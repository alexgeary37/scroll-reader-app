import { Item, Button } from "semantic-ui-react";
import { useState } from "react";
import DeleteReadingSessionModal from "./readingSessions/DeleteReadingSessionModal";

const ReadingSession = ({ session, deleteReadingSession }) => {
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
