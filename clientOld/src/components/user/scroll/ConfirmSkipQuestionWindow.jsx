import { Modal, Button } from "semantic-ui-react";

const ConfirmSkipQuestionWindow = ({ isOpen, skip, cancel }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Header as="h4">
        Are you sure you want to skip this question?
        <br />
        You will not be able to come back to it later.
      </Modal.Header>
      <Button primary content="Yes" onClick={skip} />
      <Button content="No" onClick={cancel} />
    </Modal>
  );
};

export default ConfirmSkipQuestionWindow;
