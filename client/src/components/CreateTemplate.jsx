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

  const handleQuestionFormatChange = () => {
    setComprehension(!comprehension);
  };

  async function handleCreate() {
    const questionFormat = comprehension ? "comprehension" : "inline";
    const template = {
      scrollTextFile: scrollFile,
      speedTextFile: speedFile,
      questionFormat: questionFormat,
    };

    Axios.post("http://localhost:3001/createSessionTemplate", template).catch(
      (error) => {
        console.log("Error creating session template:", error);
      }
    );

    close();
  }

  return (
    <Modal open={isOpen} style={{ padding: 10 }}>
      <h1>Create a Session Template</h1>
      <Divider />
      <div>
        <Segment basic>
          <div className="wrapper">
            <Header
              as="h3"
              content="Scrollable Text:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <FileInput setFile={setScrollFile} />
          </div>
        </Segment>

        <Segment basic>
          <div className="wrapper">
            <Header
              as="h3"
              content="Speed Text:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <FileInput setFile={setSpeedFile} />
          </div>
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
                  name="example2"
                  checked={comprehension}
                  onChange={handleQuestionFormatChange}
                />
                <label>Comprehension</label>
              </div>
            </Form.Field>
            <Form.Field>
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  name="example2"
                  checked={!comprehension}
                  onChange={handleQuestionFormatChange}
                />
                <label>Inline</label>
              </div>
            </Form.Field>
          </div>
        </Form>
      </Segment>

      <Button positive content="Create" onClick={handleCreate} />
      <Button content="Cancel" onClick={() => close()} />
    </Modal>
  );
};

export default CreateTemplate;
