import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Header, Modal, List, Item, Segment } from "semantic-ui-react";

const SessionTemplateView = ({ template, isOpen, close }) => {
  const [completeTemplate, setCompleteTemplate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplate();
    } else {
      setCompleteTemplate(null);
    }
  }, [isOpen]);

  const fetchTemplate = () => {
    axios
      .get("http://localhost:3001/getSessionTemplate", {
        params: { _id: template.key },
      })
      .then((response) => {
        setCompleteTemplate(response.data);
      })
      .catch((error) => {
        console.error("Error fetching SessionTemplate:", error);
      });
  };

  const displayTemplateInfo = () => {
    if (completeTemplate !== null) {
      return (
        <div>
          <Header content={completeTemplate.name} />
          <Header
            content={`Question format: ${completeTemplate.questionFormat}`}
          />
          <Header content={`Created: ${completeTemplate.createdAt}`} />

          <Segment>
            <Header content="Speedtest" />
            <Header
              as="h4"
              content={`Instructions: ${completeTemplate.speedTest.instructions}`}
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
          </Segment>

          <Segment>
            <Header content="Scrolltest" />
          </Segment>
        </div>
      );
    }
  };

  return (
    <Modal
      open={isOpen}
      style={{ height: "70vh", overflow: "auto", padding: 10 }}
    >
      {displayTemplateInfo()}

      <Button content="Click" onClick={() => console.log(completeTemplate)} />
      <Button floated="right" content="Close" onClick={close} />
    </Modal>
  );
};

export default SessionTemplateView;
