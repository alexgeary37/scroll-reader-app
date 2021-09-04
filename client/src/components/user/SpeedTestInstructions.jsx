import { Button, Modal } from "semantic-ui-react";
import { SessionContext } from "../../contexts/SessionContext";
import Axios from "axios";
import { useContext } from "react";

const SpeedTestInstructions = ({ isOpen }) => {
  const sessionContext = useContext(SessionContext);

  const handleStartTask2 = () => {
    const sessionID = sessionContext.sessionID;
    const startTime = new Date();

    Axios.put("http://localhost:3001/startReadingSessionSpeedTest", {
      id: sessionID,
      startTime: startTime,
    })
      .then(() => {
        // Set sessionContext to be in progress, this will close modal.
        sessionContext.setInProgress(true);
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.speedTest.startTime:",
          error
        );
      });
  };

  return (
    <Modal open={isOpen} style={{ padding: 10 }}>
      <h1>Task 2 Instructions</h1>
      <p>
        For this task, you are given a document to read through. Read through
        the entire document until the end. When you have finished reading the
        document, click on the "Finish" button. You will then be directed to the
        next part of this task.
      </p>
      <Button primary content="Start Task 2" onClick={handleStartTask2} />
    </Modal>
  );
};

export default SpeedTestInstructions;
