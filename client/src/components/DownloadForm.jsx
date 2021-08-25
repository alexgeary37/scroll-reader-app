import { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Header } from "semantic-ui-react";
import Axios from "axios";

const DownloadForm = ({ open, closeForm, setScrollData }) => {
  const [sessionOptions, setSessionOptions] = useState([]);
  const [sessionID, setSessionID] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    Axios.get("http://localhost:3001/getReadingSessions")
      .then((response) => {
        const readingSessions = response.data;
        const options = [];
        readingSessions.forEach((session) => {
          options.push({
            key: session._id,
            value: session._id,
            text: session.name,
          });
        });
        setSessionOptions(options);
      })
      .catch(() => {
        console.log("Error fetching ReadingSessions");
      });
  }

  async function fetchScrollData() {
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
        console.log("Error fetching scroll data", error);
      });
  }

  // https://www.codegrepper.com/code-examples/javascript/semantic+ui+react+how+to+get+dropdown+value
  const handleSelectSession = (e, data) => {
    setSessionID(data.value);
  };

  const toggleOpenDownloadForm = () => {
    setSessionID("");
    closeForm();
  };

  return (
    <Modal open={open}>
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
      <div className="button-ui">
        <Button primary content="Select" onClick={fetchScrollData} />
        <Button negative content="Cancel" onClick={toggleOpenDownloadForm} />
      </div>
    </Modal>
  );
};

export default DownloadForm;
