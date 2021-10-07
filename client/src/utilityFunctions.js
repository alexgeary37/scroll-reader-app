// Functions that are used in multiple components throughout the app.

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
