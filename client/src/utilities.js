/** Variables and Functions that are used in multiple components in the app */
import axios from "axios";

export const wordSeparators = /[\s\r\n,]+/;

/** Functions */

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
    .catch((error) => {
      console.error("Error updating readingSession.viewportDimensions:", error);
    });
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
