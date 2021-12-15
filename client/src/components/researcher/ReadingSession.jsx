import { Item, Button } from "semantic-ui-react";
import { useState } from "react";
import DeleteReadingSessionModal from "./readingSessions/DeleteReadingSessionModal.jsx";
import { handleExport } from "./exportData.js";

const ReadingSession = ({ session, textFiles, deleteReadingSession }) => {
  const [openDeleteReadingSessionModal, setOpenDeleteReadingSessionModal] =
    useState(false);

  return (
    <Item>
      <Item.Content>
        <Item.Header as="h3" style={{ margin: 5 }} content={session.userName} />
        <Item.Description content={`Template: ${session.templateName}`} />
        <Item.Description content={`Start time: ${session.startTime}`} />
        <Item.Description content={`End time: ${session.endTime}`} />

        <Button
          content="Delete"
          onClick={() => setOpenDeleteReadingSessionModal(true)}
        />
        <Button
          primary
          content="Export Session Data"
          icon="download"
          onClick={() => handleExport(session.key, textFiles)}
        />

        <DeleteReadingSessionModal
          isOpen={openDeleteReadingSessionModal}
          answerYes={deleteReadingSession}
          answerNo={() => setOpenDeleteReadingSessionModal(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default ReadingSession;
