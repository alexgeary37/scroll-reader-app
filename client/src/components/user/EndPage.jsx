import { useContext, useEffect, useState } from "react";
import { Segment, Container, Header } from "semantic-ui-react";
import { SessionContext } from "../../contexts/SessionContext";
import { clearStorage } from "../../utilities";

const EndPage = () => {
  const sessionContext = useContext(SessionContext);
  const [variablesCleared, setVariablesCleared] = useState(false);

  useEffect(() => {
    if (!variablesCleared) {
      clearStorage(sessionContext);
      setVariablesCleared(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionContext]);

  return (
    <div style={{ textAlign: "center", marginTop: "25vh" }}>
      <Segment basic>
        <Container text>
          <Header as="h2" content="Thank you for taking the test!" />
        </Container>
      </Segment>
    </div>
  );
};

export default EndPage;
