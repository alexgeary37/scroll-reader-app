import { TextContext } from "../contexts/TextContext.jsx";
import { SessionContext } from "../contexts/SessionContext.jsx";
import FileInput from "./FileInput.jsx";
import MainText from "./MainText.jsx";
import { useContext, useEffect, useState } from "react";
import { Form, Container, Divider } from "semantic-ui-react";
import Axios from "axios";

const Home = () => {
  const sessionContext = useContext(SessionContext);
  const textContext = useContext(TextContext);
  const [enableSession, setEnableSession] = useState(false);
  const [session, setSession] = useState(
    JSON.parse(localStorage.getItem("session"))
  );

  // If this is the first time the page has been loaded, set the initial value
  // of 'session' to an empty object {}. This will then cause the variable to
  // be set in localStorage when the effect runs.
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("session")) === null) {
      setSession({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("session", JSON.stringify(session));
  }, [session]);

  const startStopLabel = () => {
    return sessionContext.inProgress ? "Stop Session" : "Start Session";
  };

  const startButtonDisabled = () => {
    return sessionContext.name === "";
  };

  // Keep track of whether there is text ready for a session to begin.
  useEffect(() => {
    setEnableSession(textContext.text !== null && textContext.text !== "");
  }, [textContext]);

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

  // Add new session to database.
  const startSession = () => {
    const date = new Date();
    const timestamp =
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      ":" +
      date.getMilliseconds();

    const newSession = {
      name: sessionContext.name,
      fileName: textContext.fileName,
      startTime: timestamp,
      endTime: "",
    };

    Axios.post("http://localhost:3001/addReadingSession", newSession)
      .then((response) => {
        setSession(response.data);
      })
      .catch((error) => {
        console.log("Error adding session", error);
      });
  };

  // Update session with the time it finished.
  const stopSession = () => {
    const sessionID = session._id;
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
      console.log("Error updating session", error);
    });

    setSession({});
    sessionContext.setName("");
  };

  const handleSessionNameChange = (event) => {
    sessionContext.setName(event.target.value);
  };

  const displayStartStopButton = (enableSession) => {
    if (enableSession) {
      return (
        <div>
          <Form>
            <div className="wrapper">
              <Form.Input
                type="text"
                name="sessionName"
                value={sessionContext.name}
                placeholder="Session Name"
                disabled={sessionContext.inProgress}
                onChange={handleSessionNameChange}
              />
              <Form.Button
                positive={!sessionContext.inProgress}
                negative={sessionContext.inProgress}
                floated="right"
                content={startStopLabel()}
                disabled={startButtonDisabled()}
                onClick={toggleSession}
              />
            </div>
          </Form>
        </div>
      );
    }
  };

  return (
    <Container>
      <div className="wrapper">
        <FileInput />
        {displayStartStopButton(enableSession)}
      </div>
      <Divider />
      <MainText session={session} />
    </Container>
  );
};

export default Home;
