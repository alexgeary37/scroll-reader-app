import { Modal, Button } from "semantic-ui-react";

const StartNextSpeedWindow = ({ isOpen, close }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description as="h4" content="Read this text, then click Done!" />
      <div style={{ marginTop: 10 }}>
        <Button primary content="Ok" onClick={close} />
      </div>
    </Modal>
  );
};

export default StartNextSpeedWindow;
