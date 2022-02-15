import { Modal, Button } from "semantic-ui-react";

const AnswersCompleteMessage = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        style={{ margin: "2vh" }}
        content="You have answered all the questions!"
      />
      <div style={{ marginBottom: "1vh" }}>
        <Button primary content="Ok" onClick={close} />
      </div>
    </Modal>
  );
};

export default AnswersCompleteMessage;
