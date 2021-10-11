import { Button, Modal, Segment } from "semantic-ui-react";
import { SessionContext } from "../../contexts/SessionContext";
import axios from "axios";
import { useContext, useState } from "react";

const ScrollTestInstructions = ({ isOpen, instructions, fileID }) => {
  const sessionContext = useContext(SessionContext);
  const [familiarity, setFamiliarity] = useState("Very Unfamiliar");
  const [interest, setInterest] = useState("Very Uninterested");

  const handleStartTest = () => {
    const sessionID = sessionContext.sessionID;
    const startTime = new Date();

    let textObj = {
      id: sessionID,
      fileID: fileID,
      startTime: startTime,
    };

    if (JSON.parse(instructions.familiarityQuestion) === true) {
      textObj.familiarity = familiarity;
    }

    if (JSON.parse(instructions.interestQuestion) === true) {
      textObj.interest = interest;
    }

    axios
      .put("http://localhost:3001/addNewScrollText", textObj)
      .then(() => {
        // Set sessionContext to be in progress, this will close modal.
        sessionContext.setHasStartedReading(true);
        clearData();
      })
      .catch((error) => {
        console.error(
          `Error updating readingSession.scrollTexts[fileID].startTime:`,
          error
        );
      });
  };

  const clearData = () => {
    setFamiliarity("Very Unfamiliar");
    setInterest("Very Uninterested");
  };

  const displayFamiliarityQuestion = () => {
    if (JSON.parse(instructions.familiarityQuestion) === true) {
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
    if (JSON.parse(instructions.interestQuestion) === true) {
      return (
        <div className="ui form" style={{ textAlign: "center" }}>
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
    <Modal size="tiny" open={isOpen} style={{ overflow: "auto", padding: 10 }}>
      <Segment>{instructions.main}</Segment>
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