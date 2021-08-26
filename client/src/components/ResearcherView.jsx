import TopMenu from "./TopMenu.jsx";
import CreateTemplate from "./CreateTemplate.jsx";
import DataGraph from "./DataGraph.jsx";
import { Segment, Container } from "semantic-ui-react";
import { Route } from "react-router";

const ResearcherView = () => {
  return (
    <div>
      <TopMenu />
      <div className="page">
        <Segment>
          <Container>
            <Route
              exact
              path="/researcher/create-session-template"
              component={CreateTemplate}
            />
            <Route exact path="/researcher/data" component={DataGraph} />
          </Container>
        </Segment>
      </div>
    </div>
  );
};

export default ResearcherView;
