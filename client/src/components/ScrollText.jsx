import { SessionContext } from "../contexts/SessionContext.jsx";
import MainText from "./MainText.jsx";
import { useContext, useEffect, createRef } from "react";
import {
  Container,
  Segment,
  Button,
  Grid,
  GridColumn,
} from "semantic-ui-react";
import Axios from "axios";
import { Link } from "react-router-dom";

const ScrollText = () => {
  const sessionContext = useContext(SessionContext);
  const startTask2Ref = createRef();

  useEffect(() => {
    // const template = {
    //   name: templateName,
    //   scrollTextFileID: scrollTextID,
    //   speedTextFileID: speedTextID,
    //   questionFormat: questionFormat,
    //   createdAt: new Date(),
    // };
  }, []);

  // Update session with the time it finished.
  const finishReading = () => {
    // Display alert, Are you sure.
    // If yes do below code and go to next part of test
    // Else, do not do rest of code
    const sessionID = sessionContext.sessionID;

    Axios.put("http://localhost:3001/updateReadingSession", {
      id: sessionID,
      endTime: new Date(),
    }).catch((error) => {
      console.error("Error updating session:", error);
    });

    sessionContext.setInProgress(false);
    startTask2Ref.current.click();
  };

  return (
    <div className="page">
      <Container>
        <Grid columns="3">
          <GridColumn width="2">
            <Button
              compact
              className="fixed-button"
              content="Finish"
              positive={!sessionContext.inProgress}
              negative={sessionContext.inProgress}
              floated="right"
              onClick={finishReading}
            />
            <Link to="/speedtext" hidden ref={startTask2Ref}></Link>
          </GridColumn>
          <GridColumn width="12">
            <MainText />
          </GridColumn>
          <GridColumn width="2">
            <Segment></Segment>
          </GridColumn>
        </Grid>
      </Container>
    </div>
  );
};

export default ScrollText;
