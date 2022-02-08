import { Button, Modal } from "semantic-ui-react";

const PauseWindow = ({ isOpen, resume }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description
        as="h4"
        style={{ margin: "2vh" }}
        content="Click to resume reading"
      />
      <div style={{ marginBottom: "1vh" }}>
        <Button primary content="Resume" onClick={resume} />
      </div>
    </Modal>
  );
};

export default PauseWindow;
