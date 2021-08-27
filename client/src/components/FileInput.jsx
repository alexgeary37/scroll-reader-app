import { useRef } from "react";
import { Button } from "semantic-ui-react";

const FileInput = ({ setFile }) => {
  const fileRef = useRef();

  const handleButtonClick = () => {
    fileRef.current.click();
  };

  async function handleFileSelect(event) {
    // https://stackoverflow.com/questions/51272255/how-to-use-filereader-in-react/51278185
    const file = event.target.files[0];
    if (typeof file !== `undefined`) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const fileName = file.name;
        setFile({
          text: text,
          fileName: fileName,
        });
      };
      reader.readAsText(file);
    }
  }

  return (
    //https://stackoverflow.com/questions/55464274/react-input-type-file-semantic-ui-react
    <div>
      <Button
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

export default FileInput;
