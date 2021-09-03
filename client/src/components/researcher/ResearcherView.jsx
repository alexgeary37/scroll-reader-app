import TopMenu from "./TopMenu.jsx";
import DataGraph from "./data/DataGraph.jsx";
import TextFiles from "./home/TextFiles.jsx";
import { Segment, Container, Divider } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { Route } from "react-router";
import SessionTemplates from "./home/SessionTemplates.jsx";
import Axios from "axios";

const ResearcherView = () => {
  const [textFiles, setTextFiles] = useState({
    textFiles: [],
    isFetching: true,
  });
  const [templates, setTemplates] = useState({
    templates: [],
    isFetching: true,
  });

  useEffect(() => {
    fetchTextFiles();
    fetchSessionTemplates();
  }, []);

  // useEffect(() => {
  //   console.log("B4", textFiles.textFiles);
  //   if (textFiles.textFiles.length > 0) {
  //     console.log("In", textFiles.textFiles);
  //     fetchSessionTemplates();
  //   }
  // }, [textFiles.textFiles]);

  const fetchTextFiles = () => {
    try {
      setTextFiles({ textFiles: textFiles.textFiles, isFetching: true });
      Axios.get("http://localhost:3001/getTextFiles").then((response) => {
        const data = response.data;
        const files = [];
        data.forEach((file) => {
          const textFile = {
            key: file._id,
            value: file._id,
            name: file.fileName,
            text: file.fileName, // This is for the Dropdown in CreateTemplate.jsx
            uploadedAt: file.createdAt,
          };
          files.push(textFile);
        });
        setTextFiles({ textFiles: files, isFetching: false });
      });
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const fetchSessionTemplates = () => {
    try {
      setTemplates({ templates: templates.templates, isFetching: true });
      Axios.get("http://localhost:3001/getSessionTemplates").then(
        (templatesResponse) => {
          const options = [];
          const data = templatesResponse.data;
          data.forEach((temp) => {
            Axios.get("http://localhost:3001/getTextFile", {
              params: { _id: temp.scrollTextFileID },
            }).then((scrollTextFileResponse) => {
              const scrollTextFileName = scrollTextFileResponse.data.fileName;
              Axios.get("http://localhost:3001/getTextFile", {
                params: { _id: temp.speedTextFileID },
              }).then((speedTextFileResponse) => {
                const speedTextFileName = speedTextFileResponse.data.fileName;
                const option = {
                  key: temp._id,
                  name: temp.name,
                  scrollFileName: scrollTextFileName,
                  speedFileName: speedTextFileName,
                  questionFormat: temp.questionFormat,
                  url: temp._id,
                };
                options.push(option);
              });
            });
          });
          setTemplates({ templates: options, isFetching: false });
        }
      );
    } catch (error) {
      console.error("Error fetching session templates:", error);
    }
  };

  const textDocuments = () => {
    const curUrl = window.location.href;
    if (curUrl.substr(curUrl.length - 5) !== "/data" && !textFiles.isFetching) {
      return (
        <div>
          <TextFiles
            textFiles={textFiles.textFiles}
            fetchTextFiles={() => fetchTextFiles()}
          />
        </div>
      );
    }
  };

  const sessionTemplates = () => {
    const curUrl = window.location.href;
    if (curUrl.substr(curUrl.length - 5) !== "/data" && !templates.isFetching) {
      return (
        <div>
          <SessionTemplates
            templates={templates.templates}
            textFiles={textFiles.textFiles}
            appendTemplate={(template) =>
              setTemplates({
                templates: [...templates.templates, template],
                isFetching: false,
              })
            }
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
