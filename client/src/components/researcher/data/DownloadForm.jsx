import { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Header } from "semantic-ui-react";
import Axios from "axios";

const DownloadForm = ({ open, closeForm, setScrollData }) => {
  const [sessionOptions, setSessionOptions] = useState([]);
  const [sessionID, setSessionID] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = () => {
    Axios.get("http://localhost:3001/getReadingSessions")
      .then((response) => {
        const readingSessions = response.data;
        const options = [];
        readingSessions.forEach((session) => {
          options.push({
            key: session._id,
            value: session._id,
            text: session.userName,
          });
        });
        setSessionOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching ReadingSessions:", error);
      });
  };

  const fetchScrollData = () => {
    Axios.get("http://localhost:3001/getScrollPosEntries", {
      params: { sessionID: sessionID },
    })
      .then((response) => {
        const scrollPosEntries = response.data;
        const positions = [];
        const timestamps = [];
        scrollPosEntries.forEach((entry) => {
          positions.push(entry.yPos);
          timestamps.push(entry.time);
        });
        setScrollData({ yPositions: positions, timestamps: timestamps });
        toggleOpenDownloadForm();
      })
      .catch((error) => {
        console.error("Error fetching scroll data:", error);
      });
  };

  // https://www.codegrepper.com/code-examples/javascript/semantic+ui+react+how+to+get+dropdown+value
  const handleSelectSession = (e, data) => {
    setSessionID(data.value);
  };

  const toggleOpenDownloadForm = () => {
    setSessionID("");
    closeForm();
  };

  return (
    <Modal open={open} style={{ padding: 10 }}>
      <Header
        as="h2"
        content="Select session to download"
        textAlign="center"
        className="h2-sui"
      />
      <Dropdown
        placeholder="Select Session"
        fluid
        search
        selection
        options={sessionOptions}
        onChange={handleSelectSession}
      />
      <div style={{ float: "right", paddingTop: 10 }}>
        <Button primary content="Select" onClick={fetchScrollData} />
        <Button content="Cancel" onClick={toggleOpenDownloadForm} />
      </div>
    </Modal>
  );
};

export default DownloadForm;
