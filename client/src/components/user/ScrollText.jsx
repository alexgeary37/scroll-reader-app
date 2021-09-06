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
import ScrollTestInstructions from "./ScrollTestInstructions.jsx";
import Axios from "axios";

const ScrollText = () => {
  const sessionContext = useContext(SessionContext);
  const startTask2Ref = createRef();

  const updateSession = async () => {
    let sessionUpdated = false;
    const sessionID = sessionContext.sessionID;

    await Axios.put("http://localhost:3001/finishReadingSessionScrollTest", {
      id: sessionID,
      endTime: new Date(),
    })
      .then(() => {
        sessionUpdated = true;
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.scrollTest.endTime:",
          error
        );
      });

    return sessionUpdated;
  };

  const handleFinish = () => {
    // Update session.scrollTest with an end time.
    const sessionUpdated = updateSession();

    if (sessionUpdated) {
      sessionContext.setInProgress(false);
      startTask2Ref.current.click();
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
              <Link to="/speedtext" hidden ref={startTask2Ref}></Link>
            </div>
          </GridColumn>
          <GridColumn width="12">
            <MainText />
          </GridColumn>
          <GridColumn width="2">
            <Segment></Segment>
          </GridColumn>
        </Grid>
        <ScrollTestInstructions isOpen={sessionContext.inProgress === false} />
      </Container>
    </div>
  );
};

export default ScrollText;
