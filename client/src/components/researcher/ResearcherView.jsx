import TopMenu from "./TopMenu.jsx";
import DataGraph from "./data/DataGraph.jsx";
import TextFiles from "./home/TextFiles.jsx";
import { Segment, Container, Divider } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { Route } from "react-router";
import SessionTemplates from "./home/SessionTemplates.jsx";
import Axios from "axios";

const ResearcherView = () => {
  const [textFiles, setTextFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTextFiles();
  }, []);

  async function fetchTextFiles() {
    setIsLoading(true);
    Axios.get("http://localhost:3001/getTextFiles").then((response) => {
      const data = response.data;
      const files = [];
      data.forEach((file) => {
        files.push({
          key: file._id,
          value: file._id,
          name: file.fileName,
          text: file.fileName, // This is for the Dropdown in CreateTemplate.jsx
          uploadedAt: file.createdAt,
        });
      });
      setTextFiles(files);
      setIsLoading(false);
    });
  }

  const textDocuments = () => {
    const curUrl = window.location.href;
    if (curUrl.substr(curUrl.length - 5) !== "/data" && !isLoading) {
      return (
        <div>
          <TextFiles
            textFiles={textFiles}
            fetchTextFiles={() => fetchTextFiles()}
          />
        </div>
      );
    }
  };

  const sessionTemplates = () => {
    const curUrl = window.location.href;
    if (curUrl.substr(curUrl.length - 5) !== "/data" && !isLoading) {
      return (
        <div>
          <SessionTemplates textFiles={textFiles} />
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
            {textDocuments()}
            <Divider />
            {sessionTemplates()}
          </Container>
        </Segment>
      </div>
    </div>
  );
};

export default ResearcherView;
