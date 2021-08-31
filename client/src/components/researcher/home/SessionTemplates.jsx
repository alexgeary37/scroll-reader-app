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
    try {
      const options = [];
      let templatesResponse = await Axios.get(
        "http://localhost:3001/getSessionTemplates"
      );
      templatesResponse = templatesResponse.data;
      for (let i = 0; i < templatesResponse.length; i++) {
        let scrollTextFileResponse = await Axios.get(
          "http://localhost:3001/getTextFile",
          { params: { _id: templatesResponse[i].scrollTextFileID } }
        );
        scrollTextFileResponse = scrollTextFileResponse.data;

        let speedTextFileResponse = await Axios.get(
          "http://localhost:3001/getTextFile",
          { params: { _id: templatesResponse[i].speedTextFileID } }
        );
        speedTextFileResponse = speedTextFileResponse.data;
        options.push({
          key: templatesResponse[i]._id,
          name: templatesResponse[i].name,
          scrollFileName: scrollTextFileResponse,
          speedFileName: speedTextFileResponse,
          questionFormat: templatesResponse[i].questionFormat,
        });
      }
      setTemplates(options);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching session templates:", error);
    }
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
                  content={template.name}
                />
                <ItemDescription
                  style={{ margin: 5 }}
                  content={`Scroll Text File: ${template.scrollFileName}`}
                />
                <ItemDescription
                  style={{ margin: 5 }}
                  content={`Speed Text File: ${template.speedFileName}`}
                />
                <ItemDescription
                  style={{ margin: 5 }}
                  content={`Question Format: ${template.questionFormat}`}
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
      />
    </div>
  );
};

export default SessionTemplates;
