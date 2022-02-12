import { useState, useEffect } from "react";
import axios from "axios";

const SpeedText = ({ fileID, textStyleID }) => {
  const [text, setText] = useState("");
  const [textStyle, setTextStyle] = useState(null);

  useEffect(() => {
    fetchText();
  }, [fileID]);

  useEffect(() => {
    fetchStyle();
  }, [textStyleID]);

  const fetchText = () => {
    axios
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => setText(response.data.text))
      .catch((error) =>
        console.error("Error fetching text in SpeedText:", error)
      );
  };

  const fetchStyle = () => {
    axios
      .get("/api/getStyle", {
        params: { _id: textStyleID },
      })
      .then((response) => {
        const style = response.data;
        const fontWeight = style.bold ? "bold" : "normal";
        setTextStyle({
          marginLeft: 20,
          marginRight: 20,
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          lineHeight: `${style.lineHeight}px`,
          fontWeight: fontWeight,
        });
      });
  };

  return <div style={textStyle}>{text}</div>;
};

export default SpeedText;
