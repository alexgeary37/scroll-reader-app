import { SessionContext } from "../../contexts/SessionContext.jsx";
import MainText from "./MainText.jsx";
import { useContext, createRef } from "react";
import {
  Container,
  Segment,
  Button,
  Grid,
  GridColumn,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import SpeedTestInstructions from "./SpeedTestInstructions.jsx";
import Axios from "axios";

const SpeedText = () => {
  const sessionContext = useContext(SessionContext);
  const endPageRef = createRef();

  // const template = {
  //   name: templateName,
  //   scrollTextFileID: scrollTextID,
  //   speedTextFileID: speedTextID,
  //   questionFormat: questionFormat,
  //   createdAt: new Date(),
  // };

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
      endPageRef.current.click();
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
                content="Finish"
                floated="right"
                onClick={handleFinish}
              />
              <Link to="/end" hidden ref={endPageRef}></Link>
            </div>
          </GridColumn>
          <GridColumn width="12">
            <MainText />
          </GridColumn>
          <GridColumn width="2">
            <Segment></Segment>
          </GridColumn>
        </Grid>
        <SpeedTestInstructions isOpen={sessionContext.inProgress === false} />
      </Container>
    </div>
  );
};

export default SpeedText;