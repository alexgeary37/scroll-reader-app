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
  const [speedTestIsComplete, setSpeedTestIsComplete] = useState(
    JSON.parse(localStorage.getItem("speedTestIsComplete"))
  );
  const [scrollPosEntries, setScrollPosEntries] = useState(
    JSON.parse(localStorage.getItem("scrollPosEntries"))
  );
  const [questionAnswers, setQuestionAnswers] = useState(
    JSON.parse(localStorage.getItem("questionAnswers"))
  );

  // This sessionID enables the session to be accessed from db for updates.
  const [sessionID, setSessionID] = useState(localStorage.getItem("sessionID"));

  // If this is the first time the page has been loaded, set the initial value
  // of all hooks to default values. This will then cause the other effects to run
  // and initialise them in localStorage.
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("isPaused")) === null) {
      initialiseVariables();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialiseVariables = () => {
    setTemplate(null);
    setIsPaused(false);
    setHasStartedReading(false);
    setFileNumber(0);
    setSpeedTestIsComplete(false);
    setScrollPosEntries([]);
    setQuestionAnswers([]);
    setSessionID("");
  };

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
    localStorage.setItem(
      "speedTestIsComplete",
      JSON.stringify(speedTestIsComplete)
    );
  }, [speedTestIsComplete]);

  useEffect(() => {
    localStorage.setItem("scrollPosEntries", JSON.stringify(scrollPosEntries));
  }, [scrollPosEntries]);

  useEffect(() => {
    localStorage.setItem("questionAnswers", JSON.stringify(questionAnswers));
  }, [questionAnswers]);

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
        speedTestIsComplete,
        setSpeedTestIsComplete,
        scrollPosEntries,
        setScrollPosEntries,
        questionAnswers,
        setQuestionAnswers,
        sessionID,
        setSessionID,
        initialiseVariables,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
