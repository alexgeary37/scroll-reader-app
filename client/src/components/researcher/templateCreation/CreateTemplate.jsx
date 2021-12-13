import { useEffect, useState } from "react";
import {
  Button,
  Header,
  Segment,
  Modal,
  Dropdown,
  List,
  Input,
} from "semantic-ui-react";
import axios from "axios";
import ScrollTextListItem from "./ScrollTextListItem";
import SpeedTextListItem from "./SpeedTextListItem";

const CreateTemplate = ({ isOpen, close, textFiles }) => {
  const [templateName, setTemplateName] = useState("");
  const [speedTexts, setSpeedTexts] = useState([]);
  const [speedTestInstructions, setSpeedTestInstructions] = useState("");
  const [scrollTexts, setScrollTexts] = useState([]);
  const [displayMissingInputError, setDisplayMissingInputError] =
    useState(false);
  const [dropdownTextFiles, setDropdownTextFiles] = useState([]);

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

  const checkFormInputs = () => {
    let emptyFields = false;

    if (templateName.trim() === "") {
      setDisplayMissingInputError(true);
      emptyFields = true;
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

    return emptyFields;
  };

  const handleCreate = () => {
    const emptyFields = checkFormInputs();

    if (!emptyFields) {
      // Create scrollTexts field.
      const files = [];
      for (let i = 0; i < scrollTexts.length; i++) {
        files.push({
          fileID: scrollTexts[i].fileID,
          instructions: scrollTexts[i].instructions,
          questionIDs: scrollTexts[i].questionIDs,
          styleID: scrollTexts[i].styleID,
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
        .catch((error) => {
          console.error("Error creating session template:", error);
        });
    }
  };

  const handleSelectSpeedText = (e, data) => {
    if (e.target.className === "delete icon") {
      for (let i = 0; i < data.options.length; i++) {
        const optionIndex = data.value.indexOf(data.options[i].value);

        // IF this element is not found in data.value array, and it is still
        // in speedTexts, remove it from speedTexts.
        if (
          optionIndex === -1 &&
          speedTexts.some((elem) => elem.fileID === data.options[i].value)
        ) {
          setSpeedTexts(
            speedTexts.filter((elem) => elem.fileID !== data.options[i].value)
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
            (file) => file.value === data.value[data.value.length - 1]
          ).text,
          styleID: textFiles.find(
            (tf) => tf.value === data.value[data.value.length - 1]
          ).styles[0]._id,
        },
      ]);
    }
  };

  const handleSelectScrollText = (e, data) => {
    if (e.target.className === "delete icon") {
      for (let i = 0; i < data.options.length; i++) {
        const optionIndex = data.value.indexOf(data.options[i].value);

        // IF this element is not found in data.value array, and it is still
        // in scrollTexts, remove it from scrollTexts.
        if (
          optionIndex === -1 &&
          scrollTexts.some((elem) => elem.fileID === data.options[i].value)
        ) {
          setScrollTexts(
            scrollTexts.filter((elem) => elem.fileID !== data.options[i].value)
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
            (file) => file.value === data.value[data.value.length - 1]
          ).text,
          instructions: {
            main: "",
            hasFamiliarityQuestion: true,
            hasInterestQuestion: true,
          },
          questionIDs: [],
          styleID: textFiles.find(
            (tf) => tf.value === data.value[data.value.length - 1]
          ).styles[0]._id,
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

  const handleSelectSpeedTextStyle = (text, styleID) => {
    const index = speedTexts.indexOf(text);
    const tempSpeedTexts = speedTexts;
    tempSpeedTexts[index].styleID = styleID;
    setSpeedTexts(tempSpeedTexts);
  };

  const handleSelectScrollTextStyle = (text, styleID) => {
    const index = scrollTexts.indexOf(text);
    const tempScrollTexts = scrollTexts;
    tempScrollTexts[index].styleID = styleID;
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
  };

  const handleClose = (templateCreated, responseData) => {
    clearData();

    if (templateCreated) {
      const tempSpeedTexts = [];
      responseData.speedTest.texts.forEach((text) => {
        tempSpeedTexts.push({
          fileID: text.fileID,
          name: textFiles.find((tf) => tf.value === text.fileID).name,
          styleID: text.styleID,
        });
      });

      const tempScrollTexts = [];
      responseData.scrollTexts.forEach((fileObj) =>
        tempScrollTexts.push({
          fileID: fileObj.fileID,
          name: textFiles.find((tf) => tf.value === fileObj.fileID).name,
          instructions: fileObj.instructions,
          questionIDs: fileObj.questionIDs,
          styleID: fileObj.styleID,
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
            availableStyles={
              textFiles.find((file) => file.key === text.fileID).styles
            }
            selectStyle={handleSelectSpeedTextStyle}
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
            availableStyles={
              textFiles.find((file) => file.key === text.fileID).styles
            }
            addQuestions={handleAddQuestions}
            selectStyle={handleSelectScrollTextStyle}
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

  return (
    <div>
      <Modal open={isOpen} style={{ height: "70vh", padding: 10 }}>
        <Header as="h1" content="Create a Session Template" />
        <Segment style={{ overflow: "auto", maxHeight: "75%" }}>
          <Segment>
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
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </Segment>

          <Segment>
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

          <Segment>
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

          <Segment>
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

        <div style={{ position: "absolute", right: 10, bottom: 10 }}>
          <Button content="Cancel" onClick={() => handleClose(false, null)} />
          <Button positive content="Create" onClick={handleCreate} />
        </div>
      </Modal>
    </div>
  );
};

export default CreateTemplate;
