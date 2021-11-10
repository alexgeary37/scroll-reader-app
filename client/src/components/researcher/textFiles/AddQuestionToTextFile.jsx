import { useState } from "react";
import { Modal, Button, Input } from "semantic-ui-react";
import TextAnswersConfigurationView from "./TextAnswersConfigurationView";

const AddQuestionToTextFile = ({
  isOpen,
  fileID,
  format,
  addQuestion,
  close,
}) => {
  const [question, setQuestion] = useState("");
  const [answerRegion, setAnswerRegion] = useState({
    startIndex: 0,
    endIndex: 0,
  });
  const [displayQuestionError, setDisplayQuestionError] = useState(false);
  const [
    displayAnswerRegionConfiguration,
    setDisplayAnswerRegionConfiguration,
  ] = useState(false);
  const [displayAnswerRegionError, setDisplayAnswerRegionError] =
    useState(false);

  const handleCancel = () => {
    setQuestion("");
    setAnswerRegion({ startIndex: 0, endIndex: 0 });
    setDisplayAnswerRegionConfiguration(false);
    setDisplayAnswerRegionError(false);
    close();
  };

  const handleQuestionChange = (event) => {
    setDisplayQuestionError(false);
    setQuestion(event.target.value);
  };

  const handleAddQuestion = () => {
    if (question === "") {
      setDisplayQuestionError(true);
      return;
    }

    if (
      format === "inline" &&
      answerRegion.startIndex === 0 &&
      answerRegion.endIndex === 0
    ) {
      setDisplayAnswerRegionError(true);
      return;
    }

    setQuestion("");
    setDisplayAnswerRegionConfiguration(false);
    addQuestion(question, answerRegion);
    setAnswerRegion({ startIndex: 0, endIndex: 0 });
    close();
  };

  const handleSelectAnswerRegion = (mouseDownIndex, mouseUpIndex) => {
    setDisplayAnswerRegionError(false);
    setAnswerRegion({ startIndex: mouseDownIndex, endIndex: mouseUpIndex });
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
          answerRegion={answerRegion}
          selectAnswer={handleSelectAnswerRegion}
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
          error={displayQuestionError}
          autoFocus
          type="text"
          fluid
          placeholder="Type a question for this text here..."
          onChange={handleQuestionChange}
        />
        {displayInlineComponents()}
        <div style={{ position: "absolute", right: 10, bottom: 10 }}>
          <Button content="Cancel" onClick={handleCancel} />
          <Button primary content="Add Question" onClick={handleAddQuestion} />
        </div>
      </div>
    );
  };

  const displayInlineComponents = () => {
    if (format === "inline") {
      return (
        <div>
          <Button
            positive
            content="Select Answer Region"
            onClick={() =>
              setDisplayAnswerRegionConfiguration(
                !displayAnswerRegionConfiguration
              )
            }
          />
          {displayAnswerRegionSelection()}
        </div>
      );
    }
  };

  const displayAnswerRegionSelection = () => {
    if (displayAnswerRegionConfiguration) {
      return (
        <span
          style={{ padding: 10, color: "blue" }}
        >{`Answer Region: words [${answerRegion.startIndex} - ${answerRegion.endIndex}]`}</span>
      );
    }
  };

  return (
    <Modal
      open={isOpen}
      size={format === "inline" ? "small" : "tiny"}
      style={{ padding: 10 }}
    >
      {displayConfigurationView()}
      {displayQuestionAndButtons()}
    </Modal>
  );
};

export default AddQuestionToTextFile;
