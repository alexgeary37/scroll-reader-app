import { Modal, Button } from "semantic-ui-react";

const AnswerResponseWindow = ({
  isOpen,
  isCorrect,
  tryAgain,
  continueReading,
}) => {
  const message = isCorrect ? "Correct Answer!" : "Your answer is incorrect";
  const displayButtons = () => {
    if (isCorrect) {
      return (
        <div style={{ marginTop: 10 }}>
          <Button primary content="Ok" onClick={continueReading} />
        </div>
      );
    } else {
      return (
        <div style={{ marginTop: 10 }}>
          <Button content="Continue Reading" onClick={continueReading} />
          <Button primary content="Try Again" onClick={tryAgain} />
        </div>
      );
    }
  };

  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Modal.Description as="h4" content={message} />
      {displayButtons()}
    </Modal>
  );
};

export default AnswerResponseWindow;
