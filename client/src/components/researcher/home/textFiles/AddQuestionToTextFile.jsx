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
  const [
    displayAnswerRegionConfiguration,
    setDisplayAnswerRegionConfiguration,
  ] = useState(false);
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

  const handleSelectAnswerRegion = (mouseDownIndex, mouseUpIndex) => {
    setAnswerRegion(mouseDownIndex, mouseUpIndex);
    console.log(mouseDownIndex, mouseUpIndex);
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

  const displayConfigurationView = () => {
    if (displayAnswerRegionConfiguration) {
      return (
        <TextAnswersConfigurationView
          fileID={fileID}
          selectAnswer={handleSelectAnswerRegion}
          close={() => setDisplayAnswerRegionConfiguration(false)}
        />
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

        <Button
          positive
          content="Select Region"
          onClick={() => setDisplayAnswerRegionConfiguration(true)}
        />
        <div style={{ position: "absolute", right: 10, bottom: 10 }}>
          <Button content="Cancel" onClick={close} />
          <Button primary content="Add Question" onClick={handleAddQuestion} />
        </div>
      </div>
    );
  };

  return (
    <Modal open={isOpen} size="tiny" style={{ padding: 10 }}>
      {displayConfigurationView()}
      {displayQuestionAndButtons()}
    </Modal>
  );
};

export default AddQuestionToTextFile;
