import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import SessionTemplate from "./templates/SessionTemplate";
import CreateTemplate from "./templates/templateCreation/CreateTemplate";

const TemplatesSection = ({
  textFiles,
  templates,
  setTemplates,
  readingSessions,
}) => {
  const [openTemplateCreator, setOpenTemplateCreator] = useState(false);

  useEffect(() => {
    // Fetch session templates only after text files have been fetched.
    if (!textFiles.isFetching) {
      fetchSessionTemplates();
    }
  }, [textFiles.isFetching]);

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
              name: textFiles.data.find((tf) => tf.key === text.fileID).name,
              style: text.style,
            });
          });
          const scrollTexts = [];
          temp.scrollTexts.forEach((fileObj) => {
            scrollTexts.push({
              fileID: fileObj.fileID,
              name: textFiles.data.find((tf) => tf.key === fileObj.fileID).name,
              instructions: fileObj.instructions,
              questionIDs: fileObj.questionIDs,
              style: fileObj.style,
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
      .catch((error) =>
        console.error("Error fetching session templates:", error)
      );
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

  const handleDeleteTemplate = (template) => {
    let sessionTemplates = templates.data;
    sessionTemplates = sessionTemplates.filter((t) => t !== template);
    setTemplates({ data: sessionTemplates, isFetching: false });

    axios
      .put("/api/deleteTemplate", {
        templateID: template.key,
      })
      .catch((error) => console.error("Error deleting template:", error));
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

  const displayContent = () => {
    // Only render sessionTemplates if they have been fetched.
    if (!templates.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Existing Templates" />

          <Segment basic style={{ overflow: "auto", maxHeight: "75vh" }}>
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
            onClick={() => setOpenTemplateCreator(true)}
          />
          <CreateTemplate
            isOpen={openTemplateCreator}
            templates={templates.data}
            close={closeTemplateCreator}
            textFiles={textFiles.data}
          />
        </div>
      );
    } else {
      return <div />;
    }
  };

  return displayContent();
};

export default TemplatesSection;
