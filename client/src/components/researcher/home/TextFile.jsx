import axios from "axios";
import { useEffect, useState } from "react";
import { Item, Icon, Button, Form, Header } from "semantic-ui-react";
import AddQuestionToTextFile from "./textFiles/AddQuestionToTextFile";
import TextFileQuestionsView from "./textFiles/TextFileQuestionsView";

const TextFile = ({ file, updateFileQuestions, fileInUse, removeQuestion }) => {
  const [openAddQuestion, setOpenAddQuestion] = useState(false);
  const [openViewQuestions, setOpenViewQuestions] = useState(false);
  const [questionFormat, setQuestionFormat] = useState(file.questionFormat);

  useEffect(() => {
    console.log(file.questionFormat);
  }, []);

  const addQuestion = (question, answerRegion) => {
    const fileID = file.key;

    axios
      .put("http://localhost:3001/addTextFileQuestion", {
        id: fileID,
        question: question,
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
    <Item>
      <Icon size="large" name="file outline" />
      <Item.Content>
        <div className="wrapper">
          <div>
            <Item.Header as="h4" style={{ margin: 5 }} content={file.name} />
            <Item.Description content={`Uploaded: ${file.uploadedAt}`} />
            <div>
              <Form>
                <div className="grouped fields">
                  <Header as="h5" content="Question Format:" />
                  <Form.Field>
                    <div className="ui radio checkbox">
                      <input
                        type="radio"
                        disabled={file.questionFormat !== ""}
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
                        disabled={file.questionFormat !== ""}
                        checked={questionFormat === "inline"}
                        onChange={() => setQuestionFormat("inline")}
                      />
                      <label>Inline</label>
                    </div>
                  </Form.Field>
                </div>
              </Form>
            </div>
          </div>
          <div>
            <Button
              disabled={questionFormat === "" || fileInUse}
              content="Add Question"
              onClick={() => setOpenAddQuestion(true)}
            />
            <Button
              disabled={file.questions.length === 0}
              content="View Questions"
              onClick={() => setOpenViewQuestions(true)}
            />
          </div>{" "}
        </div>
        <AddQuestionToTextFile
          isOpen={openAddQuestion}
          fileID={file.key}
          format={questionFormat}
          addQuestion={addQuestion}
          close={() => setOpenAddQuestion(false)}
        />
        <TextFileQuestionsView
          isOpen={openViewQuestions}
          questions={file.questions}
          fileInUse={fileInUse}
          removeQuestion={removeQuestion}
          close={() => setOpenViewQuestions(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default TextFile;
