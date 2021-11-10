import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";
import { wordSeparators } from "../../../utilities";
import { Segment } from "semantic-ui-react";

const TextAnswersConfigurationView = ({
  fileID,
  answerRegion,
  selectAnswer,
}) => {
  const [words, setWords] = useState([]);

  // Variable to store index of the word the user began highlighting from.
  let mouseDownIndex;

  useEffect(() => {
    fetchText();
  }, [fileID]);

  const fetchText = () => {
    axios
      .get("http://localhost:3001/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setWords(response.data.text.split(wordSeparators));
      })
      .catch((error) => {
        console.error("Error fetching text in ScrollText:", error);
      });
  };

  const handleMouseUp = (index) => {
    if (mouseDownIndex !== index) {
      selectAnswer(
        Math.min(mouseDownIndex, index),
        Math.max(mouseDownIndex, index)
      );
    }
  };

  const wordColor = (index) => {
    const minIndex = Math.min(answerRegion.startIndex, answerRegion.endIndex);
    const maxIndex = Math.max(answerRegion.startIndex, answerRegion.endIndex);
    if (minIndex <= index && index <= maxIndex && maxIndex > 0) {
      return "yellow";
    }
    return "white";
  };

  return (
    <Segment style={{ overflow: "auto", maxHeight: "65vh" }}>
      <p>
        {words.map((word, index) => (
          <span
            key={uuid_v4()}
            onMouseDown={() => (mouseDownIndex = index)}
            onMouseUp={() => handleMouseUp(index)}
            style={{ backgroundColor: wordColor(index) }}
          >
            {word + " "}
          </span>
        ))}
      </p>
    </Segment>
  );
};

export default TextAnswersConfigurationView;
