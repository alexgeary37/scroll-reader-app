import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Header, Segment, Tab } from "semantic-ui-react";
import ConfirmDeleteReadingSessionMessage from "./readingSessions/ConfirmDeleteReadingSessionMessage";
import ReadingSession from "./readingSessions/ReadingSession";

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
            hasBeenExported: session.hasBeenExported,
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

  const panes = [
    {
      menuItem: "New Reading Sessions",
      render: () => (
        <Tab.Pane>
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
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Exported Sessions",
      render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
    },
  ];

  const displayContent = () => {
    if (!readingSessions.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Reading Sessions" />
          <Tab panes={panes} />
        </div>
      );
    } else {
      return <div />;
    }
  };

  return displayContent();
};

export default ReadingSessionsSection;
