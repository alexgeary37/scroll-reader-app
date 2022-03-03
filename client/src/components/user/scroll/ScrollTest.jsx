import { SessionContext } from "../../../contexts/SessionContext.jsx";
import ScrollText from "./ScrollText.jsx";
import { useContext, useState, useEffect, createRef } from "react";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import ScrollTestInstructions from "./ScrollTestInstructions.jsx";
import PauseMessage from "../PauseMessage.jsx";
import axios from "axios";
import {
  addScrollPosEntryToSessionContext,
  isLastText,
  recordViewportResize,
  scrollToTop,
} from "../../../utilities.js";
import { getScrollPosition } from "./scrollPosition.jsx";
import ComprehensionQuestion from "./ComprehensionQuestion.jsx";
import ClickQuestion from "./ClickQuestion.jsx";
import ConfirmSkipQuestionMessage from "./ConfirmSkipQuestionMessage.jsx";
import UnfinishedQuestionsMessage from "../UnfinishedQuestionsMessage.jsx";
import AnswerResponseMessage from "./AnswerResponseMessage.jsx";
import AnswersCompleteMessage from "./AnswersCompleteMessage.jsx";
import { debounce } from "debounce";
import toast, { Toaster } from "react-hot-toast";

const DEFAULT_QUESTION_HEIGHT = 60;

