import { Modal, Button } from "semantic-ui-react";

const ConfirmDeleteTextMessage = ({ isOpen, answerYes, answerNo }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        content="Are you sure you want to delete this text?"
      />
      <div style={{ marginTop: 10 }}>
        <Button content="No" onClick={answerNo} />
        <Button primary content="Yes" onClick={answerYes} />
      </div>
    </Modal>
  );
};

export default ConfirmDeleteTextMessage;
