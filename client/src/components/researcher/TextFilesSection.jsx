import axios from "axios";
import { useEffect } from "react";
import { Header, Segment } from "semantic-ui-react";
import FileUpload from "./textFiles/FileUpload";
import TextFile from "./textFiles/TextFile";

const TextFilesSection = ({ textFiles, setTextFiles, templates }) => {
  useEffect(() => {
    // Fetch text files only on first render.
    fetchTextFiles();
  }, []);

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
            uploadedAt: file.createdAt, // TODO make this Date() object to use new utilities.js function
          };
          files.push(textFile);
        });

        // Set textFiles for rendering, and indicate that they are no longer being fetched.
        setTextFiles({ data: files, isFetching: false });
      })
      .catch((error) => console.error("Error fetching files:", error));
  };

  const fileUsedInTemplates = (fileID) => {
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

  const handleUpdateFileQuestions = (file, newQuestion) => {
    const files = textFiles.data;
    const index = files.indexOf(file);
    files[index].questions.push(newQuestion);

    setTextFiles({ data: files, isFetching: false });
  };

  const handleRemoveFileQuestion = (file, question) => {
    const files = textFiles.data;
    const index = files.indexOf(file);
    files[index].questions = files[index].questions.filter(
      (q) => q !== question
    );

    setTextFiles({ data: files, isFetching: false });

    axios
      .put("/api/removeTextFileQuestion", {
        fileID: file.key,
        questionID: question._id,
      })
      .catch((error) =>
        console.error("Error removing question from file.questions:", error)
      );
  };

  const handleDeleteFile = (file) => {
    let files = textFiles.data;
    files = files.filter((f) => f !== file);
    setTextFiles({ data: files, isFetching: false });

    axios
      .put("/api/deleteTextFile", {
        fileID: file.key,
      })
      .catch((error) => console.error("Error deleting file:", error));
  };

  const handleFileUpload = (file) => {
    axios
      .get("/api/getTextFile", {
        params: { _id: file.key },
      })
      .then(() => {
        setTextFiles({
          data: [...textFiles.data, file],
          isFetching: false,
        });
      })
      .catch((error) =>
        console.error("Error fetching text in ScrollText:", error)
      );
  };

  const displayContent = () => {
    // Only rendern text files once they have been fetched.
    if (!textFiles.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Uploaded Texts" />

          <Segment basic style={{ overflow: "auto", maxHeight: "75vh" }}>
            <div className="ui link divided relaxed items">
              {textFiles.data.map((file) => (
                <TextFile
                  key={file.key}
                  file={file}
                  usedInTemplate={fileUsedInTemplates(file.key)}
                  updateFileQuestions={(newQuestion) =>
                    handleUpdateFileQuestions(file, newQuestion)
                  }
                  removeQuestion={(question) =>
                    handleRemoveFileQuestion(file, question)
                  }
                  deleteFile={() => handleDeleteFile(file)}
                />
              ))}
            </div>
          </Segment>

          <FileUpload
            textFiles={textFiles.data}
            uploadSubmitted={handleFileUpload}
          />
        </div>
      );
    } else {
      return <div />;
    }
  };

  return displayContent();
};

export default TextFilesSection;
