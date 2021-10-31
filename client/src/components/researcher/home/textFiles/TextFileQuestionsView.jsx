import { Modal, List, Item, Divider, Button, Header } from "semantic-ui-react";

const TextFileQuestionsView = ({
  isOpen,
  questions,
  fileInUse,
  removeQuestion,
  close,
}) => {
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
                onClick={() => removeQuestion(question)}
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
