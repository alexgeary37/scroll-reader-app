import { Container } from "semantic-ui-react";
import { useState, useEffect } from "react";
import axios from "axios";

const SpeedText = ({ fileID }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    fetchText();
  }, [fileID]);

  const fetchText = () => {
    axios
      .get("http://localhost:3001/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setText(response.data.text);
      })
      .catch((error) => {
        console.error("Error fetching text in SpeedText:", error);
      });
  };

  return (
    <Container text style={{ paddingTop: "20px" }}>
      <p>{text}</p>
    </Container>
  );
};

export default SpeedText;
