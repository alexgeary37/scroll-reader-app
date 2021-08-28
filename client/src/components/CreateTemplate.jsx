import { useState } from "react";
import {
  Button,
  Divider,
  Form,
  Header,
  Segment,
  Modal,
} from "semantic-ui-react";
import FileInput from "./FileInput";
import Axios from "axios";

const CreateTemplate = ({ isOpen, close }) => {
  const [comprehension, setComprehension] = useState(true);
  const [scrollFile, setScrollFile] = useState({});
  const [speedFile, setSpeedFile] = useState({});
  const [displayScrollFileError, setDisplayScrollFileError] = useState(false);
  const [displaySpeedFileError, setDisplaySpeedFileError] = useState(false);

  async function handleCreate() {
    if (scrollFile.fileName === undefined) {
      setDisplayScrollFileError(true);
      if (speedFile.fileName === undefined) {
        setDisplaySpeedFileError(true);
      }
      return;
    }
    if (speedFile.fileName === undefined) {
      setDisplaySpeedFileError(true);
      return;
    }

    const questionFormat = comprehension ? "comprehension" : "inline";
    const template = {
      scrollTextFile: scrollFile,
      speedTextFile: speedFile,
      questionFormat: questionFormat,
    };

    Axios.post("http://localhost:3001/createSessionTemplate", template)
      .then(() => {
        handleClose(true);
      })
      .catch((error) => {
        console.log("Error creating session template:", error);
      });
  }

  const fileText = (file) => {
    if (file.fileName !== undefined) {
      return (
        <label style={{ padding: 10, float: "right" }}>{file.fileName}</label>
      );
    }
  };

  const fileError = (testType, displayError) => {
    if (displayError) {
      return (
        <label style={{ padding: 10, float: "right", color: "red" }}>
          Please select a file for the {testType} test!
        </label>
      );
    }
  };

  const handleClose = (templateCreated) => {
    setScrollFile({});
    setSpeedFile({});
    setComprehension(true);
    setDisplayScrollFileError(false);
    setDisplaySpeedFileError(false);
    close(templateCreated);
  };

  return (
    <Modal open={isOpen} style={{ padding: 10 }}>
      <h1>Create a Session Template</h1>
      <Divider />
      <div>
        <Segment basic compact>
          <div className="wrapper">
            <Header
              as="h3"
              content="Scrollable Text:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <FileInput
              setFile={setScrollFile}
              openDialog={() => setDisplayScrollFileError(false)}
            />
          </div>
          {fileText(scrollFile)}
          {fileError("scroll", displayScrollFileError)}
        </Segment>

        <Segment basic compact>
          <div className="wrapper">
            <Header
              as="h3"
              content="Speed Text:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <FileInput
              setFile={setSpeedFile}
              openDialog={() => setDisplaySpeedFileError(false)}
            />
          </div>
          {fileText(speedFile)}
          {fileError("speed", displaySpeedFileError)}
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

      <Button positive content="Create" onClick={handleCreate} />
      <Button content="Cancel" onClick={() => handleClose(false)} />
    </Modal>
  );
};

export default CreateTemplate;
