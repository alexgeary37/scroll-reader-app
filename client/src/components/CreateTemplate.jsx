import { useState } from "react";
import { Button, Divider, Form, Header, Segment } from "semantic-ui-react";
import FileInput from "./FileInput";

const CreateTemplate = () => {
  const [comprehension, setComprehension] = useState(true);

  const handleQuestionFormatChange = () => {
    setComprehension(!comprehension);
  };

  const handleCreate = () => {
    // Send sessiontemplate to db
  };

  return (
    <div>
      <h1>Create Session Template</h1>
      <Divider />
      <div>
        <Segment basic>
          <div className="wrapper">
            <Header
              as="h3"
              content="Scrollable Text:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <FileInput />
          </div>
        </Segment>

        <Segment basic>
          <div className="wrapper">
            <Header as="h3" content="Speed Text:" style={{ paddingTop: 5, marginRight: 10 }} />
            <FileInput />
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
    </div>
  );
};

export default CreateTemplate;
