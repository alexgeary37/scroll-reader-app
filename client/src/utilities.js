/** Variables and Functions that are used in multiple components in the app */
import axios from "axios";

export const wordSeparators = /[\s\r\n,]+/;

/** Functions */

// Check if this is the last text.
// Used in SpeedTest and ScrollTest.
export const isLastText = (testType, context) => {
  if (testType === "speed") {
    return context.fileNumber === context.template.speedTest.fileIDs.length - 1;
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

export const recordViewportResize = (e, sessionContext) => {
  const sessionID = sessionContext.sessionID;
  const time = new Date();

  axios
    .put("http://localhost:3001/addViewportChange", {
      id: sessionID,
      width: window.innerWidth,
      height: window.innerHeight,
      time: time,
    })
    .catch((error) => {
      console.error("Error updating readingSession.viewportDimensions:", error);
    });
};