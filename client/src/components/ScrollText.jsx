import { TextContext } from "../contexts/TextContext.jsx";
import { SessionContext } from "../contexts/SessionContext.jsx";
import MainText from "./MainText.jsx";
import { useContext, useEffect } from "react";
import { Container, Divider } from "semantic-ui-react";
import Axios from "axios";

const ScrollText = () => {
  const sessionContext = useContext(SessionContext);

  const toggleSession = () => {
    if (enableSession) {
      if (!sessionContext.inProgress) {
        // Session is about to start, so create new session.
        startSession();
        sessionContext.setInProgress(true);
      } else {
        stopSession();
        sessionContext.setInProgress(false);
      }
    }
  };

  // Update session with the time it finished.
  const stopSession = () => {
    const sessionID = sessionContext.sessionID;
    const date = new Date();
    const timestamp =
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      ":" +
      date.getMilliseconds();

    Axios.put("http://localhost:3001/updateReadingSession", {
      id: sessionID,
      endTime: timestamp,
    }).catch((error) => {
      console.log("Error updating session:", error);
    });

    sessionContext.setSessionID("");
    sessionContext.setName("");
  };

  return (
    <div className="page">
      <Container>
        <Button
          positive={!sessionContext.inProgress}
          negative={sessionContext.inProgress}
          floated="right"
          onClick={toggleSession}
        />
        <Divider />
        <MainText />
      </Container>
    </div>
  );
};

export default Home;
