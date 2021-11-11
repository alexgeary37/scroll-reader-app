import { useState } from "react";
import { Item, Icon, Button } from "semantic-ui-react";
import DeleteTextModal from "./textFiles/DeleteTextModal";
import TextFileQuestionsView from "./textFiles/TextFileQuestionsView";
import TextFileStylesView from "./textFiles/TextFileStylesView";
import TextFileTextView from "./textFiles/TextFileTextView";

const TextFile = ({
  file,
  usedInTemplate,
  usedAsScrollText,
  updateFileQuestions,
  removeQuestion,
  updateFileStyles,
  removeStyle,
  deleteFile,
}) => {
  const [openViewQuestions, setOpenViewQuestions] = useState(false);
  const [openViewStyles, setOpenViewStyles] = useState(false);
  const [openTextFileTextView, setOpenTextFileTextView] = useState(false);
  const [openDeleteTextModal, setOpenDeleteTextModal] = useState(false);

  return (
    <Item>
      <Icon size="large" name="file outline" />
      <Item.Content>
        <div className="wrapper">
          <div>
            <Item.Header as="h4" style={{ margin: 5 }} content={file.name} />
            <Item.Description content={`Uploaded: ${file.uploadedAt}`} />
            <Item.Description
              content={`Question Format: ${file.questionFormat}`}
            />
          </div>

          <div className="ui vertical buttons">
            <Button
              content="Questions"
              onClick={() => setOpenViewQuestions(true)}
            />
            <Button content="Styles" onClick={() => setOpenViewStyles(true)} />
          </div>

          <div className="ui vertical buttons" style={{ marginLeft: 5 }}>
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
        </div>

        <TextFileQuestionsView
          isOpen={openViewQuestions}
          fileID={file.key}
          questions={file.questions}
          format={file.questionFormat}
          usedAsScrollText={usedAsScrollText}
          updateFileQuestions={updateFileQuestions}
          removeQuestion={removeQuestion}
          close={() => setOpenViewQuestions(false)}
        />
        <TextFileStylesView
          isOpen={openViewStyles}
          fileID={file.value}
          styles={file.styles}
          usedInTemplate={usedInTemplate}
          updateFileStyles={updateFileStyles}
          removeStyle={removeStyle}
          close={() => setOpenViewStyles(false)}
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
