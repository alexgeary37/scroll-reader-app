import { useState } from "react";
import { Modal, List, Item, Divider, Button, Header } from "semantic-ui-react";
import AddQuestionToTextFile from "./AddQuestionToTextFile";
import axios from "axios";

const TextFileQuestionsView = ({
  isOpen,
  fileID,
  questions,
  format,
  usedAsScrollText,
  updateFileQuestions,
  removeQuestion,
  close,
}) => {
  const [openAddQuestion, setOpenAddQuestion] = useState(false);

  const addQuestion = (question, answerRegion) => {
    axios
      .put("http://localhost:3001/addTextFileQuestion", {
        id: fileID,
        question: question,
        answerRegion: answerRegion,
        questionFormat: format,
      })
      .then((response) => {
        // Return the latest question just added.
        const newQuestion = response.data.questions.at(-1);
        updateFileQuestions(newQuestion, format);
      })
      .catch((error) => {
        console.error(
          "Error updating file.questions and file.questionFormat:",
          error
        );
      });
  };

  const handleRemoveQuestion = (question) => {
    const closeModal = questions.length === 1;
    removeQuestion(question);
    if (closeModal) {
      close();
    }
  };

  return (
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Header as="h4" content="Questions" />
      <Button
        disabled={format === "" || usedAsScrollText}
        content="Add Question"
        onClick={() => setOpenAddQuestion(true)}
      />
      <List ordered divided relaxed>
        {questions.map((question) => (
          <Item key={question._id}>
            <div className="wrapper">
              <Item.Description content={question.question} />
              <Item.Description
                content={`Word Index Answer Region: [${question.answerRegion.startIndex}...${question.answerRegion.endIndex}]`}
              />
              <Button
                floated="right"
                disabled={usedAsScrollText}
                content="Remove"
                onClick={() => handleRemoveQuestion(question)}
              />
            </div>
          </Item>
        ))}
      </List>
      <Divider />
      <Button floated="right" content="Close" onClick={close} />

      <AddQuestionToTextFile
        isOpen={openAddQuestion}
        fileID={fileID}
        format={format}
        addQuestion={addQuestion}
        close={() => setOpenAddQuestion(false)}
      />
    </Modal>
  );
};

export default TextFileQuestionsView;
