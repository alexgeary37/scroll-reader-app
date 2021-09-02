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

const SessionTemplates = ({ textFiles }) => {
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
    try {
      setIsLoading(true);
      const options = [];
      Axios.get("http://localhost:3001/getSessionTemplates").then(
        (templatesResponse) => {
          const templatesData = templatesResponse.data;
          templatesData.forEach((temp) => {
            Axios.get("http://localhost:3001/getTextFile", {
              params: { _id: temp.scrollTextFileID },
            }).then((scrollTextFileResponse) => {
              const scrollTextFileName = scrollTextFileResponse.data.fileName;
              Axios.get("http://localhost:3001/getTextFile", {
                params: { _id: temp.speedTextFileID },
              }).then((speedTextFileResponse) => {
                const speedTextFileName = speedTextFileResponse.data.fileName;
                options.push({
                  key: temp._id,
                  name: temp.name,
                  scrollFileName: scrollTextFileName,
                  speedFileName: speedTextFileName,
                  questionFormat: temp.questionFormat,
                  url: temp._id,
                });
              });
            });
          });
        }
      );

      setTemplates(options);
      if (templates.length > 0) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching session templates:", error);
    }
  }

  const displaySessionTemplates = () => {
    if (!isLoading) {
      console.log(templates);
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
                <ItemDescription
                  style={{ margin: 5 }}
                  content={`URL: ${template.url}`}
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
        textFiles={textFiles}
      />
    </div>
  );
};

export default SessionTemplates;
