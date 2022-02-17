import { Segment, Container, Grid, Header, Button } from "semantic-ui-react";
import { useState, useEffect } from "react";
import ReadingSession from "./readingSessions/ReadingSession.jsx";
import StylesView from "./styles/StylesView.jsx";
import axios from "axios";
import { clearStorage } from "../../utilities.js";
import ConfirmDeleteReadingSessionMessage from "./readingSessions/ConfirmDeleteReadingSessionMessage.jsx";
import TextFilesSection from "./TextFilesSection.jsx";
import TemplatesSection from "./TemplatesSection.jsx";

const ResearcherView = ({ onLogout }) => {
  const [textFiles, setTextFiles] = useState({ data: [], isFetching: true });
  const [templates, setTemplates] = useState({ data: [], isFetching: true });
  const [readingSessions, setReadingSessions] = useState({
    data: [],
    isFetching: true,
  });
  const [selectedReadingSessions, setSelectedReadingSessions] = useState([]);
  const [openStylesView, setOpenStylesView] = useState(false);
  const [openDeleteReadingSessionMessage, setOpenDeleteReadingSessionMessage] =
    useState(false);

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

  const handleSelectReadingSession = (sessionID) => {
    if (selectedReadingSessions.includes(sessionID)) {
      setSelectedReadingSessions(
        selectedReadingSessions.filter((r) => r !== sessionID)
      );
    } else {
      setSelectedReadingSessions([...selectedReadingSessions, sessionID]);
    }
  };

  const displayReadingSessions = () => {
    if (!readingSessions.isFetching) {
      return (
        <div>
          <Header as="h1" textAlign="center" content="Reading Sessions" />
          <Button
            negative
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
    }
  };

  return (
    <div className="researcher">
      <Container>
        <Grid>
          <Grid.Row>
            <Button negative content="Logout" onClick={onLogout} />
            <Button
              content="Clear Storage"
              onClick={() => clearStorage(null)}
            />
            <Button content="Styles" onClick={() => setOpenStylesView(true)} />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <TextFilesSection
                textFiles={textFiles}
                setTextFiles={setTextFiles}
                templates={templates}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <TemplatesSection
                textFiles={textFiles}
                templates={templates}
                setTemplates={setTemplates}
                readingSessions={readingSessions}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>{displayReadingSessions()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <StylesView
        isOpen={openStylesView}
        close={() => setOpenStylesView(false)}
      />
    </div>
  );
};

export default ResearcherView;
