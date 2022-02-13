import { v4 as uuid_v4 } from "uuid";
import useScrollPosition from "./scrollPosition.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SessionContext } from "../../../contexts/SessionContext.jsx";
import {
  addScrollPosEntryToSessionContext,
  scrollTextSeparators,
} from "../../../utilities.js";

const ScrollText = ({ fileID, styles, selectAnswerEnabled, selectAnswer }) => {
  const sessionContext = useContext(SessionContext);
  const [sentences, setSentences] = useState([]);
  const [style, setStyle] = useState(null);

  useEffect(() => {
    fetchText();
  }, [fileID]);

  useEffect(() => {
    fetchStyle();
  }, [styles]);

  const fetchText = () => {
    axios
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setSentences(response.data.text.split(scrollTextSeparators));
        sessionContext.setQuestionAnswers(response.data.questions);
      })
      .catch((error) =>
        console.error("Error fetching text in ScrollText:", error)
      );
  };

  const fetchStyle = () => {
    axios
      .get("/api/getStyles", {
        params: {
          styleIDs: Object.values(styles),
        },
      })
      .then((response) => {
        const h1Style = response.data.find((s) => s._id === styles.h1ID);
        const h2Style = response.data.find((s) => s._id === styles.h2ID);
        const h3Style = response.data.find((s) => s._id === styles.h3ID);
        const paragraphStyle = response.data.find(
          (s) => s._id === styles.paragraphID
        );

        const fontWeight = h1Style.bold ? "bold" : "normal";
        setStyle({
          marginLeft: 20,
          marginRight: 20,
          fontFamily: h1Style.fontFamily,
          fontSize: `${h1Style.fontSize}px`,
          lineHeight: `${h1Style.lineHeight}px`,
          fontWeight: fontWeight,
        });
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

  return (
    <div className={selectAnswerEnabled ? "hand-cursor" : ""} style={style}>
      {sentences.map((s, index) => (
        <span key={uuid_v4()} onClick={() => handleSentenceClick(index)}>
          {s + " "}
        </span>
      ))}
    </div>
  );
};

export default ScrollText;
