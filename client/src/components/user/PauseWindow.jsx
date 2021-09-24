import { Button, Modal, Segment } from "semantic-ui-react";

const PauseWindow = ({ isOpen, resume }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Segment as="h4">Click to resume reading.</Segment>
      <Button primary content="Reume" onClick={resume} />
    </Modal>
  );
};

export default PauseWindow;
