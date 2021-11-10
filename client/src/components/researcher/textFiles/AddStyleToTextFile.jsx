import { useState } from "react";
import { Input, Button, Modal } from "semantic-ui-react";

const AddStyleToTextFile = ({ isOpen, addStyle, close }) => {
  const [style, setStyle] = useState("");
  const [displayStyleError, setDisplayStyleError] = useState(false);

  const handleCancel = () => {
    setStyle("");
    setDisplayStyleError(false);
    close();
  };

  const handleStyleChange = (event) => {
    setDisplayStyleError(false);
    setStyle(event.target.value);
  };

  const handleAddStyle = () => {
    if (style === "") {
      setDisplayStyleError(true);
      return;
    }

    setStyle("");
    addStyle(style);
    close();
  };

  const displayStyleAndButtons = () => {
    return (
      <div>
        <Input
          style={{ marginBottom: 10 }}
          error={displayStyleError}
          autoFocus
          type="text"
          fluid
          placeholder="Type a font style here..."
          onChange={handleStyleChange}
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
