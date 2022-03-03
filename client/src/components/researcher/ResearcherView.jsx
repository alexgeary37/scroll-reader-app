import { Container, Grid, Button } from "semantic-ui-react";
import { useState } from "react";
import StylesView from "./styles/StylesView.jsx";
import { clearStorage } from "../../utilities.js";
import TextFilesSection from "./TextFilesSection.jsx";
import TemplatesSection from "./TemplatesSection.jsx";
import ReadingSessionsSection from "./ReadingSessionsSection.jsx";

const ResearcherView = ({ onLogout }) => {
  const [styles, setStyles] = useState({ data: [], isFetching: true });
  const [textFiles, setTextFiles] = useState({ data: [], isFetching: true });
  const [templates, setTemplates] = useState({ data: [], isFetching: true });
  const [readingSessions, setReadingSessions] = useState({
    data: [],
    isFetching: true,
  });
  const [openStylesView, setOpenStylesView] = useState(false);

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
            <Grid.Column width={16}>
              <ReadingSessionsSection
                textFiles={textFiles}
                templates={templates}
                readingSessions={readingSessions}
                setReadingSessions={setReadingSessions}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <StylesView
        isOpen={openStylesView}
        styles={styles}
        setStyles={setStyles}
        close={() => setOpenStylesView(false)}
      />
    </div>
  );
};

export default ResearcherView;
