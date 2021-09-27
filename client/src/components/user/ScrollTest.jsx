import { SessionContext } from "../../contexts/SessionContext.jsx";
import ScrollText from "./ScrollText.jsx";
import { useContext, useState, useEffect, createRef } from "react";
import { Segment, Button, Grid, GridColumn } from "semantic-ui-react";
import { Link } from "react-router-dom";
import TestInstructions from "./TestInstructions.jsx";
import PauseWindow from "./PauseWindow.jsx";
import axios from "axios";
import { isLastText, scrollToTop } from "../../utilityFunctions.js";
import Question from "./Question.jsx";

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

  const instructions = sessionContext.template.scrollTest.instructions;

  useEffect(() => {
    // if (localStorage.getItem("scrollQuestionNumber") === null) {
    localStorage.setItem("scrollQuestionNumber", JSON.stringify(0));
    // setScrollQuestion(sessionContext.template.scrollTest.files[sessionContext.fileNumber]
    //   .questions[0])
    // }
    setScrollQuestion(
      sessionContext.template.scrollTest.files[sessionContext.fileNumber]
        .questions[JSON.parse(localStorage.getItem("scrollQuestionNumber"))]
    );
    console.log(scrollQuestion)
    console.log(localStorage.getItem("scrollQuestionNumber"));
  }, []);

  useEffect(() => {
    setCurrentFileID(
      sessionContext.template.scrollTest.files[sessionContext.fileNumber]._id
    );
  }, [sessionContext.fileNumber]);

  useEffect(() => {
    localStorage.setItem(
      "scrollQuestionNumber",
      JSON.stringify(scrollQuestionNumber)
    );
    setScrollQuestion(
      sessionContext.template.scrollTest.files[sessionContext.fileNumber]
        .questions[scrollQuestionNumber]
    );
  }, [scrollQuestionNumber]);

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
          "Error updating readingSession.scrollTexts[currentFileID].endTime:",
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

  const incrementScrollQuestion = () => {
    if (
      scrollQuestionNumber <
      sessionContext.template.scrollTest.files[sessionContext.fileNumber]
        .questions.length
    ) {
      console.log("Hello");
      setScrollQuestionNumber(scrollQuestionNumber + 1);
    }
  };

  return (
    <div className="page">
      <Segment>
        <Grid columns="3">
          <GridColumn width="4">
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "fixed" }}>
                <Button primary content="Done" onClick={handleFinishText} />
                <Link to="/end" hidden ref={endPageRef}></Link>
                <div>
                  <Button
                    negative={sessionContext.isPaused === false}
                    disabled={sessionContext.isPaused}
                    content="Paused"
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
              skip={incrementScrollQuestion}
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
