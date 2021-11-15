import { useState, useEffect } from "react";
import axios from "axios";

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
    <p className="text-container" style={textStyle}>
      {text}
    </p>
  );
};

export default SpeedText;
