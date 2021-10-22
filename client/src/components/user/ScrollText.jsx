import { Container } from "semantic-ui-react";
import { uuid } from "uuidv4";
import useScrollPosition from "./scrollPosition.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SessionContext } from "../../contexts/SessionContext.jsx";

const ScrollText = ({ fileID, selectAnswerEnabled, selectAnswer }) => {
  const sessionContext = useContext(SessionContext);
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetchText();
  }, [fileID]);

  const fetchText = () => {
    axios
      .get("http://localhost:3001/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setWords(response.data.text.split(" "));
      })
      .catch((error) => {
        console.error("Error fetching text in ScrollText:", error);
      });
  };

  // This useEffect runs whenever sessionContext.scrollPosEntries changes.
  // It also runs once the user has finished scrolling.
  useEffect(() => {
    const intervalId = setInterval(() => {
      const entriesToInsert = sessionContext.scrollPosEntries;
      if (entriesToInsert.length > 0) {
        sessionContext.setScrollPosEntries([]);
        axios
          .post("http://localhost:3001/insertScrollPosEntries", entriesToInsert)
          .catch((error) => {
            console.error("Error adding scrollPosEntry:", error);
          });
      }
    }, 500);
    return () => clearInterval(intervalId);
  }, [sessionContext.scrollPosEntries]);

  const addScrollPosEntry = (currPos) => {
    if (sessionContext.isPaused === false) {
      const date = new Date();
      const timestamp =
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds() +
        ":" +
        date.getMilliseconds();

      const scrollPosEntry = {
        yPos: parseInt(currPos.y),
        time: timestamp,
        sessionID: sessionContext.sessionID,
      };

      sessionContext.setScrollPosEntries([
        ...sessionContext.scrollPosEntries,
        scrollPosEntry,
      ]);
    }
  };

  // This is a useLayoutEffect function.
  useScrollPosition(addScrollPosEntry, 50);

  const handleWordClick = (event, index) => {
    if (selectAnswerEnabled) {
      selectAnswer(event.target.textContent, index);
    }
  };

  return (
    <p className="text-container">
      {words.map((word, index) => (
        <span key={uuid()} onClick={(e) => handleWordClick(e, index)}>
          {word + " "}
        </span>
      ))}
    </p>
  );
};

export default ScrollText;
