import { useState } from "react";
import { Input, Item, Button } from "semantic-ui-react";
import QuestionsView from "./QuestionsView";
import TextStylesView from "./TextStylesView";

const ScrollTextListItem = ({
  text,
  availableQuestions,
  styles,
  addQuestions,
  selectStyles,
  setInstructions,
  instructionsError,
  toggleHasFamiliarityQuestion,
  toggleHasInterestQuestion,
}) => {
  const [viewQuestions, setViewQuestions] = useState(false);
  const [viewStyles, setViewStyles] = useState(false);
  const [instructionsAreEmpty, setInstructionsAreEmpty] = useState(true);

  const handleInstructionsChange = (text, instructions) => {
    setInstructionsAreEmpty(instructions === "");
    setInstructions(text, instructions);
  };

  const updateQuestions = (selectedQuestions) => {
    setViewQuestions(false);
    addQuestions(text, selectedQuestions);
  };

  const updateStyles = (h1, h2, h3, paragraph) => {
    setViewStyles(false);
    selectStyles(text, h1, h2, h3, paragraph);
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

          <Button content="Styles" onClick={() => setViewStyles(true)} />
          <Button content="Questions" onClick={() => setViewQuestions(true)} />

          <QuestionsView
            isOpen={viewQuestions}
            availableQuestions={availableQuestions}
            updateQuestions={updateQuestions}
          />

          <TextStylesView
            isOpen={viewStyles}
            styles={styles}
            updateStyles={updateStyles}
          />
        </div>
      </Item.Content>
    </Item>
  );
};

export default ScrollTextListItem;
