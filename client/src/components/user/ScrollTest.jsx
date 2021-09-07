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
import axios from "axios";

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

  const updateSession = async () => {
    let sessionUpdated = false;
    const sessionID = sessionContext.sessionID;
    const fileNumber = sessionContext.fileNumber;

    // Update session with the time the current file was finished.
    await axios
      .put("http://localhost:3001/finishReadingSessionScrollTest", {
        id: sessionID,
        index: fileNumber,
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

  const handleFinishText = () => {
    // Update session.scrollTest with an end time.
    const sessionUpdated = updateSession();

    if (sessionUpdated) {
      endPageRef.current.click();
    }
  };

  const displayScrollText = () => {
    if (sessionContext.inProgress) {
      return <ScrollText fileID={currentFileID} />;
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
          fileID={currentFileID}
        />
      </Container>
    </div>
  );
};

export default ScrollTest;
