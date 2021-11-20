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
      return <Button floated="right" content="Ok" onClick={continueReading} />;
    } else {
      return (
        <div>
          <Button
            floated="right"
            primary
            content="Try Again"
            onClick={tryAgain}
          />
          <Button
            floated="right"
            content="Continue Reading"
            onClick={continueReading}
          />
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
      <Modal.Header as="h4">{message}</Modal.Header>

      {displayButtons()}
    </Modal>
  );
};

export default AnswerResponseWindow;
