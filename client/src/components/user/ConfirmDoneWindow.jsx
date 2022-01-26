import { Modal, Button } from "semantic-ui-react";

const ConfirmDoneWindow = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Header as="h4">
        You have not answered all the questions for this text.
        <br />
        Please answer each of the remaining questions, or click "Skip"
      </Modal.Header>

      <Button primary content="Ok" onClick={close} />
    </Modal>
  );
};

export default ConfirmDoneWindow;
