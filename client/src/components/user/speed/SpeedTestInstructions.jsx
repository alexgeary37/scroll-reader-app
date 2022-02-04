import { Button, Modal } from "semantic-ui-react";
import { SessionContext } from "../../../contexts/SessionContext";
import axios from "axios";
import { useContext } from "react";

const SpeedTestInstructions = ({
  isOpen,
  displayConfirmMessage,
  instructions,
  fileID,
  answerYes,
  close,
}) => {
  const sessionContext = useContext(SessionContext);

  const handleStartTest = () => {
    const sessionID = sessionContext.sessionID;
    const startTime = new Date();

    axios
      .put("/api/addNewSpeedText", {
        id: sessionID,
        fileID: fileID,
        startTime: startTime,
      })
      .then(() => {
        close();
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.speedTest.startTime:",
          error
        );
      });
  };

  const displayContent = () => {
    if (displayConfirmMessage) {
      return (
        <div>
          <Modal.Description
            as="h4"
            content="Are you sure you have finished this text?"
          />
          <div style={{ marginTop: 10 }}>
            <Button content="No" onClick={close} />
            <Button primary content="Yes" onClick={answerYes} />
          </div>
        </div>
      );
    } else {
      const buttonContent =
        instructions === `Read this text, then click "Done"!` ? "OK" : "Begin";

      return (
        <div>
          <Modal.Description as="h4" content={instructions} />
          <div style={{ marginTop: 10 }}>
            <Button primary content={buttonContent} onClick={handleStartTest} />
          </div>
        </div>
      );
    }
  };

  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ overflow: "auto", textAlign: "center", padding: 10 }}
    >
      {displayContent()}
    </Modal>
  );
};

export default SpeedTestInstructions;
