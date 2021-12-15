import { Item, Button } from "semantic-ui-react";
import { useState } from "react";
import DeleteReadingSessionModal from "./readingSessions/DeleteReadingSessionModal.jsx";
import ConfirmExportModal from "./readingSessions/ConfirmExportModal.jsx";
import { exportData } from "./exportData.js";

const ReadingSession = ({ session, textFiles, deleteReadingSession }) => {
  const [openDeleteReadingSessionModal, setOpenDeleteReadingSessionModal] =
    useState(false);
  const [openConfirmExportModal, setOpenConfirmExportModal] = useState(false);

  const handleAnswerYesExport = () => {
    exportData(session.key, textFiles);
    setOpenConfirmExportModal(false);
  };

  return (
    <Item>
      <Item.Content>
        <div className="wrapper">
          <div>
            <Item.Header
              as="h3"
              style={{ margin: 5 }}
              content={session.userName}
            />
            <Item.Description content={`Template: ${session.templateName}`} />
            <Item.Description content={`Start time: ${session.startTime}`} />
            <Item.Description content={`End time: ${session.endTime}`} />
          </div>
          <div className="ui vertical buttons">
            <Button
              primary
              content="Export Session Data"
              icon="download"
              onClick={() => setOpenConfirmExportModal(true)}
            />
            <Button
              content="Delete"
              onClick={() => setOpenDeleteReadingSessionModal(true)}
            />
          </div>
        </div>

        <DeleteReadingSessionModal
          isOpen={openDeleteReadingSessionModal}
          answerYes={deleteReadingSession}
          answerNo={() => setOpenDeleteReadingSessionModal(false)}
        />
        <ConfirmExportModal
          isOpen={openConfirmExportModal}
          answerYes={handleAnswerYesExport}
          answerNo={() => setOpenConfirmExportModal(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default ReadingSession;
