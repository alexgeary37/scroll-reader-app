import { Button, Modal } from "semantic-ui-react";

const PauseWindow = ({ isOpen, resume }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Header as="h4">Click to resume reading.</Modal.Header>
      <Button primary content="Reume" onClick={resume} />
    </Modal>
  );
};

export default PauseWindow;
