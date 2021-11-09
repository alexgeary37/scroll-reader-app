import { useState, useEffect } from "react";
import { Card, Button, Grid, Message, Transition } from "semantic-ui-react";
import axios from "axios";

const ClickQuestion = ({
  currentText,
  questionNumber,
  disable,
  answerIsEnabled,
  enableAnswer,
  skip,
}) => {
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const fileID = currentText.fileID;
    const questionID = currentText.questionIDs[questionNumber];

    console.log(fileID);

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

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header content="Question:" />
        <Card.Description style={{ marginBottom: 10 }} content={question} />
        <Grid>
          <Grid.Column width="8">
            <Button
              fluid
              toggle
              active={answerIsEnabled}
              disabled={disable}
              content="Answer"
              onClick={enableAnswer}
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
        <Transition visible={answerIsEnabled} animation="glow" duration={2000}>
          <Message
            info
            hidden={!answerIsEnabled}
            content="Click in the text where you think the answer is!"
          />
        </Transition>
      </Card.Content>
    </Card>
  );
};

export default ClickQuestion;
