// const panes = [
//   { menuItem: "Tab 1", render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
//   { menuItem: "Tab 2", render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
//   { menuItem: "Tab 3", render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
// ];

import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import ConfirmDeleteReadingSessionMessage from "./readingSessions/ConfirmDeleteReadingSessionMessage";
import ReadingSession from "./readingSessions/ReadingSession";

// const TabExampleBasic = () => <Tab panes={panes} />;

const ReadingSessionsSection = ({
  textFiles,
  templates,
  readingSessions,
  setReadingSessions,
}) => {
  const [openDeleteReadingSessionMessage, setOpenDeleteReadingSessionMessage] =
    useState(false);
  const [selectedReadingSessions, setSelectedReadingSessions] = useState([]);

  useEffect(() => {
    // Fetch reading sessions only after templates have been fetched.
    if (!templates.isFetching) {
      fetchReadingSessions();
    }
  }, [templates.isFetching]);

  const fetchReadingSessions = () => {
    setReadingSessions({ data: readingSessions.data, isFetching: false });

    axios
      .get("/api/getReadingSessions")
      .then((response) => {
        const options = [];
        const data = response.data;
        data.forEach((session) => {
          const option = {
            key: session._id,
            userName: session.userName,
            templateID: session.templateID,
            templateName: templates.data.find(
              (t) => t.key === session.templateID
            ).name,
            startTime: session.startTime,
            endTime: session.endTime,
          };

          options.push(option);
        });

        // Set readingSessions for rendering, and indicate that they are no longer being fetched.
        setReadingSessions({ data: options, isFetching: false });
      })
      .catch((error) =>
        console.error("Error fetching reading sessions:", error)
      );
  };

  const handleSelectReadingSession = (sessionID) => {
    if (selectedReadingSessions.includes(sessionID)) {
      setSelectedReadingSessions(
        selectedReadingSessions.filter((r) => r !== sessionID)
      );
    } else {
      setSelectedReadingSessions([...selectedReadingSessions, sessionID]);
    }
  };

  const handleDeleteReadingSessions = (sessionsToDelete) => {
    setOpenDeleteReadingSessionMessage(false);
    let sessions = readingSessions.data;
    sessions = sessions.filter((s) => !sessionsToDelete.includes(s.key));
    setReadingSessions({ data: sessions, isFetching: false });

    axios
      .put("/api/deleteScrollPosEntries", {
        sessionIDs: sessionsToDelete,
      })
      .catch((error) =>
        console.error("Error deleting scroll position entries", error)
      );

    axios
      .put("/api/deleteReadingSessions", {
        readingSessionIDs: sessionsToDelete,
      })
      .then(() => setSelectedReadingSessions([]))
      .catch((error) =>
        console.error("Error deleting reading sessions:", error)
      );
  };

  const displayContent = () => {
    if (!readingSessions.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Reading Sessions" />
          <Button
            negative={!selectedReadingSessions.length < 1}
            disabled={selectedReadingSessions.length < 1}
            content="Delete Selected Reading Sessions"
            onClick={() => setOpenDeleteReadingSessionMessage(true)}
          />
          <Segment style={{ overflow: "auto", maxHeight: "75vh" }}>
            <div className="ui link divided relaxed items">
              {readingSessions.data.map((session) => (
                <ReadingSession
                  key={session.key}
                  session={session}
                  textFiles={textFiles.data}
                  toggleSelect={() => handleSelectReadingSession(session.key)}
                  deleteReadingSession={() =>
                    handleDeleteReadingSessions([session.key])
                  }
                />
              ))}
            </div>
          </Segment>
          <ConfirmDeleteReadingSessionMessage
            isOpen={openDeleteReadingSessionMessage}
            answerYes={() =>
              handleDeleteReadingSessions(selectedReadingSessions)
            }
            answerNo={() => setOpenDeleteReadingSessionMessage(false)}
          />
        </div>
      );
    } else {
      return <div />;
    }
  };

  return displayContent();
};

export default ReadingSessionsSection;
