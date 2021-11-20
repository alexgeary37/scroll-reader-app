import { SessionContext } from "../../../contexts/SessionContext.jsx";
import { useContext, useEffect, useState } from "react";
import ScrollTest from "./ScrollTest.jsx";

const ScrollTestWrapper = () => {
  const sessionContext = useContext(SessionContext);
  const [sessionIsComplete, setSessionIsComplete] = useState(null);

  useEffect(() => {
    setSessionIsComplete(
      sessionContext.sessionID === null || sessionContext.sessionID === ""
    );
  }, [sessionContext.sessionID]);

  const displayPage = () => {
    if (sessionIsComplete === true) {
      return <h1>Session is complete!</h1>;
    } else if (sessionIsComplete === false) {
      return <ScrollTest />;
    } else {
      return <div></div>;
    }
  };

  return displayPage();
};

export default ScrollTestWrapper;
