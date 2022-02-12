import { Button, Form, Header, Modal } from "semantic-ui-react";
import { SessionContext } from "../../../contexts/SessionContext";
import axios from "axios";
import { useContext, useState } from "react";

const ScrollTestInstructions = ({
  isOpen,
  displayConfirmMessage,
  text,
  answerYes,
  close,
}) => {
  const sessionContext = useContext(SessionContext);
  const [familiarity, setFamiliarity] = useState("");
  const [interest, setInterest] = useState("");
  const [displayFamiliarityError, setDisplayFamiliarityError] = useState(false);
  const [displayInterestError, setDisplayInterestError] = useState(false);

  const handleFamiliarityChange = (familiarity) => {
    setFamiliarity(familiarity);
    setDisplayFamiliarityError(false);
  };

  const handleInterestChange = (interest) => {
    setInterest(interest);
    setDisplayInterestError(false);
  };

  const inputsAreValid = () => {
    let isValid = true;
    if (
      JSON.parse(text.instructions.hasFamiliarityQuestion) === true &&
      familiarity === ""
    ) {
      setDisplayFamiliarityError(true);
      isValid = false;
    }
    if (
      JSON.parse(text.instructions.hasInterestQuestion) === true &&
      interest === ""
    ) {
      setDisplayInterestError(true);
      isValid = false;
    }
    return isValid;
  };

  const handleStartTest = () => {
    if (inputsAreValid()) {
      const sessionID = sessionContext.sessionID;
      const startTime = new Date();

      const textObj = {
        id: sessionID,
        fileID: text.fileID,
        startTime: startTime,
      };

      if (JSON.parse(text.instructions.hasFamiliarityQuestion) === true) {
        textObj.familiarity = familiarity;
      }

      if (JSON.parse(text.instructions.hasInterestQuestion) === true) {
        textObj.interest = interest;
      }

      axios
        .put("/api/addNewScrollText", textObj)
        .then(() => {
          // Set sessionContext to be in progress, this will close modal.
          clearData();
          close();
        })
        .catch((error) =>
          console.error(
            "Error updating readingSession.scrollTexts[text.fileID].startTime:",
            error
          )
        );
    }
  };

  const clearData = () => {
    setFamiliarity("");
    setInterest("");
  };

  const displayFamiliarityQuestion = () => {
    if (JSON.parse(text.instructions.hasFamiliarityQuestion) === true) {
      return (
        <div>
          <Form>
            <Header as="h4" content="How familiar are you with this topic?" />
            <Form.Group widths="equal">
              <Form.Field>
                <Form.Radio
                  label="Very Unfamiliar"
                  checked={familiarity === "Very Unfamiliar"}
                  onChange={(e) => handleFamiliarityChange("Very Unfamiliar")}
                />
              </Form.Field>
              <Form.Field>
                <Form.Radio
                  label="Unfamiliar"
                  checked={familiarity === "Unfamiliar"}
                  onChange={(e) => handleFamiliarityChange("Unfamiliar")}
                />
              </Form.Field>
              <Form.Field>
                <Form.Radio
                  label="Neutral"
                  checked={familiarity === "Neutral"}
                  onChange={(e) => handleFamiliarityChange("Neutral")}
                />
              </Form.Field>
              <Form.Field>
                <Form.Radio
                  label="Familiar"
                  checked={familiarity === "Familiar"}
                  onChange={(e) => handleFamiliarityChange("Familiar")}
                />
              </Form.Field>
              <Form.Field>
                <Form.Radio
                  label="Very Familiar"
                  checked={familiarity === "Very Familiar"}
                  onChange={(e) => handleFamiliarityChange("Very Familiar")}
                />
              </Form.Field>
            </Form.Group>
          </Form>
          {displayFamiliarityError && (
            <span style={{ color: "red" }}>Please select an option above!</span>
          )}
        </div>
      );
    }
  };

  const displayInterestQuestion = () => {
    if (JSON.parse(text.instructions.hasInterestQuestion) === true) {
      return (
        <div>
          <Form>
            <Header as="h4" content="How interested are you with this topic?" />
            <Form.Group widths="equal">
              <Form.Field>
                <Form.Radio
                  label="Very Uninterested"
                  checked={interest === "Very Uninterested"}
                  onChange={(e) => handleInterestChange("Very Uninterested")}
                />
              </Form.Field>
              <Form.Field>
                <Form.Radio
                  label="Uninterested"
                  checked={interest === "Uninterested"}
                  onChange={(e) => handleInterestChange("Uninterested")}
                />
              </Form.Field>
              <Form.Field>
                <Form.Radio
                  label="Neutral"
                  checked={interest === "Neutral"}
                  onChange={(e) => handleInterestChange("Neutral")}
                />
              </Form.Field>
              <Form.Field>
                <Form.Radio
                  label="Interested"
                  checked={interest === "Interested"}
                  onChange={(e) => handleInterestChange("Interested")}
                />
              </Form.Field>
              <Form.Field>
                <Form.Radio
                  label="Very Interested"
                  checked={interest === "Very Interested"}
                  onChange={(e) => handleInterestChange("Very Interested")}
                />
              </Form.Field>
            </Form.Group>
          </Form>
          {displayInterestError && (
            <span style={{ color: "red" }}>Please select an option above!</span>
          )}
        </div>
      );
    }
  };

  const displayContent = () => {
    if (displayConfirmMessage) {
      return (
        <div>
          <Modal.Description
            as="h4"
            style={{ margin: "2vh" }}
            content="Are you sure you have finished this text?"
          />
          <div style={{ marginBottom: "1vh" }}>
            <Button content="No" onClick={close} />
            <Button primary content="Yes" onClick={answerYes} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Modal.Description
            as="h4"
            style={{ margin: "2vh" }}
            content={text.instructions.main}
          />
          {displayFamiliarityQuestion()}
          {displayInterestQuestion()}
          <div style={{ marginBottom: "1vh" }}>
            <Button primary content="Begin" onClick={handleStartTest} />
          </div>
        </div>
      );
    }
  };

  return (
    <Modal
      open={isOpen}
      style={{ overflow: "auto", textAlign: "center", padding: 10 }}
    >
      {displayContent()}
    </Modal>
  );
};

export default ScrollTestInstructions;
