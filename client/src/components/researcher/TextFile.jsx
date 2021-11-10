import { useEffect, useState } from "react";
import { Item, Icon, Button, Form, Header } from "semantic-ui-react";
import DeleteTextModal from "./textFiles/DeleteTextModal";
import TextFileQuestionsView from "./textFiles/TextFileQuestionsView";
import TextFileTextView from "./textFiles/TextFileTextView";

const TextFile = ({
  file,
  updateFileQuestions,
  usedInTemplate,
  usedAsScrollText,
  removeQuestion,
  deleteFile,
}) => {
  const [openViewQuestions, setOpenViewQuestions] = useState(false);
  const [openTextFileTextView, setOpenTextFileTextView] = useState(false);
  const [openDeleteTextModal, setOpenDeleteTextModal] = useState(false);
  const [questionFormat, setQuestionFormat] = useState(file.questionFormat);

  useEffect(() => {
    setQuestionFormat(file.questionFormat);
  }, [file.questionFormat]);

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

          <div className="ui vertical buttons">
            <Button
              content="Questions"
              onClick={() => setOpenViewQuestions(true)}
            />
            <Button
              content="View Text"
              onClick={() => setOpenTextFileTextView(true)}
            />
            <Button
              disabled={usedInTemplate}
              content="Delete"
              onClick={() => setOpenDeleteTextModal(true)}
            />
          </div>

          <div className="ui vertical buttons" style={{ marginLeft: 5 }}>
            <Button content="Styles" />
          </div>
        </div>

        <TextFileQuestionsView
          isOpen={openViewQuestions}
          fileID={file.key}
          questions={file.questions}
          format={questionFormat}
          usedAsScrollText={usedAsScrollText}
          updateFileQuestions={updateFileQuestions}
          removeQuestion={removeQuestion}
          close={() => setOpenViewQuestions(false)}
        />
        <TextFileTextView
          isOpen={openTextFileTextView}
          fileID={file.value}
          close={() => setOpenTextFileTextView(false)}
        />
        <DeleteTextModal
          isOpen={openDeleteTextModal}
          answerYes={deleteFile}
          answerNo={() => setOpenDeleteTextModal(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default TextFile;
