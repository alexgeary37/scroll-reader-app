import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";
import { wordSeparators } from "../../../../utilityFunctions";
import { Button, Modal, Segment } from "semantic-ui-react";

const TextAnswersConfigurationView = ({ fileID, selectAnswer, close }) => {
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
      selectAnswer(mouseDownIndex, index);
    }
  };

  return (
    <Modal open={true} style={{ height: "75vh", padding: 10 }}>
      <Segment style={{ overflow: "auto", maxHeight: "85%" }}>
        <p>
          {words.map((word, index) => (
            <span
              key={uuid_v4()}
              onMouseDown={() => (mouseDownIndex = index)}
              onMouseUp={() => handleMouseUp(index)}
            >
              {word + " "}
            </span>
          ))}
        </p>
      </Segment>
      <div style={{ position: "absolute", right: 10, bottom: 10 }}>
        <Button content="Cancel" onClick={close} />
      </div>
    </Modal>
  );
};

export default TextAnswersConfigurationView;
