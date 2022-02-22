import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid_v4 } from "uuid";
import { scrollTextSeparators } from "../../../utilities.js";
import { Segment } from "semantic-ui-react";

const TextAnswersConfigurationView = ({
  fileID,
  answerRegion,
  selectAnswer,
}) => {
  const [text, setText] = useState({ sections: [], isFetching: true });
  const style = {
    h1: {
      fontFamily: 'Times, "Times New Roman", Georgia, serif',
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: "125%",
    },
    h2: {
      fontFamily: 'Times, "Times New Roman", Georgia, serif',
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: "125%",
    },
    h3: {
      fontFamily: 'Times, "Times New Roman", Georgia, serif',
      fontSize: "18.72px",
      fontWeight: 700,
      lineHeight: "125%",
    },
    paragraph: {
      fontFamily: 'Times, "Times New Roman", Georgia, serif',
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "125%",
    },
  };

  // Variable to store index of the word the user began highlighting from.
  let mouseDownIndex;

  useEffect(() => {
    fetchText();
  }, [fileID]);

  const fetchText = () => {
    setText({ sections: text.sections, isFetching: true });
    axios
      .get("/api/getTextFile", {
        params: { _id: fileID },
      })
      .then((response) => {
        setText({
          sections: response.data.text.split(scrollTextSeparators),
          isFetching: false,
        });
      })
      .catch((error) =>
        console.error(
          "Error fetching text in TextAnswersConfigurationView:",
          error
        )
      );
  };

  const handleMouseUp = (index) => {
    selectAnswer(
      Math.min(mouseDownIndex, index),
      Math.max(mouseDownIndex, index)
    );
  };

  const wordColor = (index) => {
    const minIndex = Math.min(answerRegion.startIndex, answerRegion.endIndex);
    const maxIndex = Math.max(answerRegion.startIndex, answerRegion.endIndex);
    if (minIndex <= index && index <= maxIndex) {
      return "yellow";
    }
    return "white";
  };

  const displayContent = () => {
    if (!text.isFetching) {
      return (
        <div style={{ marginLeft: 20, marginRight: 20 }}>
          {text.sections.map((s, index) => {
            const sSubstring = s.substring(4);
            if (s.includes("<h1>")) {
              return (
                <h1 key={uuid_v4()} style={style.h1}>
                  {sSubstring}
                </h1>
              );
            } else if (s.includes("<h2>")) {
              return (
                <h2 key={uuid_v4()} style={style.h2}>
                  {sSubstring}
                </h2>
              );
            } else if (s.includes("<h3>")) {
              return (
                <h3 key={uuid_v4()} style={style.h3}>
                  {sSubstring}
                </h3>
              );
            } else if (s.includes("<p>")) {
              const startPString = s.substring(3);
              return (
                <span
                  key={uuid_v4()}
                  style={{
                    fontFamily: style.paragraph.fontFamily,
                    fontSize: style.paragraph.fontSize,
                    fontWeight: style.paragraph.fontWeight,
                    lineHeight: style.paragraph.lineHeight,
                    backgroundColor: wordColor(index),
                  }}
                  onMouseDown={() => (mouseDownIndex = index)}
                  onMouseUp={() => handleMouseUp(index)}
                >
                  {startPString}
                </span>
              );
            } else if (s.includes("</p>")) {
              const endPString = s.substring(0, s.length - 4);
              return (
                <span
                  key={uuid_v4()}
                  style={{
                    fontFamily: style.paragraph.fontFamily,
                    fontSize: style.paragraph.fontSize,
                    fontWeight: style.paragraph.fontWeight,
                    lineHeight: style.paragraph.lineHeight,
                    backgroundColor: wordColor(index),
                  }}
                  onMouseDown={() => (mouseDownIndex = index)}
                  onMouseUp={() => handleMouseUp(index)}
                >
                  {endPString}
                  <br />
                  <br />
                </span>
              );
            } else if (s === "\n" || s === "") {
              return <span key={uuid_v4()} />;
            } else {
              return (
                <span
                  key={uuid_v4()}
                  style={{
                    fontFamily: style.paragraph.fontFamily,
                    fontSize: style.paragraph.fontSize,
                    fontWeight: style.paragraph.fontWeight,
                    lineHeight: style.paragraph.lineHeight,
                    backgroundColor: wordColor(index),
                  }}
                  onMouseDown={() => (mouseDownIndex = index)}
                  onMouseUp={() => handleMouseUp(index)}
                >
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

  return (
    <Segment basic style={{ overflow: "auto", maxHeight: "65vh" }}>
      {displayContent()}
    </Segment>
  );
};

export default TextAnswersConfigurationView;
