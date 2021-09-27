import TopMenu from "./TopMenu.jsx";
import DataGraph from "./data/DataGraph.jsx";
import TextFiles from "./home/TextFiles.jsx";
import { Segment, Container, Divider } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { Route } from "react-router";
import SessionTemplates from "./home/SessionTemplates.jsx";
import axios from "axios";

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
    // Fetch text files only on first render.
    fetchTextFiles();
  }, []);

  useEffect(() => {
    // Fetch session templates only after text files have been fetched.
    if (!textFiles.isFetching) {
      fetchSessionTemplates();
    }
  }, [textFiles.isFetching]);

  const fetchTextFiles = () => {
    setTextFiles({ textFiles: textFiles.textFiles, isFetching: true });
    axios
      .get("http://localhost:3001/getTextFiles")
      .then((response) => {
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

        // Set text files for rendering, and indicate that they are no longer being fetched.
        setTextFiles({ textFiles: files, isFetching: false });
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  };

  const fetchSessionTemplates = () => {
    setTemplates({ templates: templates.templates, isFetching: true });
    axios
      .get("http://localhost:3001/getSessionTemplates")
      .then((templatesResponse) => {
        const options = [];
        const data = templatesResponse.data;
        data.forEach((temp) => {
          // Get names of text files this template references.
          const speedTextFileNames = [];
          temp.speedTest.fileIDs.forEach((fileID) => {
            speedTextFileNames.push(
              textFiles.textFiles.find((tf) => tf.key === fileID).name
            );
          });
          const scrollTextFileNames = [];
          temp.scrollTest.files.forEach((fileObj) => {
            scrollTextFileNames.push(
              textFiles.textFiles.find((tf) => tf.key === fileObj._id).name
            );
          });

          const option = {
            key: temp._id,
            name: temp.name,
            speedFileNames: speedTextFileNames,
            scrollFileNames: scrollTextFileNames,
            questionFormat: temp.questionFormat,
            url: temp._id,
          };

          options.push(option);
        });

        // Set templates for rendering, and indicate that they are no longer being fetched.
        setTemplates({ templates: options, isFetching: false });
      })
      .catch((error) => {
        console.error("Error fetching session templates:", error);
      });
  };

  const textDocuments = () => {
    const curUrl = window.location.href;

    // Do not render text files if the researcher is looking at the data page,
    // or if the files are still being fetched from the database.
    if (curUrl.substr(curUrl.length - 5) !== "/data" && !textFiles.isFetching) {
      return (
        <div>
          <TextFiles
            textFiles={textFiles.textFiles}
            appendTextFile={(file) =>
              setTextFiles({
                textFiles: [...textFiles.textFiles, file],
                isFetching: false,
              })
            }
          />
        </div>
      );
    }
  };

  const sessionTemplates = () => {
    const curUrl = window.location.href;

    // Do not render session templates if the researcher is looking at the data page,
    // or if the session templates are still being fetched from the database.
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
