import { Header, Segment } from "semantic-ui-react";

const PageError = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "25vh" }}>
      <Segment basic>
        <Header as="h1" content="404 Error!" />
        <Header
          as="h2"
          style={{ color: "red" }}
          content="The url for this page is invalid."
        />
      </Segment>
    </div>
  );
};

export default PageError;
