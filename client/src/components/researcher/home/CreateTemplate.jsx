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
  Item,
} from "semantic-ui-react";
import axios from "axios";

const CreateTemplate = ({ isOpen, close, textFiles }) => {
  const [templateName, setTemplateName] = useState("");
  const [speedTextIDs, setSpeedTextIDs] = useState([]);
  const [scrollTextIDs, setScrollTextIDs] = useState([]);
  const [questionIDs, setQuestionIDs] = useState([]);
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
  const [openAddScrollText, setOpenAddScrollText] = useState(false);

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

    return emptyFields;
  };

  const handleCreate = () => {
    const emptyFields = checkFormInputs();

    if (!emptyFields) {
      // Set fileIDs field.
      let files = [];
      for (let i = 0; i < scrollTextIDs.length; i++) {
        files.push({
          id: scrollTextIDs[i]._id,
          questionIDs: [questionIDs[i]],
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
        // in scrollTextIDs, remove it from scrollTextIDs.
        if (
          optionIndex === -1 &&
          scrollTextIDs.some((elem) => elem._id === data.options[i].value)
        ) {
          setScrollTextIDs(
            scrollTextIDs.filter((elem) => elem._id !== data.options[i].value)
          );
          break;
        }
      }
    } else if (data.value.length > 0) {
      setScrollTextIDs([
        ...scrollTextIDs,
        {
          fileName: data.options.find(
            (file) => file.value === data.value[data.value.length - 1]
          ).name,
          _id: data.value[data.value.length - 1],
        },
      ]);
      setDisplayScrollTextError(false);
    }
  };

  const handleAddScrollText = () => {
    setOpenAddScrollText(true);
  };

  const closeAddScrollText = () => {
    setOpenAddScrollText(false);
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
    setScrollTextIDs([]);
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
      responseData.scrollTest.fileIDs.forEach((fileIDObj) => {
        scrollTextFileNames.push(
          textFiles.find((tf) => tf.key === fileIDObj.id).name
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
            <List relaxed divided>
              {scrollTextIDs.map((text) => (
                <Item key={text._id}>
                  <Item.Content>
                    <Item.Header
                      as="h4"
                      style={{ margin: 5 }}
                      content={text.fileName}
                    />
                    <Item.Description
                      style={{ margin: 5 }}
                      content={`Uploaded:`}
                    />
                  </Item.Content>
                </Item>
              ))}
            </List>
            {/*
            <Button content="Add Scroll text" onClick={handleAddScrollText} />
             <Modal size="tiny" open={openAddScrollText}>
              
              <Button content="Add" />
              <Button content="Cancel" onClick={closeAddScrollText} />
            </Modal> */}
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
          primary
          content="Create"
          onClick={handleCreate}
        />
        <Button
          floated="right"
          content="Cancel"
          onClick={() => handleClose(false, null)}
        />
      </Modal>
    </div>
  );
};

export default CreateTemplate;
