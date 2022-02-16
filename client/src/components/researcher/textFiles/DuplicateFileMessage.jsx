import { Modal, Button } from "semantic-ui-react";

const DuplicateFileMessage = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        content={`This file has already been uploaded. 
            Please choose a different file, or rename this file before you upload it.`}
      />
      <Button primary content="Ok" onClick={close} />
    </Modal>
  );
};

export default DuplicateFileMessage;
