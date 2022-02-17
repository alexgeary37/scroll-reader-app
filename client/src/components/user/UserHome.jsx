import { Container, Segment, Input, Button, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { createRef, useContext, useEffect, useState } from "react";
import axios from "axios";
import { SessionContext } from "../../contexts/SessionContext";
import PageError from "../PageError";

const MIN_USERNAME_CHARACTERS = 3;

const UserHome = () => {
  const sessionContext = useContext(SessionContext);
  const [userName, setUserName] = useState("");
  const [template, setTemplate] = useState(null);
  const [templateError, setTemplateError] = useState(false);
  const [displayUserNameError, setDisplayUserNameError] = useState(false);
  const [startSpeedTest, setStartSpeedTest] = useState(false);

  const speedTestRef = createRef();
  const scrollTestRef = createRef();
  const endPageRef = createRef();

  useEffect(() => {
    fetchSessionTemplate();
  }, []);

  useEffect(() => {
    if (
      sessionContext.template !== null &&
      sessionContext.sessionID !== "" &&
      startSpeedTest
    ) {
      speedTestRef.current.click();
    }
  }, [sessionContext.template, sessionContext.sessionID, startSpeedTest]);

  const fetchSessionTemplate = () => {
    // Get sessionTemplateID from the url.
    const url = window.location.href.toString();
    const templateID = url.substring(url.lastIndexOf("/") + 1, url.length);

    // Get template from the database.
    axios
      .get("/api/getSessionTemplate", {
        params: { _id: templateID },
      })
      .then((response) => {
        if (response.data.name === "CastError") {
          setTemplateError(true);
        } else {
          setTemplate(response.data);
        }
      })
      .catch((error) =>
        console.error("Error fetching SessionTemplate:", error)
      );
  };

  // Add new session to database.
  const createSession = async () => {
    const date = new Date();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const newReadingSession = {
      userName: userName.trim(),
      viewportDimensions: [
        {
          width: viewportWidth,
          height: viewportHeight,
          time: date,
        },
      ],
      templateID: template._id,
      startTime: date,
      hasBeenExported: false,
    };

    await axios
      .post("/api/createReadingSession", newReadingSession)
      .then((response) => {
        sessionContext.setSessionID(response.data._id);
        sessionContext.setTemplate(template);
        setStartSpeedTest(true);
      })
      .catch((error) => console.error("Error adding session:", error));
  };

  const handleStartSpeedTest = () => {
    if (userName.trim().length < MIN_USERNAME_CHARACTERS) {
      setDisplayUserNameError(true);
      return;
    }
    createSession();
  };

  const handleResumeSession = () => {
    axios
      .get("/api/getReadingSession", {
        params: { _id: sessionContext.sessionID },
      })
      .then((response) => {
        const currentSession = response.data;
        if (
          currentSession.scrollTexts.length === template.scrollTexts.length &&
          currentSession.scrollTexts.at(-1).hasOwnProperty("endTime")
        ) {
          endPageRef.current.click();
        } else if (
          currentSession.speedTexts.length ===
            template.speedTest.texts.length &&
          currentSession.speedTexts.at(-1).hasOwnProperty("endTime")
        ) {
          scrollTestRef.current.click();
        } else {
          speedTestRef.current.click();
        }
      });
  };

  const handleUserNameChange = (event) => {
    setDisplayUserNameError(false);
    setUserName(event.target.value);
  };

  const displayFieldAndButton = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <Input
          type="text"
          placeholder="Type your name here..."
          onChange={handleUserNameChange}
        />
        <Button
          primary
          style={{ marginTop: 10 }}
          content="Begin"
          onClick={handleStartSpeedTest}
        />

        {userNameError()}
      </div>
    );
  };

  const userNameError = () => {
    if (displayUserNameError) {
      return (
        <label style={{ padding: 10, float: "right", color: "red" }}>
          Please enter a username!
        </label>
      );
    }
  };

  const displayContent = () => {
    if (templateError) {
      return <PageError />;
    } else {
      return (
        <div style={{ textAlign: "center", marginTop: "10vh" }}>
          <Segment>
            <Container text>
              {sessionContext.sessionID === "" ? (
                <div>
                  <Header as="h1" content="Welcome!" />
                  <Header
                    as="h4"
                    style={{ marginBottom: "3vh" }}
                    content="Please type your name below, and click on the button to begin the session!"
                  />
                  {displayFieldAndButton()}
                </div>
              ) : (
                <div>
                  <Header
                    as="h4"
                    style={{ marginBottom: "3vh" }}
                    content="You are currently in an active session, Click the button to resume!"
                  />
                  <Button
                    primary
                    content="Resume Session"
                    onClick={handleResumeSession}
                  />
                </div>
              )}
            </Container>
          </Segment>
        </div>
      );
    }
  };

  return (
    <div>
      <div>{displayContent()}</div>
      <Link to="/speedtest" hidden ref={speedTestRef} />
      <Link to="/scrolltest" hidden ref={scrollTestRef} />
      <Link to="/end" hidden ref={endPageRef} />
    </div>
  );
};

export default UserHome;
