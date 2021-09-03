import { Container, Header, Segment, Input, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { createRef, useContext, useEffect, useState } from "react";
import Axios from "axios";
import { SessionContext } from "../contexts/SessionContext";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [displayUserNameError, setDisplayUserNameError] = useState(false);
  const sessionContext = useContext(SessionContext);
  const startTask1Ref = createRef();

  useEffect(() => {
    fetchSessionTemplate();
  }, []);

  const fetchSessionTemplate = () => {

    // Get sessionTemplateID from the url.
    const url = window.location.href.toString();
    const templateId = url.substr(url.lastIndexOf("/") + 1);

    // Get template from the database
    Axios.get("http://localhost:3001/getSessionTemplate", {
      params: { _id: templateId },
    })
      .then((response) => {
        sessionContext.setTemplate(response.data);
      })
      .catch((error) => {
        console.error("Error fetching SessionTemplate:", error);
      });
  };

  // Add new session to database.
  const createSession = () => {
    const date = new Date();

    const newSession = {
      userName: userName,
      template: sessionContext.template,
      startTime: date,
      endTime: date,
    };

    Axios.post("http://localhost:3001/addReadingSession", newSession)
      .then((response) => {
        sessionContext.setSessionID(response.data._id);
      })
      .catch((error) => {
        console.error("Error adding session:", error);
      });
  };

  const handleStartTask1 = () => {
    if (userName === "") {
      setDisplayUserNameError(true);
      return;
    }
    createSession();
    sessionContext.setUserName(userName);
    sessionContext.setInProgress(true);
    startTask1Ref.current.click();
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

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <Container text>
        <Segment>
          <Header as="h1" content="Welcome!" />
          <p>
            These are the instructions for this experiment. They will tell you
            what to do, and how to use this website. Please type your name
            below, and click on the button to continue to task 1 when you are
            ready.
          </p>
          <div className="wrapper" style={{ justifyContent: "center" }}>
            <Input
              type="text"
              placeholder="Type your name here..."
              onChange={handleUserNameChange}
            />
            <Button primary content="Start Task 1" onClick={handleStartTask1} />
            <Link to="/scrolltext" hidden ref={startTask1Ref}></Link>
            {userNameError()}
          </div>
        </Segment>
      </Container>
    </div>
  );
};

export default Home;
