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
  format,
  updateFileQuestions,
  removeQuestion,
  close,
}) => {
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [questionFormat, setQuestionFormat] = useState(format);
  const [usedQuestionIDs, setUsedQuestionIDs] = useState([]);

  useEffect(() => {
    setQuestionFormat(format);
  }, [format]);

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

  const addQuestion = (question, answerRegion) => {
    axios
      .put("/api/addTextFileQuestion", {
        id: fileID,
        question: question.trim(),
        answerRegion: answerRegion,
        questionFormat: questionFormat,
      })
      .then((response) => {
        // Return the latest question just added.
        const newQuestion = response.data.questions.at(-1);
        updateFileQuestions(newQuestion, questionFormat);
      })
      .catch((error) => {
        console.error(
          "Error updating file.questions and file.questionFormat:",
          error
        );
      });
  };

  return (
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Header as="h4" content="Questions" />
      <div>
        <Form>
          <div className="grouped fields">
            <Form.Field>
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  disabled={format !== ""}
                  checked={questionFormat === "comprehension"}
                  onChange={() => setQuestionFormat("comprehension")}
                />
                <label>Comprehension</label>
              </div>
            </Form.Field>
            <Form.Field>
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  disabled={format !== ""}
                  checked={questionFormat === "inline"}
                  onChange={() => setQuestionFormat("inline")}
                />
                <label>Inline</label>
              </div>
            </Form.Field>
          </div>
        </Form>
      </div>
      <Button
        positive
        disabled={questionFormat === ""}
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
                disabled={usedQuestionIDs.includes(question._id)}
                content="Remove"
                onClick={() => removeQuestion(question)}
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
        format={questionFormat}
        addQuestion={addQuestion}
        close={() => setOpenAddQuestion(false)}
      />
    </Modal>
  );
};

export default TextFileQuestionsView;
