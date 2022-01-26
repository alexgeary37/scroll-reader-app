import React, { useState } from "react";
import { Input, Button, Container, Header, Segment } from "semantic-ui-react";
import { login } from "../../api";

function Login({ onLoginSuccessful }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setHasError(false);
    const loginResult = await login({ email, password });
    if (!loginResult) {
      setHasError(true);
    } else {
      // Save user IDs on local storage
      const { name, token } = loginResult;
      localStorage.setItem("name", name);
      localStorage.setItem("token", token);
      onLoginSuccessful();
    }
  };

  return (
    <div>
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
            The email address and password you entered don't match any account.
            Please try again.
          </label>
        )}
        <Button content="Submit" onClick={onSubmit} />
      </Container>
    </div>
  );
}

export default Login;
