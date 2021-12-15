import { v4 as uuid_v4 } from "uuid";
import useScrollPosition from "./scrollPosition.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SessionContext } from "../../../contexts/SessionContext.jsx";
import {
  addScrollPosEntryToSessionContext,
  wordSeparators,
} from "../../../utilities.js";
import { Container } from "semantic-ui-react";

const ScrollText = ({
  fileID,
  textStyleID,
  selectAnswerEnabled,
  selectAnswer,
}) => {
  const sessionContext = useContext(SessionContext);
  const [words, setWords] = useState([]);
  const [textStyle, setTextStyle] = useState(null);

  useEffect(() => {
    fetchText();
  }, [fileID]);

  const fetchText = () => {
    axios
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setWords(response.data.text.split(wordSeparators));

        const style = response.data.styles.find((s) => s._id === textStyleID);
        setTextStyle({
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          lineHeight: `${style.lineHeight}px`,
        });

        // sessionContext.setQuestionFormat(response.data.questionFormat);
        sessionContext.setQuestionAnswers(
          response.data.questions.map((q) => {
            return q.answerRegion;
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching text in ScrollText:", error);
      });
  };

  // This useEffect runs whenever sessionContext.scrollPosEntries changes.
  // It also runs once the user has finished scrolling.
  useEffect(() => {
    const intervalID = setInterval(() => {
      const entriesToInsert = sessionContext.scrollPosEntries;
      if (entriesToInsert.length > 0) {
        sessionContext.setScrollPosEntries([]);
        axios
          .post("/api/insertScrollPosEntries", entriesToInsert)
          .catch((error) => {
            console.error("Error adding scrollPosEntry:", error);
          });
      }
    }, 500);
    return () => clearInterval(intervalID);
  }, [sessionContext.scrollPosEntries]);

  const addScrollPosEntry = (currPos) => {
    if (sessionContext.isPaused === false) {
      addScrollPosEntryToSessionContext(sessionContext, parseInt(currPos.y));
    }
  };

  // This is a useLayoutEffect function triggered whenever a scroll event occurs.
  useScrollPosition(addScrollPosEntry, 25);

  const handleWordClick = (index) => {
    if (selectAnswerEnabled) {
      selectAnswer(index, false);
    }
  };

  return (
    <Container
      text
      className={selectAnswerEnabled ? "hand-cursor" : ""}
      style={textStyle}
    >
      {words.map((word, index) => (
        <span key={uuid_v4()} onClick={() => handleWordClick(index)}>
          {word + " "}
        </span>
      ))}
    </Container>
  );
};

export default ScrollText;
