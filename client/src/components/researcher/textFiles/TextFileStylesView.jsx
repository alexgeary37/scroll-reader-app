import { Modal, Divider, Button, Header } from "semantic-ui-react";

const TextFileStylesView = ({ isOpen, fileID, close }) => {
  //   const addStyle = (style) => {
  //     axios
  //       .put("http://localhost:3001/addTextFileQuestion", {
  //         id: fileID,
  //         question: question,
  //         answerRegion: answerRegion,
  //         questionFormat: questionFormat,
  //       })
  //       .then((response) => {
  //         // Return the latest question just added.
  //         const newQuestion = response.data.questions.at(-1);
  //         updateFileQuestions(newQuestion, questionFormat);
  //       })
  //       .catch((error) => {
  //         console.error(
  //           "Error updating file.questions and file.questionFormat:",
  //           error
  //         );
  //       });
  //   };

  return (
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Header as="h4" content="Styles" />

      <Button
        positive
        // disabled={}
        content="Add Style"
        // onClick={() => setOpenAddQuestion(true)}
      />
      {/* <List ordered divided relaxed>
        {styles.map((style) => (
          <Item key={style._id}>
            <div className="wrapper">
              <Item.Description content={style.............} />
              
              <Button
                floated="right"
                // disabled={usedAsScrollText}
                content="Remove"
                onClick={() => removeStyle(style)}
              />
            </div>
          </Item>
        ))}
      </List> */}
      <Divider />
      <Button floated="right" content="Close" onClick={close} />

      {/* <AddQuestionToTextFile
        isOpen={openAddQuestion}
        fileID={fileID}
        format={questionFormat}
        addQuestion={addQuestion}
        close={() => setOpenAddQuestion(false)}
      /> */}
    </Modal>
  );
};

export default TextFileStylesView;
