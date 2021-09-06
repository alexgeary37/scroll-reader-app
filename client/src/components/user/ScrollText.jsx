import { Container } from "semantic-ui-react";
import useScrollPosition from "./scrollPosition.jsx";
import { SessionContext } from "../../contexts/SessionContext.jsx";
import { useContext, useEffect, useState } from "react";
import Axios from "axios";

const ScrollText = () => {
  const sessionContext = useContext(SessionContext);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchText();
  }, []);

  const fetchText = () => {
    const scrollTextFileID = sessionContext.template.scrollTest.fileID;

    Axios.get("http://localhost:3001/getTextFile", {
      params: { _id: scrollTextFileID },
    })
      .then((response) => {
        setText(response.data.text);
      })
      .catch((error) => {
        console.error("Error fetching text in ScrollText:", error);
      });
  };

  const addScrollPosEntry = (currPos) => {
    if (sessionContext.inProgress) {
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

      Axios.post(
        "http://localhost:3001/addScrollPosEntry",
        scrollPosEntry
      ).catch((error) => {
        console.error("Error adding scrollPosEntry:", error);
      });
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
