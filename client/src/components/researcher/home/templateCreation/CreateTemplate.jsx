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
  const [scrollTexts, setScrollTexts] = useState([]);
  const [speedTestInstructions, setSpeedTestInstructions] = useState("");
  const [scrollTestInstructions, setScrollTestInstructions] = useState("");
  const [comprehension, setComprehension] = useState(true);
  const [displayTemplateNameError, setDisplayTemplateNameError] =
    useState(false);
  const [displaySpeedTextError, setDisplaySpeedTextError] = useState(false);
  const [displayScrollTextError, setDisplayScrollTextError] = useState(false);
  const [
    displaySpeedTestInstructionsError,
    setDisplaySpeedTestInstructionsError,
  ] = useState(false);
  const [
    displayScrollTestInstructionsError,
    setDisplayScrollTestInstructionsError,
  ] = useState(false);

  const checkFormInputs = () => {
    let emptyFields = false;

    if (templateName === "") {
      setDisplayTemplateNameError(true);
      emptyFields = true;
    }
    if (speedTextIDs.length === 0) {
      setDisplaySpeedTextError(true);
      emptyFields = true;
    }
    if (scrollTexts.length === 0) {
      setDisplayScrollTextError(true);
      emptyFields = true;
    }
    if (speedTestInstructions === "") {
      setDisplaySpeedTestInstructionsError(true);
      emptyFields = true;
    }
    if (scrollTestInstructions === "") {
      setDisplayScrollTestInstructionsError(true);
      emptyFields = true;
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
          _id: scrollTexts[i]._id,
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
        scrollTest: {
          files: files,
          instructions: scrollTestInstructions,
        },
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

  const nameError = () => {
    if (displayTemplateNameError) {
      return (
        <label style={{ padding: 10, float: "right", color: "red" }}>
          Template must be given a name!
        </label>
      );
    }
  };

  const textError = (testType, displayError) => {
    if (displayError) {
      return (
        <label style={{ padding: 10, float: "right", color: "red" }}>
          Please select a file for the {testType} test!
        </label>
      );
    }
  };

  const instructionsError = (testType, displayError) => {
    if (displayError) {
      return (
        <label style={{ padding: 10, float: "right", color: "red" }}>
          Please write instructions for the {testType} test!
        </label>
      );
    }
  };

  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
    setDisplayTemplateNameError(false);
  };

  const handleSelectSpeedText = (e, data) => {
    setSpeedTextIDs(data.value);
    setDisplaySpeedTextError(false);
  };

  const handleSelectScrollText = (e, data) => {
    if (e.target.className === "delete icon") {
      for (let i = 0; i < data.options.length; i++) {
        const optionIndex = data.value.indexOf(data.options[i].value);

        // IF this element is not found in data.value array, and it is still
        // in scrollTexts, remove it from scrollTexts.
        if (
          optionIndex === -1 &&
          scrollTexts.some((elem) => elem._id === data.options[i].value)
        ) {
          setScrollTexts(
            scrollTexts.filter((elem) => elem._id !== data.options[i].value)
          );
          break;
        }
      }
    } else if (data.value.length > 0) {
      setScrollTexts([
        ...scrollTexts,
        {
          _id: data.value[data.value.length - 1],
          fileName: data.options.find(
            (file) => file.value === data.value[data.value.length - 1]
          ).name,
          questions: [],
        },
      ]);
      setDisplayScrollTextError(false);
    }
  };

  const handleAddQuestion = (text, question) => {
    const index = scrollTexts.indexOf(text);
    let tempScrollTexts = scrollTexts;
    tempScrollTexts[index].questions.push(question);
    setScrollTexts(tempScrollTexts);
  };

  const handleSpeedTestInstructionsChange = (event) => {
    setSpeedTestInstructions(event.target.value);
    setDisplaySpeedTestInstructionsError(false);
  };

  const handleScrollTestInstructionsChange = (event) => {
    setScrollTestInstructions(event.target.value);
    setDisplayScrollTestInstructionsError(false);
  };

  const clearData = () => {
    setTemplateName("");
    setSpeedTextIDs([]);
    setScrollTexts([]);
    setSpeedTestInstructions("");
    setScrollTestInstructions("");
    setComprehension(true);
    setDisplayTemplateNameError(false);
    setDisplaySpeedTextError(false);
    setDisplayScrollTextError(false);
    setDisplaySpeedTestInstructionsError(false);
    setDisplayScrollTestInstructionsError(false);
  };

  const handleClose = (templateCreated, responseData) => {
    clearData();

    if (templateCreated) {
      const speedTextFileNames = [];
      responseData.speedTest.fileIDs.forEach((fileID) => {
        speedTextFileNames.push(textFiles.find((tf) => tf.key === fileID).name);
      });

      const scrollTextFileNames = [];
      responseData.scrollTest.files.forEach((fileObj) => {
        scrollTextFileNames.push(
          textFiles.find((tf) => tf.key === fileObj._id).name
        );
      });

      const template = {
        key: responseData._id,
        name: responseData.name,
        speedFileNames: speedTextFileNames,
        scrollFileNames: scrollTextFileNames,
        questionFormat: responseData.questionFormat,
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
            key={text._id}
            text={text}
            addQuestion={handleAddQuestion}
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
              fluid
              placeholder="Type template name here..."
              onChange={handleTemplateNameChange}
            />
            {nameError()}
          </Segment>

          <Segment>
            <Header
              as="h3"
              content="Speed Test Instructions:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Input
              type="text"
              fluid
              placeholder="Write instructions for the speed test here..."
              onChange={handleSpeedTestInstructionsChange}
            />
            {instructionsError("speed", displaySpeedTestInstructionsError)}
          </Segment>

          <Segment>
            <Header
              as="h3"
              content="Speed Texts:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder="Select texts for the speed test"
              fluid
              search
              selection
              multiple
              options={textFiles}
              onChange={handleSelectSpeedText}
            />
            {textError("speed", displaySpeedTextError)}
          </Segment>

          <Segment>
            <Header
              as="h3"
              content="Scroll Test Instructions:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Input
              type="text"
              fluid
              placeholder="Write instructions for the scroll test here..."
              onChange={handleScrollTestInstructionsChange}
            />
            {instructionsError("scroll", displayScrollTestInstructionsError)}
          </Segment>

          <Segment>
            <Header
              as="h3"
              content="Scrollable Texts:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder="Select texts for the scroll test"
              fluid
              search
              selection
              multiple
              options={textFiles}
              onChange={handleSelectScrollText}
            />
            {displayScrollTexts()}
            {textError("scroll", displayScrollTextError)}
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
                    onChange={() => setComprehension(!comprehension)}
                  />
                  <label>Comprehension</label>
                </div>
              </Form.Field>
              <Form.Field>
                <div className="ui radio checkbox">
                  <input
                    type="radio"
                    checked={!comprehension}
                    onChange={() => setComprehension(!comprehension)}
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
