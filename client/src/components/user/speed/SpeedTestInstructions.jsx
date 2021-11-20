import { Button, Modal } from "semantic-ui-react";
import { SessionContext } from "../../../contexts/SessionContext";
import axios from "axios";
import { useContext } from "react";

const SpeedTestInstructions = ({ isOpen, instructions, fileID }) => {
  const sessionContext = useContext(SessionContext);

  const handleStartTest = () => {
    const sessionID = sessionContext.sessionID;
    const startTime = new Date();

    axios
      .put("http://localhost:3001/addNewSpeedText", {
        id: sessionID,
        fileID: fileID,
        startTime: startTime,
      })
      .then(() => {
        // Set sessionContext to be in progress, this will close modal.
        sessionContext.setHasStartedReading(true);
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.speedTest.startTime:",
          error
        );
      });
  };

  return (
    <Modal size="tiny" open={isOpen} style={{ overflow: "auto", padding: 10 }}>
      <Modal.Description as="h4" content={instructions} />
      <Button
        floated="right"
        primary
        content="Begin"
        onClick={handleStartTest}
      />
    </Modal>
  );
};

export default SpeedTestInstructions;
