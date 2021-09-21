import { Button, Modal } from "semantic-ui-react";

const PauseWindow = ({ isOpen, resume }) => {
  return (
    <Modal open={isOpen}>
      <Button content="Reume" onClick={resume} />
    </Modal>
  );
};

export default PauseWindow;
