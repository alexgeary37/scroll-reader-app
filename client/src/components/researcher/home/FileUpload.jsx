import Axios from "axios";
import { useRef } from "react";
import { Button } from "semantic-ui-react";

const FileUpload = ({ uploadSubmitted }) => {
  const fileRef = useRef();

  const handleButtonClick = () => {
    fileRef.current.click();
  };

  const handleFileSelect = (event) => {
    // https://stackoverflow.com/questions/51272255/how-to-use-filereader-in-react/51278185
    const file = event.target.files[0];
    if (typeof file !== `undefined`) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textFile = {
          text: event.target.result,
          fileName: file.name,
          createdAt: new Date(),
        };
        Axios.post("http://localhost:3001/uploadTextFile", textFile)
          .then((response) => {
            const doc = {
              key: response.data._id,
              value: response.data._id,
              name: textFile.fileName,
              text: textFile.fileName, // This is for the Dropdown in CreateTemplate.jsx
              uploadedAt: textFile.createdAt,
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
        style={{ marginTop: 10 }}
        primary
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
