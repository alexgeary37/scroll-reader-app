import { useState } from "react";
import {
  Button,
  Divider,
  Form,
  Header,
  Segment,
  Modal,
  Dropdown,
  Input,
} from "semantic-ui-react";
import axios from "axios";

const CreateTemplate = ({ isOpen, close, textFiles }) => {
  const [templateName, setTemplateName] = useState("");
  const [speedTextIDs, setSpeedTextIDs] = useState([]);
  const [scrollTextIDs, setScrollTextIDs] = useState([]);
  const [speedTestInstructions, setSpeedTestInstructions] = useState(
    "SpeedTest Instructions"
  );
  const [scrollTestInstructions, setScrollTestInstructions] = useState(
    "ScrollTest Instructions"
  );
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

  const handleCreate = () => {
    let emptyFields = false;

    if (templateName === "") {
      setDisplayTemplateNameError(true);
      emptyFields = true;
    }
    if (speedTextIDs.length === 0) {
      setDisplaySpeedTextError(true);
      emptyFields = true;
    }
    if (scrollTextIDs.length === 0) {
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

    if (emptyFields) {
      return;
    }

    const questionFormat = comprehension ? "comprehension" : "inline";
    const template = {
      name: templateName,
      speedTest: {
        fileIDs: speedTextIDs,
        instructions: speedTestInstructions,
      },
      scrollTest: {
        fileIDs: scrollTextIDs,
        instructions: scrollTestInstructions,
      },
      questionFormat: questionFormat,
      createdAt: new Date(),
    };

    axios.post("http://localhost:3001/createSessionTemplate", template)
      .then((response) => {
        handleClose(true, response.data);
      })
      .catch((error) => {
        console.error("Error creating session template:", error);
      });
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

  const handleSpeedTestInstructionsChange = (event) => {
    setSpeedTestInstructions(event.target.value);
    setDisplaySpeedTestInstructionsError(false);
  };

  const handleSelectScrollText = (e, data) => {
    setScrollTextIDs(data.value);
    setDisplayScrollTextError(false);
  };

  const handleScrollTestInstructionsChange = (event) => {
    setScrollTestInstructions(event.target.value);
    setDisplayScrollTestInstructionsError(false);
  };

  const handleClose = (templateCreated, responseData) => {
    setTemplateName("");
    setSpeedTextIDs([]);
    setScrollTextIDs([]);
    setSpeedTestInstructions("");
    setScrollTestInstructions("");
    setComprehension(true);
    setDisplayTemplateNameError(false);
    setDisplaySpeedTextError(false);
    setDisplayScrollTextError(false);
    setDisplaySpeedTestInstructionsError(false);
    setDisplayScrollTestInstructionsError(false);

    if (templateCreated) {
      const speedTextFileNames = [];
      responseData.speedTest.fileIDs.forEach((fileID) => {
        speedTextFileNames.push(textFiles.find((tf) => tf.key === fileID).name);
      });

      const scrollTextFileNames = [];
      responseData.scrollTest.fileIDs.forEach((fileID) => {
        scrollTextFileNames.push(
          textFiles.find((tf) => tf.key === fileID).name
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

  const textSelectionPlaceholder = textFiles[0] ? textFiles[0].text : "";

  return (
    <Modal open={isOpen} style={{ padding: 10 }}>
      <h1>Create a Session Template</h1>
      <Divider />
      <div>
        <Segment basic compact>
          <div className="wrapper">
            <Header
              as="h3"
              content="Template Name:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Input
              type="text"
              placeholder="Type template name here..."
              onChange={handleTemplateNameChange}
            />
          </div>
          {nameError()}
        </Segment>

        <Segment basic compact>
          <div className="wrapper">
            <Header
              as="h3"
              content="Speed Text:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder={textSelectionPlaceholder}
              fluid
              search
              selection
              multiple
              options={textFiles}
              onChange={handleSelectSpeedText}
            />
          </div>
          {textError("speed", displaySpeedTextError)}
        </Segment>

        <Segment basic compact>
          <div className="wrapper">
            <Header
              as="h3"
              content="Scrollable Text:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder={textSelectionPlaceholder}
              fluid
              search
              selection
              multiple
              options={textFiles}
              onChange={handleSelectScrollText}
            />
          </div>
          {textError("scroll", displayScrollTextError)}
        </Segment>
      </div>

      <Segment basic>
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

      <Button floated="right" primary content="Create" onClick={handleCreate} />
      <Button
        floated="right"
        content="Cancel"
        onClick={() => handleClose(false, null)}
      />
    </Modal>
  );
};

export default CreateTemplate;
