import { Container } from "semantic-ui-react";
import useScrollPosition from "./scrollPosition.jsx";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { SessionContext } from "../../contexts/SessionContext.jsx";

const ScrollText = ({ fileID }) => {
  const sessionContext = useContext(SessionContext);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchText();
  }, [fileID]);

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

  const fetchText = () => {
    axios
      .get("http://localhost:3001/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setText(response.data.text);
      })
      .catch((error) => {
        console.error("Error fetching text in ScrollText:", error);
      });
  };

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

  return (
    <Container text>
      <p>{text}</p>
    </Container>
  );
};

export default ScrollText;
