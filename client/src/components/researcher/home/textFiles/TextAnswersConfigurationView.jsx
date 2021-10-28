import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";

const TextAnswersConfigurationView = ({ fileID }) => {
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

  const handleWordClick = (event, index) => {
    // selectAnswer(event.target.textContent, index);
    console.log(event);
  };

  return (
    <div>
      <p>
        {words.map((word, index) => (
          <span key={uuid_v4()} onClick={(e) => handleWordClick(e, index)}>
            {word + " "}
          </span>
        ))}
      </p>
    </div>
  );
};

export default TextAnswersConfigurationView;
