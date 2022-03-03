import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { parse } from "json2csv";

let numSpeedTexts;
let numScrollTexts;

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
      filename: `scroll_${entriesByText[i].textNumber + 1}_positions`,
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
    filename: `readingSession`,
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

    speedText.name = text.name;
    speedText.startTime = sessionText.startTime;
    speedText.endTime = sessionText.endTime;

    const styles = [
      {
        type: "h1",
        style: speedText.style.h1,
      },
      {
        type: "h2",
        style: speedText.style.h2,
      },
      {
        type: "h3",
        style: speedText.style.h3,
      },
      {
        type: "paragraph",
        style: speedText.style.paragraph,
      },
    ];

    csvs.push({
      data: createCsv(styles),
      filename: `speed_${textNumber + 1}_styles`,
    });

    delete speedText.styleID;
    delete speedText.style;

    if (sessionText.pauses.length > 0) {
      csvs.push({
        data: createCsv(sessionText.pauses),
        filename: `speed_${textNumber + 1}_pauses`,
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

    scrollText.name = text.name;
    scrollText.startTime = sessionText.startTime;
    scrollText.endTime = sessionText.endTime;
    scrollText.instructions = scrollText.instructions.main;
    scrollText.userFamiliarity = sessionText.familiarity;
    scrollText.userInterest = sessionText.interest;

    const styles = [
      {
        type: "h1",
        style: scrollText.style.h1,
      },
      {
        type: "h2",
        style: scrollText.style.h2,
      },
      {
        type: "h3",
        style: scrollText.style.h3,
      },
      {
        type: "paragraph",
        style: scrollText.style.paragraph,
      },
    ];

    csvs.push({
      data: createCsv(styles),
      filename: `scroll_${textNumber + 1}_styles`,
    });

    if (sessionText.pauses.length > 0) {
      csvs.push({
        data: createCsv(sessionText.pauses),
        filename: `scroll_${textNumber + 1}_pauses`,
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
        filename: `scroll_${textNumber + 1}_answerButtonClicks`,
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
    delete scrollText.style;
    delete scrollText.questionIDs;

    if (questionAnswers.length > 0) {
      csvs.push({
        data: createCsv(questionAnswers),
        filename: `scroll_${textNumber + 1}_questionAnswers`,
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
  const speedTestFiles = csvs.filter((c) => c.filename.includes("speed_"));
  const scrollTestFiles = csvs.filter((c) => c.filename.includes("scroll_"));
  const otherFiles = csvs.filter(
    (c) => !c.filename.includes("speed_") && !c.filename.includes("scroll_")
  );

  for (let i = 1; i <= numSpeedTexts; i++) {
    const files = speedTestFiles.filter((f) =>
      f.filename.includes(`speed_${i}`)
    );
    let speedTextFolder = zip.folder(`speedTest/speed_${i}`);
    files.forEach((csv) =>
      speedTextFolder.file(`${csv.filename}.csv`, csv.data)
    );
  }

  for (let i = 1; i <= numScrollTexts; i++) {
    const files = scrollTestFiles.filter((f) =>
      f.filename.includes(`scroll_${i}`)
    );
    let scrollTextFolder = zip.folder(`scrollTest/scroll_${i}`);
    files.forEach((csv) =>
      scrollTextFolder.file(`${csv.filename}.csv`, csv.data)
    );
  }

  otherFiles.forEach((csv) => {
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
  numSpeedTexts = readingSessionData.speedTexts.length;
  numScrollTexts = readingSessionData.scrollTexts.length;

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
