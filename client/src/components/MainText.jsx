import { Container } from "semantic-ui-react";
import useScrollPosition from "./scrollPosition.jsx";
import { TextContext } from "../contexts/TextContext.jsx";
import { SessionContext } from "../contexts/SessionContext.jsx";
import { useContext } from "react";
import Axios from "axios";

const MainText = ({ session }) => {
  const textContext = useContext(TextContext);
  const sessionContext = useContext(SessionContext);

  async function addScrollPosEntry(currPos) {
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
        sessionID: session._id,
      };

      Axios.post(
        "http://localhost:3001/addScrollPosEntry",
        scrollPosEntry
      ).catch((error) => {
        console.log("Error adding scrollPosEntry", error);
      });
    }
  }

  // This is a useLayoutEffect function.
  useScrollPosition(addScrollPosEntry, 50);

  return (
    <Container text>
      <p>{textContext.text}</p>
    </Container>
  );
};

export default MainText;
