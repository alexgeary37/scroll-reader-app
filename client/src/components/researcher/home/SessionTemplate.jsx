import { List, Item, Button, Segment } from "semantic-ui-react";
import SessionTemplateView from "./SessionTemplateView";
import { useState } from "react";

const SessionTemplate = ({ template }) => {
  const [openTemplateView, setOpenTemplateView] = useState(false);

  return (
    <Item>
      <Item.Content>
        <div onClick={() => setOpenTemplateView(true)}>
          <Item.Header as="h3" style={{ margin: 5 }} content={template.name} />

          <Item.Description
            as="h5"
            style={{ margin: 5 }}
            content="Speedtest texts:"
          />
          <List style={{ marginLeft: 20 }} horizontal divided>
            {template.speedTest.fileNames.map((name) => (
              <Item key={name}>
                <Item.Content>
                  <Item.Description
                    content={`${
                      template.speedTest.fileNames.indexOf(name) + 1
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
          <List style={{ marginLeft: 20 }} horizontal divided>
            {template.scrollTexts.map((text) => (
              <Item key={text.name}>
                <Item.Content>
                  <Item.Description
                    content={`${template.scrollTexts.indexOf(text) + 1}. ${
                      text.name
                    }`}
                  />
                </Item.Content>
              </Item>
            ))}
          </List>

          <Item.Description
            style={{ margin: 5 }}
            content={`Question Format: ${template.questionFormat}`}
          />
        </div>
        <div className="wrapper">
          <Item.Description
            style={{ margin: 5 }}
            content={`URL: ${template.url}`}
          />

          <Button
            content="Copy URL"
            onClick={() => navigator.clipboard.writeText(template.url)}
          />
        </div>

        <SessionTemplateView
          template={template}
          isOpen={openTemplateView}
          close={() => setOpenTemplateView(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default SessionTemplate;
