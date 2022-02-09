import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  TextArea,
  Header,
  Segment,
  Icon,
} from "semantic-ui-react";

const ComprehensionQuestion = ({
  close,
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
        <Form>
          <Form.Field>
            <TextArea
              placeholder="Type your answer here..."
              value={answer}
              onChange={handleChangeAnswer}
            />
          </Form.Field>
        </Form>
        <Button.Group widths={2}>
          <Button
            fluid
            negative
            disabled={disable}
            content="Skip"
            onClick={handleSkip}
          />
          <Button
            fluid
            primary
            disabled={disable || answer === ""}
            content="Submit"
            onClick={handleSubmit}
          />
        </Button.Group>
      </div>
    );
  };

  const displayContent = () => {
    return (
      <Segment
        style={{
          margin: "auto",
          maxWidth: "60em",
          width: "100%",
          position: "fixed",
          top: 0,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h4" content="Question:" />
          <div onClick={close}>
            <Icon size="large" name="close" link />
          </div>
        </div>
        <span>{question}</span>
        {displayFormAndButtons()}
      </Segment>
    );
  };

  return displayContent();
};

export default ComprehensionQuestion;
