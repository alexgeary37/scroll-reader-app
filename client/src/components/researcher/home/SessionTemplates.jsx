import { useState } from "react";
import { Header, Segment, List, Item, Button } from "semantic-ui-react";
import CreateTemplate from "./templateCreation/CreateTemplate";

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
              <Item.Header
                as="h4"
                style={{ margin: 5 }}
                content={template.name}
              />

              <Item.Description
                as="h5"
                style={{ margin: 5 }}
                content="Speedtest texts:"
              />
              <List style={{ marginLeft: 10 }} horizontal divided>
                {template.speedFileNames.map((name) => (
                  <Item key={name}>
                    <Item.Content>
                      <Item.Description
                        content={`${
                          template.speedFileNames.indexOf(name) + 1
                        }. ${name}`}
                      />
                    </Item.Content>
                  </Item>
                ))}
              </List>

              <Item.Description
                as="h5"
                style={{ margin: 5 }}
                content="Scrolltest texts:"
              />
              <List style={{ marginLeft: 10 }} horizontal divided>
                {template.scrollFileNames.map((name) => (
                  <Item key={name}>
                    <Item.Content>
                      <Item.Description
                        content={`${
                          template.scrollFileNames.indexOf(name) + 1
                        }. ${name}`}
                      />
                    </Item.Content>
                  </Item>
                ))}
              </List>

              <Item.Description
                style={{ margin: 5 }}
                content={`Question Format: ${template.questionFormat}`}
              />

              <Item.Description
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
