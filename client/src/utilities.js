/** Variables and Functions that are used in multiple components in the app */
import axios from "axios";

// https://medium.com/@shemar.gordon32/how-to-split-and-keep-the-delimiter-s-d433fb697c65
export const speedTextSeparators = /[\n\r]/g;
export const scrollTextSeparators =
  /(?=[?!\n\r])|(?<=[?!\n\r])|(?=\. )|(?<=\. )|(?=\.\n)|(?<=\.\n)|(?=\.\r)|(?<=\.\r)|<\/h1>|<\/h2>|<\/h3>/g;

/** Functions */

// Take styles from template and format them into json for rendering.
export const initializeStyles = (styles) => {
  const general = { marginLeft: 20, marginRight: 20 };
  const h1 = styles.h1;
  const h2 = styles.h2;
  const h3 = styles.h3;
  const paragraph = styles.paragraph;

  h1.fontSize = `${h1.fontSize}px`;
  h1.lineHeight = `${h1.lineHeight}%`;

  h2.fontSize = `${h2.fontSize}px`;
  h2.lineHeight = `${h2.lineHeight}%`;

  h3.fontSize = `${h3.fontSize}px`;
  h3.lineHeight = `${h3.lineHeight}%`;

  paragraph.fontSize = `${paragraph.fontSize}px`;
  paragraph.lineHeight = `${paragraph.lineHeight}%`;

  return { general, h1, h2, h3, paragraph };
};

// Check if this is the last text.
// Used in SpeedTest and ScrollTest.
export const isLastText = (testType, context) => {
  if (testType === "speed") {
    return context.fileNumber === context.template.speedTest.texts.length - 1;
  }
  if (testType === "scroll") {
    return context.fileNumber === context.template.scrollTexts.length - 1;
  }
};

// Scroll to the top of the page.
// Used in SpeedTest and ScrollTest for when the next text is loaded.
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Adds the latest viewport width and height to ReadingSession.viewportDimensions array.
export const recordViewportResize = (e, sessionContext) => {
  const sessionID = sessionContext.sessionID;
  const time = new Date();

  axios
    .put("/api/addViewportChange", {
      id: sessionID,
      width: window.innerWidth,
      height: window.innerHeight,
      time: time,
    })
    .catch((error) =>
      console.error("Error updating readingSession.viewportDimensions:", error)
    );
};

export const addScrollPosEntryToSessionContext = (sessionContext, yPos) => {
  const date = new Date();

  const scrollPosEntry = {
    yPos: yPos,
    time: date,
    sessionID: sessionContext.sessionID,
    textNumber: sessionContext.fileNumber,
  };

  sessionContext.setScrollPosEntries([
    ...sessionContext.scrollPosEntries,
    scrollPosEntry,
  ]);
};

export const clearStorage = (sessionContext) => {
  if (sessionContext) {
    sessionContext.initialiseVariables();
  } else {
    localStorage.setItem("sessionTemplate", JSON.stringify(null));
    localStorage.setItem("isPaused", JSON.stringify(false));
    localStorage.setItem("hasStartedReading", JSON.stringify(false));
    localStorage.setItem("fileNumber", JSON.stringify(0));
    localStorage.setItem("speedTestIsComplete", JSON.stringify(false));
    localStorage.setItem("scrollPosEntries", JSON.stringify([]));
    localStorage.setItem("questionAnswers", JSON.stringify([]));
    localStorage.setItem("sessionID", "");
  }
  localStorage.removeItem("userName");
  localStorage.removeItem("scrollQuestionNumber");
};

// This function should always output the current DateTime in New Zealand.
// Replace the argument with any epoch Date().getTime().
// https://stackoverflow.com/questions/52106990/easiest-way-to-convert-utc-to-new-zealand-date-account-for-daylight-savings
export const toNewZealand = (ms) => {
  const standardHours = 12;
  const daylightHours = 13;

  const UTCFromMS = (ms) => {
    return new Date(new Date(ms).toUTCString().replace(" GMT", ""));
  };

  const addHours = (dte, hrs) => {
    return new Date(
      dte.getFullYear(),
      dte.getMonth(),
      dte.getDate(),
      dte.getHours() + hrs,
      dte.getMinutes(),
      dte.getMilliseconds()
    );
  };

  const getPreviousSunday = (dte) => {
    return new Date(
      dte.getFullYear(),
      dte.getMonth(),
      dte.getDate() - dte.getDay(),
      1,
      0,
      0
    );
  };

  const getNextSunday = (dte) => {
    return new Date(
      dte.getFullYear(),
      dte.getMonth(),
      dte.getDay() === 0 ? dte.getDate() : dte.getDate() + (7 - dte.getDay()),
      1,
      0,
      0
    );
  };

  const addNewZealandDaylightSavings = (dte) => {
    const lastSundaySeptember = getPreviousSunday(
      new Date(dte.getFullYear(), 8, 30)
    );

    const firstSundayApril = getNextSunday(new Date(dte.getFullYear(), 3, 1));

    // If its before firstSundayApril, add 13, if we went over 1am, add 12.
    if (dte <= firstSundayApril) {
      const daylightNz = addHours(dte, daylightHours);
      if (daylightNz >= firstSundayApril) {
        return addHours(dte, standardHours);
      }
      return daylightNz;
    }

    // if its before lastSundaySeptember, add 12 if we went over 1am add 13.
    if (dte <= lastSundaySeptember) {
      const standardNz = addHours(dte, standardHours);
      if (standardNz >= lastSundaySeptember) {
        return addHours(dte, daylightHours);
      }
      return standardNz;
    }
    return addHours(dte, daylightHours);
  };

  return addNewZealandDaylightSavings(UTCFromMS(ms));
};
