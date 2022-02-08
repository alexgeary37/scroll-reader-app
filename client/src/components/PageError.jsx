import { Header, Segment } from "semantic-ui-react";

const PageError = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <Segment>
        <Header as="h1" content="404 Error!" />
        <Segment>
          <p style={{ color: "red" }}>The url for this page is invalid.</p>
        </Segment>
      </Segment>
    </div>
  );
};

export default PageError;
