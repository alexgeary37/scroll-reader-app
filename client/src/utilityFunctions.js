// Functions that are used in multiple components throughout the app.

export const isLastText = (testType, context) => {
  if (testType === "speed") {
    return context.fileNumber === context.template.speedTest.fileIDs.length - 1;
  }
  if (testType === "scroll") {
    return (
      context.fileNumber === context.template.scrollTest.fileIDs.length - 1
    );
  }
};

export const scrollToTop = () => {
  console.log("scrollToTop");
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
