import { useEffect, useState } from "react";
import {
  Modal,
  List,
  Item,
  Divider,
  Button,
  Header,
  Form,
} from "semantic-ui-react";
import AddQuestionToTextFile from "./AddQuestionToTextFile";
import axios from "axios";

const TextFileQuestionsView = ({
  isOpen,
  fileID,
  questions,
  updateFileQuestions,
  removeQuestion,
  close,
}) => {
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [usedQuestionIDs, setUsedQuestionIDs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchTemplateQuestions();
    }
  }, [isOpen]);

  const fetchTemplateQuestions = () => {
    axios
      .get("/api/getUsedQuestions")
      .then((response) => {
        setUsedQuestionIDs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching used questions:", error);
      });
  };

  const addQuestion = (question, questionFormat, answerRegion) => {
    axios
      .put("/api/addTextFileQuestion", {
        id: fileID,
        question: question.trim(),
        questionFormat: questionFormat,
        answerRegion: answerRegion,
      })
      .then((response) => {
        // Return the latest question just added.
        const newQuestion = response.data.questions.at(-1);
        updateFileQuestions(newQuestion);
      })
      .catch((error) => {
        console.error("Error updating file.questions:", error);
      });
  };

  return (
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Header as="h4" content="Questions" />
      <List ordered divided relaxed>
        {questions.map((question) => (
          <Item key={question._id}>
            <div className="wrapper">
              <Item.Description content={question.question} />
              <Item.Description content={question.questionFormat} />
              <Item.Description
                content={`Word Index Answer Region: [${question.answerRegion.startIndex}...${question.answerRegion.endIndex}]`}
              />
              <Button
                floated="right"
                disabled={usedQuestionIDs.includes(question._id)}
                content="Remove"
                onClick={() => removeQuestion(question)}
              />
            </div>
          </Item>
        ))}
      </List>
      <Divider />
      <Button
        positive
        content="Add Question"
        onClick={() => setOpenAddQuestion(true)}
      />
      <Button floated="right" content="Close" onClick={close} />

      <AddQuestionToTextFile
        isOpen={openAddQuestion}
        fileID={fileID}
        addQuestion={addQuestion}
        close={() => setOpenAddQuestion(false)}
      />
    </Modal>
  );
};

export default TextFileQuestionsView;
