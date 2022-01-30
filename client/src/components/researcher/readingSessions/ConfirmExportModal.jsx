import { Modal, Button } from "semantic-ui-react";

const ConfirmExportModal = ({ isOpen, answerYes, answerNo }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Header as="h4">
        Are you sure you want to export data from this reading session?
        <br />
      </Modal.Header>
      <div style={{ marginTop: 10 }}>
        <Button content="No" onClick={answerNo} />
        <Button primary content="Yes" onClick={answerYes} />
      </div>
    </Modal>
  );
};

export default ConfirmExportModal;
