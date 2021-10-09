import {
  Button,
  Header,
  Modal,
  List,
  Item,
  ItemDescription,
  Segment,
} from "semantic-ui-react";

const SessionTemplateView = ({ template, isOpen, close }) => {
  const displayTemplateInfo = () => {
    return (
      <div>
        <Segment>
          <Header content={template.name} />
          <p>{`Question format: ${template.questionFormat}`}</p>
          <p>{`Created: ${template.createdAt}`}</p>
        </Segment>
        <Segment>
          <Header content="Speedtest" />
          <p>{`Instructions: ${template.speedTest.instructions}`}</p>
          <List style={{ marginLeft: 10 }} horizontal divided>
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
        </Segment>

        <Segment>
          <Header content="ScrollTexts" />
          <List style={{ marginLeft: 10 }} divided relaxed>
            {template.scrollTexts.map((text) => (
              <Item key={text.name}>
                <Item.Content>
                  <Item.Header
                    content={`${template.scrollTexts.indexOf(text) + 1}. ${
                      text.name
                    }`}
                  />
                  <p>{text.instructions} </p>
                  <p>Questions:</p>
                  <List relaxed>
                    {text.questions.map((question) => (
                      <Item key={text.questions.indexOf(question)}>
                        <Item.Content>
                          <Item.Description
                            content={`${
                              text.questions.indexOf(question) + 1
                            }. ${question}`}
                          />
                        </Item.Content>
                      </Item>
                    ))}
                  </List>
                </Item.Content>
              </Item>
            ))}
          </List>
        </Segment>
      </div>
    );
  };

  return (
    <Modal
      open={isOpen}
      style={{ height: "70vh", overflow: "auto", padding: 10 }}
    >
      {displayTemplateInfo()}
      <Button floated="right" content="Close" onClick={close} />
    </Modal>
  );
};

export default SessionTemplateView;
