import { v4 as uuid_v4 } from "uuid";
import useScrollPosition from "./scrollPosition.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SessionContext } from "../../../contexts/SessionContext.jsx";
import {
  addScrollPosEntryToSessionContext,
  initializeStyles,
  scrollTextSeparators,
} from "../../../utilities.js";

const ScrollText = ({ fileID, styles, selectAnswerEnabled, selectAnswer }) => {
  const sessionContext = useContext(SessionContext);
  const [text, setText] = useState({
    sections: [],
    isFetching: true,
  });
  const [style, setStyle] = useState({ style: {}, isInitialized: false });

  useEffect(() => {
    fetchText();
  }, [fileID]);

  useEffect(() => {
    initializeStyle();
  }, [styles]);

  const fetchText = () => {
    setText({ sections: text.sections, isFetching: true });
    axios
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setText({
          sections: response.data.text.split(scrollTextSeparators),
          isFetching: false,
        });
        sessionContext.setQuestionAnswers(response.data.questions);
      })
      .catch((error) =>
        console.error("Error fetching text in ScrollText:", error)
      );
  };

  const initializeStyle = () => {
    setStyle({ style: style.style, isInitialized: false });
    setStyle({
      style: initializeStyles(styles),
      isInitialized: true,
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
          .catch((error) =>
            console.error("Error adding scrollPosEntry:", error)
          );
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

  const handleSentenceClick = (index) => {
    if (selectAnswerEnabled) {
      selectAnswer(index, false);
    }
  };

  const displayContent = () => {
    if (!text.isFetching && style.isInitialized) {
      return (
        <div
          className={selectAnswerEnabled ? "hand-cursor" : ""}
          style={style.style.general}
        >
          {text.sections.map((s, index) => {
            const sSubstring = s.substring(4);

            if (s.includes("<h1>")) {
              return (
                <h1 key={uuid_v4()} style={style.style.h1}>
                  {sSubstring}
                </h1>
              );
            } else if (s.includes("<h2>")) {
              return (
                <h2 key={uuid_v4()} style={style.style.h2}>
                  {sSubstring}
                </h2>
              );
            } else if (s.includes("<h3>")) {
              return (
                <h3 key={uuid_v4()} style={style.style.h3}>
                  {sSubstring}
                </h3>
              );
            } else if (s.includes("<p>")) {
              const startPString = s.substring(3);
              return (
                <span
                  key={uuid_v4()}
                  style={style.style.span}
                  onClick={() => handleSentenceClick(index)}
                >
                  {startPString}
                </span>
              );
            } else if (s.includes("</p>")) {
              const endPString = s.substring(0, s.length - 4);
              return (
                <span
                  key={uuid_v4()}
                  style={style.style.span}
                  onClick={() => handleSentenceClick(index)}
                >
                  {endPString}
                  <br />
                  <br />
                </span>
              );
            } else if (s === "\n" || s === "") {
              // Do not display the newline
            } else {
              return (
                <span
                  key={uuid_v4()}
                  style={style.style.span}
                  onClick={() => handleSentenceClick(index)}
                >
                  {s}
                </span>
              );
            }
          })}
        </div>
      );
    } else {
      return <div />;
    }
  };

  return displayContent();
};

export default ScrollText;
