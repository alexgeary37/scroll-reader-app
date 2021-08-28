// https://scotch.io/courses/10-react-challenges-beginner/use-context-to-pass-data

import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [template, setTemplate] = useState(
    JSON.parse(localStorage.getItem("sessionTemplate"))
  );
  const [inProgress, setInProgress] = useState(
    JSON.parse(localStorage.getItem("inProgress"))
  );
  const [sessionID, setSessionID] = useState(localStorage.getItem("sessionID"));

  // If this is the first time the page has been loaded, set the initial value
  // of all hooks to default values. This will then cause the other effects to run
  // and initialise them in localStorage.
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("inProgress")) === null) {
      setUserName("");
      setTemplate({});
      setInProgress(false);
      setSessionID("");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("sessionTemplate", JSON.stringify(template));
  }, [template]);

  useEffect(() => {
    localStorage.setItem("inProgress", JSON.stringify(inProgress));
  }, [inProgress]);

  useEffect(() => {
    localStorage.setItem("sessionID", sessionID);
  }, [sessionID]);

  return (
    <SessionContext.Provider
      value={{
        userName,
        setUserName,
        template,
        setTemplate,
        inProgress,
        setInProgress,
        sessionID,
        setSessionID,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
