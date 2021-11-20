import { useContext, useEffect, useState } from "react";
import { Segment, Container, Header } from "semantic-ui-react";
import { SessionContext } from "../../contexts/SessionContext";

const EndPage = () => {
  const sessionContext = useContext(SessionContext);
  const [variablesCleared, setVariablesCleared] = useState(false);

  useEffect(() => {
    if (!variablesCleared) {
      clearSessionVariables();
      sessionContext.initialiseVariables(true);
      setVariablesCleared(true);
    }
  }, [sessionContext]);

  const clearSessionVariables = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("scrollQuestionNumber");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Segment>
        <Container text>
          <Header as="h1" content="Thank you for taking the test!" />
        </Container>
      </Segment>
    </div>
  );
};

export default EndPage;
