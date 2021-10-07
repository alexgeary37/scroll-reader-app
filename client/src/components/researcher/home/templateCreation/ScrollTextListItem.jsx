import { useState } from "react";
import { Input, Item, Button } from "semantic-ui-react";
import AddQuestion from "./AddQuestion";
import QuestionsView from "./QuestionsView";

const ScrollTextListItem = ({
  text,
  addQuestion,
  setInstructions,
  instructionsError,
}) => {
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [viewQuestions, setViewQuestions] = useState(false);
  const [instructionsAreEmpty, setInstructionsAreEmpty] = useState(true);

  const handleQuestionsClick = () => {
    if (text.questions.length > 0) {
      setViewQuestions(true);
    }
  };

  const handleInstructionsChange = (text, instructions) => {
    setInstructionsAreEmpty(instructions === "");
    setInstructions(text, instructions);
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

          <Input
            type="text"
            error={instructionsError && instructionsAreEmpty}
            placeholder="Write instructions here..."
            onChange={(e) => handleInstructionsChange(text, e.target.value)}
          />

          <Button
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
