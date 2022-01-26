import { SessionContext } from "../../../contexts/SessionContext.jsx";
import { useContext, useEffect, useState } from "react";
import SpeedTest from "./SpeedTest.jsx";
import DisplaySessionCompleted from "../DisplaySessionCompleted.jsx";

const SpeedTestWrapper = () => {
  const sessionContext = useContext(SessionContext);
  const [sessionIsComplete, setSessionIsComplete] = useState(null);

  useEffect(() => {
    setSessionIsComplete(
      sessionContext.sessionID === null || sessionContext.sessionID === ""
    );
  }, [sessionContext.sessionID]);

  const displayPage = () => {
    if (sessionIsComplete === true) {
      return <DisplaySessionCompleted />;
    } else if (sessionIsComplete === false) {
      return <SpeedTest />;
    } else {
      return <div></div>;
    }
  };

  return displayPage();
};

export default SpeedTestWrapper;
