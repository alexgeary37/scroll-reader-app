import { Modal, Button } from "semantic-ui-react";

const AnswerResponseMessage = ({
  isOpen,
  isCorrect,
  tryAgain,
  continueReading,
}) => {
  const message = isCorrect ? "Correct Answer!" : "Your answer is incorrect";
  const displayButtons = () => {
    if (isCorrect) {
      return (
        <div style={{ marginBottom: "1vh" }}>
          <Button primary content="Ok" onClick={continueReading} />
        </div>
      );
    } else {
      return (
        <div style={{ marginBottom: "1vh" }}>
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
      <Modal.Description as="h4" style={{ margin: "2vh" }} content={message} />
      {displayButtons()}
    </Modal>
  );
};

export default AnswerResponseMessage;
