// https://scotch.io/courses/10-react-challenges-beginner/use-context-to-pass-data

import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [inProgress, setInProgress] = useState(
    JSON.parse(localStorage.getItem("inProgress"))
  );
  const [name, setName] = useState(localStorage.getItem("name"));
  const [sessionID, setSessionID] = useState(localStorage.getItem("sessionID"));

  // If this is the first time the page has been loaded, set the initial value
  // of 'inProgress' to false. This will then cause the other effects to run
  // and initialise the variable in localStorage.
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("inProgress")) === null) {
      setInProgress(false);
      setName("");
      setSessionID("");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inProgress", JSON.stringify(inProgress));
  }, [inProgress]);

  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("sessionID", sessionID);
  }, [sessionID]);

  return (
    <SessionContext.Provider
      value={{
        inProgress,
        setInProgress,
        name,
        setName,
        sessionID,
        setSessionID,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
