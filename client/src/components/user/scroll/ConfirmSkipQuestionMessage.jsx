import { Modal, Button } from "semantic-ui-react";

const ConfirmSkipQuestionMessage = ({ isOpen, skip, cancel }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        style={{ margin: "2vh" }}
        content="Are you sure you want to skip this question? You will not be able to come back to it later"
      />
      <div style={{ marginBottom: "1vh" }}>
        <Button content="No" onClick={cancel} />
        <Button primary content="Yes" onClick={skip} />
      </div>
    </Modal>
  );
};

export default ConfirmSkipQuestionMessage;
