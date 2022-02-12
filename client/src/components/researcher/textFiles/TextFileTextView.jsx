import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Segment } from "semantic-ui-react";

const TextFileTextView = ({ isOpen, fileID, close }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (isOpen) {
      axios
        .get("/api/getTextFile", {
          params: { _id: fileID },
        })
        .then((response) => {
          setText(response.data.text);
        })
        .catch((error) =>
          console.error("Error fetching text in TextFileTextView:", error)
        );
    }
  }, [isOpen]);

  const handleClose = () => {
    setText("");
    close();
  };

  return (
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Segment style={{ overflow: "auto", maxHeight: "65vh" }}>
        <p>{text}</p>
      </Segment>
      <Button floated="right" content="Close" onClick={handleClose} />
    </Modal>
  );
};

export default TextFileTextView;
