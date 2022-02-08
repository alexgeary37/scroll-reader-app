import { Modal, Button } from "semantic-ui-react";

const ConfirmDoneModal = ({ isOpen, answerYes, answerNo }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        style={{ margin: "2vh" }}
        content="Are you sure you have finished this text?"
      />
      <div style={{ marginBottom: "1vh" }}>
        <Button content="No" onClick={answerNo} />
        <Button primary content="Yes" onClick={answerYes} />
      </div>
    </Modal>
  );
};

export default ConfirmDoneModal;
