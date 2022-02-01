import { Container, Button, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const Home = () => {
  const loginRef = useRef();

  return (
    <div style={{ paddingTop: 10, textAlign: "center" }}>
      <Container text>
        <Header as="h1" content="Welcome!" />
        <Button
          primary
          content="Login"
          onClick={() => loginRef.current.click()}
        />
        <Link to="/researcher" hidden ref={loginRef} />
      </Container>
    </div>
  );
};

export default Home;
