import { useEffect, useState } from "react";
import {
  Button,
  Header,
  Segment,
  Modal,
  Dropdown,
  List,
  Input,
  Divider,
} from "semantic-ui-react";
import axios from "axios";
import ScrollTextListItem from "./ScrollTextListItem";
import SpeedTextListItem from "./SpeedTextListItem";

const CreateTemplate = ({ isOpen, templates, close, textFiles }) => {
  const [templateName, setTemplateName] = useState("");
  const [speedTexts, setSpeedTexts] = useState([]);
  const [speedTestInstructions, setSpeedTestInstructions] = useState("");
  const [scrollTexts, setScrollTexts] = useState([]);
  const [displayMissingInputError, setDisplayMissingInputError] =
    useState(false);
  const [
    displayDuplicateTemplateNameError,
    setDisplayDuplicateTemplateNameError,
  ] = useState(false);
  const [dropdownTextFiles, setDropdownTextFiles] = useState([]);
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch styles
      axios
        .get("/api/getAllStyles")
        .then((response) => setStyles(response.data))
        .catch((error) => console.error("Error fetching styles:", error));
    }
  }, [isOpen]);

  useEffect(() => {
    setDropdownTextFiles(formatDropdownTextFiles(textFiles));
  }, [textFiles]);

  const formatDropdownTextFiles = (textFiles) => {
    return textFiles.map((file) => {
      return {
        key: file.key,
        value: file.value,
        text: file.name,
      };
    });
  };

  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
    setDisplayDuplicateTemplateNameError(false);
  };

  const checkFormInputs = () => {
    let emptyFields = false;
    let duplicateName = false;

    if (templateName.trim() === "") {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (templates.some((t) => t.name === templateName)) {
      setDisplayMissingInputError(true);
      setDisplayDuplicateTemplateNameError(true);
      duplicateName = true;
    }
    if (speedTexts.length === 0) {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (scrollTexts.length === 0) {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (speedTestInstructions.trim() === "") {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    for (let i = 0; i < scrollTexts.length; i++) {
      if (scrollTexts[i].instructions.main === "") {
        setDisplayMissingInputError(true);
        emptyFields = true;
        break;
      }
    }

    return emptyFields || duplicateName;
  };

  const handleCreate = () => {
    const validInput = checkFormInputs();

    if (!validInput) {
      // Create scrollTexts field.
      const files = [];
      for (let i = 0; i < scrollTexts.length; i++) {
        files.push({
          fileID: scrollTexts[i].fileID,
          instructions: scrollTexts[i].instructions,
          questionIDs: scrollTexts[i].questionIDs,
          style: scrollTexts[i].style,
        });
      }

      const template = {
        name: templateName.trim(),
        speedTest: {
          texts: speedTexts,
          instructions: speedTestInstructions.trim(),
        },
        scrollTexts: files,
        createdAt: new Date(),
      };

      axios
        .post("/api/createSessionTemplate", template)
        .then((response) => {
          handleClose(true, response.data);
        })
        .catch((error) =>
          console.error("Error creating session template:", error)
        );
    }
  };

  const handleSelectSpeedText = (e, data) => {
    if (e.target.className === "delete icon") {
      for (let i = 0; i < data.options.length; i++) {
        const optionIndex = data.value.indexOf(data.options[i].key);

        // IF this element is not found in data.value array, and it is still
        // in speedTexts, remove it from speedTexts.
        if (
          optionIndex === -1 &&
          speedTexts.some((elem) => elem.fileID === data.options[i].key)
        ) {
          setSpeedTexts(
            speedTexts.filter((elem) => elem.fileID !== data.options[i].key)
          );
          break;
        }
      }
    } else {
      setSpeedTexts([
        ...speedTexts,
        {
          fileID: data.value[data.value.length - 1],
          fileName: data.options.find(
            (file) => file.key === data.value[data.value.length - 1]
          ).text,
          style: {
            h1: styles[0]._id,
            h2: styles[0]._id,
            h3: styles[0]._id,
            paragraph: styles[0]._id,
          },
        },
      ]);
    }
  };

  const handleSelectScrollText = (e, data) => {
    if (e.target.className === "delete icon") {
      for (let i = 0; i < data.options.length; i++) {
        const optionIndex = data.value.indexOf(data.options[i].key);

        // IF this element is not found in data.value array, and it is still
        // in scrollTexts, remove it from scrollTexts.
        if (
          optionIndex === -1 &&
          scrollTexts.some((elem) => elem.fileID === data.options[i].key)
        ) {
          setScrollTexts(
            scrollTexts.filter((elem) => elem.fileID !== data.options[i].key)
          );
          break;
        }
      }
    } else {
      setScrollTexts([
        ...scrollTexts,
        {
          fileID: data.value[data.value.length - 1],
          fileName: data.options.find(
            (file) => file.key === data.value[data.value.length - 1]
          ).text,
          instructions: {
            main: "",
            hasFamiliarityQuestion: true,
            hasInterestQuestion: true,
          },
          questionIDs: [],
          style: {
            h1: styles[0]._id,
            h2: styles[0]._id,
            h3: styles[0]._id,
            paragraph: styles[0]._id,
          },
        },
      ]);
    }
  };

  const handleAddQuestions = (text, selectedQuestions) => {
    const index = scrollTexts.indexOf(text);
    const tempScrollTexts = scrollTexts;
    tempScrollTexts[index].questionIDs = selectedQuestions;
    setScrollTexts(tempScrollTexts);
  };

  const handleSelectSpeedTextStyles = (text, h1, h2, h3, paragraph) => {
    const index = speedTexts.indexOf(text);
    const tempSpeedTexts = speedTexts;
    tempSpeedTexts[index].style = {
      h1: h1,
      h2: h2,
      h3: h3,
      paragraph: paragraph,
    };
    setSpeedTexts(tempSpeedTexts);
  };

  const handleSelectScrollTextStyles = (text, h1, h2, h3, paragraph) => {
    const index = scrollTexts.indexOf(text);
    const tempScrollTexts = scrollTexts;
    tempScrollTexts[index].style = {
      h1: h1,
      h2: h2,
      h3: h3,
      paragraph: paragraph,
    };
    setScrollTexts(tempScrollTexts);
  };

  const setScrollTextInstructions = (text, instructions) => {
    const index = scrollTexts.indexOf(text);
    const tempScrollTexts = scrollTexts;
    tempScrollTexts[index].instructions.main = instructions;
    setScrollTexts(tempScrollTexts);
  };

  const setAskQuestion = (text, question) => {
    const index = scrollTexts.indexOf(text);
    const tempScrollTexts = scrollTexts;
    if (question === "familiarity") {
      const ask = !tempScrollTexts[index].instructions.hasFamiliarityQuestion;
      tempScrollTexts[index].instructions.hasFamiliarityQuestion = ask;
    }
    if (question === "interest") {
      const ask = !tempScrollTexts[index].instructions.hasInterestQuestion;
      tempScrollTexts[index].instructions.hasInterestQuestion = ask;
    }
    setScrollTexts(tempScrollTexts);
  };

  const clearData = () => {
    setTemplateName("");
    setSpeedTexts([]);
    setScrollTexts([]);
    setSpeedTestInstructions("");
    setDisplayMissingInputError(false);
    setDisplayDuplicateTemplateNameError(false);
  };

  const handleClose = (templateCreated, responseData) => {
    clearData();

    if (templateCreated) {
      const tempSpeedTexts = [];
      responseData.speedTest.texts.forEach((text) => {
        tempSpeedTexts.push({
          fileID: text.fileID,
          name: textFiles.find((tf) => tf.key === text.fileID).name,
          style: text.style,
        });
      });

      const tempScrollTexts = [];
      responseData.scrollTexts.forEach((fileObj) =>
        tempScrollTexts.push({
          fileID: fileObj.fileID,
          name: textFiles.find((tf) => tf.key === fileObj.fileID).name,
          instructions: fileObj.instructions,
          questionIDs: fileObj.questionIDs,
          style: fileObj.style,
        })
      );

      const template = {
        key: responseData._id,
        name: responseData.name,
        speedTest: {
          texts: tempSpeedTexts,
          instructions: responseData.speedTest.instructions,
        },
        scrollTexts: tempScrollTexts,
        createdAt: responseData.createdAt,
        url: responseData._id,
      };

      close(true, template);
    } else {
      close(false, null);
    }
  };

  const displaySpeedTexts = () => {
    return (
      <List relaxed divided>
        {speedTexts.map((text) => (
          <SpeedTextListItem
            key={text.fileID}
            text={text}
            styles={styles}
            selectStyles={handleSelectSpeedTextStyles}
          />
        ))}
      </List>
    );
  };

  const displayScrollTexts = () => {
    return (
      <List relaxed divided>
        {scrollTexts.map((text) => (
          <ScrollTextListItem
            key={text.fileID}
            text={text}
            availableQuestions={
              textFiles.find((file) => file.key === text.fileID).questions
            }
            styles={styles}
            addQuestions={handleAddQuestions}
            selectStyles={handleSelectScrollTextStyles}
            setInstructions={setScrollTextInstructions}
            instructionsError={
              text.instructions.main === "" && displayMissingInputError
            }
            toggleHasFamiliarityQuestion={() =>
              setAskQuestion(text, "familiarity")
            }
            toggleHasInterestQuestion={() => setAskQuestion(text, "interest")}
          />
        ))}
      </List>
    );
  };

  const displayDuplicateTemplateNameErrorMessage = () => {
    if (displayDuplicateTemplateNameError) {
      return (
        <label style={{ padding: 10, color: "red" }}>
          Template name already exists.
        </label>
      );
    }
  };

  return (
    <div>
      <Modal open={isOpen} style={{ height: "70vh", padding: 10 }}>
        <Header as="h1" content="Create a Session Template" />
        <Segment basic style={{ overflow: "auto", maxHeight: "75%" }}>
          <Segment basic>
            <Header
              as="h3"
              content="Template Name:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Input
              type="text"
              error={templateName === "" && displayMissingInputError}
              autoFocus
              fluid
              placeholder="Type template name here..."
              onChange={handleTemplateNameChange}
            />
            {displayDuplicateTemplateNameErrorMessage()}
          </Segment>

          <Segment basic>
            <Header
              as="h3"
              content="Speed Test Instructions:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Input
              type="text"
              error={speedTestInstructions === "" && displayMissingInputError}
              fluid
              placeholder="Write instructions for the speed test here..."
              onChange={(e) => setSpeedTestInstructions(e.target.value)}
            />
          </Segment>

          <Segment basic>
            <Header
              as="h3"
              content="Speed Texts:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder="Select texts for the speed test"
              error={speedTexts.length === 0 && displayMissingInputError}
              fluid
              search
              selection
              multiple
              options={dropdownTextFiles}
              onChange={handleSelectSpeedText}
            />
            {displaySpeedTexts()}
          </Segment>
          <Divider />

          <Segment basic>
            <Header
              as="h3"
              content="Scrollable Texts:"
              style={{ paddingTop: 5, marginRight: 10 }}
            />
            <Dropdown
              placeholder="Select texts for the scroll test"
              error={scrollTexts.length === 0 && displayMissingInputError}
              fluid
              search
              selection
              multiple
              options={dropdownTextFiles}
              onChange={handleSelectScrollText}
            />
            {displayScrollTexts()}
          </Segment>
        </Segment>

        <div style={{ display: "flex", float: "right" }}>
          <Button content="Cancel" onClick={() => handleClose(false, null)} />
          <Button positive content="Create" onClick={handleCreate} />
        </div>
      </Modal>
    </div>
  );
};

export default CreateTemplate;
