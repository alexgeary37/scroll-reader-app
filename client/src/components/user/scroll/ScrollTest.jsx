import { SessionContext } from "../../../contexts/SessionContext.jsx";
import ScrollText from "./ScrollText.jsx";
import { useContext, useState, useEffect, createRef } from "react";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import ScrollTestInstructions from "./ScrollTestInstructions.jsx";
import PauseWindow from "../PauseWindow.jsx";
import axios from "axios";
import {
  addScrollPosEntryToSessionContext,
  isLastText,
  scrollToTop,
} from "../../../utilities.js";
import { getScrollPosition } from "./scrollPosition.jsx";
import ComprehensionQuestion from "./ComprehensionQuestion.jsx";
import ClickQuestion from "./ClickQuestion.jsx";
import ConfirmSkipQuestionWindow from "./ConfirmSkipQuestionWindow.jsx";
import ConfirmDoneWindow from "../ConfirmDoneWindow.jsx";
import AnswerResponseWindow from "./AnswerResponseWindow.jsx";
import { debounce } from "debounce";
import { recordViewportResize } from "../../../utilities";

const ScrollTest = () => {
  const sessionContext = useContext(SessionContext);
  const endPageRef = createRef();
  const [currentText, setCurrentText] = useState(
    sessionContext.template.scrollTexts[sessionContext.fileNumber]
  );
  const [scrollQuestionNumber, setScrollQuestionNumber] = useState(
    JSON.parse(localStorage.getItem("scrollQuestionNumber"))
  );
  const [selectAnswerEnabled, setSelectAnswerEnabled] = useState(false);
  const [answerResponseWindow, setAnswerResponseWindow] = useState({
    display: false,
    isCorrect: false,
  });
  const [displayConfirmSkipMessage, setDisplayConfirmSkipMessage] =
    useState(false);
  const [displayConfirmDoneMessage, setDisplayConfirmDoneMessage] =
    useState(false);
  const [textIsComplete, setTextIsComplete] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("scrollQuestionNumber") === null) {
      setScrollQuestionNumber(0);
    }
    initialiseTextIsComplete();
    window.onresize = debounce(
      (e) => recordViewportResize(e, sessionContext),
      500
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "scrollQuestionNumber",
      JSON.stringify(scrollQuestionNumber)
    );
  }, [scrollQuestionNumber]);

  useEffect(() => {
    setCurrentText(
      sessionContext.template.scrollTexts[sessionContext.fileNumber]
    );
  }, [sessionContext.fileNumber]);

  const initialiseTextIsComplete = () => {
    axios
      .get("http://localhost:3001/getReadingSession", {
        params: { _id: sessionContext.sessionID },
      })
      .then((response) => {
        const currentSession = response.data;

        // Set to true if this text contains an endTime, false otherwise.
        if (currentSession.hasOwnProperty("scrollTexts")) {
          const text = currentSession.scrollTexts.find(
            (t) => t.fileID === currentText.fileID
          );
          if (typeof text !== "undefined") {
            setTextIsComplete(text.hasOwnProperty("endTime"));
          }
        }
      });
  };

  const finishCurrentText = async () => {
    const sessionID = sessionContext.sessionID;
    const endTime = new Date();

    // Update session with the time the current file was finished.
    axios
      .put("http://localhost:3001/updateCurrentScrollText", {
        id: sessionID,
        fileID: currentText.fileID,
        endTime: endTime,
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.scrollTexts[currentText.fileID].endTime:",
          error
        );
      });

    return endTime;
  };

  const finishReadingSession = async (endTime) => {
    const sessionID = sessionContext.sessionID;

    // Update session with an endTime.
    axios
      .put("http://localhost:3001/addEndTime", {
        id: sessionID,
        time: endTime,
      })
      .catch((error) => {
        console.error("Error updating readingSession.endTime:", error);
      });
  };

  const handleFinishText = async () => {
    if (scrollQuestionNumber < currentText.questionIDs.length) {
      setDisplayConfirmDoneMessage(true);
    } else {
      // Update session.scrollTexts[currentText.fileID] with an end time.
      const endTime = await finishCurrentText();

      const fileNumber = sessionContext.fileNumber;

      // if (sessionUpdated) {
      if (isLastText("scroll", sessionContext)) {
        await finishReadingSession(endTime);
        endPageRef.current.click();
      } else {
        // Adjust hooks and context for the next scrollText.
        setScrollQuestionNumber(0);
        sessionContext.setFileNumber(fileNumber + 1);
        scrollToTop();
        sessionContext.setHasStartedReading(false);
      }
      // }
    }
  };

  // Add either a pause or resume action with a timestamp to the session's pauses array.
  const updateScrollTextPauses = async (isPaused) => {
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const action = isPaused ? "pause" : "resume";

    // Update session with the time the current file was finished.
    axios
      .put("http://localhost:3001/updateCurrentScrollTextPauses", {
        id: sessionID,
        fileID: currentText.fileID,
        action: action,
        time: currentTime,
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.scrollTexts[fileID].pauses",
          error
        );
      });
  };

  const pauseSession = () => {
    updateScrollTextPauses(true);
    sessionContext.setIsPaused(true);
  };

  const resumeSession = () => {
    updateScrollTextPauses(false);
    sessionContext.setIsPaused(false);
  };

  const handleAnswerQuestion = (answer, skip) => {
    const isInlineQuestion = sessionContext.questionFormat === "inline";
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const yPos = parseInt(getScrollPosition().y);
    const answerObj = isInlineQuestion
      ? {
          questionID: currentText.questionIDs[scrollQuestionNumber],
          answer: answer,
        }
      : answer;

    axios
      .put("http://localhost:3001/addCurrentScrollTextQuestionAnswer", {
        sessionID: sessionID,
        fileID: currentText.fileID,
        answer: answerObj,
        skip: skip,
        yPos: yPos,
        time: currentTime,
      })
      .then(() => {
        if (isInlineQuestion) {
          let isCorrect = false;
          if (
            sessionContext.questionAnswers[scrollQuestionNumber].startIndex <=
              answer &&
            answer <=
              sessionContext.questionAnswers[scrollQuestionNumber].endIndex
          ) {
            setScrollQuestionNumber(scrollQuestionNumber + 1);
            isCorrect = true;
          }

          if (skip) {
            setScrollQuestionNumber(scrollQuestionNumber + 1);
          } else {
            setAnswerResponseWindow({ display: true, isCorrect: isCorrect });
          }
        } else {
          setScrollQuestionNumber(scrollQuestionNumber + 1);
        }
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.scrollTexts[fileID].questionAnswers",
          error
        );
      });
  };

  const skipQuestion = () => {
    handleAnswerQuestion("", true);
    setSelectAnswerEnabled(false);
    setDisplayConfirmSkipMessage(false);
  };

  const handleCloseScrollTestInstructions = () => {
    sessionContext.setHasStartedReading(true);
    addScrollPosEntryToSessionContext(
      sessionContext,
      parseInt(getScrollPosition().y)
    );
  };

  const displayButtons = () => {
    return (
      <div
        style={{
          top: 0,
          left: 0,
          width: "15vw",
          position: "fixed",
        }}
      >
        <Menu vertical fluid style={{ textAlign: "center" }}>
          <Menu.Item>
            <Button
              primary
              fluid
              disabled={textIsComplete}
              content="Done"
              onClick={handleFinishText}
            />
          </Menu.Item>
          <Link to="/end" hidden ref={endPageRef}></Link>
          <Menu.Item>
            <Button
              negative
              fluid
              disabled={textIsComplete}
              content="Pause"
              onClick={() => pauseSession(sessionContext)}
            />
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  const displayScrollText = () => {
    if (sessionContext.hasStartedReading) {
      return (
        <ScrollText
          fileID={currentText.fileID}
          textStyleID={currentText.styleID}
          selectAnswerEnabled={selectAnswerEnabled}
          selectAnswer={handleAnswerQuestion}
        />
      );
    }
  };

  const displayQuestions = () => {
    if (scrollQuestionNumber < currentText.questionIDs.length) {
      return (
        <div
          style={{
            top: "0px",
            right: "0px",
            width: "15vw",
            position: "fixed",
          }}
        >
          {sessionContext.questionFormat === "comprehension" ? (
            <ComprehensionQuestion
              currentText={currentText}
              questionNumber={scrollQuestionNumber}
              disable={textIsComplete}
              submitAnswer={handleAnswerQuestion}
              skip={() => setDisplayConfirmSkipMessage(true)}
            />
          ) : (
            <ClickQuestion
              currentText={currentText}
              questionNumber={scrollQuestionNumber}
              disable={textIsComplete}
              answerIsEnabled={selectAnswerEnabled}
              enableAnswer={() => setSelectAnswerEnabled(!selectAnswerEnabled)}
              skip={() => setDisplayConfirmSkipMessage(true)}
            />
          )}
        </div>
      );
    }
  };

  return (
    <div>
      {displayButtons()}

      {displayScrollText()}

      {displayQuestions()}

      <AnswerResponseWindow
        isOpen={answerResponseWindow.display}
        isCorrect={answerResponseWindow.isCorrect}
        tryAgain={() =>
          setAnswerResponseWindow({ display: false, isCorrect: false })
        }
        continueReading={() => {
          setAnswerResponseWindow({ display: false, isCorrect: false });
          setSelectAnswerEnabled(false);
        }}
      />

      <ConfirmSkipQuestionWindow
        isOpen={displayConfirmSkipMessage}
        skip={skipQuestion}
        cancel={() => setDisplayConfirmSkipMessage(false)}
      />

      <ConfirmDoneWindow
        isOpen={displayConfirmDoneMessage}
        close={() => setDisplayConfirmDoneMessage(false)}
      />

      <ScrollTestInstructions
        isOpen={sessionContext.hasStartedReading === false}
        text={currentText}
        close={handleCloseScrollTestInstructions}
      />
      <PauseWindow isOpen={sessionContext.isPaused} resume={resumeSession} />
    </div>
  );
};

export default ScrollTest;