import { SessionContext } from "../../../contexts/SessionContext.jsx";
import { useContext, useEffect, useState } from "react";
import ScrollTest from "./ScrollTest.jsx";
import DisplaySessionCompleted from "../DisplaySessionCompleted.jsx";

const ScrollTestWrapper = () => {
  const sessionContext = useContext(SessionContext);
  const [sessionIsComplete, setSessionIsComplete] = useState(null);

  useEffect(() => {
    setSessionIsComplete(sessionContext.sessionID === "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSessionIsComplete(sessionContext.sessionID === "");
  }, [sessionContext.sessionID]);

  const displayPage = () => {
    if (sessionIsComplete === true) {
      return <DisplaySessionCompleted thing="Session" />;
    } else if (sessionIsComplete === false) {
      return <ScrollTest />;
    } else {
      return <div />;
    }
  };

  return displayPage();
};

export default ScrollTestWrapper;
