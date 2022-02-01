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
  recordViewportResize,
  scrollToTop,
} from "../../../utilities.js";
import { getScrollPosition } from "./scrollPosition.jsx";
import ComprehensionQuestion from "./ComprehensionQuestion.jsx";
import ClickQuestion from "./ClickQuestion.jsx";
import ConfirmSkipQuestionWindow from "./ConfirmSkipQuestionWindow.jsx";
import UnfinishedQuestionsWindow from "../UnfinishedQuestionsWindow.jsx";
import AnswerResponseWindow from "./AnswerResponseWindow.jsx";
import AnswersCompleteWindow from "./AnswersCompleteWindow.jsx";
import { debounce } from "debounce";

const ScrollTest = () => {
  const sessionContext = useContext(SessionContext);
  const endPageRef = createRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [displayMobileQuestionModal, setDisplayMobileQuestionModal] =
    useState(false);
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
  const [displayAnswersCompleteMessage, setDisplayAnswersCompleteMessage] =
    useState(false);
  const [displayConfirmDoneMessage, setDisplayConfirmDoneMessage] =
    useState(false);
  const [textIsComplete, setTextIsComplete] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("scrollQuestionNumber") === null) {
      setScrollQuestionNumber(0);
    }
    initialiseTextIsComplete();
    window.onresize = debounce((e) => {
      recordViewportResize(e, sessionContext);
      setIsMobile(window.innerWidth <= 768);
    }, 500);
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
      .get("/api/getReadingSession", {
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
      .put("/api/updateCurrentScrollText", {
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
      .put("/api/addEndTime", {
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
    }
  };

  // Add either a pause or resume action with a timestamp to the session's pauses array.
  const updateScrollTextPauses = async (isPaused) => {
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const action = isPaused ? "pause" : "resume";

    axios
      .put("/api/updateCurrentScrollTextPauses", {
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
    const isInlineQuestion =
      sessionContext.questionAnswers.find(
        (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
      ).questionFormat === "inline";

    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const yPos = parseInt(getScrollPosition().y);

    axios
      .put("/api/addCurrentScrollTextQuestionAnswer", {
        sessionID: sessionID,
        fileID: currentText.fileID,
        questionNumber: scrollQuestionNumber,
        questionID: currentText.questionIDs[scrollQuestionNumber],
        answer: answer,
        skip: skip,
        yPos: yPos,
        time: currentTime,
      })
      .then(() => {
        if (isInlineQuestion) {
          let isCorrect = false;
          if (
            sessionContext.questionAnswers.find(
              (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
            ).answerRegion.startIndex <= answer &&
            answer <=
              sessionContext.questionAnswers.find(
                (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
              ).answerRegion.endIndex
          ) {
            setScrollQuestionNumber(scrollQuestionNumber + 1);
            isCorrect = true;
          }

          if (skip) {
            if (scrollQuestionNumber + 1 >= currentText.questionIDs.length) {
              setDisplayAnswersCompleteMessage(true);
            }
            setScrollQuestionNumber(scrollQuestionNumber + 1);
          } else {
            setAnswerResponseWindow({ display: true, isCorrect: isCorrect });
          }
        } else {
          if (scrollQuestionNumber + 1 >= currentText.questionIDs.length) {
            setDisplayAnswersCompleteMessage(true);
          }
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
    setDisplayMobileQuestionModal(false);
  };

  const handleCloseScrollTestInstructions = () => {
    sessionContext.setHasStartedReading(true);
    addScrollPosEntryToSessionContext(
      sessionContext,
      parseInt(getScrollPosition().y)
    );
  };

  const displayButtons = () => {
    if (isMobile) {
      const displayQuestions =
        scrollQuestionNumber < currentText.questionIDs.length;
      return (
        <Menu inverted widths={displayQuestions ? 3 : 2} fixed="top">
          <Menu.Item
            active
            disabled={textIsComplete}
            content="Done"
            color="blue"
            onClick={handleFinishText}
          />
          <Link to="/end" hidden ref={endPageRef}></Link>
          <Menu.Item
            active
            disabled={textIsComplete}
            content="Pause"
            color="red"
            onClick={() => pauseSession(sessionContext)}
          />
          {displayQuestions && (
            <Menu.Item
              active
              disabled={textIsComplete}
              content="Question"
              color="green"
              onClick={() => setDisplayMobileQuestionModal(true)}
            />
          )}
        </Menu>
      );
    } else {
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
    }
  };

  const displayScrollText = () => {
    if (sessionContext.hasStartedReading) {
      if (isMobile) {
        return (
          <div style={{ marginTop: 45 }}>
            <ScrollText
              fileID={currentText.fileID}
              textStyleID={currentText.styleID}
              selectAnswerEnabled={selectAnswerEnabled}
              selectAnswer={handleAnswerQuestion}
            />
          </div>
        );
      } else {
        return (
          <ScrollText
            fileID={currentText.fileID}
            textStyleID={currentText.styleID}
            selectAnswerEnabled={selectAnswerEnabled}
            selectAnswer={handleAnswerQuestion}
          />
        );
      }
    }
  };

  const displayQuestions = () => {
    if (
      scrollQuestionNumber < currentText.questionIDs.length &&
      sessionContext.questionAnswers.length > 0 &&
      typeof sessionContext.questionAnswers.find(
        (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
      ) !== "undefined"
    ) {
      const isComprehension =
        sessionContext.questionAnswers.find(
          (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
        ).questionFormat === "comprehension";
      return (
        <div
          style={{
            top: "0px",
            right: "0px",
            width: "15vw",
            position: "fixed",
          }}
        >
          {isComprehension ? (
            <ComprehensionQuestion
              isMobile={isMobile}
              openModal={displayMobileQuestionModal}
              currentText={currentText}
              questionNumber={scrollQuestionNumber}
              disable={textIsComplete}
              submitAnswer={(answer, skip) => {
                handleAnswerQuestion(answer, skip);
                setDisplayMobileQuestionModal(false);
              }}
              skip={() => setDisplayConfirmSkipMessage(true)}
            />
          ) : (
            <ClickQuestion
              isMobile={isMobile}
              openModal={displayMobileQuestionModal}
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

  const displayMessages = () => {
    return (
      <div>
        <ScrollTestInstructions
          isOpen={sessionContext.hasStartedReading === false}
          text={currentText}
          close={handleCloseScrollTestInstructions}
        />
        <AnswerResponseWindow
          isOpen={answerResponseWindow.display}
          isCorrect={answerResponseWindow.isCorrect}
          tryAgain={() =>
            setAnswerResponseWindow({ display: false, isCorrect: false })
          }
          continueReading={() => {
            const answerWasCorrect = answerResponseWindow.isCorrect;
            setAnswerResponseWindow({ display: false, isCorrect: false });
            setSelectAnswerEnabled(false);
            if (
              answerWasCorrect &&
              scrollQuestionNumber >= currentText.questionIDs.length
            ) {
              setDisplayAnswersCompleteMessage(true);
            }
          }}
        />
        <ConfirmSkipQuestionWindow
          isOpen={displayConfirmSkipMessage}
          skip={skipQuestion}
          cancel={() => setDisplayConfirmSkipMessage(false)}
        />
        <AnswersCompleteWindow
          isOpen={displayAnswersCompleteMessage}
          close={() => setDisplayAnswersCompleteMessage(false)}
        />
        <UnfinishedQuestionsWindow
          isOpen={displayConfirmDoneMessage}
          close={() => setDisplayConfirmDoneMessage(false)}
        />
        <PauseWindow isOpen={sessionContext.isPaused} resume={resumeSession} />
      </div>
    );
  };

  return (
    <div>
      {displayButtons()}
      {displayScrollText()}
      {displayQuestions()}
      {displayMessages()}
    </div>
  );
};

export default ScrollTest;
