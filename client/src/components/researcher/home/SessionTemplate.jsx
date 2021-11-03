import { List, Item, Button } from "semantic-ui-react";
import SessionTemplateView from "./SessionTemplateView";
import { useState } from "react";

const SessionTemplate = ({ template, textFiles }) => {
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
            {template.speedTest.texts.map((text) => (
              <Item key={text.fileID}>
                <Item.Content>
                  <Item.Description
                    content={`${template.speedTest.texts.indexOf(text) + 1}. ${
                      text.name
                    }`}
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
              <Item key={text.fileID}>
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
            content={`Question Format: ${
              // Get the questionFormat from the first textFile used in template.scrollTexts
              textFiles[
                textFiles.indexOf(
                  textFiles.find(
                    (file) => file.value === template.scrollTexts[0].fileID
                  )
                )
              ].questionFormat
            }`}
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
          isOpen={openTemplateView}
          template={template}
          textFiles={textFiles}
          close={() => setOpenTemplateView(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default SessionTemplate;
