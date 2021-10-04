import { SessionContext } from "../../contexts/SessionContext.jsx";
import ScrollText from "./ScrollText.jsx";
import { useContext, useState, useEffect, createRef } from "react";
import { Segment, Button, Grid, GridColumn, Modal } from "semantic-ui-react";
import { Link } from "react-router-dom";
import TestInstructions from "./TestInstructions.jsx";
import PauseWindow from "./PauseWindow.jsx";
import axios from "axios";
import { isLastText, scrollToTop } from "../../utilityFunctions.js";
import Question from "./Question.jsx";
import ConfirmSkipQuestionWindow from "./ConfirmSkipQuestionWindow.jsx";

const ScrollTest = () => {
  const sessionContext = useContext(SessionContext);
  const endPageRef = createRef();
  const [currentFileID, setCurrentFileID] = useState(
    sessionContext.template.scrollTest.files[sessionContext.fileNumber]._id
  );
  const [scrollQuestionNumber, setScrollQuestionNumber] = useState(
    JSON.parse(localStorage.getItem("scrollQuestionNumber"))
  );
  const [scrollQuestion, setScrollQuestion] = useState(
    sessionContext.template.scrollTest.files[sessionContext.fileNumber]
      .questions[JSON.parse(localStorage.getItem("scrollQuestionNumber"))]
  );
  const [displayConfirmSkipMessage, setDisplayConfirmSkipMessage] =
    useState(false);
  const [textIsComplete, setTextIsComplete] = useState(false);

  const instructions = sessionContext.template.scrollTest.instructions;

  useEffect(() => {
    if (localStorage.getItem("scrollQuestionNumber") === null) {
      setScrollQuestionNumber(0);
      setScrollQuestion(
        sessionContext.template.scrollTest.files[sessionContext.fileNumber]
          .questions[0]
      );
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
    setCurrentFileID(
      sessionContext.template.scrollTest.files[sessionContext.fileNumber]._id
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
        if (currentSession.scrollTexts !== undefined) {
          const currentText = currentSession.scrollTexts.find(
            (text) => text.fileID === currentFileID
          );
          if (currentText !== undefined) {
            setTextIsComplete(currentText.endTime !== undefined);
          }
        }
      });
  };

  const startNextText = (fileID) => {
    const sessionID = sessionContext.sessionID;
    const startTime = new Date();

    axios
      .put("http://localhost:3001/addNewScrollText", {
        id: sessionID,
        fileID: fileID,
        startTime: startTime,
      })
      .catch((error) => {
        console.error(
          `Error updating readingSession.scrollTest[currentFileID].startTime:`,
          error
        );
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
        fileID: currentFileID,
        endTime: endTime,
      })
      .then(() => {
        sessionUpdated = true;
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.scrollTest[currentFileID].endTime:",
          error
        );
      });

    return sessionUpdated;
  };

  const handleFinishText = () => {
    // Update session.scrollTexts[currentFileID] with an end time.
    const sessionUpdated = finishCurrentText();

    const fileNumber = sessionContext.fileNumber;

    if (sessionUpdated) {
      if (isLastText("scroll", sessionContext)) {
        endPageRef.current.click();
      } else {
        // Add a new entry to session.scrollTexts.
        const nextFileID =
          sessionContext.template.scrollTest.files[fileNumber + 1]._id;
        startNextText(nextFileID);
        setScrollQuestionNumber(0);
        setScrollQuestion(
          sessionContext.template.scrollTest.files[fileNumber + 1].questions[0]
        );
        sessionContext.setFileNumber(fileNumber + 1);
        scrollToTop();
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
        fileID: currentFileID,
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
    if (sessionContext.isPaused === false) {
      return <ScrollText fileID={currentFileID} />;
    }
  };

  const skipQuestion = () => {
    setScrollQuestion(
      sessionContext.template.scrollTest.files[sessionContext.fileNumber]
        .questions[scrollQuestionNumber + 1]
    );
    setScrollQuestionNumber(scrollQuestionNumber + 1);
    setDisplayConfirmSkipMessage(false);
  };

  return (
    <div className="page">
      <Segment>
        <Grid columns="3">
          <GridColumn width="4">
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "fixed" }}>
                <Button
                  primary
                  disabled={textIsComplete}
                  content="Done"
                  onClick={handleFinishText}
                />
                <Link to="/end" hidden ref={endPageRef}></Link>
                <div>
                  <Button
                    negative
                    disabled={sessionContext.isPaused || textIsComplete}
                    content="Pause"
                    onClick={() => pauseSession(sessionContext)}
                  />
                </div>
              </div>
            </div>
          </GridColumn>

          <GridColumn width="8">{displayScrollText()}</GridColumn>
          <GridColumn width="4">
            <Question
              question={scrollQuestion}
              disable={
                scrollQuestionNumber >=
                  sessionContext.template.scrollTest.files[
                    sessionContext.fileNumber
                  ].questions.length -
                    1 || textIsComplete
              }
              skip={() => setDisplayConfirmSkipMessage(true)}
            />

            <ConfirmSkipQuestionWindow
              isOpen={displayConfirmSkipMessage}
              skip={skipQuestion}
              cancel={() => setDisplayConfirmSkipMessage(false)}
            />
          </GridColumn>
        </Grid>
        <TestInstructions
          isOpen={sessionContext.hasStartedReading === false}
          task={"scrollTest"}
          instructions={instructions}
          fileID={currentFileID}
        />
        <PauseWindow isOpen={sessionContext.isPaused} resume={resumeSession} />
      </Segment>
    </div>
  );
};

export default ScrollTest;
