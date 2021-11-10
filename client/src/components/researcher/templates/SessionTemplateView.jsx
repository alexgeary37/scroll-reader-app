import { useEffect } from "react";
import {
  Button,
  Header,
  Modal,
  List,
  Item,
  Segment,
  Divider,
} from "semantic-ui-react";

const SessionTemplateView = ({ isOpen, template, textFiles, close }) => {
  useEffect(() => {
    console.log("TextFiles::", textFiles);
  }, []);

  const speedTestInfo = () => {
    return (
      <div>
        <Item.Header as="h3" content="Speedtest" />
        <List>
          <Item>
            <Item.Description>{`Instructions: ${template.speedTest.instructions}`}</Item.Description>
          </Item>
          <Item>
            <Item.Header as="h5" style={{ margin: 5 }} content="Texts:" />
            <List style={{ marginLeft: 20 }} horizontal divided>
              {template.speedTest.texts.map((text) => (
                <Item key={text.fileID}>
                  <Item.Content>
                    <Item.Description
                      content={`${
                        template.speedTest.texts.indexOf(text) + 1
                      }. ${text.name}`}
                    />
                  </Item.Content>
                </Item>
              ))}
            </List>
          </Item>
        </List>
      </div>
    );
  };

  const scrollTestInfo = () => {
    return (
      <div>
        <Item.Header as="h3" content="ScrollTexts" />
        <List style={{ marginLeft: 20 }} divided relaxed>
          {template.scrollTexts.map((text) => (
            <Item key={text.fileID}>
              <Item.Content>
                <Item.Header
                  as="h5"
                  content={`${template.scrollTexts.indexOf(text) + 1}. ${
                    text.name
                  }`}
                />
                <Item.Description
                  style={{ marginTop: 5 }}
                  content={`Instructions: ${text.instructions.main}`}
                />
                <Item.Description
                  content={
                    JSON.parse(text.instructions.hasFamiliarityQuestion) ===
                    true
                      ? "Ask familiarity: Yes"
                      : "Ask familiarity: No"
                  }
                />
                <Item.Description
                  content={
                    JSON.parse(text.instructions.hasInterestQuestion) === true
                      ? "Ask interest: Yes"
                      : "Ask interest: No"
                  }
                />
                <Item.Description
                  as="h5"
                  style={{ marginTop: 5, marginBottom: 0 }}
                  content="Questions:"
                />
                <List style={{ marginLeft: 20 }}>
                  {text.questionIDs.map((questionID) => (
                    <Item key={questionID}>
                      <Item.Content>
                        <Item.Description
                          content={`${
                            text.questionIDs.indexOf(questionID) + 1
                          }. ${
                            // Get the question from the textFile
                            textFiles[
                              textFiles.indexOf(
                                textFiles.find(
                                  (file) => file.value === text.fileID
                                )
                              )
                            ].questions.find((q) => q._id === questionID)
                              .question
                          }`}
                        />
                      </Item.Content>
                    </Item>
                  ))}
                </List>
              </Item.Content>
            </Item>
          ))}
        </List>
      </div>
    );
  };

  const displayTemplateInfo = () => {
    return (
      <Segment basic style={{ overflow: "auto", maxHeight: "75%" }}>
        <Item>
          <Item.Content>
            <List>
              <Item>
                <Item.Description content={`Created: ${template.createdAt}`} />
              </Item>
            </List>

            {speedTestInfo()}

            <Divider />

            {scrollTestInfo()}
          </Item.Content>
        </Item>
      </Segment>
    );
  };

  return (
    <Modal open={isOpen} style={{ height: "70vh", padding: 10 }}>
      <Header as="h1" content={template.name} />

      {/* {displayTemplateInfo()} */}
      <Button
        style={{ position: "absolute", right: 10, bottom: 10 }}
        content="Close"
        onClick={close}
      />
    </Modal>
  );
};

export default SessionTemplateView;
