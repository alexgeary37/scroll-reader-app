import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Header, Segment, Tab } from "semantic-ui-react";
import { exportData } from "../../exportData";
import ConfirmDeleteReadingSessionMessage from "./readingSessions/ConfirmDeleteReadingSessionMessage";
import ConfirmExportMessage from "./readingSessions/ConfirmExportMessage";
import ReadingSession from "./readingSessions/ReadingSession";

const ReadingSessionsSection = ({
  textFiles,
  templates,
  readingSessions,
  setReadingSessions,
}) => {
  const [openDeleteReadingSessionMessage, setOpenDeleteReadingSessionMessage] =
    useState(false);
  const [openConfirmExportMessage, setOpenConfirmExportMessage] =
    useState(false);
  const [selectedReadingSessions, setSelectedReadingSessions] = useState([]);

  useEffect(() => {
    // Fetch reading sessions only after templates have been fetched.
    if (!templates.isFetching) {
      fetchReadingSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSingleExport = async (sessionID) => {
    await exportData(sessionID, textFiles.data);
    let sessions = readingSessions.data;
    const session = sessions.find((s) => s.key === sessionID);
    const index = sessions.indexOf(session);
    sessions[index].hasBeenExported = true;
    setReadingSessions({ data: sessions, isFetching: false });

    axios
      .put("/api/setHasBeenExported", { ids: [sessionID] })
      .then(() =>
        setSelectedReadingSessions(
          selectedReadingSessions.filter((r) => r !== sessionID)
        )
      )
      .catch((error) =>
        console.error("Error updating readingSession.hasBeenExported:", error)
      );
  };

  const handleMultipleExport = async () => {
    setOpenConfirmExportMessage(false);
    for (let i = 0; i < selectedReadingSessions.length; i++) {
      await exportData(selectedReadingSessions[i], textFiles.data);
    }
    let sessions = readingSessions.data;
    sessions.forEach((s) => {
      if (selectedReadingSessions.includes(s.key)) {
        s.hasBeenExported = true;
      }
    });
    setReadingSessions({ data: sessions, isFetching: false });

    axios
      .put("/api/setHasBeenExported", { ids: selectedReadingSessions })
      .then(() => setSelectedReadingSessions([]))
      .catch((error) =>
        console.error(
          "Error updating readingSession.hasBeenExported for multiple sessions:",
          error
        )
      );
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

  const tabPane = (displayExported) => {
    return (
      <Tab.Pane>
        <Button
          negative={!selectedReadingSessions.length < 1}
          disabled={selectedReadingSessions.length < 1}
          content="Delete Selected Reading Sessions"
          onClick={() => setOpenDeleteReadingSessionMessage(true)}
        />
        <Button
          primary={!selectedReadingSessions.length < 1}
          disabled={selectedReadingSessions.length < 1}
          content="Export Selected Reading Sessions"
          onClick={() => setOpenConfirmExportMessage(true)}
        />
        <Segment basic style={{ overflow: "auto", maxHeight: "75vh" }}>
          <div className="ui link divided relaxed items">
            {readingSessions.data
              .filter((s) => s.hasBeenExported === displayExported)
              .map((session) => (
                <ReadingSession
                  key={session.key}
                  session={session}
                  toggleSelect={() => handleSelectReadingSession(session.key)}
                  exportSession={() => handleSingleExport(session.key)}
                  deleteReadingSession={() =>
                    handleDeleteReadingSessions([session.key])
                  }
                />
              ))}
          </div>
        </Segment>
        <ConfirmDeleteReadingSessionMessage
          isOpen={openDeleteReadingSessionMessage}
          answerYes={() => handleDeleteReadingSessions(selectedReadingSessions)}
          answerNo={() => setOpenDeleteReadingSessionMessage(false)}
        />
        <ConfirmExportMessage
          isOpen={openConfirmExportMessage}
          answerYes={handleMultipleExport}
          answerNo={() => setOpenConfirmExportMessage(false)}
        />
      </Tab.Pane>
    );
  };

  const displayContent = () => {
    if (!readingSessions.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Reading Sessions" />
          <Tab
            onTabChange={() => setSelectedReadingSessions([])}
            panes={[
              {
                menuItem: "New Reading Sessions",
                render: () => tabPane(false),
              },
              {
                menuItem: "Exported Sessions",
                render: () => tabPane(true),
              },
            ]}
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
