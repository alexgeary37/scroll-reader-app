import { List, Item, Button } from "semantic-ui-react";
import SessionTemplateView from "./SessionTemplateView.jsx";
import { useState } from "react";
import ConfirmDeleteTemplateMessage from "./ConfirmDeleteTemplateMessage.jsx";

const SessionTemplate = ({
  template,
  usedInReadingSession,
  textFiles,
  deleteTemplate,
}) => {
  const [openTemplateView, setOpenTemplateView] = useState(false);
  const [
    openConfirmDeleteTemplateMessage,
    setOpenConfirmDeleteTemplateMessage,
  ] = useState(false);

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
          <Button
            disabled={usedInReadingSession}
            content="Delete"
            onClick={() => setOpenConfirmDeleteTemplateMessage(true)}
          />
        </div>

        <SessionTemplateView
          isOpen={openTemplateView}
          template={template}
          textFiles={textFiles}
          close={() => setOpenTemplateView(false)}
        />
        <ConfirmDeleteTemplateMessage
          isOpen={openConfirmDeleteTemplateMessage}
          answerYes={deleteTemplate}
          answerNo={() => setOpenConfirmDeleteTemplateMessage(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default SessionTemplate;
