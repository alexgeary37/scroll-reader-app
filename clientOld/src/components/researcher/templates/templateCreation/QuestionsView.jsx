import { useEffect, useState } from "react";
import {
  Modal,
  List,
  Item,
  Divider,
  Button,
  Header,
  Dropdown,
} from "semantic-ui-react";

const QuestionsView = ({ isOpen, availableQuestions, updateQuestions }) => {
  const [dropdownQuestions, setDropdownQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    setDropdownQuestions(formatDropdownQuestions(availableQuestions));
  }, [availableQuestions]);

  const formatDropdownQuestions = (questions) => {
    return questions.map((question) => {
      return {
        key: question._id,
        value: question._id,
        text: question.question,
      };
    });
  };

  return (
    <Modal style={{ padding: 10 }} size="tiny" open={isOpen}>
      <Header as="h4" content="Selected Questions:" />
      <Dropdown
        placeholder="Select questions for this text"
        fluid
        search
        selection
        multiple
        options={dropdownQuestions}
        onChange={(e, data) => setSelectedQuestions(data.value)}
      />
      <List ordered divided relaxed>
        {selectedQuestions.map((question) => (
          <Item key={question}>
            <Item.Description
              content={
                availableQuestions.find((q) => q._id === question).question
              }
            />
          </Item>
        ))}
      </List>
      <Divider />
      <Button
        floated="right"
        content="Save"
        onClick={() => updateQuestions(selectedQuestions)}
      />
    </Modal>
  );
};

export default QuestionsView;
