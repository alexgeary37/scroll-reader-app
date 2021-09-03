import { useState } from "react";
import {
  Header,
  Segment,
  List,
  Item,
  ItemDescription,
  Button,
} from "semantic-ui-react";
import CreateTemplate from "./CreateTemplate";

const SessionTemplates = ({ templates, textFiles, appendTemplate }) => {
  const [openTemplateCreator, setOpenTemplateCreator] = useState(false);

  const handleCreateTemplate = () => {
    setOpenTemplateCreator(true);
  };

  const closeTemplateCreator = (templateCreated, template) => {
    if (templateCreated) {
      appendTemplate(template);
    }
    setOpenTemplateCreator(false);
  };

  const displaySessionTemplates = () => {
    return (
      <List relaxed divided>
        {templates.map((template) => (
          <Item key={template.key}>
            <Item.Content>
              <Header
                style={{ margin: 5 }}
                size="small"
                content={`Template name: ${template.name}`}
              />
              <ItemDescription
                style={{ margin: 5 }}
                content={`Scroll Text File: ${template.scrollFileName}`}
              />
              <ItemDescription
                style={{ margin: 5 }}
                content={`Speed Text File: ${template.speedFileName}`}
              />
              <ItemDescription
                style={{ margin: 5 }}
                content={`Question Format: ${template.questionFormat}`}
              />
              <ItemDescription
                style={{ margin: 5 }}
                content={`URL: ${template.url}`}
              />
            </Item.Content>
          </Item>
        ))}
      </List>
    );
  };

  return (
    <div>
      <Header as="h2" textAlign="center" content="Existing Templates:" />
      <div>
        <Segment basic>{displaySessionTemplates()}</Segment>
      </div>
      <Button
        style={{ marginTop: 10 }}
        positive
        content="Create Template"
        onClick={handleCreateTemplate}
      />
      <CreateTemplate
        isOpen={openTemplateCreator}
        close={closeTemplateCreator}
        textFiles={textFiles}
      />
    </div>
  );
};

export default SessionTemplates;
