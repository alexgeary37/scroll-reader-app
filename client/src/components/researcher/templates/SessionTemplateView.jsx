import axios from "axios";
import { useEffect, useState } from "react";
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
  const [styles, setStyles] = useState({ data: [], isFetching: true });

  useEffect(() => {
    if (isOpen) {
      // Fetch styles
      axios
        .get("/api/getAllStyles")
        .then((response) =>
          setStyles({ data: response.data, isFetching: false })
        )
        .catch((error) => console.error("Error fetching styles:", error));
    }
  }, [isOpen]);

  const styleContent = (textStyle, type) => {
    return `${type} - font-family: ${textStyle.fontFamily}, font-size: ${textStyle.fontSize},
        line-height: ${textStyle.lineHeight}, bold: ${textStyle.fontWeight}`;
  };

  const speedTestInfo = () => {
    return (
      <div>
        <Item.Header as="h3" content="Speedtest" />
        <List>
          <Item>
            <Item.Description>{`Instructions: ${template.speedTest.instructions}`}</Item.Description>
          </Item>
          <Item>
            <Item.Header as="h4" style={{ margin: 5 }} content="Texts:" />
            <List style={{ marginLeft: 20 }} divided relaxed>
              {template.speedTest.texts.map((text) => (
                <Item key={text.fileID}>
                  <Item.Content>
                    <Item.Header
                      as="h5"
                      content={`${
                        template.speedTest.texts.indexOf(text) + 1
                      }. ${text.name}`}
                    />
                    <Item.Description
                      as="h5"
                      style={{ marginTop: 5, marginBottom: 0 }}
                      content="Style"
                    />
                    {!styles.isFetching && (
                      <div>
                        <Item.Description
                          style={{ marginLeft: 20 }}
                          content={styleContent(text.style.h1, "h1")}
                        />
                        <Item.Description
                          style={{ marginLeft: 20 }}
                          content={styleContent(text.style.h2, "h2")}
                        />
                        <Item.Description
                          style={{ marginLeft: 20 }}
                          content={styleContent(text.style.h3, "h3")}
                        />
                        <Item.Description
                          style={{ marginLeft: 20 }}
                          content={styleContent(
                            text.style.paragraph,
                            "paragraph"
                          )}
                        />
                      </div>
                    )}
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
                  content="Style"
                />
                {!styles.isFetching && (
                  <div>
                    <Item.Description
                      style={{ marginLeft: 20 }}
                      content={styleContent(text.style.h1, "h1")}
                    />
                    <Item.Description
                      style={{ marginLeft: 20 }}
                      content={styleContent(text.style.h2, "h2")}
                    />
                    <Item.Description
                      style={{ marginLeft: 20 }}
                      content={styleContent(text.style.h3, "h3")}
                    />
                    <Item.Description
                      style={{ marginLeft: 20 }}
                      content={styleContent(text.style.paragraph, "paragraph")}
                    />
                  </div>
                )}

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
                            textFiles
                              .find((tf) => tf.key === text.fileID)
                              .questions.find((q) => q._id === questionID)
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
      <Header as="h1" style={{ textAlign: "center" }} content={template.name} />

      {displayTemplateInfo()}
      <Button
        style={{ position: "absolute", right: 10, bottom: 10 }}
        content="Close"
        onClick={close}
      />
    </Modal>
  );
};

export default SessionTemplateView;
