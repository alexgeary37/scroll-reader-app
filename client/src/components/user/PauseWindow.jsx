import { Button, Modal } from "semantic-ui-react";

const PauseWindow = ({ isOpen, resume }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description as="h4" content="Click to resume reading" />
      <div style={{ marginTop: 10 }}>
        <Button primary content="Resume" onClick={resume} />
      </div>
    </Modal>
  );
};

export default PauseWindow;
