import { Container, Button, Header, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Home = () => {
  const loginRef = useRef();

  return (
    <div style={{ textAlign: "center", marginTop: "25vh" }}>
      <Segment basic>
        <Container text>
          <Header as="h1" style={{ marginBottom: "3vh" }} content="Welcome!" />
          <Button
            primary
            content="Log In"
            onClick={() => loginRef.current.click()}
          />
          <Link to="/researcher" hidden ref={loginRef} />
        </Container>
      </Segment>
    </div>
  );
};

export default Home;
