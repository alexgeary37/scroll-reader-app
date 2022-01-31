import { Modal, Button } from "semantic-ui-react";

const AnswersCompleteWindow = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        content="You have answered all the questions!"
      />
      <div style={{ marginTop: 10 }}>
        <Button primary content="Ok" onClick={close} />
      </div>
    </Modal>
  );
};

export default AnswersCompleteWindow;
