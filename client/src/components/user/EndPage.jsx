import { Segment, Container, Header } from "semantic-ui-react";

const EndPage = () => {
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
