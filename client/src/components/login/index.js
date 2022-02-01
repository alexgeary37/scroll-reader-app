import axios from "axios";
import React, { useState } from "react";
import { Input, Button, Container, Header, Segment } from "semantic-ui-react";

const Login = ({ onLoginSuccessful }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setHasError(false);
    axios
      .post("/api/login", { email: email, password: password })
      .then((response) => {
        // Save user IDs on local storage
        const { name, token } = response.data;
        localStorage.setItem("name", name);
        localStorage.setItem("token", token);
        onLoginSuccessful();
      })
      .catch((error) => {
        setHasError(true);
        console.error("Error logging in:", error);
      });
  };

  return (
    <div style={{ paddingTop: 10, textAlign: "center" }}>
      <Container>
        <Header as="h1" content="Login" />
        <Segment>
          <Header as="h3" content="Email address:" />
          <Input
            type="email"
            autoFocus
            fluid
            placeholder="Enter email..."
            onChange={(e) => setEmail(e.target.value)}
          />
        </Segment>
        <Segment>
          <Header as="h3" content="Password:" />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Segment>
        {hasError && (
          <label style={{ padding: 10, color: "red" }}>
            Incorrect email or password. Please try again.
          </label>
        )}
        <Button positive content="Login" onClick={onSubmit} />
      </Container>
    </div>
  );
};

export default Login;
