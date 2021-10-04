import { useEffect } from "react";
import { Segment, Container, Header } from "semantic-ui-react";

const EndPage = () => {
  useEffect(() => {
    clearSessionVariables();
  }, []);

  const clearSessionVariables = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("sessionTemplate");
    localStorage.removeItem("isPaused");
    localStorage.removeItem("hasStartedReading");
    localStorage.removeItem("fileNumber");
    localStorage.removeItem("scrollQuestionNumber");
    localStorage.removeItem("scrollPosEntries");
    localStorage.removeItem("sessionID");
  };

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <Segment>
        <Container text>
          <Header as="h1" content="Thank you for taking the test!" />
        </Container>
      </Segment>
    </div>
  );
};

export default EndPage;
