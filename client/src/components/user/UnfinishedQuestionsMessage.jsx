import { Modal, Button } from "semantic-ui-react";

const UnfinishedQuestionsMessage = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        style={{ margin: "2vh" }}
        content={`You have not answered all the questions for this text.
        Please answer each of the remaining questions, or click "Skip"`}
      />
      <div style={{ marginBottom: "1vh" }}>
        <Button primary content="Ok" onClick={close} />
      </div>
    </Modal>
  );
};

export default UnfinishedQuestionsMessage;
