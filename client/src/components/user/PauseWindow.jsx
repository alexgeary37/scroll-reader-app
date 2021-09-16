import { useContext } from "react";
import { Button, Modal } from "semantic-ui-react";
import { SessionContext } from "../../contexts/SessionContext";

const PauseWindow = ({ isOpen }) => {
  const sessionContext = useContext(SessionContext);

  return (
    <Modal open={isOpen}>
      <Button
        content="Reume"
        onClick={() => sessionContext.setIsPaused(false)}
      />
    </Modal>
  );
};

export default PauseWindow;
