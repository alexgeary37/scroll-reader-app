import { Button, Modal } from "semantic-ui-react";
import { SessionContext } from "../../../contexts/SessionContext";
import axios from "axios";
import { useContext, useState } from "react";

const ScrollTestInstructions = ({ isOpen, text, close }) => {
  const sessionContext = useContext(SessionContext);
  const [familiarity, setFamiliarity] = useState("Very Unfamiliar");
  const [interest, setInterest] = useState("Very Uninterested");

  const handleStartTest = () => {
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
      .catch((error) => {
        console.error(
          "Error updating readingSession.scrollTexts[text.fileID].startTime:",
          error
        );
      });
  };

  const clearData = () => {
    setFamiliarity("Very Unfamiliar");
    setInterest("Very Uninterested");
  };

  const displayFamiliarityQuestion = () => {
    if (JSON.parse(text.instructions.hasFamiliarityQuestion) === true) {
      return (
        <div className="ui form" style={{ textAlign: "center" }}>
          <label>How familiar are you with this topic?</label>
          <div className="inline fields">
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={familiarity === "Very Unfamiliar"}
                  onChange={(e) => setFamiliarity("Very Unfamiliar")}
                />
                <label>Very Unfamiliar</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={familiarity === "Unfamiliar"}
                  onChange={(e) => setFamiliarity("Unfamiliar")}
                />
                <label>Unfamiliar</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={familiarity === "Neutral"}
                  onChange={(e) => setFamiliarity("Neutral")}
                />
                <label>Neutral</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={familiarity === "Familiar"}
                  onChange={(e) => setFamiliarity("Familiar")}
                />
                <label>Familiar</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={familiarity === "Very Familiar"}
                  onChange={(e) => setFamiliarity("Very Familiar")}
                />
                <label>Very Familiar</label>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const displayInterestQuestion = () => {
    if (JSON.parse(text.instructions.hasInterestQuestion) === true) {
      return (
        <div className="ui form">
          <label>How interested are you with this topic?</label>
          <div className="inline fields">
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={interest === "Very Uninterested"}
                  onChange={(e) => setInterest("Very Uninterested")}
                />
                <label>Very Uninterested</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={interest === "Uninterested"}
                  onChange={(e) => setInterest("Uninterested")}
                />
                <label>Uninterested</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={interest === "Neutral"}
                  onChange={(e) => setInterest("Neutral")}
                />
                <label>Neutral</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={interest === "Interested"}
                  onChange={(e) => setInterest("Interested")}
                />
                <label>Interested</label>
              </div>
            </div>
            <div className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  checked={interest === "Very Interested"}
                  onChange={(e) => setInterest("Very Interested")}
                />
                <label>Very Interested</label>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", overflow: "auto", padding: 10 }}
    >
      <Modal.Description as="h4" content={text.instructions.main} />
      {displayFamiliarityQuestion()}
      {displayInterestQuestion()}
      <Button
        floated="right"
        primary
        content="Begin"
        onClick={handleStartTest}
      />
    </Modal>
  );
};

export default ScrollTestInstructions;
