import { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Header } from "semantic-ui-react";
import axios from "axios";
import { ExportToCsv } from "export-to-csv";

const DownloadDataForm = ({ isOpen, templates, close }) => {
  const [sessionOptions, setSessionOptions] = useState([]);
  const [sessionIDs, setSessionIDs] = useState([]);

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

  const fetchScrollData = () => {
    axios
      .get("http://localhost:3001/getScrollPosEntries", {
        params: { sessionIDs: sessionIDs },
      })
      .then((response) => {
        const scrollPosEntries = response.data;

        // List of lists of entries, each one associated with an
        // individual text from and individual session.
        const entriesByText = [];

        let sessionID = scrollPosEntries[0].sessionID;
        let textNumber = 0;
        let scrollPosIndex = 0;
        for (let i = 0; i < scrollPosEntries.length; i++) {
          // Create separate lists of entries associated with each text read within each session.
          if (
            textNumber !== scrollPosEntries[i].textNumber ||
            sessionID !== scrollPosEntries[i].sessionID
          ) {
            entriesByText.push({
              textNumber: textNumber,
              entries: scrollPosEntries.slice(scrollPosIndex, i),
            });
            textNumber = scrollPosEntries[i].textNumber;
            sessionID = scrollPosEntries[i].sessionID;
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
          const data = csvFormat(entriesByText[i].entries);
          createCsv(
            data,
            `${entriesByText[i].entries[0].sessionID}_${entriesByText[i].textNumber}`
          );
        }

        handleClose();
      })
      .catch((error) => {
        console.error("Error fetching scroll data:", error);
      });
  };

  const csvFormat = (entries) => {
    return entries.map((entry) => {
      return { yPos: entry.yPos, time: entry.time };
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

  // https://www.codegrepper.com/code-examples/javascript/semantic+ui+react+how+to+get+dropdown+value
  const handleSelectSession = (e, data) => {
    setSessionIDs(data.value);
  };

  const handleClose = () => {
    setSessionOptions([]);
    setSessionIDs([]);
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
        multiple
        options={sessionOptions}
        onChange={handleSelectSession}
      />

      <div style={{ float: "right", paddingTop: 10 }}>
        <Button primary content="Select" onClick={fetchScrollData} />
        <Button content="Cancel" onClick={handleClose} />
      </div>
    </Modal>
  );
};

export default DownloadDataForm;
