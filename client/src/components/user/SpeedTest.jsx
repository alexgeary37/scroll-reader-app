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
import Axios from "axios";

const SpeedTest = () => {
  const sessionContext = useContext(SessionContext);
  const startTask2Ref = createRef();
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    setInstructions(sessionContext.template.speedTest.instructions);
  }, []);

  const updateSession = async () => {
    let sessionUpdated = false;
    const sessionID = sessionContext.sessionID;

    // Update session with the time it finished.
    Axios.put("http://localhost:3001/finishReadingSessionSpeedTest", {
      id: sessionID,
      endTime: new Date(),
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

  const handleFinish = () => {
    // Update session.speedTest with an end time.
    const sessionUpdated = updateSession();

    if (sessionUpdated) {
      sessionContext.setInProgress(false);
      startTask2Ref.current.click();
    }
  };

  const displaySpeedText = () => {
    if (sessionContext.inProgress) {
      return <SpeedText />;
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
                onClick={handleFinish}
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
        />
      </Container>
    </div>
  );
};

export default SpeedTest;
