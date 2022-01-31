import { Modal, Button } from "semantic-ui-react";

const ConfirmSkipQuestionWindow = ({ isOpen, skip, cancel }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        content={`Are you sure you want to skip this question?${(
          <br />
        )}You will not be able to come back to it later`}
      />
      <div style={{ marginTop: 10 }}>
        <Button content="No" onClick={cancel} />
        <Button primary content="Yes" onClick={skip} />
      </div>
    </Modal>
  );
};

export default ConfirmSkipQuestionWindow;
