import { useState } from "react";
import { Input, Button, Modal } from "semantic-ui-react";

const CreateStyle = ({ isOpen, styles, addStyle, close }) => {
  const [style, setStyle] = useState("");
  const [displayStyleError, setDisplayStyleError] = useState(false);
  const [displayStyleDuplicateError, setDisplayStyleDuplicateError] =
    useState(false);

  const handleStyleChange = (event) => {
    setDisplayStyleError(false);
    setDisplayStyleDuplicateError(false);
    setStyle(event.target.value);
  };

  const checkFormInputs = () => {
    if (style === "") {
      setDisplayStyleError(true);
      return true;
    }
    return false;
  };

  const handleAddStyle = () => {
    const emptyFields = checkFormInputs();

    if (!emptyFields) {
      const refinedStyle = {
        style: style.trim(),
      };

      if (styles.some((s) => s.style === refinedStyle)) {
        setDisplayStyleDuplicateError(true);
      } else {
        addStyle(refinedStyle);
        setStyle("");
      }
    }
  };

  const handleCancel = () => {
    setStyle("");
    setDisplayStyleError(false);
    close();
  };

  const displayStyleDuplicateErrorMessage = () => {
    if (displayStyleDuplicateError) {
      return (
        <label style={{ padding: 10, color: "red" }}>
          This style has already been created.
        </label>
      );
    }
  };

  const displayStyleAndButtons = () => {
    return (
      <div style={{ marginTop: 10 }}>
        <Input
          style={{ marginBottom: 10 }}
          error={displayStyleError}
          autoFocus
          type="text"
          fluid
          placeholder={`{fontFamily: '<family(ies)>', fontSize: '15px', ... }`}
          onChange={handleStyleChange}
        />
        {displayStyleDuplicateErrorMessage()}
        <div style={{ display: "flex", float: "right" }}>
          <Button content="Cancel" onClick={handleCancel} />
          <Button primary content="Add Style" onClick={handleAddStyle} />
        </div>
      </div>
    );
  };

  return (
    <Modal open={isOpen} size="tiny" style={{ padding: 10 }}>
      <span
        style={{ fontFamily: "Helvetica", fontWeight: 600 }}
      >{`Format: {propertyOne: "val, 'multiple word val'", propertyTwo: "val", ... }`}</span>
      {displayStyleAndButtons()}
    </Modal>
  );
};

export default CreateStyle;
