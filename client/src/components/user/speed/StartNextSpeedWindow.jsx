import { Modal, Button } from "semantic-ui-react";

const StartNextSpeedWindow = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Header as="h4">Read this text, then click Done!</Modal.Header>
      <Button floated="right" content="Ok" onClick={close} />
    </Modal>
  );
};

export default StartNextSpeedWindow;
