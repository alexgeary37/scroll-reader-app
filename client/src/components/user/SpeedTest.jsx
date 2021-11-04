import { SessionContext } from "../../contexts/SessionContext.jsx";
import SpeedText from "./SpeedText.jsx";
import { useContext, createRef, useState, useEffect } from "react";
import { Button, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import SpeedTestInstructions from "./SpeedTestInstructions.jsx";
import PauseWindow from "./PauseWindow.jsx";
import axios from "axios";
import { isLastText, scrollToTop } from "../../utilityFunctions.js";

const SpeedTest = () => {
  const sessionContext = useContext(SessionContext);
  const startTask2Ref = createRef();
  const [instructions, setInstructions] = useState("");
  const [currentFileID, setCurrentFileID] = useState(
    sessionContext.template.speedTest.fileIDs[sessionContext.fileNumber]
  );
  const [textIsComplete, setTextIsComplete] = useState(false);

  useEffect(() => {
    setInstructions(sessionContext.template.speedTest.instructions);
    initialiseTextIsComplete();
  }, []);

  useEffect(() => {
    setCurrentFileID(
      sessionContext.template.speedTest.fileIDs[sessionContext.fileNumber]
    );
  }, [sessionContext.fileNumber]);

  const initialiseTextIsComplete = () => {
    axios
      .get("http://localhost:3001/getCurrentSession", {
        params: { _id: sessionContext.sessionID },
      })
      .then((response) => {
        const currentSession = response.data;

        // Set to true if this text contains an endTime, false otherwise.
        if (currentSession.hasOwnProperty("speedTexts")) {
          const currentText = currentSession.speedTexts.find(
            (text) => text.fileID === currentFileID
          );
          // if (currentText !== "undefined") {
          if (typeof currentText !== "undefined") {
            setTextIsComplete(currentText.hasOwnProperty("endTime"));
          }
        }
      });
  };

  const startNextText = (fileID) => {
    const sessionID = sessionContext.sessionID;
    const startTime = new Date();

    axios
      .put("http://localhost:3001/addNewSpeedText", {
        id: sessionID,
        fileID: fileID,
        startTime: startTime,
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.speedTest[currentFileID].startTime:",
          error
        );
      });
  };

  const finishCurrentText = async () => {
    let sessionUpdated = false;
    const sessionID = sessionContext.sessionID;
    const endTime = new Date();

    // Update session with the time the current file was finished.
    axios
      .put("http://localhost:3001/updateCurrentSpeedText", {
        id: sessionID,
        fileID: currentFileID,
        endTime: endTime,
      })
      .then(() => {
        sessionUpdated = true;
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.speedTexts[currentFileID].endTime:",
          error
        );
      });

    return sessionUpdated;
  };

  const handleFinishText = async () => {
    // Update session.speedTexts[currentFileID] with an end time.
    const sessionUpdated = finishCurrentText();

    const fileNumber = sessionContext.fileNumber;

    if (sessionUpdated) {
      if (isLastText("speed", sessionContext)) {
        sessionContext.setFileNumber(0);
        sessionContext.setHasStartedReading(false);
        startTask2Ref.current.click();
      } else {
        // Add a new entry to session.speedTexts.
        startNextText(
          sessionContext.template.speedTest.fileIDs[fileNumber + 1]
        );
        sessionContext.setFileNumber(fileNumber + 1);
        scrollToTop();
      }
    }
  };

  // Add either a pause or resume action with a timestamp to the session's pauses array.
  const updateSpeedTextPauses = async (isPaused) => {
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const action = isPaused ? "pause" : "resume";

    // Update session with the time the current file was finished.
    axios
      .put("http://localhost:3001/updateCurrentSpeedTextPauses", {
        id: sessionID,
        fileID: currentFileID,
        action: action,
        time: currentTime,
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.speedTexts[fileID].pauses",
          error
        );
      });
  };

  const pauseSession = () => {
    updateSpeedTextPauses(true);
    sessionContext.setIsPaused(true);
  };

  const resumeSession = () => {
    updateSpeedTextPauses(false);
    sessionContext.setIsPaused(false);
  };

  const displayButtons = () => {
    return (
      <div
        style={{
          top: 0,
          left: 0,
          width: "15vw",
          position: "fixed",
        }}
      >
        <Menu vertical fluid style={{ textAlign: "center" }}>
          <Menu.Item>
            <Button
              primary
              fluid
              disabled={textIsComplete}
              content="Done"
              onClick={handleFinishText}
            />
          </Menu.Item>
          <Link to="/scrolltest" hidden ref={startTask2Ref}></Link>
          <Menu.Item>
            <Button
              negative
              fluid
              disabled={textIsComplete}
              content="Pause"
              onClick={() => pauseSession(sessionContext)}
            />
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  const displaySpeedText = () => {
    if (sessionContext.hasStartedReading) {
      return <SpeedText fileID={currentFileID} />;
    }
  };

  return (
    <div>
      {displayButtons()}

      {displaySpeedText()}

      <SpeedTestInstructions
        isOpen={sessionContext.hasStartedReading === false}
        instructions={instructions}
        fileID={currentFileID}
      />
      <PauseWindow isOpen={sessionContext.isPaused} resume={resumeSession} />
    </div>
  );
};

export default SpeedTest;
