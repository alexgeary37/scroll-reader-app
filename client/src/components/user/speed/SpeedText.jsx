import { useState, useEffect } from "react";
import axios from "axios";

const SpeedText = ({ fileID, style }) => {
  const [text, setText] = useState("");
  const [textStyle, setTextStyle] = useState(null);

  useEffect(() => {
    fetchText();
  }, [fileID]);

  useEffect(() => {
    fetchStyle();
  }, [style]);

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
      .get("/api/getStyles", {
        params: {
          styleIDs: Object.values(style),
        },
      })
      .then((response) => {
        const h1Style = response.data.find((s) => s._id === style.h1ID);
        const h2Style = response.data.find((s) => s._id === style.h2ID);
        const h3Style = response.data.find((s) => s._id === style.h3ID);
        const paragraphStyle = response.data.find(
          (s) => s._id === style.paragraphID
        );

        const fontWeight = h1Style.bold ? "bold" : "normal";
        setTextStyle({
          marginLeft: 20,
          marginRight: 20,
          fontFamily: h1Style.fontFamily,
          fontSize: `${h1Style.fontSize}px`,
          lineHeight: `${h1Style.lineHeight}px`,
          fontWeight: fontWeight,
        });
      });
  };

  return <div style={textStyle}>{text}</div>;
};

export default SpeedText;
