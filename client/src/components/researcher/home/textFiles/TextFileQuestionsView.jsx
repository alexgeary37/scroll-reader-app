import { Modal, List, Item, Divider, Button, Header } from "semantic-ui-react";

const TextFileQuestionsView = ({
  isOpen,
  questions,
  fileInUse,
  removeQuestion,
  close,
}) => {
  const handleRemoveQuestion = (question) => {
    const closeModal = questions.length === 1;
    removeQuestion(question);
    if (closeModal) {
      close();
    }
  };

  return (
    <Modal style={{ padding: 10 }} size="tiny" open={isOpen}>
      <Header as="h4" content="Questions" />
      <List ordered divided relaxed>
        {questions.map((question) => (
          <Item key={question._id}>
            <div className="wrapper">
              <Item.Description content={question.question} />
              <Button
                floated="right"
                disabled={fileInUse}
                content="Remove"
                onClick={() => handleRemoveQuestion(question)}
              />
            </div>
          </Item>
        ))}
      </List>
      <Divider />
      <Button floated="right" content="Close" onClick={close} />
    </Modal>
  );
};

export default TextFileQuestionsView;
