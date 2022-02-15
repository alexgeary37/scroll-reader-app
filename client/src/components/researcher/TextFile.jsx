import { useState } from "react";
import { Item, Icon, Button } from "semantic-ui-react";
import ConfirmDeleteTextMessage from "./textFiles/ConfirmDeleteTextMessage";
import TextFileQuestionsView from "./textFiles/TextFileQuestionsView";
import TextFileTextView from "./textFiles/TextFileTextView";

const TextFile = ({
  file,
  usedInTemplate,
  updateFileQuestions,
  removeQuestion,
  deleteFile,
}) => {
  const [openTextFileQuestionsView, setOpenTextFileQuestionsView] =
    useState(false);
  const [openTextFileTextView, setOpenTextFileTextView] = useState(false);
  const [openConfirmDeleteTextMessage, setOpenConfirmDeleteTextMessage] =
    useState(false);

  return (
    <Item>
      <Icon size="large" name="file outline" />
      <Item.Content>
        <div className="wrapper">
          <div>
            <Item.Header as="h4" style={{ margin: 5 }} content={file.name} />
            <Item.Description content={`Uploaded: ${file.uploadedAt}`} />
          </div>

          <div className="ui vertical buttons">
            <Button
              content="Questions"
              onClick={() => setOpenTextFileQuestionsView(true)}
            />
          </div>

          <div className="ui vertical buttons" style={{ marginLeft: 5 }}>
            <Button
              content="View Text"
              onClick={() => setOpenTextFileTextView(true)}
            />
            <Button
              disabled={usedInTemplate}
              content="Delete"
              onClick={() => setOpenConfirmDeleteTextMessage(true)}
            />
          </div>
        </div>

        <TextFileQuestionsView
          isOpen={openTextFileQuestionsView}
          fileID={file.key}
          questions={file.questions}
          updateFileQuestions={updateFileQuestions}
          removeQuestion={removeQuestion}
          close={() => setOpenTextFileQuestionsView(false)}
        />
        <TextFileTextView
          isOpen={openTextFileTextView}
          fileID={file.key}
          close={() => setOpenTextFileTextView(false)}
        />
        <ConfirmDeleteTextMessage
          isOpen={openConfirmDeleteTextMessage}
          answerYes={deleteFile}
          answerNo={() => setOpenConfirmDeleteTextMessage(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default TextFile;
