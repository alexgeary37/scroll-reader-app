import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";
import { wordSeparators } from "../../../../utilityFunctions";
import { Button, Modal, Segment } from "semantic-ui-react";

const TextAnswersConfigurationView = ({ fileID, selectAnswer, close }) => {
  const [words, setWords] = useState([]);
  const [mouseDownIndex, setMouseDownIndex] = useState(null);
  const [mouseUpIndex, setMouseUpIndex] = useState(null);

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

  const handleMouseDown = (event, index) => {
    // console.log(event);
    // console.log(index);
    setMouseDownIndex(index);
  };

  const handleMouseUp = (event, index) => {
    // console.log(event);
    // console.log(index);
    setMouseUpIndex(index);
    if (mouseDownIndex !== mouseUpIndex) {
      selectAnswer(mouseDownIndex, mouseUpIndex);
    }
  };

  return (
    <Modal open={true} style={{ height: "75vh", padding: 10 }}>
      <Segment style={{ overflow: "auto", maxHeight: "85%" }}>
        <p>
          {words.map((word, index) => (
            <span
              key={uuid_v4()}
              onMouseDown={(e) => handleMouseDown(e, index)}
              onMouseUp={(e) => handleMouseUp(e, index)}
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
