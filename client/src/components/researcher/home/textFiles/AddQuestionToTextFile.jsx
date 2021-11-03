import { useState } from "react";
import { Modal, Button, Input, Segment } from "semantic-ui-react";
import TextAnswersConfigurationView from "./TextAnswersConfigurationView";

const AddQuestionToTextFile = ({
  isOpen,
  fileID,
  format,
  addQuestion,
  close,
}) => {
  const [question, setQuestion] = useState("");
  const [answerRegion, setAnswerRegion] = useState("");
  const [displayAnswerRegionError, setDisplayAnswerRegionError] =
    useState(false);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleAddQuestion = () => {
    if (question !== "") {
      if (format === "inline" && answerRegion === "") {
        setDisplayAnswerRegionError(true);
        return;
      }
      addQuestion(question, answerRegion);
    }
    close();
  };

  const displayErrorMessage = () => {
    if (displayAnswerRegionError) {
      return (
        <label style={{ padding: 10, color: "red" }}>
          Please select an answer region for this question!
        </label>
      );
    }
  };

  const displayText = () => {
    if (format === "inline") {
      return (
        <Segment style={{ overflow: "auto", maxHeight: "75%" }}>
          <TextAnswersConfigurationView fileID={fileID} />;
        </Segment>
      );
    }
  };

  const displayQuestionAndButtons = () => {
    return (
      <div>
        {displayErrorMessage()}
        <Input
          style={{ marginBottom: 10 }}
          autoFocus
          type="text"
          fluid
          placeholder="Type a question for this text here..."
          onChange={handleQuestionChange}
        />

        <div style={{ position: "absolute", right: 10, bottom: 10 }}>
          <Button content="Cancel" onClick={close} />
          <Button primary content="Add Question" onClick={handleAddQuestion} />
        </div>
      </div>
    );
  };

  const displayModal = () => {
    if (format === "inline") {
      return (
        <Modal open={isOpen} style={{ height: "70vh", padding: 10 }}>
          {displayText()}
          {displayQuestionAndButtons()}
        </Modal>
      );
    } else {
      return (
        <Modal open={isOpen} size="tiny" style={{ padding: 10 }}>
          {displayQuestionAndButtons()}
        </Modal>
      );
    }
  };

  return displayModal();
};

export default AddQuestionToTextFile;
