import { useState } from "react";
import { Input, Button, Modal } from "semantic-ui-react";

const AddStyleToTextFile = ({ isOpen, addStyle, close }) => {
  const [family, setFamily] = useState("");
  const [size, setSize] = useState(-1);
  const [lineHeight, setLineHeight] = useState(-1);
  const [displayFamilyError, setDisplayFamilyError] = useState(false);
  const [displaySizeError, setDisplaySizeError] = useState(false);
  const [displayLineHeightError, setDisplayLineHeightError] = useState(false);

  const handleFamilyChange = (event) => {
    setDisplayFamilyError(false);
    setFamily(event.target.value);
  };

  const handleSizeChange = (event) => {
    setDisplaySizeError(false);
    setSize(event.target.value);
  };

  const handleLineHeightChange = (event) => {
    setDisplayLineHeightError(false);
    setLineHeight(event.target.value);
  };

  const handleAddStyle = () => {
    if (family === "") {
      setDisplayFamilyError(true);
      return;
    }
    if (size === -1) {
      setDisplaySizeError(true);
      return;
    }
    if (lineHeight === -1) {
      setDisplayLineHeightError(true);
      return;
    }

    const style = {
      fontFamily: family,
      fontSize: size,
      lineHeight: lineHeight,
    };

    addStyle(style);

    setFamily("");
    setSize(-1);
    setLineHeight(-1);

    close();
  };

  const handleCancel = () => {
    setFamily("");
    setSize(-1);
    setLineHeight(-1);
    setDisplayFamilyError(false);
    setDisplaySizeError(false);
    setDisplayLineHeightError(false);
    close();
  };

  const displayStyleAndButtons = () => {
    return (
      <div>
        <Input
          style={{ marginBottom: 10 }}
          error={displayFamilyError}
          autoFocus
          type="text"
          fluid
          placeholder="Type a font family here..."
          onChange={handleFamilyChange}
        />
        <Input
          style={{ marginBottom: 10 }}
          error={displaySizeError}
          type="Number"
          fluid
          placeholder="Type a size number here..."
          onChange={handleSizeChange}
        />
        <Input
          style={{ marginBottom: 10 }}
          error={displayLineHeightError}
          type="Number"
          fluid
          placeholder="Type a line height number here..."
          onChange={handleLineHeightChange}
        />
        <div style={{ position: "absolute", right: 10, bottom: 10 }}>
          <Button content="Cancel" onClick={handleCancel} />
          <Button primary content="Add Style" onClick={handleAddStyle} />
        </div>
      </div>
    );
  };

  return (
    <Modal open={isOpen} size="tiny" style={{ padding: 10 }}>
      {displayStyleAndButtons()}
    </Modal>
  );
};

export default AddStyleToTextFile;
