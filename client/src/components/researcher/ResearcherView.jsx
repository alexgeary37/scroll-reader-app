import TextFile from "./TextFile.jsx";
import { Segment, Container, Grid, Header, Button } from "semantic-ui-react";
import { useState, useEffect } from "react";
import SessionTemplate from "./SessionTemplate.jsx";
import axios from "axios";
import CreateTemplate from "./templates/templateCreation/CreateTemplate.jsx";
import FileUpload from "./FileUpload.jsx";
import ReadingSession from "./ReadingSession.jsx";

const ResearcherView = () => {
  const [textFiles, setTextFiles] = useState({ data: [], isFetching: true });
  const [templates, setTemplates] = useState({ data: [], isFetching: true });
  const [readingSessions, setReadingSessions] = useState({
    data: [],
    isFetching: true,
  });
  const [openTemplateCreator, setOpenTemplateCreator] = useState(false);
  const [openDownloadDataModal, setOpenDownloadDataModal] = useState(false);

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

  useEffect(() => {
    // Fetch reading sessions only after templates have been fetched.
    if (!templates.isFetching) {
      fetchReadingSessions();
    }
  }, [templates.isFetching]);

  const fetchTextFiles = () => {
    setTextFiles({ data: textFiles.data, isFetching: true });

    axios
      .get("/api/getAllTextFiles")
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
            styles: file.styles,
            uploadedAt: file.createdAt,
          };
          files.push(textFile);
        });

        // Set textFiles for rendering, and indicate that they are no longer being fetched.
        setTextFiles({ data: files, isFetching: false });
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  };

  const fetchSessionTemplates = () => {
    setTemplates({ data: templates.data, isFetching: true });

    axios
      .get("/api/getSessionTemplates")
      .then((templatesResponse) => {
        const options = [];
        const data = templatesResponse.data;
        data.forEach((temp) => {
          // Get names of text files this template references.
          const speedTexts = [];
          temp.speedTest.texts.forEach((text) => {
            speedTexts.push({
              fileID: text.fileID,
              name: textFiles.data.find((tf) => tf.value === text.fileID).name,
              styleID: text.styleID,
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
              styleID: fileObj.styleID,
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

  const fetchReadingSessions = () => {
    setReadingSessions({ data: readingSessions.data, isFetching: false });

    axios
      .get("/api/getReadingSessions")
      .then((response) => {
        const options = [];
        const data = response.data;
        data.forEach((session) => {
          const option = {
            key: session._id,
            userName: session.userName,
            templateID: session.templateID,
            templateName: templates.data.find(
              (t) => t.key === session.templateID
            ).name,
            startTime: session.startTime,
            endTime: session.endTime,
          };

          options.push(option);
        });

        // Set readingSessions for rendering, and indicate that they are no longer being fetched.
        setReadingSessions({ data: options, isFetching: false });
      })
      .catch((error) => {
        console.error("Error fetching reading sessions:", error);
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

  const handleUpdateFileQuestions = (file, newQuestion, questionFormat) => {
    const files = textFiles.data;
    const index = files.indexOf(file);
    files[index].questions.push(newQuestion);
    files[index].questionFormat = questionFormat;

    setTextFiles({ data: files, isFetching: false });
  };

  const handleRemoveFileQuestion = (file, question) => {
    const files = textFiles.data;
    const index = files.indexOf(file);
    files[index].questions = files[index].questions.filter(
      (q) => q !== question
    );
    const questionFormat =
      files[index].questions.length > 0 ? files[index].questionFormat : "";
    files[index].questionFormat = questionFormat;

    setTextFiles({ data: files, isFetching: false });

    axios
      .put("/api/removeTextFileQuestion", {
        fileID: file.key,
        questionID: question._id,
        questionFormat: questionFormat,
      })
      .catch((error) => {
        console.error("Error removing question from file.questions:", error);
      });
  };

  const handleUpdateFileStyles = (file, newStyle) => {
    const files = textFiles.data;
    const index = files.indexOf(file);
    files[index].styles.push(newStyle);

    setTextFiles({ data: files, isFetching: false });
  };

  const handleRemoveFileStyle = (file, style) => {
    const files = textFiles.data;
    const index = files.indexOf(file);
    files[index].styles = files[index].styles.filter((s) => s !== style);

    setTextFiles({ data: files, isFetching: false });

    axios
      .put("/api/removeTextFileStyle", {
        fileID: file.key,
        styleID: style._id,
      })
      .catch((error) => {
        console.error("Error removing style from file.styles:", error);
      });
  };

  const handleDeleteFile = (file) => {
    let files = textFiles.data;
    files = files.filter((f) => f !== file);
    setTextFiles({ data: files, isFetching: false });

    axios
      .put("/api/deleteTextFile", {
        fileID: file.key,
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const handleDeleteTemplate = (template) => {
    let sessionTemplates = templates.data;
    sessionTemplates = sessionTemplates.filter((t) => t !== template);
    setTemplates({ data: sessionTemplates, isFetching: false });

    axios
      .put("/api/deleteTemplate", {
        templateID: template.key,
      })
      .catch((error) => {
        console.error("Error deleting template:", error);
      });
  };

  const handleDeleteReadingSession = (session) => {
    let sessions = readingSessions.data;
    sessions = sessions.filter((s) => s !== session);
    setReadingSessions({ data: sessions, isFetching: false });

    axios
      .put("/api/deleteReadingSession", {
        readingSessionID: session.key,
      })
      .catch((error) => {
        console.error("Error deleting reading session:", error);
      });
  };

  const fileUsedInTemplate = (fileID) => {
    if (!templates.isFetching) {
      const usedAsSpeed =
        templates.data.find((template) =>
          template.speedTest.texts.some((text) => text.fileID === fileID)
        ) !== undefined;

      const usedAsScroll = fileUsedAsScrollText(fileID);
      return usedAsSpeed || usedAsScroll;
    }
    return false;
  };

  const fileUsedAsScrollText = (fileID) => {
    if (!templates.isFetching) {
      return (
        templates.data.find((template) =>
          template.scrollTexts.some((text) => text.fileID === fileID)
        ) !== undefined
      );
    }
    return false;
  };

  const templateUsedInReadingSession = (templateID) => {
    if (!readingSessions.isFetching) {
      return (
        readingSessions.data.find(
          (session) => session.templateID === templateID
        ) !== undefined
      );
    }
    return false;
  };

  const handleFileUpload = (file) => {
    axios
      .get("/api/getTextFile", {
        params: { _id: file.key },
      })
      .then((response) => {
        const newFile = file;
        newFile.styles[0]._id = response.data.styles[0]._id;
        setTextFiles({
          data: [...textFiles.data, newFile],
          isFetching: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching text in ScrollText:", error);
      });
  };

  const displayTextFiles = () => {
    // Only rendern text files once they have been fetched.
    if (!textFiles.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Uploaded Texts" />

          <Segment style={{ overflow: "auto", maxHeight: "75vh" }}>
            <div className="ui link divided relaxed items">
              {textFiles.data.map((file) => (
                <TextFile
                  key={file.key}
                  file={file}
                  usedInTemplate={fileUsedInTemplate(file.key)}
                  updateFileQuestions={(newQuestion, questionFormat) =>
                    handleUpdateFileQuestions(file, newQuestion, questionFormat)
                  }
                  removeQuestion={(question) =>
                    handleRemoveFileQuestion(file, question)
                  }
                  updateFileStyles={(style) =>
                    handleUpdateFileStyles(file, style)
                  }
                  removeStyle={(style) => handleRemoveFileStyle(file, style)}
                  deleteFile={() => handleDeleteFile(file)}
                />
              ))}
            </div>
          </Segment>

          <FileUpload uploadSubmitted={handleFileUpload} />
        </div>
      );
    }
  };

  const displaySessionTemplates = () => {
    // Only render sessionTemplates if they have been fetched.
    if (!templates.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Existing Templates" />

          <Segment style={{ overflow: "auto", maxHeight: "75vh" }}>
            <div className="ui link divided relaxed items">
              {templates.data.map((template) => (
                <SessionTemplate
                  key={template.key}
                  template={template}
                  usedInReadingSession={templateUsedInReadingSession(
                    template.key
                  )}
                  textFiles={textFiles.data}
                  deleteTemplate={() => handleDeleteTemplate(template)}
                />
              ))}
            </div>
          </Segment>

          <Button
            style={{ display: "flex", float: "right" }}
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

  const displayReadingSessions = () => {
    if (!readingSessions.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Reading Sessions" />

          <Segment style={{ overflow: "auto", maxHeight: "75vh" }}>
            <div className="ui link divided relaxed items">
              {readingSessions.data.map((session) => (
                <ReadingSession
                  key={session.key}
                  session={session}
                  textFiles={textFiles.data}
                  deleteReadingSession={() =>
                    handleDeleteReadingSession(session)
                  }
                />
              ))}
            </div>
          </Segment>
        </div>
      );
    }
  };

  return (
    <div className="researcher">
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>{displayTextFiles()}</Grid.Column>
            <Grid.Column width={8}>{displaySessionTemplates()}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>{displayReadingSessions()}</Grid.Column>
          </Grid.Row>
          {/* <Grid.Row>
            <Button
              positive
              content="Download data"
              onClick={() => setOpenDownloadDataModal(true)}
            />
            <DownloadDataForm
              isOpen={openDownloadDataModal}
              templates={templates.data}
              textFiles={textFiles.data}
              close={() => setOpenDownloadDataModal(false)}
            />
          </Grid.Row> */}
        </Grid>
      </Container>
    </div>
  );
};

export default ResearcherView;
