import { useState, useEffect } from "react";
import { Button, Dropdown, Modal } from "semantic-ui-react";
import { exportData } from "../../exportData.js";

const DownloadData = ({ isOpen, readingSessions, textFiles, close }) => {
  const [sessionID, setSessionID] = useState("");
  const [dropdownReadingSessions, setDropdownReadingSessions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const options = [];
      readingSessions.forEach((session) => {
        options.push({
          key: session.key,
          value: session.key,
          text: session.userName,
        });
      });
      setDropdownReadingSessions(options);
    }
  }, [isOpen]);

  const handleExport = () => {
    exportData(sessionID, textFiles);
    close();
  };

  return (
    <Modal open={isOpen} size="tiny">
      <Dropdown
        placeholder="Select a reading session to export..."
        fluid
        selection
        options={dropdownReadingSessions}
        onChange={(e, data) => setSessionID(data.value)}
      />
      <div style={{ margin: 10, display: "flex", float: "right" }}>
        <Button content="Cancel" onClick={close} />
        <Button
          primary
          icon="download"
          content="Export Session Data"
          onClick={handleExport}
        />
      </div>
    </Modal>
  );
};

export default DownloadData;
