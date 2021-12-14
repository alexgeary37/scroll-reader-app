import { List, Item, Button } from "semantic-ui-react";
// import ReadingSessionView from "./readingSessions/ReadingSessionView";
import { useState } from "react";
// import DeleteReadingSessionModal from "./readingSessions/DeleteReadingSessionModal";

const ReadingSession = ({ session, deleteReadingSession }) => {
  const [openReadingSessionView, setOpenReadingSessionView] = useState(false);
  const [openDeleteReadingSessionModal, setOpenDeleteReadingSessionModal] =
    useState(false);

  return (
    <Item>
      <Item.Content>
        <div onClick={() => setOpenReadingSessionView(true)}>
          <Item.Header as="h3" style={{ margin: 5 }} content={session.name} />
          <Item.Description
            as="h5"
            style={{ margin: 5 }}
            content="Speedtest texts:"
          />
          <List style={{ marginLeft: 20 }} horizontal divided>
            {session.speedTest.texts.map((text) => (
              <Item key={text.fileID}>
                <Item.Content>
                  <Item.Description
                    content={`${session.speedTest.texts.indexOf(text) + 1}. ${
                      text.name
                    }`}
                  />
                </Item.Content>
              </Item>
            ))}
          </List>
        </div>
        <div className="wrapper">
          <Button
            content="Delete"
            onClick={() => setOpenDeleteReadingSessionModal(true)}
          />
        </div>

        {/* <ReadingSessionView
          isOpen={openReadingSessionView}
          session={session}
          close={() => setOpenReadingSessionView(false)}
        />
        <DeleteReadingSessionModal
          isOpen={openDeleteReadingSessionModal}
          answerYes={deleteReadingSession}
          answerNo={() => setOpenDeleteReadingSessionModal(false)}
        /> */}
      </Item.Content>
    </Item>
  );
};

export default ReadingSession;
