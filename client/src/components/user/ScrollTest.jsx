import { SessionContext } from "../../contexts/SessionContext.jsx";
import ScrollText from "./ScrollText.jsx";
import { useContext, useState, useEffect, createRef } from "react";
import {
  Container,
  Segment,
  Button,
  Grid,
  GridColumn,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import TestInstructions from "./TestInstructions.jsx";
import PauseWindow from "./PauseWindow.jsx";
import axios from "axios";
import { isLastText, scrollToTop } from "../../utilityFunctions.js";

const ScrollTest = () => {
  const sessionContext = useContext(SessionContext);
  const endPageRef = createRef();
  const [instructions, setInstructions] = useState("");
  const [currentFileID, setCurrentFileID] = useState(
    sessionContext.template.scrollTest.fileIDs[sessionContext.fileNumber]
  );

  useEffect(() => {
    setInstructions(sessionContext.template.scrollTest.instructions);
  }, []);

  useEffect(() => {
    setCurrentFileID(
      sessionContext.template.scrollTest.fileIDs[sessionContext.fileNumber]
    );
  }, [sessionContext.fileNumber]);

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
        startNextText(
          sessionContext.template.scrollTest.fileIDs[fileNumber + 1]
        );
        sessionContext.setFileNumber(fileNumber + 1);
        scrollToTop();
      }
    }
  };

  const handlePauseResume = () => {
    sessionContext.setIsPaused(!sessionContext.isPaused);
  };

  const displayScrollText = () => {
    if (sessionContext.isPaused === false) {
      return <ScrollText fileID={currentFileID} />;
    }
  };

  return (
    <div className="page">
      <Container>
        <Grid columns="3">
          <GridColumn width="2">
            <div className="fixed-button">
              <div className="wrapper">
                <Button compact content="Done" onClick={handleFinishText} />
                <Link to="/end" hidden ref={endPageRef}></Link>
              </div>
              <Button
                compact
                negative={sessionContext.isPaused === false}
                disabled={sessionContext.isPaused}
                className="fixed-button"
                content="Paused"
                onClick={handlePauseResume}
              />
            </div>
          </GridColumn>
          <GridColumn width="12">{displayScrollText()}</GridColumn>
          <GridColumn width="2">
            <Segment></Segment>
          </GridColumn>
        </Grid>
        <TestInstructions
          isOpen={sessionContext.hasStartedReading === false}
          task={"scrollTest"}
          instructions={instructions}
          fileID={currentFileID}
        />
        <PauseWindow isOpen={sessionContext.isPaused} />
      </Container>
    </div>
  );
};

export default ScrollTest;
