import { SessionContext } from "../../../contexts/SessionContext.jsx";
import { useContext, useEffect, useState } from "react";
import SpeedTest from "./SpeedTest.jsx";
import DisplaySessionCompleted from "../DisplaySessionCompleted.jsx";
import { Redirect } from "react-router-dom";

const SpeedTestWrapper = () => {
  const sessionContext = useContext(SessionContext);
  const [sessionIsComplete, setSessionIsComplete] = useState(null);
  const [speedTestIsComplete, setSpeedTestIsComplete] = useState(null);

  useEffect(() => {
    setSessionIsComplete(sessionContext.sessionID === "");
    setSpeedTestIsComplete(sessionContext.speedTestIsComplete);
  }, []);

  useEffect(() => {
    setSessionIsComplete(sessionContext.sessionID === "");
  }, [sessionContext.sessionID]);

  useEffect(() => {
    setSpeedTestIsComplete(sessionContext.speedTestIsComplete);
  }, [sessionContext.speedTestIsComplete]);

  const displayPage = () => {
    if (sessionIsComplete === true) {
      return <DisplaySessionCompleted thing="Session" />;
    } else if (sessionIsComplete === false) {
      if (speedTestIsComplete) {
        return <DisplaySessionCompleted thing="This section" />;
      } else {
        return <SpeedTest />;
      }
    } else {
      return <div></div>;
    }
  };

  return displayPage();
};

export default SpeedTestWrapper;
