import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Grid,
  TextArea,
  Modal,
  Header,
} from "semantic-ui-react";

const ComprehensionQuestion = ({
  isMobile,
  openModal,
  currentText,
  questionNumber,
  disable,
  submitAnswer,
  skip,
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fileID = currentText.fileID;
    const questionID = currentText.questionIDs[questionNumber];

    axios
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        if (isMounted) {
          const questionObj = response.data.questions.find(
            (q) => q._id === questionID
          );
          if (typeof questionObj !== "undefined") {
            setQuestion(questionObj.question);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching text in ScrollText:", error);
      });
    return () => {
      isMounted = false;
    };
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

  const displayFormAndButtons = () => {
    return (
      <div>
        <Form style={{ marginTop: 10, marginBottom: 10 }}>
          <Form.Field>
            <TextArea
              placeholder="Type your answer here..."
              value={answer}
              onChange={handleChangeAnswer}
            />
          </Form.Field>
        </Form>
        <Grid columns="equal">
          <Grid.Column>
            <Button
              fluid
              negative
              disabled={disable}
              content="Skip"
              onClick={handleSkip}
            />
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              primary
              disabled={disable || answer === ""}
              content="Submit"
              onClick={handleSubmit}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  };

  const displayContent = () => {
    if (isMobile) {
      return (
        <Modal
          size="tiny"
          open={openModal}
          style={{ textAlign: "center", padding: 10 }}
        >
          <Modal.Description as="h4" content="Question:" />
          <Modal.Description style={{ marginTop: 10 }} content={question} />
          {displayFormAndButtons()}
        </Modal>
      );
    } else {
      return (
        <Card fluid>
          <Card.Content>
            <Card.Header content="Question:" />
            <Card.Description content={question} />
            {displayFormAndButtons()}
          </Card.Content>
        </Card>
      );
    }
  };

  return displayContent();
};

export default ComprehensionQuestion;
