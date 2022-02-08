import { Container, Button, Header, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Home = () => {
  const loginRef = useRef();

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <Segment>
        <Container text>
          <Header as="h1" content="Welcome!" />
          <Button
            primary
            content="Login"
            onClick={() => loginRef.current.click()}
          />
          <Link to="/researcher" hidden ref={loginRef} />
        </Container>
      </Segment>
    </div>
  );
};

export default Home;