const ScrollTest = () => {
  const sessionContext = useContext(SessionContext);
  const [questionHeight, setQuestionHeight] = useState(DEFAULT_QUESTION_HEIGHT);
  const endPageRef = createRef();
  const [displayQuestion, setDisplayQuestion] = useState(false);
  const [currentText, setCurrentText] = useState(
    sessionContext.template.scrollTexts[sessionContext.fileNumber]
  );
  const [scrollQuestionNumber, setScrollQuestionNumber] = useState(
    JSON.parse(localStorage.getItem("scrollQuestionNumber"))
  );
  const [selectAnswerEnabled, setSelectAnswerEnabled] = useState(false);
  const [answerResponseMessage, setAnswerResponseMessage] = useState({
    display: false,
    isCorrect: false,
  });
  const [displayConfirmSkipMessage, setDisplayConfirmSkipMessage] =
    useState(false);
  const [displayAnswersCompleteMessage, setDisplayAnswersCompleteMessage] =
    useState(false);
  const [
    displayUnfinishedQuestionsMessage,
    setDisplayUnfinishedQuestionsMessage,
  ] = useState(false);
  const [textIsComplete, setTextIsComplete] = useState(false);
  const [displayConfirmDoneMessage, setDisplayConfirmDoneMessage] =
    useState(false);

  useEffect(() => {
    if (localStorage.getItem("scrollQuestionNumber") === null) {
      setScrollQuestionNumber(0);
    }
    initialiseTextIsComplete();
    window.onresize = debounce(
      (e) => recordViewportResize(e, sessionContext),
      500
    );
    recordViewportResize(null, sessionContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "scrollQuestionNumber",
      JSON.stringify(scrollQuestionNumber)
    );
  }, [scrollQuestionNumber]);

  useEffect(() => {
    setCurrentText(
      sessionContext.template.scrollTexts[sessionContext.fileNumber]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionContext.fileNumber]);

  const initialiseTextIsComplete = () => {
    axios
      .get("/api/getReadingSession", {
        params: { _id: sessionContext.sessionID },
      })
      .then((response) => {
        const currentSession = response.data;

        // Set to true if this text contains an endTime, false otherwise.
        if (currentSession.hasOwnProperty("scrollTexts")) {
          const text = currentSession.scrollTexts.find(
            (t) => t.fileID === currentText.fileID
          );
          if (typeof text !== "undefined") {
            setTextIsComplete(text.hasOwnProperty("endTime"));
          }
        }
      });
  };

  const finishCurrentText = async () => {
    const sessionID = sessionContext.sessionID;
    const endTime = new Date();

    // Update session with the time the current file was finished.
    axios
      .put("/api/updateCurrentScrollText", {
        id: sessionID,
        fileID: currentText.fileID,
        endTime: endTime,
      })
      .catch((error) =>
        console.error(
          "Error updating readingSession.scrollTexts[currentText.fileID].endTime:",
          error
        )
      );

    return endTime;
  };

  const finishReadingSession = async (endTime) => {
    const sessionID = sessionContext.sessionID;

    // Update session with an endTime.
    axios
      .put("/api/addEndTime", {
        id: sessionID,
        time: endTime,
      })
      .catch((error) =>
        console.error("Error updating readingSession.endTime:", error)
      );
  };

  const handleFinishText = async () => {
    setDisplayConfirmDoneMessage(false);
    if (scrollQuestionNumber < currentText.questionIDs.length) {
      setDisplayUnfinishedQuestionsMessage(true);
    } else {
      sessionContext.setHasStartedReading(false);
      const lastText = isLastText("scroll", sessionContext);

      if (lastText) {
        endPageRef.current.click();
      }

      // Update session.scrollTexts[currentText.fileID] with an end time.
      const endTime = await finishCurrentText();
      const fileNumber = sessionContext.fileNumber;

      if (lastText) {
        finishReadingSession(endTime);
      } else {
        // Adjust hooks and context for the next scrollText.
        setScrollQuestionNumber(0);
        sessionContext.setFileNumber(fileNumber + 1);
        scrollToTop();
      }
    }
  };

  // Add either a pause or resume action with a timestamp to the session's pauses array.
  const updateScrollTextPauses = async (isPaused) => {
    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const action = isPaused ? "pause" : "resume";

    axios
      .put("/api/updateCurrentScrollTextPauses", {
        id: sessionID,
        fileID: currentText.fileID,
        action: action,
        time: currentTime,
      })
      .catch((error) =>
        console.error(
          "Error updating readingSession.scrollTexts[fileID].pauses",
          error
        )
      );
  };

  const pauseSession = () => {
    updateScrollTextPauses(true);
    sessionContext.setIsPaused(true);
  };

  const resumeSession = () => {
    updateScrollTextPauses(false);
    sessionContext.setIsPaused(false);
  };

  const handleAnswerQuestion = (answer, skip) => {
    const isInlineQuestion =
      sessionContext.questionAnswers.find(
        (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
      ).questionFormat === "inline";

    const sessionID = sessionContext.sessionID;
    const currentTime = new Date();
    const yPos = parseInt(getScrollPosition().y);

    axios
      .put("/api/addCurrentScrollTextQuestionAnswer", {
        sessionID: sessionID,
        fileID: currentText.fileID,
        questionNumber: scrollQuestionNumber,
        answer: answer,
        skip: skip,
        yPos: yPos,
        time: currentTime,
      })
      .then(() => {
        if (isInlineQuestion) {
          let isCorrect = false;
          if (
            sessionContext.questionAnswers.find(
              (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
            ).answerRegion.startIndex <= answer &&
            answer <=
              sessionContext.questionAnswers.find(
                (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
              ).answerRegion.endIndex
          ) {
            setScrollQuestionNumber(scrollQuestionNumber + 1);
            isCorrect = true;
          }

          if (skip) {
            if (scrollQuestionNumber + 1 >= currentText.questionIDs.length) {
              setDisplayAnswersCompleteMessage(true);
            }
            setScrollQuestionNumber(scrollQuestionNumber + 1);
          } else {
            if (isCorrect) {
              setDisplayQuestion(false);
              setQuestionHeight(DEFAULT_QUESTION_HEIGHT);
            }
            setAnswerResponseMessage({ display: true, isCorrect: isCorrect });
          }
        } else {
          if (scrollQuestionNumber + 1 >= currentText.questionIDs.length) {
            setDisplayAnswersCompleteMessage(true);
          }
          setScrollQuestionNumber(scrollQuestionNumber + 1);
          setDisplayQuestion(false);
          setQuestionHeight(DEFAULT_QUESTION_HEIGHT);
        }
      })
      .catch((error) =>
        console.error(
          "Error updating readingSession.scrollTexts[fileID].questionAnswers",
          error
        )
      );
  };

  const skipQuestion = () => {
    handleAnswerQuestion("", true);
    setSelectAnswerEnabled(false);
    setDisplayConfirmSkipMessage(false);
    setDisplayQuestion(false);
    setQuestionHeight(DEFAULT_QUESTION_HEIGHT);
  };

  const handleCloseScrollTestInstructions = () => {
    sessionContext.setHasStartedReading(true);
    setDisplayConfirmDoneMessage(false);
    addScrollPosEntryToSessionContext(
      sessionContext,
      parseInt(getScrollPosition().y)
    );
  };

  const displayButtons = () => {
    const displayQuestions =
      scrollQuestionNumber < currentText.questionIDs.length;

    return (
      <div>
        <div
          style={{
            margin: "auto",
            maxWidth: "60em",
            position: "fixed",
            top: 0,
            width: "100%",
          }}
        >
          <Button.Group widths={displayQuestions ? 3 : 2}>
            <Button
              primary
              disabled={textIsComplete}
              content="Done"
              onClick={() => setDisplayConfirmDoneMessage(true)}
            />
            <Link to="/end" hidden ref={endPageRef} />
            <Button
              negative
              disabled={textIsComplete}
              content="Pause"
              onClick={() => pauseSession(sessionContext)}
            />
            {displayQuestions && (
              <Button
                positive
                disabled={textIsComplete}
                content="Question"
                onClick={() => setDisplayQuestion(true)}
              />
            )}
          </Button.Group>
        </div>
        <Toaster
          toastOptions={{
            style: {
              marginTop: questionHeight,
              padding: 20,
              background: "#a8ffff",
              color: "#000000",
            },
          }}
        />
      </div>
    );
  };

  const displayScrollText = () => {
    if (sessionContext.hasStartedReading) {
      return (
        <div style={{ marginTop: questionHeight }}>
          <ScrollText
            fileID={currentText.fileID}
            styles={currentText.style}
            selectAnswerEnabled={selectAnswerEnabled}
            selectAnswer={handleAnswerQuestion}
          />
        </div>
      );
    }
  };

  const displayQuestions = () => {
    if (
      scrollQuestionNumber < currentText.questionIDs.length &&
      sessionContext.questionAnswers.length > 0 &&
      typeof sessionContext.questionAnswers.find(
        (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
      ) !== "undefined"
    ) {
      const isComprehension =
        sessionContext.questionAnswers.find(
          (q) => q._id === currentText.questionIDs[scrollQuestionNumber]
        ).questionFormat === "comprehension";

      if (displayQuestion) {
        return isComprehension ? (
          <ComprehensionQuestion
            componentHeight={(height) => setQuestionHeight(height + 15)}
            close={() => {
              setDisplayQuestion(false);
              setQuestionHeight(DEFAULT_QUESTION_HEIGHT);
            }}
            currentText={currentText}
            questionNumber={scrollQuestionNumber}
            disable={textIsComplete}
            submitAnswer={handleAnswerQuestion}
            skip={() => setDisplayConfirmSkipMessage(true)}
          />
        ) : (
          <ClickQuestion
            componentHeight={(height) => setQuestionHeight(height + 15)}
            close={() => {
              setDisplayQuestion(false);
              setSelectAnswerEnabled(false);
              setQuestionHeight(DEFAULT_QUESTION_HEIGHT);
            }}
            currentText={currentText}
            questionNumber={scrollQuestionNumber}
            disable={textIsComplete}
            answerIsEnabled={selectAnswerEnabled}
            enableAnswer={() => {
              if (!selectAnswerEnabled) {
                toast("Click in the text where you think the answer is!");
              }
              setSelectAnswerEnabled(!selectAnswerEnabled);
            }}
            skip={() => setDisplayConfirmSkipMessage(true)}
          />
        );
      }
    }
  };

  const displayMessages = () => {
    return (
      <div>
        <ScrollTestInstructions
          isOpen={
            sessionContext.hasStartedReading === false ||
            displayConfirmDoneMessage
          }
          displayConfirmMessage={displayConfirmDoneMessage}
          text={currentText}
          answerYes={handleFinishText}
          close={handleCloseScrollTestInstructions}
        />
        <AnswerResponseMessage
          isOpen={answerResponseMessage.display}
          isCorrect={answerResponseMessage.isCorrect}
          tryAgain={() =>
            setAnswerResponseMessage({ display: false, isCorrect: false })
          }
          continueReading={() => {
            const answerWasCorrect = answerResponseMessage.isCorrect;
            setAnswerResponseMessage({ display: false, isCorrect: false });
            setSelectAnswerEnabled(false);
            setDisplayQuestion(false);
            setQuestionHeight(DEFAULT_QUESTION_HEIGHT);
            if (
              answerWasCorrect &&
              scrollQuestionNumber >= currentText.questionIDs.length
            ) {
              setDisplayAnswersCompleteMessage(true);
            }
          }}
        />
        <ConfirmSkipQuestionMessage
          isOpen={displayConfirmSkipMessage}
          skip={skipQuestion}
          cancel={() => setDisplayConfirmSkipMessage(false)}
        />
        <AnswersCompleteMessage
          isOpen={displayAnswersCompleteMessage}
          close={() => setDisplayAnswersCompleteMessage(false)}
        />
        <UnfinishedQuestionsMessage
          isOpen={displayUnfinishedQuestionsMessage}
          close={() => setDisplayUnfinishedQuestionsMessage(false)}
        />
        <PauseMessage isOpen={sessionContext.isPaused} resume={resumeSession} />
      </div>
    );
  };

  return (
    <div style={{ margin: "auto", maxWidth: "60em" }}>
      {displayButtons()}
      {displayQuestions()}
      {displayScrollText()}
      {displayMessages()}
    </div>
  );
};

export default ScrollTest;
