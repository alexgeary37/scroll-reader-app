import { Container, Segment, Input, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { createRef, useContext, useEffect, useState } from "react";
import axios from "axios";
import { SessionContext } from "../../contexts/SessionContext";
import PageError from "../PageError";

const Home = () => {
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

  const fetchSessionTemplate = () => {
    // Get sessionTemplateID from the url.
    const url = window.location.href.toString();
    const templateId = url.substr(url.lastIndexOf("/") + 1);

    // Get template from the database
    axios
      .get("http://localhost:3001/getSessionTemplate", {
        params: { _id: templateId },
      })
      .then((response) => {
        if (response.data.name === "CastError") {
          setTemplateError(true);
        } else {
          setTemplate(response.data);
          console.log(response.data);
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
    const viewportHeight = window.innerHeight;

    const newReadingSession = {
      userName: userName,
      viewportHeight: viewportHeight,
      templateID: template._id,
      startTime: date,
    };

    await axios
      .post("http://localhost:3001/createReadingSession", newReadingSession)
      .then((response) => {
        sessionContext.setSessionID(response.data._id);
        sessionCreated = true;
      })
      .catch((error) => {
        console.error("Error adding session:", error);
      });

    return sessionCreated;
  };

  const handleStartTask1 = () => {
    if (userName === "") {
      setDisplayUserNameError(true);
      return;
    }

    const sessionCreated = createSession();

    if (sessionCreated) {
      sessionContext.setTemplate(template);
      speedTestRef.current.click();
    }
  };

  const handleResumeSession = () => {
    axios
      .get("http://localhost:3001/getCurrentSession", {
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
          <div style={{ textAlign: "center" }}>
            <Container text>
              <h1>Welcome!</h1>
              <Segment>
                Please type your name below, and click on the button to begin
                the session!
              </Segment>
              <div className="wrapper" style={{ justifyContent: "center" }}>
                <Input
                  type="text"
                  placeholder="Type your name here..."
                  onChange={handleUserNameChange}
                />
                <Button
                  primary
                  content="Start Task 1"
                  onClick={handleStartTask1}
                />

                {userNameError()}
              </div>
            </Container>
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

export default Home;
