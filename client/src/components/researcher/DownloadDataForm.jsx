import { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Header } from "semantic-ui-react";
import axios from "axios";

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
        const entriesBySession = [];

        let sessionID = scrollPosEntries[0].sessionID;
        let scrollPosIndex = 0;
        for (let i = 0; i < scrollPosEntries.length; i++) {
          if (sessionID !== scrollPosEntries[i].sessionID) {
            entriesBySession.push(scrollPosEntries.slice(scrollPosIndex, i));
            sessionID = scrollPosEntries[i].sessionID;
            scrollPosIndex = i;
          }
        }
        entriesBySession.push(scrollPosEntries.slice(scrollPosIndex));

        console.log("entriesBySession::", entriesBySession);
        // Export scrollPosEntries to csv.
        handleClose();
      })
      .catch((error) => {
        console.error("Error fetching scroll data:", error);
      });
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
