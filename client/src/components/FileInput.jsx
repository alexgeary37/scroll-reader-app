import { useContext, useRef } from "react";
import { TextContext } from "../contexts/TextContext.jsx";
import { SessionContext } from "../contexts/SessionContext.jsx";
import { Button } from "semantic-ui-react";

const FileInput = () => {
  const textContext = useContext(TextContext);
  const sessionContext = useContext(SessionContext);
  const fileRef = useRef();

  const uploadRemoveLabel = (text) => {
    return text === "" ? "Upload Text" : "Remove Text";
  };

  const handleButtonClick = () => {
    if (textContext.text === "") {
      fileRef.current.click();
    } else {
      if (!sessionContext.inProgress) {
        textContext.removeText();
        fileRef.current.value = "";
      }
    }
  };

  const handleFileSelect = (event) => {
    // https://stackoverflow.com/questions/51272255/how-to-use-filereader-in-react/51278185
    const file = event.target.files[0];
    if (typeof file !== `undefined`) {
      const reader = new FileReader();
      reader.onload = (event) => textContext.setText(event.target.result);
      reader.readAsText(file);
      textContext.setFileName(file.name);
    }
  };

  return (
    //https://stackoverflow.com/questions/55464274/react-input-type-file-semantic-ui-react
    <div>
      <Button
        primary
        content={uploadRemoveLabel(textContext.text)}
        icon="file"
        disabled={sessionContext.inProgress}
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

export default FileInput;
