import { Container, Segment, Header } from "semantic-ui-react";

const DisplaySessionCompleted = ({ thing }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "30vh" }}>
      <Segment>
        <Container text>
          <Header as="h1" content={`${thing} has been completed!`} />
        </Container>
      </Segment>
    </div>
  );
};

export default DisplaySessionCompleted;
