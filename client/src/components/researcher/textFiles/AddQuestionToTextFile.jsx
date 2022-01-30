import { useState } from "react";
import { Modal, Button, Input, Form, Segment } from "semantic-ui-react";
import TextAnswersConfigurationView from "./TextAnswersConfigurationView";

const AddQuestionToTextFile = ({ isOpen, fileID, addQuestion, close }) => {
  const [question, setQuestion] = useState("");
  const [questionFormat, setQuestionFormat] = useState("");
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
  const [displayQuestionFormatError, setDisplayQuestionFormatError] =
    useState(false);

  const handleQuestionChange = (event) => {
    setDisplayQuestionError(false);
    setQuestion(event.target.value);
  };

  const handleQuestionFormatChange = (format) => {
    setDisplayQuestionFormatError(false);
    setQuestionFormat(format);
  };

  const handleSelectAnswerRegion = (mouseDownIndex, mouseUpIndex) => {
    setDisplayAnswerRegionError(false);
    setAnswerRegion({ startIndex: mouseDownIndex, endIndex: mouseUpIndex });
  };

  const checkInputs = () => {
    let inputsAreValid = true;
    if (question === "") {
      setDisplayQuestionError(true);
      inputsAreValid = false;
    }

    if (questionFormat === "") {
      setDisplayQuestionFormatError(true);
      inputsAreValid = false;
    }

    if (
      questionFormat === "inline" &&
      answerRegion.startIndex === 0 &&
      answerRegion.endIndex === 0
    ) {
      setDisplayAnswerRegionError(true);
      inputsAreValid = false;
    }
    return inputsAreValid;
  };

  const handleAddQuestion = () => {
    const inputsAreValid = checkInputs();

    if (!inputsAreValid) {
      return;
    }

    addQuestion(question, questionFormat, answerRegion);
    handleClose();
  };

  const handleClose = () => {
    setQuestion("");
    setQuestionFormat("");
    setAnswerRegion({ startIndex: 0, endIndex: 0 });
    setDisplayAnswerRegionConfiguration(false);
    setDisplayQuestionError(false);
    setDisplayQuestionFormatError(false);
    setDisplayAnswerRegionError(false);
    close();
  };

  const displayAnswerRegionErrorMessage = () => {
    if (displayAnswerRegionError) {
      return (
        <label style={{ padding: 10, color: "red" }}>
          Please select an answer region for this question!
        </label>
      );
    }
  };

  const displayQuestionFormatErrorMessage = () => {
    if (displayQuestionFormatError) {
      return (
        <label style={{ padding: 10, color: "red" }}>
          Please select a question format!
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
        {displayAnswerRegionErrorMessage()}
        <Input
          style={{ marginBottom: 10 }}
          error={displayQuestionError}
          autoFocus
          type="text"
          fluid
          placeholder="Type a question for this text here..."
          onChange={handleQuestionChange}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Form>
              <div className="grouped fields">
                <Form.Field>
                  <div className="ui radio checkbox">
                    <input
                      type="radio"
                      checked={questionFormat === "comprehension"}
                      onChange={() =>
                        handleQuestionFormatChange("comprehension")
                      }
                    />
                    <label>Comprehension</label>
                  </div>
                </Form.Field>
                <Form.Field>
                  <div className="ui radio checkbox">
                    <input
                      type="radio"
                      checked={questionFormat === "inline"}
                      onChange={() => handleQuestionFormatChange("inline")}
                    />
                    <label>Inline</label>
                  </div>
                </Form.Field>
              </div>
            </Form>
            {displayQuestionFormatErrorMessage()}
          </div>
          {displayInlineComponents()}
          <div>
            <Button content="Cancel" onClick={handleClose} />
            <Button
              primary
              content="Add Question"
              onClick={handleAddQuestion}
            />
          </div>
        </div>
      </div>
    );
  };

  const displayInlineComponents = () => {
    if (questionFormat === "inline") {
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
    <Modal open={isOpen} style={{ padding: 10 }}>
      {displayConfigurationView()}
      {displayQuestionAndButtons()}
    </Modal>
  );
};

export default AddQuestionToTextFile;
