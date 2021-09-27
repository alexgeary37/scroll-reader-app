import { useState } from "react";
import { Item, Button, Label } from "semantic-ui-react";
import AddQuestion from "./AddQuestion";
import QuestionsView from "./QuestionsView";

const ScrollTextListItem = ({ text, addQuestion }) => {
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [viewQuestions, setViewQuestions] = useState(false);

  const handleQuestionsClick = () => {
    if (text.questions.length > 0) {
      setViewQuestions(true);
    }
  };

  return (
    <Item key={text.fileName}>
      <Item.Content>
        <div className="wrapper" style={{ justifyContent: "space-between" }}>
          <div>
            <Item.Header
              as="h4"
              style={{ margin: 5 }}
              content={text.fileName}
            />
          </div>

          <Button
            primary
            disabled={text.questions.length === 0}
            content={`Questions: ${text.questions.length}`}
            onClick={handleQuestionsClick}
          />

          <QuestionsView
            isOpen={viewQuestions}
            text={text}
            close={() => setViewQuestions(false)}
          />

          <Button
            floated="right"
            content="Add Question"
            onClick={() => setOpenAddQuestion(true)}
          />
        </div>
        <AddQuestion
          isOpen={openAddQuestion}
          addQuestion={(question) => addQuestion(text, question)}
          close={() => setOpenAddQuestion(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default ScrollTextListItem;
