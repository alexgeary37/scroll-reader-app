import { Modal, Button } from "semantic-ui-react";

const DeleteTemplateModal = ({ isOpen, answerYes, answerNo }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Header as="h4">
        Are you sure you want to delete this template?
        <br />
      </Modal.Header>
      <Button primary content="Yes" onClick={answerYes} />
      <Button content="No" onClick={answerNo} />
    </Modal>
  );
};

export default DeleteTemplateModal;
