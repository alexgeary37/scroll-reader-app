import { Item, Button, Checkbox } from "semantic-ui-react";
import { useState } from "react";
import ConfirmDeleteReadingSessionMessage from "./ConfirmDeleteReadingSessionMessage.jsx";
import ConfirmExportMessage from "./ConfirmExportMessage.jsx";
import { exportData } from "../../../exportData.js";

const ReadingSession = ({
  session,
  textFiles,
  toggleSelect,
  exportSession,
  deleteReadingSession,
}) => {
  const [openDeleteReadingSessionMessage, setOpenDeleteReadingSessionMessage] =
    useState(false);
  const [openConfirmExportMessage, setOpenConfirmExportMessage] =
    useState(false);

  const handleExport = async () => {
    await exportData(session.key, textFiles);
    exportSession();
    setOpenConfirmExportMessage(false);
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
          <div>
            <div className="ui vertical buttons">
              <Button
                primary
                content="Export Session Data"
                icon="download"
                onClick={() => setOpenConfirmExportMessage(true)}
              />
              <Button
                content="Delete"
                onClick={() => setOpenDeleteReadingSessionMessage(true)}
              />
            </div>

            <Checkbox style={{ marginLeft: 10 }} onClick={toggleSelect} />
          </div>
        </div>

        <ConfirmDeleteReadingSessionMessage
          isOpen={openDeleteReadingSessionMessage}
          answerYes={deleteReadingSession}
          answerNo={() => setOpenDeleteReadingSessionMessage(false)}
        />
        <ConfirmExportMessage
          isOpen={openConfirmExportMessage}
          answerYes={handleExport}
          answerNo={() => setOpenConfirmExportMessage(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default ReadingSession;
