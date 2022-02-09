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
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setText(response.data.text);

        const style = response.data.styles.find((s) => s._id === textStyleID);
        setTextStyle({
          marginTop: 10,
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          lineHeight: `${style.lineHeight}px`,
        });
      })
      .catch((error) => {
        console.error("Error fetching text in SpeedText:", error);
      });
  };

  return <div style={textStyle}>{text}</div>;
};

export default SpeedText;
