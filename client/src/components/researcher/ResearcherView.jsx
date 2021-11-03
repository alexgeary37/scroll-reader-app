import TopMenu from "./TopMenu.jsx";
import DataGraph from "./data/DataGraph.jsx";
import TextFile from "./home/TextFile.jsx";
import {
  Segment,
  Container,
  Grid,
  Header,
  List,
  Button,
} from "semantic-ui-react";
import { useState, useEffect } from "react";
import { Route } from "react-router";
import SessionTemplate from "./home/SessionTemplate.jsx";
import axios from "axios";
import CreateTemplate from "./home/templateCreation/CreateTemplate.jsx";
import FileUpload from "./home/FileUpload.jsx";

const ResearcherView = () => {
  const [textFiles, setTextFiles] = useState({ data: [], isFetching: true });
  const [templates, setTemplates] = useState({ data: [], isFetching: true });
  const [openTemplateCreator, setOpenTemplateCreator] = useState(false);

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
    setTextFiles({ data: textFiles.data, isFetching: true });

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
            questions: file.questions,
            questionFormat: file.questionFormat,
            uploadedAt: file.createdAt,
          };
          files.push(textFile);
        });

        // Set text files for rendering, and indicate that they are no longer being fetched.
        setTextFiles({ data: files, isFetching: false });
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  };

  const fetchSessionTemplates = () => {
    setTemplates({ data: templates.data, isFetching: true });
    axios
      .get("http://localhost:3001/getSessionTemplates")
      .then((templatesResponse) => {
        const options = [];
        const data = templatesResponse.data;
        data.forEach((temp) => {
          // Get names of text files this template references.
          const speedTexts = [];
          temp.speedTest.fileIDs.forEach((fileID) => {
            speedTexts.push({
              fileID: fileID,
              name: textFiles.data.find((tf) => tf.value === fileID).name,
            });
          });
          const scrollTexts = [];
          temp.scrollTexts.forEach((fileObj) => {
            scrollTexts.push({
              fileID: fileObj.fileID,
              name: textFiles.data.find((tf) => tf.value === fileObj.fileID)
                .name,
              instructions: fileObj.instructions,
              questionIDs: fileObj.questionIDs,
            });
          });

          const option = {
            key: temp._id,
            name: temp.name,
            speedTest: {
              texts: speedTexts,
              instructions: temp.speedTest.instructions,
            },
            scrollTexts: scrollTexts,
            createdAt: temp.createdAt,
            url: temp._id,
          };

          options.push(option);
        });

        // Set templates for rendering, and indicate that they are no longer being fetched.
        setTemplates({ data: options, isFetching: false });
      })
      .catch((error) => {
        console.error("Error fetching session templates:", error);
      });
  };

  const handleCreateTemplate = () => {
    setOpenTemplateCreator(true);
  };

  const closeTemplateCreator = (templateCreated, template) => {
    if (templateCreated) {
      setTemplates({
        data: [...templates.data, template],
        isFetching: false,
      });
    }
    setOpenTemplateCreator(false);
  };

  const handleUpdateFileQuestions = (
    currentFile,
    newQuestion,
    questionFormat
  ) => {
    let files = textFiles.data;
    const index = files.indexOf(currentFile);
    files[index].questions.push(newQuestion);
    files[index].questionFormat = questionFormat;

    setTextFiles({ data: files, isFetching: false });
  };

  const handleRemoveFileQuestion = (file, question) => {
    let files = textFiles.data;
    const index = files.indexOf(file);
    files[index].questions = files[index].questions.filter(
      (q) => q !== question
    );
    const questionFormat =
      files[index].questions.length > 0 ? files[index].questionFormat : "";
    files[index].questionFormat = questionFormat;

    setTextFiles({ data: files, isFetching: false });

    axios
      .put("http://localhost:3001/removeTextFileQuestion", {
        fileID: file.key,
        questionID: question._id,
        questionFormat: questionFormat,
      })
      .catch((error) => {
        console.error("Error removing file.questions[index]", error);
      });
  };

  const fileInUse = (fileID) => {
    if (!templates.isFetching) {
      return (
        templates.data.find((template) =>
          template.scrollTexts.some((text) => text.fileID === fileID)
        ) !== undefined
      );
    }
    return false;
  };

  const displayTextFiles = () => {
    const curUrl = window.location.href;

    // Do not render text files if the researcher is looking at the data page,
    // or if the files are still being fetched from the database.
    if (curUrl.substr(curUrl.length - 5) !== "/data" && !textFiles.isFetching) {
      return (
        <div>
          <Header as="h2" textAlign="center" content="Uploaded Texts:" />

          <Segment
            style={{ overflow: "auto", maxHeight: "75vh", marginBottom: 50 }}
          >
            <List relaxed divided>
              {textFiles.data.map((file) => (
                <TextFile
                  key={file.key}
                  file={file}
                  updateFileQuestions={(newQuestion, questionFormat) =>
                    handleUpdateFileQuestions(file, newQuestion, questionFormat)
                  }
                  fileInUse={fileInUse(file.key)}
                  removeQuestion={(question) =>
                    handleRemoveFileQuestion(file, question)
                  }
                />
              ))}
            </List>
          </Segment>

          <FileUpload
            uploadSubmitted={(file) => {
              setTextFiles({
                data: [...textFiles.data, file],
                isFetching: false,
              });
            }}
          />
        </div>
      );
    }
  };

  const displaySessionTemplates = () => {
    const curUrl = window.location.href;

    // Do not render session templates if the researcher is looking at the data page,
    // or if the session templates are still being fetched from the database.
    if (curUrl.substr(curUrl.length - 5) !== "/data" && !templates.isFetching) {
      return (
        <div>
          <Header as="h2" textAlign="center" content="Existing Templates:" />

          <Segment
            style={{ overflow: "auto", maxHeight: "75vh", marginBottom: 50 }}
          >
            <div className="ui link divided relaxed items">
              {templates.data.map((template) => (
                <SessionTemplate
                  key={template.key}
                  template={template}
                  textFiles={textFiles.data}
                />
              ))}
            </div>
          </Segment>

          <Button
            style={{
              marginTop: 10,
              position: "absolute",
              bottom: 10,
              right: 10,
            }}
            positive
            content="Create Template"
            onClick={handleCreateTemplate}
          />
          <CreateTemplate
            isOpen={openTemplateCreator}
            close={closeTemplateCreator}
            textFiles={textFiles.data}
          />
        </div>
      );
    }
  };

  return (
    <div>
      <TopMenu />
      <div className="page-height menu-padding footer-padding">
        <Container>
          <Grid>
            <Route path="/researcher/data" component={DataGraph} />
            <Grid.Column width={8}>{displayTextFiles()}</Grid.Column>
            <Grid.Column width={8}>{displaySessionTemplates()}</Grid.Column>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default ResearcherView;
