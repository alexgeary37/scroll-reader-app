import { Header, Segment } from "semantic-ui-react";

const PageError = () => {
  return (
    <div>
      <Header as="h1" content="404 Error!" />
      <Segment>
        <p style={{ color: "red" }}>The url for this page is invalid.</p>
      </Segment>
    </div>
  );
};

export default PageError;
