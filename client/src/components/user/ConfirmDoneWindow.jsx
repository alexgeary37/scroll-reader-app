import { Modal, Button } from "semantic-ui-react";

const ConfirmDoneWindow = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        content={`You have not answered all the questions for this text.${(
          <br />
        )}Please answer each of the remaining questions, or click "Skip`}
      />
      <div style={{ marginTop: 10 }}>
        <Button primary content="Ok" onClick={close} />
      </div>
    </Modal>
  );
};

export default ConfirmDoneWindow;
