import { createRef } from "react";
import { Link } from "react-router-dom";
import { Container, Segment, Header, Button } from "semantic-ui-react";

const DisplaySessionCompleted = ({ thing }) => {
  const scrollTestRef = createRef();
  const endPageRef = createRef();

  const message =
    thing === "Session"
      ? "Session has been completed!"
      : "This section has been completed! Click the button to resume!";

  const handleResumeSession = () => {
    if (thing === "Session") {
      endPageRef.current.click();
    } else {
      scrollTestRef.current.click();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "25vh" }}>
      <Segment basic >
        <Container text>
          <Header as="h2" style={{ marginBottom: "3vh" }} content={message} />
          {thing === "This section" && (
            <Button
              primary
              content="Resume Session"
              onClick={handleResumeSession}
            />
          )}
        </Container>
      </Segment>
      <Link to="/scrolltest" hidden ref={scrollTestRef} />
      <Link to="/end" hidden ref={endPageRef} />
    </div>
  );
};

export default DisplaySessionCompleted;
