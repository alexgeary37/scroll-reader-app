import { Button, Modal } from "semantic-ui-react";
import { SessionContext } from "../../contexts/SessionContext";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";

const TestInstructions = ({ isOpen, task, instructions }) => {
  const sessionContext = useContext(SessionContext);
  const [reqUrl, setReqUrl] = useState("");

  useEffect(() => {
    if (task === "speedTest") {
      setReqUrl("http://localhost:3001/startReadingSessionSpeedTest");
    }
    if (task === "scrollTest") {
      setReqUrl("http://localhost:3001/startReadingSessionScrollTest");
    }
  }, []);

  const displayScrollTestInstructions = () => {
    if (task === "scrollTest") {
      return (
        <div>
          <p>How familiar are you with this topic?</p>
          {/* Add checkbox options here */}
          <p>How interested are you in this topic?</p>
          {/* Add checkbox options here */}
        </div>
      );
    }
  };

  const handleStartTest = () => {
    const sessionID = sessionContext.sessionID;
    const startTime = new Date();

    Axios.put(reqUrl, {
      id: sessionID,
      startTime: startTime,
    })
      .then(() => {
        // Set sessionContext to be in progress, this will close modal.
        sessionContext.setInProgress(true);
      })
      .catch((error) => {
        console.error(
          `Error updating readingSession.${task}.startTime:`,
          error
        );
      });
  };

  return (
    <Modal size="tiny" open={isOpen} style={{ padding: 10 }}>
      <p>{instructions}</p>
      {displayScrollTestInstructions()}
      <Button
        floated="right"
        primary
        content="Begin"
        onClick={handleStartTest}
      />
    </Modal>
  );
};

export default TestInstructions;
