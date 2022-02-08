import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Form, Grid, TextArea, Modal } from "semantic-ui-react";

const ComprehensionQuestion = ({
  isMobile,
  openModal,
  closeModal,
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
        <Grid columns="equal" style={{margin: 1}}>
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
    // if (isMobile) {
    return (
      <Modal
        closeIcon
        size="tiny"
        open={openModal}
        onClose={closeModal}
        style={{ textAlign: "center", padding: 10 }}
      >
        <Modal.Description as="h4" style={{margin: "2vh"}} content="Question:" />
        <Modal.Description style={{ marginBottom: "2vh" }} content={question} />
        {displayFormAndButtons()}
      </Modal>
    );
    // } else {
    //   return (
    //     <Card fluid>
    //       <Card.Content>
    //         <Card.Header content="Question:" />
    //         <Card.Description content={question} />
    //         {displayFormAndButtons()}
    //       </Card.Content>
    //     </Card>
    //   );
    // }
  };

  return displayContent();
};

export default ComprehensionQuestion;
