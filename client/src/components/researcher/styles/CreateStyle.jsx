import { useState } from "react";
import { Input, Button, Modal } from "semantic-ui-react";

const CreateStyle = ({ isOpen, addStyle, close }) => {
  const [family, setFamily] = useState("");
  const [displayFamilyError, setDisplayFamilyError] = useState(false);

  const handleFamilyChange = (event) => {
    setDisplayFamilyError(false);
    setFamily(event.target.value);
  };

  const checkFormInputs = () => {
    if (family === "") {
      setDisplayFamilyError(true);
      return true;
    }

    return false;
  };

  const handleAddStyle = () => {
    const emptyFields = checkFormInputs();

    if (!emptyFields) {
      const style = {
        fontFamily: family.trim(),
      };

      addStyle(style);

      setFamily("");
    }
  };

  const handleCancel = () => {
    setFamily("");
    setDisplayFamilyError(false);
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
        <div style={{ display: "flex", float: "right" }}>
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

export default CreateStyle;
