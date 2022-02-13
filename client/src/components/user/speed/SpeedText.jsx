import { useState, useEffect } from "react";
import axios from "axios";
import { speedTextSeparators } from "../../../utilities.js";

const SpeedText = ({ fileID, styles }) => {
  const [text, setText] = useState("");
  const [style, setStyle] = useState(null);

  useEffect(() => {
    fetchText();
  }, [fileID]);

  useEffect(() => {
    fetchStyle();
  }, [styles]);

  const fetchText = () => {
    axios
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        const splitText = response.data.text.split(speedTextSeparators);
        const sections = [];
        let sectionType = "span";
        splitText.forEach((s) => {
          if (s === "<h1>" || s === "<h2>" || s === "<h3>") {
            sectionType = s;
          } else if (s === "</h1>" || s === "</h2>" || s === "</h3>") {
            sectionType = "span";
          } else {
            sections.push({ type: sectionType, section: s });
          }
        });
        setText(sections);
      })
      .catch((error) =>
        console.error("Error fetching text in SpeedText:", error)
      );
  };

  const fetchStyle = () => {
    axios
      .get("/api/getStyles", {
        params: {
          styleIDs: Object.values(styles),
        },
      })
      .then((response) => {
        const h1Style = response.data.find((s) => s._id === styles.h1ID);
        const h2Style = response.data.find((s) => s._id === styles.h2ID);
        const h3Style = response.data.find((s) => s._id === styles.h3ID);
        const paragraphStyle = response.data.find(
          (s) => s._id === styles.paragraphID
        );

        const h1FontWeight = h1Style.bold ? "bold" : "normal";
        const h2FontWeight = h2Style.bold ? "bold" : "normal";
        const h3FontWeight = h3Style.bold ? "bold" : "normal";
        const paragraphFontWeight = paragraphStyle.bold ? "bold" : "normal";

        setStyle({
          general: {
            marginLeft: 20,
            marginRight: 20,
            lineHeight: `${h1Style.lineHeight}px`,
          },
          h1: {
            fontFamily: h1Style.fontFamily,
            fontSize: `${h1Style.fontSize}px`,
            fontWeight: h1FontWeight,
          },
          h2: {
            fontFamily: h2Style.fontFamily,
            fontSize: `${h2Style.fontSize}px`,
            fontWeight: h2FontWeight,
          },
          h3: {
            fontFamily: h3Style.fontFamily,
            fontSize: `${h3Style.fontSize}px`,
            fontWeight: h3FontWeight,
          },
          p: {
            fontFamily: paragraphStyle.fontFamily,
            fontSize: `${paragraphStyle.fontSize}px`,
            fontWeight: paragraphFontWeight,
          },
        });
      });
  };

  return (
    <div style={style.general}>
      {text.map((s) => {
        if (s.type === "<h1>") {
          return <h1 style={style.h1}>{s.section}</h1>;
        } else if (s.type === "<h2>") {
          return <h2 style={style.h2}>{s.section}</h2>;
        } else if (s.type === "<h3>") {
          return <h3 style={style.h3}>{s.section}</h3>;
        } else {
          return <p style={style.p}>{s.section}</p>;
        }
      })}
    </div>
  );
};

export default SpeedText;
