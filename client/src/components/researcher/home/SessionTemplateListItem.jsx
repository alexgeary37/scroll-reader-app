import { List, Item, Segment, Button } from "semantic-ui-react";
import SessionTemplateView from "./SessionTemplateView";
import { useState } from "react";

const SessionTemplateListItem = ({ template }) => {
  const [openTemplateView, setOpenTemplateView] = useState(false);

  return (
    <Item>
      <Item.Content>
        <div onClick={() => setOpenTemplateView(true)}>
          <Item.Header as="h4" style={{ margin: 5 }} content={template.name} />

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

export default SessionTemplateListItem;
