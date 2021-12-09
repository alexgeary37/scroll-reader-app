import { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Header } from "semantic-ui-react";
import axios from "axios";
import { ExportToCsv } from "export-to-csv";

const DownloadDataForm = ({ isOpen, templates, textFiles, close }) => {
  const [sessionOptions, setSessionOptions] = useState([]);
  const [sessionID, setSessionID] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const fetchSessions = () => {
    axios
      .get("http://localhost:3001/getReadingSessions")
      .then((response) => {
        const readingSessions = response.data;
        const options = [];
        readingSessions.forEach((session) => {
          options.push({
            key: session._id,
            value: session._id,
            text: `User: ${session.userName}, Template: ${
              templates.find((t) => t.key === session.templateID).name
            }, Start Time: ${session.startTime}`,
          });
        });
        setSessionOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching ReadingSessions:", error);
      });
  };

  const getScrollPositionData = async () => {
    return axios
      .get("http://localhost:3001/getScrollPosEntries", {
        params: { sessionID: sessionID },
      })
      .then((response) => {
        return response.data;
      });
  };

  const getReadingSessionData = async () => {
    return axios
      .get("http://localhost:3001/getReadingSession", {
        params: { _id: sessionID },
      })
      .then((response) => {
        return response.data;
      });
  };

  const exportScrollData = async (scrollPosEntries) => {
    // List of lists of entries, each one associated with an
    // individual text from and individual session.
    const entriesByText = [];

    let textNumber = 0;
    let scrollPosIndex = 0;
    for (let i = 0; i < scrollPosEntries.length; i++) {
      // Create separate lists of entries associated with each text.
      if (textNumber !== scrollPosEntries[i].textNumber) {
        entriesByText.push({
          textNumber: textNumber,
          entries: scrollPosEntries.slice(scrollPosIndex, i),
        });
        textNumber = scrollPosEntries[i].textNumber;
        scrollPosIndex = i;
      }
    }

    // Add the last text's list of entries to entriesByText.
    entriesByText.push({
      textNumber: textNumber,
      entries: scrollPosEntries.slice(scrollPosIndex),
    });

    // Export a csv file for each text.
    for (let i = 0; i < entriesByText.length; i++) {
      // Format scroll position entries for exporting to csv.
      const data = formatScrollPosEntriesForCsv(entriesByText[i].entries);
      createCsv(data, `scrollText_${entriesByText[i].textNumber}_positions`);
    }
  };

  const exportReadingSessionData = (readingSessionData, templateData) => {
    const readingSession = {
      userName: readingSessionData.userName,
      startTime: readingSessionData.startTime,
      endTime: readingSessionData.endTime,
      templateName: templateData.name,
      speedTestInstructions: templateData.speedTest.instructions,
    };

    createCsv([readingSession], `readingSession_${readingSessionData._id}`);
  };

  const exportSpeedTextData = (readingSessionData, templateData) => {
    // Deep copy this array to not change the objects in it through changes to the speedTexts variable.
    const speedTexts = JSON.parse(JSON.stringify(templateData.speedTest.texts));

    let textNumber = 0;
    speedTexts.forEach((speedText) => {
      const text = textFiles.find((t) => t.key === speedText.fileID);
      const style = text.styles.find((s) => s._id === speedText.styleID);
      const sessionText = readingSessionData.speedTexts.find(
        (t) => t.fileID === speedText.fileID
      );
      speedText.startTime = sessionText.startTime;
      speedText.endTime = sessionText.endTime;
      speedText.fontFamily = style.fontFamily;
      speedText.fontSize = style.fontSize;
      speedText.lineHeight = style.lineHeight;
      delete speedText.styleID;

      createCsv(sessionText.pauses, `speedText_${textNumber}_pauses`);
      textNumber++;
    });

    createCsv(speedTexts, "speedTexts");
  };

  const exportScrollTextData = (readingSessionData, templateData) => {
    // Deep copy this array to not change the objects in it through changes to the scrollTexts variable.
    const scrollTexts = JSON.parse(JSON.stringify(templateData.scrollTexts));

    let textNumber = 0;
    scrollTexts.forEach((scrollText) => {
      const text = textFiles.find((t) => t.key === scrollText.fileID);
      const style = text.styles.find((s) => s._id === scrollText.styleID);
      const sessionText = readingSessionData.scrollTexts.find(
        (t) => t.fileID === scrollText.fileID
      );
      scrollText.startTime = sessionText.startTime;
      scrollText.endTime = sessionText.endTime;
      scrollText.instructions = scrollText.instructions.main;
      scrollText.questionFormat = text.questionFormat;
      scrollText.userFamiliarity = sessionText.familiarity;
      scrollText.userInterest = sessionText.interest;
      scrollText.fontFamily = style.fontFamily;
      scrollText.fontSize = style.fontSize;
      scrollText.lineHeight = style.lineHeight;

      const scrollTextQuestionIDs = scrollText.questionIDs;

      delete scrollText.styleID;
      delete scrollText.questionIDs;

      createCsv(sessionText.pauses, `scrollText_${textNumber}_pauses`);

      const questionAnswers = [];
      for (let i = 0; i < sessionText.questionAnswers.length; i++) {
        const sessionTextQuestionAnswerEntry = sessionText.questionAnswers[i];
        console.log(sessionTextQuestionAnswerEntry);
        const question = text.questions.find(
          (q) => q._id === scrollTextQuestionIDs[i]
        );
        const correctAnswer = `[${question.answerRegion.startIndex}, ${question.answerRegion.endIndex}]`;
        questionAnswers.push({
          question: question.question,
          userAnswer: sessionTextQuestionAnswerEntry.answer,
          correctAnswer: correctAnswer,
          skip: sessionTextQuestionAnswerEntry.skip,
          yPosition: sessionTextQuestionAnswerEntry.yPosition,
          time: sessionTextQuestionAnswerEntry.time,
        });
      }

      createCsv(questionAnswers, `scrollText_${textNumber}_questionAnswers`);
      textNumber++;
    });

    createCsv(scrollTexts, "scrollTexts");
  };

  const formatScrollPosEntriesForCsv = (entries) => {
    return entries.map((entry) => {
      return { yPos: entry.yPos, time: entry.time };
    });
  };

  const formatViewportDimensionsForCsv = (dimensions) => {
    return dimensions.map((d) => {
      return { width: d.width, height: d.height, time: d.time };
    });
  };

  const createCsv = (data, filename) => {
    if (data.length > 0) {
      const options = {
        filename: filename,
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: true,
      };

      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(data);
    }
  };

  const handleExport = async () => {
    const scrollPositionData = await getScrollPositionData();
    exportScrollData(scrollPositionData);

    const readingSessionData = await getReadingSessionData();
    const templateData = templates.find(
      (t) => t.key === readingSessionData.templateID
    );

    const viewportDimensions = formatViewportDimensionsForCsv(
      readingSessionData.viewportDimensions
    );
    createCsv(viewportDimensions, "viewportDimensions");

    exportReadingSessionData(readingSessionData, templateData);
    exportSpeedTextData(readingSessionData, templateData);
    exportScrollTextData(readingSessionData, templateData);

    handleClose();
  };

  const handleClose = () => {
    setSessionOptions([]);
    setSessionID("");
    close();
  };

  return (
    <Modal open={isOpen} style={{ padding: 10 }}>
      <Header
        as="h2"
        content="Select reading session to download"
        textAlign="center"
      />
      <Dropdown
        placeholder="Select Session"
        fluid
        search
        selection
        options={sessionOptions}
        onChange={(e, data) => setSessionID(data.value)}
      />

      <div style={{ float: "right", paddingTop: 10 }}>
        <Button
          primary
          content="Export Session Data"
          icon="download"
          onClick={handleExport}
        />
        <Button content="Cancel" onClick={handleClose} />
      </div>
    </Modal>
  );
};

export default DownloadDataForm;
