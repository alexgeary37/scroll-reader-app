import { Button, Modal } from "semantic-ui-react";
import { SessionContext } from "../../../contexts/SessionContext";
import axios from "axios";
import { useContext } from "react";

const SpeedTestInstructions = ({ isOpen, instructions, fileID, close }) => {
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
    if (instructions === `Read this text, then click "Done"!`) {
      return (
        <div>
          <Modal.Description as="h4" content={instructions} />
          <div style={{ marginTop: 10 }}>
            <Button primary content="Ok" onClick={handleStartTest} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Modal.Description as="h4" content={instructions} />
          <div style={{ marginTop: 10 }}>
            <Button primary content="Begin" onClick={handleStartTest} />
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
