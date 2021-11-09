import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Form, Grid, TextArea } from "semantic-ui-react";

const ComprehensionQuestion = ({
  currentText,
  questionNumber,
  disable,
  submitAnswer,
  skip,
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fileID = currentText.fileID;
    const questionID = currentText.questionIDs[questionNumber];

    axios
      .get("http://localhost:3001/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        const questionObj = response.data.questions.find(
          (q) => q._id === questionID
        );
        if (typeof questionObj !== "undefined") {
          setQuestion(questionObj.question);
        }
      })
      .catch((error) => {
        console.error("Error fetching text in ScrollText:", error);
      });
  }, [currentText, questionNumber]);

  const handleChangeAnswer = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = () => {
    submitAnswer(answer, false);
    setAnswer("");
  };

  const handleSkip = () => {
    skip();
    setAnswer("");
  };

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header content="Question:" />
        <Card.Description content={question} />
        <Form style={{ marginTop: 10, marginBottom: 10 }}>
          <Form.Field>
            <TextArea
              placeholder="Type your answer here..."
              value={answer}
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
              onClick={handleSubmit}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Button
              fluid
              negative
              disabled={disable}
              content="Skip"
              onClick={handleSkip}
            />
          </Grid.Column>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default ComprehensionQuestion;
