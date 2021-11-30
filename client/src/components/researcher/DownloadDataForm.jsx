import { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Header } from "semantic-ui-react";
import axios from "axios";
import { ExportToCsv } from "export-to-csv";

const DownloadDataForm = ({ isOpen, templates, close }) => {
  const [sessionOptions, setSessionOptions] = useState([]);
  const [sessionID, setSessionID] = useState("");
  const [sessionTemplateID, setSessionTemplateID] = useState("");

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

  const getTemplateData = async (templateID) => {
    return axios
      .get("http://localhost:3001/getSessionTemplate", {
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

    // Export a csv file for each text.
    for (let i = 0; i < entriesByText.length; i++) {
      // Format scroll position entries for exporting to csv.
      const data = formatScrollPosEntriesForCsv(entriesByText[i].entries);
      createCsv(data, `scrollText_${entriesByText[i].textNumber}_positions`);
    }
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
  };

  const handleExport = async () => {
    const scrollPositionData = await getScrollPositionData();
    exportScrollData(scrollPositionData);

    const readingSessionData = await getReadingSessionData();
    const readingSession = {
      userName: readingSessionData.userName,
      startTime: readingSessionData.startTime,
      endTime: readingSessionData.endTime,
    };

    const viewportDimensions = formatViewportDimensionsForCsv(
      readingSessionData.viewportDimensions
    );

    const templateData = await getTemplateData(readingSessionData.templateID);
    readingSession.templateName = templateData.name;
    readingSession.speedTestInstructions = templateData.speedTest.instructions;

    createCsv([readingSession], `readingSession_${readingSessionData._id}`);
    createCsv(viewportDimensions, "viewportDimensions");

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
