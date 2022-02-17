import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { parse } from "json2csv";

const getScrollPositionData = async (sessionID) => {
  return axios
    .get("/api/getScrollPosEntries", {
      params: { sessionID: sessionID },
    })
    .then((response) => {
      return response.data;
    });
};

const getReadingSessionData = async (sessionID) => {
  return axios
    .get("/api/getReadingSession", {
      params: { _id: sessionID },
    })
    .then((response) => {
      return response.data;
    });
};

const getTemplateData = async (templateID) => {
  return axios
    .get("/api/getSessionTemplate", {
      params: { _id: templateID },
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

  const csvs = [];

  // Export a csv file for each text.
  for (let i = 0; i < entriesByText.length; i++) {
    // Format scroll position entries for exporting to csv.
    const data = formatScrollPosEntriesForCsv(entriesByText[i].entries);

    csvs.push({
      data: createCsv(data),
      filename: `scrollText_${entriesByText[i].textNumber + 1}_positions`,
    });
  }

  return csvs;
};

const exportReadingSessionData = (readingSessionData, templateData) => {
  const readingSession = {
    userName: readingSessionData.userName,
    startTime: readingSessionData.startTime,
    endTime: readingSessionData.endTime,
    templateName: templateData.name,
    speedTestInstructions: templateData.speedTest.instructions,
  };

  const csv = {
    data: createCsv([readingSession]),
    filename: `readingSession_${readingSessionData._id}`,
  };

  return csv;
};

const exportSpeedTextData = (readingSessionData, textFiles, templateData) => {
  // Deep copy this array to not change the objects in it through changes to the speedTexts variable.
  const speedTexts = JSON.parse(JSON.stringify(templateData.speedTest.texts));

  const csvs = [];
  let textNumber = 0;
  speedTexts.forEach((speedText) => {
    const text = textFiles.find((t) => t.key === speedText.fileID);
    const sessionText = readingSessionData.speedTexts.find(
      (t) => t.fileID === speedText.fileID
    );

    const h1Style = speedText.style.h1;
    const h2Style = speedText.style.h2;
    const h3Style = speedText.style.h3;
    const paragraphStyle = speedText.style.paragraph;

    speedText.name = text.name;
    speedText.startTime = sessionText.startTime;
    speedText.endTime = sessionText.endTime;

    speedText.h1FontFamily = h1Style.fontFamily;
    speedText.h1FontSize = h1Style.fontSize;
    speedText.h1FontWeight = h1Style.fontWeight;
    speedText.h1LineHeight = h1Style.lineHeight;

    speedText.h2FontFamily = h2Style.fontFamily;
    speedText.h2FontSize = h2Style.fontSize;
    speedText.h2FontWeight = h2Style.fontWeight;
    speedText.h2LineHeight = h2Style.lineHeight;

    speedText.h3FontFamily = h3Style.fontFamily;
    speedText.h3FontSize = h3Style.fontSize;
    speedText.h3FontWeight = h3Style.fontWeight;
    speedText.h3LineHeight = h3Style.lineHeight;

    speedText.paragraphFontFamily = paragraphStyle.fontFamily;
    speedText.paragraphFontSize = paragraphStyle.fontSize;
    speedText.paragraphFontWeight = paragraphStyle.fontWeight;
    speedText.paragraphLineHeight = paragraphStyle.lineHeight;

    delete speedText.styleID;

    if (sessionText.pauses.length > 0) {
      csvs.push({
        data: createCsv(sessionText.pauses),
        filename: `speedText_${textNumber + 1}_pauses`,
      });
    }

    textNumber++;
  });

  csvs.push({
    data: createCsv(speedTexts),
    filename: "speedTexts",
  });

  return csvs;
};

const exportScrollTextData = (readingSessionData, textFiles, templateData) => {
  // Deep copy this array to not change the objects in it through changes to the scrollTexts variable.
  const scrollTexts = JSON.parse(JSON.stringify(templateData.scrollTexts));

  const csvs = [];
  let textNumber = 0;
  scrollTexts.forEach((scrollText) => {
    const text = textFiles.find((t) => t.key === scrollText.fileID);
    const sessionText = readingSessionData.scrollTexts.find(
      (t) => t.fileID === scrollText.fileID
    );

    const h1Style = scrollText.style.h1;
    const h2Style = scrollText.style.h2;
    const h3Style = scrollText.style.h3;
    const paragraphStyle = scrollText.style.paragraph;

    scrollText.name = text.name;
    scrollText.startTime = sessionText.startTime;
    scrollText.endTime = sessionText.endTime;
    scrollText.instructions = scrollText.instructions.main;
    scrollText.userFamiliarity = sessionText.familiarity;
    scrollText.userInterest = sessionText.interest;

    scrollText.h1FontFamily = h1Style.fontFamily;
    scrollText.h1FontSize = h1Style.fontSize;
    scrollText.h1FontWeight = h1Style.fontWeight;
    scrollText.h1LineHeight = h1Style.lineHeight;

    scrollText.h2FontFamily = h2Style.fontFamily;
    scrollText.h2FontSize = h2Style.fontSize;
    scrollText.h2FontWeight = h2Style.fontWeight;
    scrollText.h2LineHeight = h2Style.lineHeight;

    scrollText.h3FontFamily = h3Style.fontFamily;
    scrollText.h3FontSize = h3Style.fontSize;
    scrollText.h3FontWeight = h3Style.fontWeight;
    scrollText.h3LineHeight = h3Style.lineHeight;

    scrollText.paragraphFontFamily = paragraphStyle.fontFamily;
    scrollText.paragraphFontSize = paragraphStyle.fontSize;
    scrollText.paragraphFontWeight = paragraphStyle.fontWeight;
    scrollText.paragraphLineHeight = paragraphStyle.lineHeight;

    if (sessionText.pauses.length > 0) {
      csvs.push({
        data: createCsv(sessionText.pauses),
        filename: `scrollText_${textNumber + 1}_pauses`,
      });
    }

    const answerButtonClicks = [];

    sessionText.answerButtonClicks.forEach((bc) => {
      const question = text.questions.find(
        (q) => q._id === scrollText.questionIDs[bc.questionNumber]
      );

      answerButtonClicks.push({
        question: question.question,
        action: bc.action,
        time: bc.time,
      });
    });

    if (answerButtonClicks.length > 0) {
      csvs.push({
        data: createCsv(answerButtonClicks),
        filename: `scrollText_${textNumber + 1}_answerButtonClicks`,
      });
    }

    const questionAnswers = [];

    sessionText.questionAnswers.forEach((questionAnswer) => {
      const question = text.questions.find(
        (q) => q._id === scrollText.questionIDs[questionAnswer.questionNumber]
      );
      const correctAnswer = `[${question.answerRegion.startIndex}, ${question.answerRegion.endIndex}]`;

      questionAnswers.push({
        question: question.question,
        questionFormat: question.questionFormat,
        userAnswer: questionAnswer.answer,
        correctAnswer: correctAnswer,
        skip: questionAnswer.skip,
        yPosition: questionAnswer.yPosition,
        time: questionAnswer.time,
      });
    });

    delete scrollText.styleID;
    delete scrollText.questionIDs;

    if (questionAnswers.length > 0) {
      csvs.push({
        data: createCsv(questionAnswers),
        filename: `scrollText_${textNumber + 1}_questionAnswers`,
      });
    }

    textNumber++;
  });

  csvs.push({
    data: createCsv(scrollTexts),
    filename: "scrollTexts",
  });

  return csvs;
};

const formatScrollPosEntriesForCsv = (entries) => {
  const firstEntryTime = Date.parse(entries[0].time);
  return entries.map((entry) => {
    return {
      yPos: entry.yPos,
      time: entry.time,
      "elapsedTime(milliseconds)": Date.parse(entry.time) - firstEntryTime,
    };
  });
};

const formatViewportDimensionsForCsv = (dimensions) => {
  return dimensions.map((d) => {
    return { width: d.width, height: d.height, time: d.time };
  });
};

const createCsv = (data) => {
  if (data.length > 0) {
    const fields = Object.keys(data[0]);

    let csv;
    try {
      csv = parse(data, { fields });
    } catch (error) {
      console.error("Error parsing data on export:", error);
    }

    return csv;
  }
};

const downloadZip = async (csvs, sessionID) => {
  let zip = new JSZip();
  let folder = zip.folder("speedTest");
  folder.file("smile.csv", csvs[0].data);
  csvs.forEach((csv) => {
    zip.file(`${csv.filename}.csv`, csv.data);
  });
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `export_${sessionID}.zip`);
    return true;
  });
};

export const exportData = async (sessionID, textFiles) => {
  let csvs = [];

  const scrollPositionData = await getScrollPositionData(sessionID);
  const scrollDataCsvs = await exportScrollData(scrollPositionData);
  csvs = csvs.concat(scrollDataCsvs);

  const readingSessionData = await getReadingSessionData(sessionID);
  const templateData = await getTemplateData(readingSessionData.templateID);

  const viewportDimensions = formatViewportDimensionsForCsv(
    readingSessionData.viewportDimensions
  );
  const viewPortDimsCsv = {
    data: createCsv(viewportDimensions),
    filename: "viewportDimensions",
  };
  csvs = csvs.concat(viewPortDimsCsv);

  const readingSessionCsv = exportReadingSessionData(
    readingSessionData,
    templateData
  );
  csvs = csvs.concat(readingSessionCsv);

  const speedTestCsvs = exportSpeedTextData(
    readingSessionData,
    textFiles,
    templateData
  );
  csvs = csvs.concat(speedTestCsvs);

  const scrollTextCsvs = exportScrollTextData(
    readingSessionData,
    textFiles,
    templateData
  );
  csvs = csvs.concat(scrollTextCsvs);

  return await downloadZip(csvs, sessionID);
};
