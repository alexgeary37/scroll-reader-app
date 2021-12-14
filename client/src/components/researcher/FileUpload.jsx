import axios from "axios";
import { useRef } from "react";
import { Button } from "semantic-ui-react";

const FileUpload = ({ uploadSubmitted }) => {
  const defaultStyle = {
    fontFamily: "sans-serif",
    fontSize: 15,
    lineHeight: 20,
  };

  const fileRef = useRef();

  const handleButtonClick = () => {
    fileRef.current.click();
  };

  const handleFileSelect = (event) => {
    // https://stackoverflow.com/questions/51272255/how-to-use-filereader-in-react/51278185
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textFile = {
          text: event.target.result,
          fileName: file.name,
          questions: [],
          questionFormat: "",
          styles: [defaultStyle],
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
              questionFormat: "",
              styles: [defaultStyle],
              uploadedAt: response.data.createdAt,
            };
            uploadSubmitted(doc);
          })
          .catch((error) => {
            console.error("Error uploading text file:", error);
          });
      };
      reader.readAsText(file);
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
        hidden
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default FileUpload;
