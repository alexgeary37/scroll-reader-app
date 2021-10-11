import { useState } from "react";
import {
  Button,
  Divider,
  Form,
  Header,
  Segment,
  Modal,
  Dropdown,
  List,
  Input,
} from "semantic-ui-react";
import axios from "axios";
import ScrollTextListItem from "./ScrollTextListItem";

const CreateTemplate = ({ isOpen, close, textFiles }) => {
  const [templateName, setTemplateName] = useState("");
  const [speedTextIDs, setSpeedTextIDs] = useState([]);
  const [speedTestInstructions, setSpeedTestInstructions] = useState("");
  const [scrollTexts, setScrollTexts] = useState([]);
  const [comprehension, setComprehension] = useState(true);
  const [displayMissingInputError, setDisplayMissingInputError] =
    useState(false);

  const checkFormInputs = () => {
    let emptyFields = false;

    if (templateName === "") {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (speedTextIDs.length === 0) {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (scrollTexts.length === 0) {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (speedTestInstructions === "") {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    for (let i = 0; i < scrollTexts.length; i++) {
      if (scrollTexts[i].instructions.main === "") {
        setDisplayMissingInputError(true);
        emptyFields = true;
        break;
      }
    }

    return emptyFields;
  };

  const handleCreate = () => {
    const emptyFields = checkFormInputs();

    if (!emptyFields) {
      // Set files field.
      const files = [];
      for (let i = 0; i < scrollTexts.length; i++) {
        files.push({
          fileID: scrollTexts[i].fileID,
          instructions: scrollTexts[i].instructions,
          questions: scrollTexts[i].questions,
        });
      }

      const questionFormat = comprehension ? "comprehension" : "inline";
      const template = {
        name: templateName,
        speedTest: {
          fileIDs: speedTextIDs,
          instructions: speedTestInstructions,
        },
        scrollTexts: files,
        questionFormat: questionFormat,
        createdAt: new Date(),
      };

      axios
        .post("http://localhost:3001/createSessionTemplate", template)
        .then((response) => {
          handleClose(true, response.data);
        })
        .catch((error) => {
          console.error("Error creating session template:", error);
        });
    }
  };

  const handleSelectScrollText = (e, data) => {
    if (e.target.className === "delete icon") {
      for (let i = 0; i < data.options.length; i++) {
        const optionIndex = data.value.indexOf(data.options[i].value);

        // IF this element is not found in data.value array, and it is still
        // in scrollTexts, remove it from scrollTexts.
        if (
          optionIndex === -1 &&
          scrollTexts.some((elem) => elem.fileID === data.options[i].value)
        ) {
          setScrollTexts(
            scrollTexts.filter((elem) => elem.fileID !== data.options[i].value)
          );
          break;
        }
      }
    } else if (data.value.length > 0) {
      setScrollTexts([
        ...scrollTexts,
        {
          fileID: data.value[data.value.length - 1],
          fileName: data.options.find(
            (file) => file.value === data.value[data.value.length - 1]
          ).name,
          instructions: {
            main: "",
            familiarityQuestion: true,
            interestQuestion: true,
          },
          questions: [],
        },
      ]);
    }
  };

  const handleAddQuestion = (text, question) => {
    const index = scrollTexts.indexOf(text);
    let tempScrollTexts = scrollTexts;
    tempScrollTexts[index].questions.push(question);
    setScrollTexts(tempScrollTexts);
  };

  const setScrollTextInstructions = (text, instructions) => {
    const index = scrollTexts.indexOf(text);
    let tempScrollTexts = scrollTexts;
    tempScrollTexts[index].instructions.main = instructions;
    setScrollTexts(tempScrollTexts);
  };

  const setAskQuestion = (text, question) => {
    const index = scrollTexts.indexOf(text);
    let tempScrollTexts = scrollTexts;
    if (question === "familiarity") {
      const ask = !tempScrollTexts[index].instructions.familiarityQuestion;
      tempScrollTexts[index].instructions.familiarityQuestion = ask;
    }
    if (question === "interest") {
      const ask = !tempScrollTexts[index].instructions.interestQuestion;
      tempScrollTexts[index].instructions.interestQuestion = ask;
    }
    setScrollTexts(tempScrollTexts);
  };

  const clearData = () => {
    setTemplateName("");
    setSpeedTextIDs([]);
    setScrollTexts([]);
    setSpeedTestInstructions("");
    setComprehension(true);
    setDisplayMissingInputError(false);
  };

  const handleClose = (templateCreated, responseData) => {
    clearData();

    if (templateCreated) {
      const speedTextFileNames = [];
      responseData.speedTest.fileIDs.forEach((fileID) => {
        speedTextFileNames.push(textFiles.find((tf) => tf.key === fileID).name);
      });

      const scrollTexts = [];
      responseData.scrollTexts.forEach((fileObj) =>
        scrollTexts.push({
          name: textFiles.find((tf) => tf.key === fileObj.fileID).name,
          instructions: fileObj.instructions,
          questions: fileObj.questions,
        })
      );

      const template = {
        key: responseData._id,
        name: responseData.name,
        speedTest: {
          fileNames: speedTextFileNames,
          instructions: responseData.speedTest.instructions,
        },
        scrollTexts: scrollTexts,
        questionFormat: responseData.questionFormat,
        createdAt: responseData.createdAt,
        url: responseData._id,
      };

      close(true, template);
    } else {
      close(false, null);
    }
  };

  const displayScrollTexts = () => {
    return (
      <List relaxed divided>
        {scrollTexts.map((text) => (
          <ScrollTextListItem
            key={text.fileID}
            text={text}
            addQuestion={handleAddQuestion}
            setInstructions={setScrollTextInstructions}
            instructionsError={
              text.instructions.main === "" && displayMissingInputError
            }
            toggleFamiliarityQuestion={() =>
              setAskQuestion(text, "familiarity")
            }
            toggleInterestQuestion={() => setAskQuestion(text, "interest")}
          />
        ))}
      </List>
    );
  };

  return (
    <div>
      <Modal
        open={isOpen}
        style={{ height: "70vh", overflow: "auto", padding: 10 }}
      >
        <h1>Create a Session Template</h1>
        <Divider />
        <div>
          <Segment>
            <Header
              as="h3"
              content="Template Name:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Input
              type="text"
              error={templateName === "" && displayMissingInputError}
              fluid
              placeholder="Type template name here..."
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </Segment>

          <Segment>
            <Header
              as="h3"
              content="Speed Test Instructions:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Input
              type="text"
              error={speedTestInstructions === "" && displayMissingInputError}
              fluid
              placeholder="Write instructions for the speed test here..."
              onChange={(e) => setSpeedTestInstructions(e.target.value)}
            />
          </Segment>

          <Segment>
            <Header
              as="h3"
              content="Speed Texts:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder="Select texts for the speed test"
              error={speedTextIDs.length === 0 && displayMissingInputError}
              fluid
              search
              selection
              multiple
              options={textFiles}
              onChange={(e, data) => setSpeedTextIDs(data.value)}
            />
          </Segment>

          <Segment>
            <Header
              as="h3"
              content="Scrollable Texts:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder="Select texts for the scroll test"
              error={scrollTexts.length === 0 && displayMissingInputError}
              fluid
              search
              selection
              multiple
              options={textFiles}
              onChange={handleSelectScrollText}
            />
            {displayScrollTexts()}
          </Segment>
        </div>

        <Segment>
          <Form>
            <div className="grouped fields">
              <Header as="h3" content="Question Format:" />
              <Form.Field>
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={comprehension}
                    onChange={() => setComprehension(true)}
                  />
                  <label>Comprehension</label>
                </div>
              </Form.Field>
              <Form.Field>
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={!comprehension}
                    onChange={() => setComprehension(false)}
                  />
                  <label>Inline</label>
                </div>
              </Form.Field>
            </div>
          </Form>
        </Segment>

        <Button
          floated="right"
          content="Cancel"
          onClick={() => handleClose(false, null)}
        />
        <Button
          floated="right"
          primary
          content="Create"
          onClick={handleCreate}
        />
      </Modal>
    </div>
  );
};

export default CreateTemplate;
