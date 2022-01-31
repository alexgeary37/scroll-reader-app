import { Button, Modal } from "semantic-ui-react";
import { SessionContext } from "../../../contexts/SessionContext";
import axios from "axios";
import { useContext, useState } from "react";

const ScrollTestInstructions = ({ isOpen, text, close }) => {
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
        .catch((error) => {
          console.error(
            "Error updating readingSession.scrollTexts[text.fileID].startTime:",
            error
          );
        });
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
          <div className="ui form" style={{ textAlign: "center" }}>
            <label>How familiar are you with this topic?</label>
            <div className="inline fields">
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={familiarity === "Very Unfamiliar"}
                    onChange={(e) => handleFamiliarityChange("Very Unfamiliar")}
                  />
                  <label>Very Unfamiliar</label>
                </div>
              </div>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={familiarity === "Unfamiliar"}
                    onChange={(e) => handleFamiliarityChange("Unfamiliar")}
                  />
                  <label>Unfamiliar</label>
                </div>
              </div>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={familiarity === "Neutral"}
                    onChange={(e) => handleFamiliarityChange("Neutral")}
                  />
                  <label>Neutral</label>
                </div>
              </div>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={familiarity === "Familiar"}
                    onChange={(e) => handleFamiliarityChange("Familiar")}
                  />
                  <label>Familiar</label>
                </div>
              </div>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={familiarity === "Very Familiar"}
                    onChange={(e) => handleFamiliarityChange("Very Familiar")}
                  />
                  <label>Very Familiar</label>
                </div>
              </div>
            </div>
          </div>
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
          <div className="ui form">
            <label>How interested are you with this topic?</label>
            <div className="inline fields" style={{textAlign:"center"}}>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={interest === "Very Uninterested"}
                    onChange={(e) => handleInterestChange("Very Uninterested")}
                  />
                  <label>Very Uninterested</label>
                </div>
              </div>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={interest === "Uninterested"}
                    onChange={(e) => handleInterestChange("Uninterested")}
                  />
                  <label>Uninterested</label>
                </div>
              </div>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={interest === "Neutral"}
                    onChange={(e) => handleInterestChange("Neutral")}
                  />
                  <label>Neutral</label>
                </div>
              </div>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={interest === "Interested"}
                    onChange={(e) => handleInterestChange("Interested")}
                  />
                  <label>Interested</label>
                </div>
              </div>
              <div className="field">
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={interest === "Very Interested"}
                    onChange={(e) => handleInterestChange("Very Interested")}
                  />
                  <label>Very Interested</label>
                </div>
              </div>
            </div>
          </div>
          {displayInterestError && (
            <span style={{ color: "red" }}>Please select an option above!</span>
          )}
        </div>
      );
    }
  };

  return (
    <Modal
    
      open={isOpen}
      style={{ textAlign: "center", overflow: "auto", padding: 10 }}
    >
      <Modal.Description as="h4" content={text.instructions.main} />
      {displayFamiliarityQuestion()}
      {displayInterestQuestion()}
      <div style={{ marginTop: 10 }}>
        <Button primary content="Begin" onClick={handleStartTest} />
      </div>
    </Modal>
  );
};

export default ScrollTestInstructions;
