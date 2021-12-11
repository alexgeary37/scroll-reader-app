import { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";

const SpeedText = ({ fileID, textStyleID }) => {
  const [text, setText] = useState("");
  const [textStyle, setTextStyle] = useState(null);

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

        const style = response.data.styles.find((s) => s._id === textStyleID);
        setTextStyle({
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          lineHeight: `${style.lineHeight}px`,
        });
      })
      .catch((error) => {
        console.error("Error fetching text in SpeedText:", error);
      });
  };

  return (
    <Container text style={textStyle}>
      {text}
    </Container>
  );
};

export default SpeedText;
