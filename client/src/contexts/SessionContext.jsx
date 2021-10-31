// https://scotch.io/courses/10-react-challenges-beginner/use-context-to-pass-data

import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [template, setTemplate] = useState(
    JSON.parse(localStorage.getItem("sessionTemplate"))
  );
  const [isPaused, setIsPaused] = useState(
    JSON.parse(localStorage.getItem("isPaused"))
  );
  const [hasStartedReading, setHasStartedReading] = useState(
    JSON.parse(localStorage.getItem("hasStartedReading"))
  );
  const [fileNumber, setFileNumber] = useState(
    JSON.parse(localStorage.getItem("fileNumber"))
  );
  const [scrollPosEntries, setScrollPosEntries] = useState(
    JSON.parse(localStorage.getItem("scrollPosEntries"))
  );
  const [questionFormat, setQuestionFormat] = useState(
    localStorage.getItem("questionFormat")
  );

  // This sessionID enables the session to be accessed from db for updates.
  const [sessionID, setSessionID] = useState(localStorage.getItem("sessionID"));

  // If this is the first time the page has been loaded, set the initial value
  // of all hooks to default values. This will then cause the other effects to run
  // and initialise them in localStorage.
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("isPaused")) === null) {
      setTemplate(null);
      setIsPaused(false);
      setHasStartedReading(false);
      setFileNumber(0);
      setScrollPosEntries([]);
      setQuestionFormat("");
      setSessionID("");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sessionTemplate", JSON.stringify(template));
  }, [template]);

  useEffect(() => {
    localStorage.setItem("isPaused", JSON.stringify(isPaused));
  }, [isPaused]);

  useEffect(() => {
    localStorage.setItem(
      "hasStartedReading",
      JSON.stringify(hasStartedReading)
    );
  }, [hasStartedReading]);

  useEffect(() => {
    localStorage.setItem("fileNumber", JSON.stringify(fileNumber));
  }, [fileNumber]);

  useEffect(() => {
    localStorage.setItem("scrollPosEntries", JSON.stringify(scrollPosEntries));
  }, [scrollPosEntries]);

  useEffect(() => {
    localStorage.setItem("questionFormat", questionFormat);
  }, [questionFormat]);

  useEffect(() => {
    localStorage.setItem("sessionID", sessionID);
  }, [sessionID]);

  return (
    <SessionContext.Provider
      value={{
        template,
        setTemplate,
        isPaused,
        setIsPaused,
        hasStartedReading,
        setHasStartedReading,
        fileNumber,
        setFileNumber,
        scrollPosEntries,
        setScrollPosEntries,
        questionFormat,
        setQuestionFormat,
        sessionID,
        setSessionID,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
