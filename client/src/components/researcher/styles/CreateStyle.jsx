import { useState } from "react";
import { Input, Button, Modal } from "semantic-ui-react";

const CreateStyle = ({ isOpen, styles, addStyle, close }) => {
  const [family, setFamily] = useState("");
  const [displayFamilyError, setDisplayFamilyError] = useState(false);
  const [displayFamilyDuplicateError, setDisplayFamilyDuplicateError] =
    useState(false);

  const handleFamilyChange = (event) => {
    setDisplayFamilyError(false);
    setDisplayFamilyDuplicateError(false);
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

      if (styles.some((s) => s.fontFamily === family)) {
        setDisplayFamilyDuplicateError(true);
      } else {
        addStyle(style);
        setFamily("");
      }
    }
  };

  const handleCancel = () => {
    setFamily("");
    setDisplayFamilyError(false);
    close();
  };

  const displayFamilyDuplicateErrorMessage = () => {
    if (displayFamilyDuplicateError) {
      return (
        <label style={{ padding: 10, color: "red" }}>
          This font-family has already been created.
        </label>
      );
    }
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
        {displayFamilyDuplicateErrorMessage()}
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
