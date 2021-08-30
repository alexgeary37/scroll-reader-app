import { useState, useEffect } from "react";
import Axios from "axios";
import {
  Header,
  Segment,
  List,
  Item,
  ItemDescription,
  Button,
} from "semantic-ui-react";
import CreateTemplate from "./CreateTemplate";

const SessionTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [openTemplateCreator, setOpenTemplateCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSessionTemplates();
  }, []);

  const handleCreateTemplate = () => {
    setOpenTemplateCreator(true);
  };

  const closeTemplateCreator = (templateCreated) => {
    if (templateCreated) {
      fetchSessionTemplates();
    }
    setOpenTemplateCreator(false);
  };

  async function fetchSessionTemplates() {
    setIsLoading(true);
    Axios.get("http://localhost:3001/getSessionTemplates")
      .then((response) => {
        const sessionTemplates = response.data;
        const options = [];
        sessionTemplates.forEach((template) => {
          Axios.get("http://localhost:3001/getTextFile", {
            params: { _id: template.scrollTextFileID },
          }).then((scrollTextFileName) => {
            Axios.get("http://localhost:3001/getTextFile", {
              params: { _id: template.speedTextFileID },
            }).then((speedTextFileName) => {
              console.log(scrollTextFileName.data);
              options.push({
                key: template._id,
                value: template._id,
                scrollFileName: scrollTextFileName.data,
                speedFileName: speedTextFileName.data,
              });
            });
          });
        });
        setTemplates(options);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching session templates:", error);
      });
  }

  const displaySessionTemplates = () => {
    if (!isLoading) {
      return (
        <List relaxed divided>
          {templates.map((template) => (
            <Item key={template.key}>
              <Item.Content>
                <Header
                  style={{ margin: 5 }}
                  size="small"
                  content={`Scroll Text File: ${template.scrollFileName}`}
                />
              </Item.Content>
            </Item>
          ))}
        </List>
      );
    }
  };

  return (
    <div>
      <Header as="h2" textAlign="center" content="Existing Templates:" />
      <div>
        <Segment>{displaySessionTemplates()}</Segment>
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
      />
    </div>
  );
};

export default SessionTemplates;
