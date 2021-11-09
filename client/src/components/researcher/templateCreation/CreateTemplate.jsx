import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Header,
  Segment,
  Modal,
  Dropdown,
  List,
  Input,
} from "semantic-ui-react";
import axios from "axios";
import ScrollTextListItem from "./ScrollTextListItem";

const CreateTemplate = ({ isOpen, close, textFiles }) => {
  const [templateName, setTemplateName] = useState("");
  const [speedTextIDs, setSpeedTextIDs] = useState([]);
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

    if (templateName === "") {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (speedTextIDs.length === 0) {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (scrollTexts.length === 0) {
      setDisplayMissingInputError(true);
      emptyFields = true;
    }
    if (speedTestInstructions === "") {
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
      // Set files field.
      const files = [];
      for (let i = 0; i < scrollTexts.length; i++) {
        files.push({
          fileID: scrollTexts[i].fileID,
          instructions: scrollTexts[i].instructions,
          questionIDs: scrollTexts[i].questionIDs,
        });
      }

      const template = {
        name: templateName,
        speedTest: {
          fileIDs: speedTextIDs,
          instructions: speedTestInstructions,
        },
        scrollTexts: files,
        createdAt: new Date(),
      };

      axios
        .post("http://localhost:3001/createSessionTemplate", template)
        .then((response) => {
          handleClose(true, response.data);
        })
        .catch((error) => {
          console.error("Error creating session template:", error);
        });
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
        },
      ]);
    }
  };

  const handleAddQuestions = (text, selectedQuestions) => {
    const index = scrollTexts.indexOf(text);
    let tempScrollTexts = scrollTexts;
    tempScrollTexts[index].questionIDs = selectedQuestions;
    setScrollTexts(tempScrollTexts);
  };

  const setScrollTextInstructions = (text, instructions) => {
    const index = scrollTexts.indexOf(text);
    let tempScrollTexts = scrollTexts;
    tempScrollTexts[index].instructions.main = instructions;
    setScrollTexts(tempScrollTexts);
  };

  const setAskQuestion = (text, question) => {
    const index = scrollTexts.indexOf(text);
    let tempScrollTexts = scrollTexts;
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
    setSpeedTextIDs([]);
    setScrollTexts([]);
    setSpeedTestInstructions("");
    setDisplayMissingInputError(false);
  };

  const handleClose = (templateCreated, responseData) => {
    clearData();

    if (templateCreated) {
      const speedTextFileNames = [];
      responseData.speedTest.fileIDs.forEach((fileID) => {
        speedTextFileNames.push({
          fileID: fileID,
          name: textFiles.find((tf) => tf.value === fileID).name,
        });
      });

      const tempScrollTexts = [];
      responseData.scrollTexts.forEach((fileObj) =>
        tempScrollTexts.push({
          fileID: fileObj.fileID,
          name: textFiles.find((tf) => tf.value === fileObj.fileID).name,
          instructions: fileObj.instructions,
          questionIDs: fileObj.questionIDs,
        })
      );

      const template = {
        key: responseData._id,
        name: responseData.name,
        speedTest: {
          texts: speedTextFileNames,
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
            addQuestions={handleAddQuestions}
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
              error={speedTextIDs.length === 0 && displayMissingInputError}
              fluid
              search
              selection
              multiple
              options={dropdownTextFiles}
              onChange={(e, data) => setSpeedTextIDs(data.value)}
            />
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
