import axios from "axios";
import { useState } from "react";
import { Card, Button, Form, Grid } from "semantic-ui-react";

const Question = ({ question, disable, skip }) => {
  const [answer, setAnswer] = useState("");

  const handleChangeAnswer = (event) => {
    setAnswer(event.target.value);
  };

  const submitAnswer = () => {
    // axios.put();
  };

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header content="Question:" />
        <Card.Description content={question} />
        <Form style={{ marginTop: 10, marginBottom: 10 }}>
          <Form.Field>
            <textarea
              placeholder="Type your answer here..."
              onChange={handleChangeAnswer}
            />
          </Form.Field>
        </Form>
        <Grid>
          <Grid.Column width="8">
            <Button
              fluid
              primary
              disabled={disable}
              content="Submit"
              onClick={submitAnswer}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Button
              fluid
              negative
              disabled={disable}
              content="Skip"
              onClick={skip}
            />
          </Grid.Column>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default Question;
