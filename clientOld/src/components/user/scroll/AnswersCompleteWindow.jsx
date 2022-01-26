import { Modal, Button } from "semantic-ui-react";

const AnswersCompleteWindow = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Header as="h4">You have answered all the questions!</Modal.Header>
      <Button floated="right" content="Ok" onClick={close} />
    </Modal>
  );
};

export default AnswersCompleteWindow;
