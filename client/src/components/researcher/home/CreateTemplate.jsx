import { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Form,
  Header,
  Segment,
  Modal,
  Dropdown,
} from "semantic-ui-react";
import Axios from "axios";

const CreateTemplate = ({ isOpen, close }) => {
  const [scrollTextID, setScrollTextID] = useState("");
  const [speedTextID, setSpeedTextID] = useState("");
  const [comprehension, setComprehension] = useState(true);
  const [textOptions, setTextOptions] = useState([]);
  const [displayScrollTextError, setDisplayScrollTextError] = useState(false);
  const [displaySpeedTextError, setDisplaySpeedTextError] = useState(false);

  useEffect(() => {
    fetchTextFiles();
  }, []);

  async function fetchTextFiles() {
    Axios.get("http://localhost:3001/getTextFiles")
      .then((response) => {
        const files = response.data;
        const options = [];
        files.forEach((file) => {
          options.push({
            key: file._id,
            value: file._id,
            text: file.fileName,
          });
        });
        setTextOptions(options);
      })
      .catch((error) => {
        console.log("Error fetching text files:", error);
      });
  }

  async function handleCreate() {
    if (scrollTextID === "") {
      setDisplayScrollTextError(true);
      if (speedTextID === "") {
        setDisplaySpeedTextError(true);
      }
      return;
    }
    if (speedTextID === "") {
      setDisplaySpeedTextError(true);
      return;
    }

    const questionFormat = comprehension ? "comprehension" : "inline";
    const template = {
      scrollTextFileID: scrollTextID,
      speedTextFileID: speedTextID,
      questionFormat: questionFormat,
      createdAt: new Date(),
    };

    Axios.post("http://localhost:3001/createSessionTemplate", template)
      .then(() => {
        handleClose(true);
      })
      .catch((error) => {
        console.log("Error creating session template:", error);
      });
  }

  const textError = (testType, displayError) => {
    if (displayError) {
      return (
        <label style={{ padding: 10, float: "right", color: "red" }}>
          Please select a file for the {testType} test!
        </label>
      );
    }
  };

  const handleSelectScrollText = (e, data) => {
    setScrollTextID(data.value);
    setDisplayScrollTextError(false);
  };

  const handleSelectSpeedText = (e, data) => {
    setSpeedTextID(data.value);
    setDisplaySpeedTextError(false);
  };

  const handleClose = (templateCreated) => {
    setScrollTextID("");
    setSpeedTextID("");
    setComprehension(true);
    setDisplayScrollTextError(false);
    setDisplaySpeedTextError(false);
    close(templateCreated);
  };

  const textSelectionPlaceholder = textOptions[0] ? textOptions[0].text : "";

  return (
    <Modal open={isOpen} style={{ padding: 10 }}>
      <h1>Create a Session Template</h1>
      <Divider />
      <div>
        <Segment compact>
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
              options={textOptions}
              onChange={handleSelectScrollText}
            />
          </div>
          {textError("scroll", displayScrollTextError)}
        </Segment>

        <Segment compact>
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
              options={textOptions}
              onChange={handleSelectSpeedText}
            />
          </div>
          {textError("speed", displaySpeedTextError)}
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

      <Button primary content="Create" onClick={handleCreate} />
      <Button content="Cancel" onClick={() => handleClose(false)} />
    </Modal>
  );
};

export default CreateTemplate;
