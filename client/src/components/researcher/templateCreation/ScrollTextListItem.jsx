import { useState } from "react";
import { Input, Item, Button } from "semantic-ui-react";
import QuestionsView from "./QuestionsView";

const ScrollTextListItem = ({
  text,
  availableQuestions,
  addQuestions,
  setInstructions,
  instructionsError,
  toggleHasFamiliarityQuestion,
  toggleHasInterestQuestion,
}) => {
  const [viewQuestions, setViewQuestions] = useState(false);
  const [instructionsAreEmpty, setInstructionsAreEmpty] = useState(true);

  const handleInstructionsChange = (text, instructions) => {
    setInstructionsAreEmpty(instructions === "");
    setInstructions(text, instructions);
  };

  const updateQuestions = (selectedQuestions) => {
    setViewQuestions(false);
    addQuestions(text, selectedQuestions);
  };

  return (
    <Item key={text.fileID}>
      <Item.Content>
        <div className="wrapper">
          <div>
            <Item.Header style={{ margin: 5 }} content={text.fileName} />
          </div>

          <Input
            type="text"
            error={instructionsError && instructionsAreEmpty}
            placeholder="Write instructions here..."
            onChange={(e) => handleInstructionsChange(text, e.target.value)}
          />

          <div>
            <div className="ui checkbox">
              <input
                type="checkbox"
                defaultChecked
                onClick={toggleHasFamiliarityQuestion}
              />
              <label>Ask user about their familiarity</label>
            </div>

            <div className="ui checkbox">
              <input
                type="checkbox"
                defaultChecked
                onClick={toggleHasInterestQuestion}
              />
              <label>Ask user about their interest</label>
            </div>
          </div>

          <Button content="Questions" onClick={() => setViewQuestions(true)} />

          <QuestionsView
            isOpen={viewQuestions}
            availableQuestions={availableQuestions}
            updateQuestions={updateQuestions}
          />
        </div>
      </Item.Content>
    </Item>
  );
};

export default ScrollTextListItem;
