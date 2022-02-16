import axios from "axios";
import { useRef, useState } from "react";
import { Button } from "semantic-ui-react";
import DuplicateFileMessage from "./DuplicateFileMessage";

const FileUpload = ({ textFiles, uploadSubmitted }) => {
  const fileRef = useRef();
  const [openDuplicateFileMessage, setOpenDuplicateFileMessage] =
    useState(false);

  const handleButtonClick = () => {
    fileRef.current.click();
  };

  const handleFileSelect = (event) => {
    // https://stackoverflow.com/questions/51272255/how-to-use-filereader-in-react/51278185
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      if (!textFiles.some((t) => t.name === file.name)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const textFile = {
            text: event.target.result,
            fileName: file.name,
            questions: [],
            createdAt: new Date(),
          };
          axios
            .post("/api/uploadTextFile", textFile)
            .then((response) => {
              const doc = {
                key: response.data._id,
                value: response.data._id,
                name: response.data.fileName,
                questions: [],
                uploadedAt: response.data.createdAt,
              };
              uploadSubmitted(doc);
            })
            .catch((error) =>
              console.error("Error uploading text file:", error)
            );
        };
        reader.readAsText(file);
      } else {
        fileRef.current.value = null;
        setOpenDuplicateFileMessage(true);
      }
    }
  };

  return (
    //https://stackoverflow.com/questions/55464274/react-input-type-file-semantic-ui-react
    <div>
      <Button
        style={{ display: "flex", float: "right" }}
        positive
        content="Upload Text"
        icon="file"
        onClick={handleButtonClick}
      />
      <input
        ref={fileRef}
        type="file"
        name="file"
        accept=".txt"
        multiple={false}
        hidden
        onChange={handleFileSelect}
      />
      <DuplicateFileMessage
        isOpen={openDuplicateFileMessage}
        close={() => {
          setOpenDuplicateFileMessage(false);
          handleButtonClick();
        }}
      />
    </div>
  );
};

export default FileUpload;
