import { Modal, List, Item, Divider, Button, Header } from "semantic-ui-react";

const QuestionsView = ({ isOpen, text, close }) => {
  return (
    <Modal style={{ padding: 10 }} size="tiny" open={isOpen}>
      <Header as="h4" content={`${text.fileName} questions`} />
      <List ordered divided relaxed>
        {text.questions.map((question) => (
          <Item key={question}>
            <Item.Description content={question} />
          </Item>
        ))}
      </List>
      <Divider />
      <Button floated="right" content="Close" onClick={close} />
    </Modal>
  );
};

export default QuestionsView;
