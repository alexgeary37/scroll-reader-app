import { Container, Segment, Input, Button, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { createRef, useContext, useEffect, useState } from "react";
import axios from "axios";
import { SessionContext } from "../../contexts/SessionContext";
import PageError from "../PageError";

const MIN_USERNAME_CHARACTERS = 3;
const isMobile = window.innerWidth <= 768;

const UserHome = () => {
  const [userName, setUserName] = useState("");
  const [template, setTemplate] = useState(null);
  const [templateError, setTemplateError] = useState(false);
  const [displayUserNameError, setDisplayUserNameError] = useState(false);
  const sessionContext = useContext(SessionContext);
  const speedTestRef = createRef();
  const scrollTestRef = createRef();
  const endPageRef = createRef();

  useEffect(() => {
    fetchSessionTemplate();
  }, []);

  useEffect(() => {
    if (sessionContext.template !== null) {
      speedTestRef.current.click();
    }
  }, [sessionContext.template]);

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
      .catch((error) => {
        console.error("Error fetching SessionTemplate:", error);
      });
  };

  // Add new session to database.
  const createSession = async () => {
    let sessionCreated = false;
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
    };

    await axios
      .post("/api/createReadingSession", newReadingSession)
      .then((response) => {
        sessionContext.setSessionID(response.data._id);
        sessionCreated = true;
      })
      .catch((error) => {
        console.error("Error adding session:", error);
      });

    return sessionCreated;
  };

  const handleStartSpeedTest = async () => {
    if (userName.trim().length < MIN_USERNAME_CHARACTERS) {
      setDisplayUserNameError(true);
      return;
    }

    const sessionCreated = await createSession();
    if (sessionCreated) {
      sessionContext.setTemplate(template);
    }
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
        } else if (currentSession.scrollTexts.length > 0) {
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
      if (sessionContext.sessionID === "") {
        return (
          <div style={{ textAlign: "center", marginTop: "10vh" }}>
            <Segment>
              <Container text>
                <Header as="h1" content="Welcome!" />
                <Segment>
                  Please type your name below, and click on the button to begin
                  the session!
                </Segment>
                {displayFieldAndButton()}
              </Container>
            </Segment>
          </div>
        );
      } else {
        return (
          <div style={{ textAlign: "center" }}>
            <Container text>
              <Segment>
                You are currently in an active session, Click the button to
                resume!
              </Segment>
              <Button
                primary
                content="Resume Session"
                onClick={handleResumeSession}
              />
            </Container>
          </div>
        );
      }
    }
  };

  return (
    <div>
      <div>{displayContent()}</div>
      <Link to="/speedtest" hidden ref={speedTestRef}></Link>
      <Link to="/scrolltest" hidden ref={scrollTestRef}></Link>
      <Link to="/end" hidden ref={endPageRef}></Link>
    </div>
  );
};

export default UserHome;
