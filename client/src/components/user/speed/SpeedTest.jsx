import { SessionContext } from "../../../contexts/SessionContext.jsx";
import SpeedText from "./SpeedText.jsx";
import { useContext, createRef, useState, useEffect } from "react";
import { Button, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import SpeedTestInstructions from "./SpeedTestInstructions.jsx";
import PauseWindow from "../PauseWindow.jsx";
import axios from "axios";
import {
  isLastText,
  recordViewportResize,
  scrollToTop,
} from "../../../utilities.js";
import { debounce } from "debounce";
import ConfirmDoneModal from "../ConfirmDoneModal.jsx";

const transitionInstructions = `Read the next text, then click "Done"`;

const SpeedTest = () => {
  const sessionContext = useContext(SessionContext);
  const startTask2Ref = createRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [instructions, setInstructions] = useState("");
  const [currentText, setCurrentText] = useState(
    sessionContext.template.speedTest.texts[sessionContext.fileNumber]
  );
  const [textIsComplete, setTextIsComplete] = useState(false);
  const [displayConfirmDoneModal, setDisplayConfirmDoneModal] = useState(false);

  useEffect(() => {
    if (sessionContext.fileNumber === 0) {
      setInstructions(sessionContext.template.speedTest.instructions);
    } else {
      setInstructions(transitionInstructions);
    }
    initialiseTextIsComplete();
    window.onresize = debounce((e) => {
      recordViewportResize(e, sessionContext);
      setIsMobile(window.innerWidth <= 768);
    }, 500);
  }, []);

  useEffect(() => {
    setCurrentText(
      sessionContext.template.speedTest.texts[sessionContext.fileNumber]
    );
  }, [sessionContext.fileNumber]);

  const initialiseTextIsComplete = () => {
    axios
      .get("/api/getReadingSession", {
        params: { _id: sessionContext.sessionID },
      })
      .then((response) => {
        const currentSession = response.data;

        // Set to true if this text contains an endTime, false otherwise.
        if (currentSession.hasOwnProperty("speedTexts")) {
          const text = currentSession.speedTexts.find(
            (t) => t.fileID === currentText.fileID
          );
          if (typeof text !== "undefined") {
            setTextIsComplete(text.hasOwnProperty("endTime"));
          }
        }
      });
  };

  const finishCurrentText = async () => {
    const sessionID = sessionContext.sessionID;
    const endTime = new Date();

    setInstructions(transitionInstructions);

    // Update session with the time the current file was finished.
    axios
      .put("/api/updateCurrentSpeedText", {
        id: sessionID,
        fileID: currentText.fileID,
        endTime: endTime,
      })
      .catch((error) => {
        console.error(
          "Error updating readingSession.speedTexts[currentFileID].endTime:",
          error
        );
      });
  };

  const handleFinishText = async () => {
    // Update session.speedTexts[currentFileID] with an end time.
    finishCurrentText();

    const fileNumber = sessionContext.fileNumber;

    sessionContext.setHasStartedReading(false);

    // setDisplayConfirmDoneModal(false);

    if (isLastText("speed", sessionContext)) {
      sessionContext.setFileNumber(0);
      startTask2Ref.current.click();
    } else {
      sessionContext.setFileNumber(fileNumber + 1);
      scrollToTop();
    }
  };

  // Add either a pause or resume action with a timestamp to the session's pauses array.
  const updateSpeedTextPauses = async (isPaused) => {
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const action = isPaused ? "pause" : "resume";

    // Update session with the time the current file was finished.
    axios
      .put("/api/updateCurrentSpeedTextPauses", {
        id: sessionID,
        fileID: currentText.fileID,
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

  const handleCloseSpeedTestInstructions = () => {
    sessionContext.setHasStartedReading(true);
  };

  const displayButtons = () => {
    if (isMobile) {
      return (
        <Menu inverted widths={2} fixed="top">
          <Menu.Item
            active
            disabled={textIsComplete}
            content="Done"
            color="blue"
            // onClick={() => setDisplayConfirmDoneModal(true)}
            onClick={handleFinishText}
          />
          <Link to="/scrolltest" hidden ref={startTask2Ref}></Link>
          <Menu.Item
            active
            disabled={textIsComplete}
            content="Pause"
            color="red"
            onClick={() => pauseSession(sessionContext)}
          />
        </Menu>
      );
    } else {
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
                // onClick={() => setDisplayConfirmDoneModal(true)}
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
    }
  };

  const displaySpeedText = () => {
    if (sessionContext.hasStartedReading) {
      if (isMobile) {
        return (
          <div style={{ marginTop: 45 }}>
            <SpeedText
              fileID={currentText.fileID}
              textStyleID={currentText.styleID}
            />
          </div>
        );
      } else {
        return (
          <SpeedText
            fileID={currentText.fileID}
            textStyleID={currentText.styleID}
          />
        );
      }
    }
  };

  const displayMessages = () => {
    return (
      <div>
        <SpeedTestInstructions
          isOpen={sessionContext.hasStartedReading === false}
          instructions={instructions}
          fileID={currentText.fileID}
          close={handleCloseSpeedTestInstructions}
        />
        <PauseWindow isOpen={sessionContext.isPaused} resume={resumeSession} />
        <ConfirmDoneModal
          isOpen={displayConfirmDoneModal}
          answerYes={handleFinishText}
          answerNo={() => setDisplayConfirmDoneModal(false)}
        />
      </div>
    );
  };

  return (
    <div>
      {displayButtons()}
      {displaySpeedText()}
      {displayMessages()}
    </div>
  );
};

export default SpeedTest;
