import { Modal, Button } from "semantic-ui-react";

const AnswerResponseWindow = ({ isOpen }) => {
  const message = "Correct Answer!";

  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Header as="h4">{message}</Modal.Header>

      <Button primary content="Ok" />
    </Modal>
  );
};

export default AnswerResponseWindow;
