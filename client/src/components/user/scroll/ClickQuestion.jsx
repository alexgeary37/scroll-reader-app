import { useState, useEffect, useContext } from "react";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import axios from "axios";
import { SessionContext } from "../../../contexts/SessionContext";

const ClickQuestion = ({
  close,
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

  const displayButtons = () => {
    return (
      <Button.Group widths={2}>
        <Button
          fluid
          negative
          disabled={disable}
          content="Skip"
          onClick={skip}
        />
        <Button
          fluid
          basic={!answerIsEnabled}
          positive
          disabled={disable}
          content="Answer"
          onClick={handleEnableAnswer}
        />
      </Button.Group>
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
        {displayButtons()}
      </Segment>
    );
  };

  return displayContent();
};

export default ClickQuestion;
