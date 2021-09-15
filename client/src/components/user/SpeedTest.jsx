import { SessionContext } from "../../contexts/SessionContext.jsx";
import SpeedText from "./SpeedText.jsx";
import { useContext, createRef, useState, useEffect } from "react";
import {
  Container,
  Segment,
  Button,
  Grid,
  GridColumn,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import TestInstructions from "./TestInstructions.jsx";
import axios from "axios";

const SpeedTest = () => {
  const sessionContext = useContext(SessionContext);
  const startTask2Ref = createRef();
  const [instructions, setInstructions] = useState("");
  const [currentFileID, setCurrentFileID] = useState(
    sessionContext.template.speedTest.fileIDs[sessionContext.fileNumber]
  );

  useEffect(() => {
    setInstructions(sessionContext.template.speedTest.instructions);
  }, []);

  const updateSession = async () => {
    let sessionUpdated = false;
    const sessionID = sessionContext.sessionID;
    const endTime = new Date();

    // Update session with the time the current file was finished.
    axios
      .put("http://localhost:3001/finishReadingSessionSpeedTest", {
        id: sessionID,
        fileID: currentFileID,
        endTime: endTime,
      })
      .then(() => {
        sessionUpdated = true;
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.speedTest.endTime:",
          error
        );
      });

    return sessionUpdated;
  };

  const handleFinishText = () => {
    // Update session.speedTest with an end time.
    const sessionUpdated = updateSession();

    if (sessionUpdated) {
      sessionContext.setInProgress(false);
      startTask2Ref.current.click();
    }
  };

  const displaySpeedText = () => {
    if (sessionContext.inProgress) {
      return <SpeedText fileID={currentFileID} />;
    }
  };

  return (
    <div className="page">
      <Container>
        <Grid columns="3">
          <GridColumn width="2">
            <div className="wrapper">
              <Button
                compact
                negative
                className="fixed-button"
                content="Done"
                floated="right"
                onClick={handleFinishText}
              />
              <Link to="/scrolltest" hidden ref={startTask2Ref}></Link>
            </div>
          </GridColumn>
          <GridColumn width="12">{displaySpeedText()}</GridColumn>
          <GridColumn width="2">
            <Segment></Segment>
          </GridColumn>
        </Grid>
        <TestInstructions
          isOpen={sessionContext.inProgress === false}
          task={"speedTest"}
          instructions={instructions}
          fileID={currentFileID}
        />
      </Container>
    </div>
  );
};

export default SpeedTest;
