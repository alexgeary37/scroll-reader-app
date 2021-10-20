import { SessionContext } from "../../contexts/SessionContext.jsx";
import ScrollText from "./ScrollText.jsx";
import { useContext, useState, useEffect, createRef } from "react";
import { Menu, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import ScrollTestInstructions from "./ScrollTestInstructions.jsx";
import PauseWindow from "./PauseWindow.jsx";
import axios from "axios";
import { isLastText, scrollToTop } from "../../utilityFunctions.js";
import Question from "./Question.jsx";
import ConfirmSkipQuestionWindow from "./ConfirmSkipQuestionWindow.jsx";

const ScrollTest = () => {
  const sessionContext = useContext(SessionContext);
  const endPageRef = createRef();
  const [currentText, setCurrentText] = useState(
    sessionContext.template.scrollTexts[sessionContext.fileNumber]
  );
  const [scrollQuestionNumber, setScrollQuestionNumber] = useState(
    JSON.parse(localStorage.getItem("scrollQuestionNumber"))
  );
  const [displayConfirmSkipMessage, setDisplayConfirmSkipMessage] =
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

  const displayScrollText = () => {
    if (sessionContext.isPaused === false && sessionContext.hasStartedReading) {
      return <ScrollText fileID={currentText.fileID} />;
    }
  };

  const displayQuestions = () => {
    if (scrollQuestionNumber < currentText.questions.length) {
      return (
        <div
          style={{
            top: "0px",
            right: "0px",
            minWidth: "15vw",
            position: "fixed",
            // height: 500,
            // backgroundColor: "blue",
          }}
        >
          <Question
            question={currentText.questions[scrollQuestionNumber]}
            disable={textIsComplete}
            submitAnswer={handleAnswerQuestion}
            skip={() => setDisplayConfirmSkipMessage(true)}
          />
        </div>
      );
    }
  };

  const handleAnswerQuestion = (answer, skip) => {
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();

    axios
      .put("http://localhost:3001/addCurrentScrollTextQuestionAnswer", {
        id: sessionID,
        fileID: currentText.fileID,
        answer: answer,
        skip: skip,
        time: currentTime,
      })
      .then(() => {
        setScrollQuestionNumber(scrollQuestionNumber + 1);
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
      <div
        style={{
          top: 0,
          left: 0,
          minWidth: "15vw",
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

      {displayScrollText()}

      {displayQuestions()}

      <ConfirmSkipQuestionWindow
        isOpen={displayConfirmSkipMessage}
        skip={skipQuestion}
        cancel={() => setDisplayConfirmSkipMessage(false)}
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
