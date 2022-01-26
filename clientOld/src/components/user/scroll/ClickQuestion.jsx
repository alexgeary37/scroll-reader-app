import { useState, useEffect, useContext } from "react";
import { Card, Button, Grid, Message, Transition } from "semantic-ui-react";
import axios from "axios";
import { SessionContext } from "../../../contexts/SessionContext";

const ClickQuestion = ({
  currentText,
  questionNumber,
  disable,
  answerIsEnabled,
  enableAnswer,
  skip,
}) => {
  const sessionContext = useContext(SessionContext);
  const [question, setQuestion] = useState("");

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

  const handleEnableAnswer = () => {
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const action = answerIsEnabled ? "deactivate" : "activate";

    axios
      .put("/api/addAnswerButtonClick", {
        sessionID: sessionID,
        fileID: currentText.fileID,
        questionNumber: questionNumber,
        action: action,
        time: currentTime,
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.scrollTexts[fileID].answerButtonClicks",
          error
        );
      });

    enableAnswer();
  };

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header content="Question:" />
        <Card.Description style={{ marginBottom: 10 }} content={question} />
        <Grid>
          <Grid.Column width="8">
            <Button
              fluid
              basic={!answerIsEnabled}
              positive
              disabled={disable}
              content="Answer"
              onClick={handleEnableAnswer}
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
