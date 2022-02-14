import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";
import { speedTextSeparators } from "../../../utilities.js";

const SpeedText = ({ fileID, styles }) => {
  const [text, setText] = useState({ sections: [], isFetching: true });
  const [style, setStyle] = useState({ style: {}, isInitialized: false });

  useEffect(() => {
    fetchText();
  }, [fileID]);

  useEffect(() => {
    fetchStyle();
  }, [styles]);

  const fetchText = () => {
    setText({ sections: text.sections, isFetching: true });
    axios
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setText({
          sections: response.data.text.split(speedTextSeparators),
          isFetching: false,
        });
      })
      .catch((error) =>
        console.error("Error fetching text in SpeedText:", error)
      );
  };

  const fetchStyle = () => {
    setStyle({ style: style.style, isInitialized: false });
    axios
      .get("/api/getStyles", {
        params: {
          styleIDs: Object.values(styles),
        },
      })
      .then((response) => {
        const h1Style = response.data.find(
          (s) => s._id === styles.h1.fontFamily
        );
        const h2Style = response.data.find(
          (s) => s._id === styles.h2.fontFamily
        );
        const h3Style = response.data.find(
          (s) => s._id === styles.h3.fontFamily
        );
        const paragraphStyle = response.data.find(
          (s) => s._id === styles.paragraph.fontFamily
        );

        // const h1FontWeight = h1Style.bold ? "bold" : "normal";
        // const h2FontWeight = h2Style.bold ? "bold" : "normal";
        // const h3FontWeight = h3Style.bold ? "bold" : "normal";
        // const paragraphFontWeight = paragraphStyle.bold ? "bold" : "normal";

        setStyle({
          style: {
            general: {
              marginLeft: 20,
              marginRight: 20,
              // lineHeight: `${h1Style.lineHeight}px`,
            },
            h1: {
              fontFamily: h1Style.fontFamily,
              // fontSize: `${h1Style.fontSize}px`,
              // fontWeight: h1FontWeight,
            },
            h2: {
              fontFamily: h2Style.fontFamily,
              // fontSize: `${h2Style.fontSize}px`,
              // fontWeight: h2FontWeight,
            },
            h3: {
              fontFamily: h3Style.fontFamily,
              // fontSize: `${h3Style.fontSize}px`,
              // fontWeight: h3FontWeight,
            },
            span: {
              fontFamily: paragraphStyle.fontFamily,
              // fontSize: `${paragraphStyle.fontSize}px`,
              // fontWeight: paragraphFontWeight,
            },
          },
          isInitialized: true,
        });
      })
      .catch((error) =>
        console.error("Error fetching styles in SpeedText:", error)
      );
  };

  const displayContent = () => {
    if (!text.isFetching && style.isInitialized) {
      return (
        <div style={style.style.general}>
          {text.sections.map((s) => {
            const sSubstring = s.substring(4, s.length - 5);
            if (s.includes("<h1>")) {
              return (
                <h1 key={uuid_v4()} style={style.style.h1}>
                  {sSubstring}
                </h1>
              );
            } else if (s.includes("<h2>")) {
              return (
                <h2 key={uuid_v4()} style={style.style.h2}>
                  {sSubstring}
                </h2>
              );
            } else if (s.includes("<h3>")) {
              return (
                <h3 key={uuid_v4()} style={style.style.h3}>
                  {sSubstring}
                </h3>
              );
            } else if (s.includes("<p>")) {
              const startPString = s.substring(3, s.length - 4);
              return (
                <span key={uuid_v4()} style={style.style.span}>
                  {startPString}
                  <br />
                  <br />
                </span>
              );
            } else if (s === "\n" || s === "") {
              // Do not display the newline
            } else {
              return (
                <span key={uuid_v4()} style={style.style.span}>
                  {s}
                </span>
              );
            }
          })}
        </div>
      );
    } else {
      return <div />;
    }
  };

  return displayContent();
};

export default SpeedText;
