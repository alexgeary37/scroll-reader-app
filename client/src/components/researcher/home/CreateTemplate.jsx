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
import Axios from "axios";

const CreateTemplate = ({ isOpen, close, textFiles }) => {
  const [templateName, setTemplateName] = useState("");
  const [scrollTextID, setScrollTextID] = useState("");
  const [speedTextID, setSpeedTextID] = useState("");
  const [comprehension, setComprehension] = useState(true);
  const [displayTemplateNameError, setDisplayTemplateNameError] =
    useState(false);
  const [displayScrollTextError, setDisplayScrollTextError] = useState(false);
  const [displaySpeedTextError, setDisplaySpeedTextError] = useState(false);

  const handleCreate = () => {
    let emptyFields = false;

    if (templateName === "") {
      setDisplayTemplateNameError(true);
      emptyFields = true;
    }
    if (scrollTextID === "") {
      setDisplayScrollTextError(true);
      emptyFields = true;
    }
    if (speedTextID === "") {
      setDisplaySpeedTextError(true);
      emptyFields = true;
    }

    if (emptyFields) {
      return;
    }

    const questionFormat = comprehension ? "comprehension" : "inline";
    const template = {
      name: templateName,
      scrollTextFileID: scrollTextID,
      speedTextFileID: speedTextID,
      questionFormat: questionFormat,
      createdAt: new Date(),
    };

    Axios.post("http://localhost:3001/createSessionTemplate", template)
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

  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
    setDisplayTemplateNameError(false);
  };

  const handleSelectScrollText = (e, data) => {
    setScrollTextID(data.value);
    setDisplayScrollTextError(false);
  };

  const handleSelectSpeedText = (e, data) => {
    setSpeedTextID(data.value);
    setDisplaySpeedTextError(false);
  };

  const handleClose = (templateCreated, responseData) => {
    setTemplateName("");
    setScrollTextID("");
    setSpeedTextID("");
    setComprehension(true);
    setDisplayTemplateNameError(false);
    setDisplayScrollTextError(false);
    setDisplaySpeedTextError(false);

    if (templateCreated) {
      const scrollTextFileName = textFiles.find(
        (tf) => tf.key === responseData.scrollTextFileID
      ).name;

      const speedTextFileName = textFiles.find(
        (tf) => tf.key === responseData.speedTextFileID
      ).name;

      const template = {
        key: responseData._id,
        name: responseData.name,
        scrollFileName: scrollTextFileName,
        speedFileName: speedTextFileName,
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
              content="Scrollable Text:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder={textSelectionPlaceholder}
              fluid
              search
              selection
              options={textFiles}
              onChange={handleSelectScrollText}
            />
          </div>
          {textError("scroll", displayScrollTextError)}
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
              options={textFiles}
              onChange={handleSelectSpeedText}
            />
          </div>
          {textError("speed", displaySpeedTextError)}
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

      <Button primary content="Create" onClick={handleCreate} />
      <Button content="Cancel" onClick={() => handleClose(false, null)} />
    </Modal>
  );
};

export default CreateTemplate;
