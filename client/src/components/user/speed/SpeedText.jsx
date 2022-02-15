import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";
import { initializeStyles, speedTextSeparators } from "../../../utilities.js";

const SpeedText = ({ fileID, styles }) => {
  const [text, setText] = useState({ sections: [], isFetching: true });
  const [style, setStyle] = useState({ style: {}, isInitialized: false });

  useEffect(() => {
    fetchText();
  }, [fileID]);

  useEffect(() => {
    initializeStyle();
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

  const initializeStyle = () => {
    setStyle({ style: style.style, isInitialized: false });
    setStyle({
      style: initializeStyles(styles),
      isInitialized: true,
    });
  };

  const displayContent = () => {
    if (!text.isFetching && style.isInitialized) {
      return (
        <div style={{ marginLeft: 20, marginRight: 20 }}>
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
                <span key={uuid_v4()} style={style.style.paragraph}>
                  {startPString}
                  <br />
                  <br />
                </span>
              );
            } else if (s === "\n" || s === "") {
              // Do not display the newline
            } else {
              return (
                <span key={uuid_v4()} style={style.style.paragraph}>
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
