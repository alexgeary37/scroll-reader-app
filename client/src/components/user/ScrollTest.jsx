import { SessionContext } from "../../contexts/SessionContext.jsx";
import ScrollText from "./ScrollText.jsx";
import { useContext, useState, useEffect, createRef } from "react";
import { Menu, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import ScrollTestInstructions from "./ScrollTestInstructions.jsx";
import PauseWindow from "./PauseWindow.jsx";
import axios from "axios";
import { isLastText, scrollToTop } from "../../utilityFunctions.js";
import { getScrollPosition } from "./scrollPosition.jsx";
import ComprehensionQuestion from "./ComprehensionQuestion.jsx";
import ClickQuestion from "./ClickQuestion.jsx";
import ConfirmSkipQuestionWindow from "./ConfirmSkipQuestionWindow.jsx";
import ConfirmDoneWindow from "./ConfirmDoneWindow.jsx";

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
      .get("http://localhost:3001/getCurrentSession", {
        params: { _id: sessionContext.sessionID },
      })
      .then((response) => {
        const currentSession = response.data;

        // Set to true if this text contains an endTime, false otherwise.
        if (currentSession.hasOwnProperty("scrollTexts")) {
          const current = currentSession.scrollTexts.find(
            (text) => text.fileID === currentText.fileID
          );
          if (current !== undefined) {
            setTextIsComplete(current.hasOwnProperty("endTime"));
          }
        }
      });
  };

  const finishCurrentText = async () => {
    let sessionUpdated = false;
    const sessionID = sessionContext.sessionID;
    const endTime = new Date();

    // Update session with the time the current file was finished.
    axios
      .put("http://localhost:3001/updateCurrentScrollText", {
        id: sessionID,
        fileID: currentText.fileID,
        endTime: endTime,
      })
      .then(() => {
        sessionUpdated = true;
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.scrollTexts[currentText.fileID].endTime:",
          error
        );
      });

    return sessionUpdated;
  };

  const handleFinishText = () => {
    if (scrollQuestionNumber < currentText.questions.length) {
      setDisplayConfirmDoneMessage(true);
    } else {
      // Update session.scrollTexts[currentText.fileID] with an end time.
      const sessionUpdated = finishCurrentText();

      const fileNumber = sessionContext.fileNumber;

      if (sessionUpdated) {
        if (isLastText("scroll", sessionContext)) {
          endPageRef.current.click();
        } else {
          // Adjust hooks and context for the next scrollText.
          const nextText = sessionContext.template.scrollTexts[fileNumber + 1];
          setScrollQuestionNumber(0);
          sessionContext.setFileNumber(fileNumber + 1);
          scrollToTop();
          sessionContext.setHasStartedReading(false);
        }
      }
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
          selectAnswerEnabled={selectAnswerEnabled}
          selectAnswer={handleSelectAnswer}
        />
      );
    }
  };

  const displayQuestions = () => {
    if (scrollQuestionNumber < currentText.questions.length) {
      return (
        <div
          style={{
            top: "0px",
            right: "0px",
            width: "15vw",
            position: "fixed",
            // height: 500,
            // backgroundColor: "blue",
          }}
        >
          {sessionContext.template.questionFormat === "comprehension" ? (
            <ComprehensionQuestion
              question={currentText.questions[scrollQuestionNumber]}
              disable={textIsComplete}
              submitAnswer={handleAnswerQuestion}
              skip={() => setDisplayConfirmSkipMessage(true)}
            />
          ) : (
            <ClickQuestion
              question={currentText.questions[scrollQuestionNumber]}
              disable={textIsComplete}
              answerIsEnabled={selectAnswerEnabled}
              enableAnswer={() => setSelectAnswerEnabled(true)}
              skip={() => setDisplayConfirmSkipMessage(true)}
            />
          )}
        </div>
      );
    }
  };

  const handleSelectAnswer = (textContent, index) => {
    console.log(textContent, index);
    // handleAnswerQuestion({ index, textContent }, false);
    setSelectAnswerEnabled(false); // TODO: REMOVE THIS because the above line does the same thing
  };

  const handleAnswerQuestion = (answer, skip) => {
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const yPos = getScrollPosition().y;

    axios
      .put("http://localhost:3001/addCurrentScrollTextQuestionAnswer", {
        id: sessionID,
        fileID: currentText.fileID,
        answer: answer,
        skip: skip,
        yPos: yPos,
        time: currentTime,
      })
      .then(() => {
        setScrollQuestionNumber(scrollQuestionNumber + 1);
        setSelectAnswerEnabled(false);
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
    setDisplayConfirmSkipMessage(false);
  };

  return (
    <div className="page-height footer-padding">
      {displayButtons()}

      {displayScrollText()}

      {displayQuestions()}

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
      />
      <PauseWindow isOpen={sessionContext.isPaused} resume={resumeSession} />
    </div>
  );
};

export default ScrollTest;
