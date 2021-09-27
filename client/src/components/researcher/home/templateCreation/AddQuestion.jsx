import { useState } from "react";
import { Modal, Button, Input } from "semantic-ui-react";

const AddQuestion = ({ isOpen, addQuestion, close }) => {
  const [question, setQuestion] = useState("");

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleAddQuestion = () => {
    addQuestion(question);
    close();
  };

  return (
    <Modal style={{ padding: 10 }} size="tiny" open={isOpen}>
      <Input
        style={{ marginBottom: 10 }}
        type="text"
        fluid
        placeholder="Type a question for this text here..."
        onChange={handleQuestionChange}
      />

      <Button floated="right" content="Cancel" onClick={close} />
      <Button
        floated="right"
        primary
        content="Add Question"
        onClick={handleAddQuestion}
      />
    </Modal>
  );
};

export default AddQuestion;
