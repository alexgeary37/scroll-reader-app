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
import Axios from "axios";

const ScrollTest = () => {
  const sessionContext = useContext(SessionContext);
  const endPageRef = createRef();
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    setInstructions(sessionContext.template.scrollTest.instructions);
  }, []);

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
      endPageRef.current.click();
    }
  };

  const displayScrollText = () => {
    if (sessionContext.inProgress) {
      return <ScrollText />;
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
              <Link to="/end" hidden ref={endPageRef}></Link>
            </div>
          </GridColumn>
          <GridColumn width="12">{displayScrollText()}</GridColumn>
          <GridColumn width="2">
            <Segment></Segment>
          </GridColumn>
        </Grid>
        <TestInstructions
          isOpen={sessionContext.inProgress === false}
          task={"scrollTest"}
          instructions={instructions}
        />
      </Container>
    </div>
  );
};

export default ScrollTest;
