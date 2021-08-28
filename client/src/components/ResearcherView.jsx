import TopMenu from "./TopMenu.jsx";
import CreateTemplate from "./CreateTemplate.jsx";
import DataGraph from "./DataGraph.jsx";
import {
  Segment,
  Container,
  List,
  Item,
  ItemDescription,
  Header,
  Icon,
  Divider,
} from "semantic-ui-react";
import { Route } from "react-router";
import { Button } from "semantic-ui-react";
import { useEffect, useState } from "react";
import Axios from "axios";

const ResearcherView = () => {
  const [openTemplateCreator, setOpenTemplateCreator] = useState(false);
  const [templates, setTemplates] = useState([]);

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
    Axios.get("http://localhost:3001/getSessionTemplates")
      .then((response) => {
        const sessionTemplates = response.data;
        const options = [];
        sessionTemplates.forEach((template) => {
          options.push({
            key: template._id,
            value: template._id,
            scrollFileName: template.scrollTextFile.fileName,
            speedFileName: template.speedTextFile.fileName,
          });
        });
        setTemplates(options);
      })
      .catch((error) => {
        console.log("Error fetching session templates:", error);
      });
  }

  const sessionTemplates = () => {
    const curUrl = window.location.href;
    if (curUrl.substr(curUrl.length - 5) !== "/data") {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Existing Templates:" />
          <Divider />
          <div style={{ maxHeight: "75vh" }}>
            <Segment basic>
              <List relaxed divided>
                {templates.map((template) => (
                  <Item key={template.key}>
                    <Icon size="large" name="file outline" />
                    <Item.Content>
                      <Header
                        style={{ margin: 5 }}
                        size="small"
                        content={`ScrollText: ${template.scrollFileName}`}
                      />
                      <Header
                        style={{ margin: 5 }}
                        size="small"
                        content={`SpeedText: ${template.speedFileName}`}
                      />
                      <ItemDescription style={{margin: 5}} content={`URL: ${template.value}`} />
                    </Item.Content>
                  </Item>
                ))}
              </List>
            </Segment>
          </div>
          <Button
            style={{ marginTop: 10 }}
            positive
            content="Create Template"
            onClick={handleCreateTemplate}
          />
        </div>
      );
    }
  };

  return (
    <div>
      <TopMenu />
      <div className="page">
        <Segment>
          <Container>
            <Route path="/researcher/data" component={DataGraph} />
            {sessionTemplates()}
            <CreateTemplate
              isOpen={openTemplateCreator}
              close={closeTemplateCreator}
            />
          </Container>
        </Segment>
      </div>
    </div>
  );
};

export default ResearcherView;
