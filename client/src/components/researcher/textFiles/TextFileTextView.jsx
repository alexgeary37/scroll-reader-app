import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Segment } from "semantic-ui-react";
import { speedTextSeparators } from "../../../utilities";
import { v4 as uuid_v4 } from "uuid";

const TextFileTextView = ({ isOpen, fileID, close }) => {
  const [text, setText] = useState({ sections: [], isFetching: true });
  const style = {
    h1: {
      fontFamily: "Times, 'Times New Roman', Georgia, serif",
    },
    h2: {
      fontFamily: "Times, 'Times New Roman', Georgia, serif",
    },
    h3: {
      fontFamily: "Times, 'Times New Roman', Georgia, serif",
    },
    paragraph: {
      fontFamily: "Times, 'Times New Roman', Georgia, serif",
    },
  };

  useEffect(() => {
    if (isOpen) {
      fetchText();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
        console.error("Error fetching text in TextFileTextView:", error)
      );
  };

  const handleClose = () => {
    setText({ sections: [], isFetching: true });
    close();
  };

  const displayContent = () => {
    if (!text.isFetching) {
      return (
        <div style={{ marginLeft: 20, marginRight: 20 }}>
          {text.sections.map((s) => {
            const sSubstring = s.substring(4, s.length - 5);
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
              const startPString = s.substring(3, s.length - 4);
              return (
                <span key={uuid_v4()} style={style.paragraph}>
                  {startPString}
                  <br />
                  <br />
                </span>
              );
            } else if (s === "\n" || s === "") {
              return <span key={uuid_v4()} />;
            } else {
              return (
                <span key={uuid_v4()} style={style.paragraph}>
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
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Segment basic style={{ overflow: "auto", maxHeight: "65vh" }}>
        {displayContent()}
      </Segment>
      <Button floated="right" content="Close" onClick={handleClose} />
    </Modal>
  );
};

export default TextFileTextView;
