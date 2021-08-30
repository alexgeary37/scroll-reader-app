import TopMenu from "./TopMenu.jsx";
import DataGraph from "./data/DataGraph.jsx";
import TextFiles from "./home/TextFiles.jsx";
import { Segment, Container, Divider } from "semantic-ui-react";
import { Route } from "react-router";
import SessionTemplates from "./home/SessionTemplates.jsx";

const ResearcherView = () => {
  const textDocuments = () => {
    const curUrl = window.location.href;
    if (curUrl.substr(curUrl.length - 5) !== "/data") {
      return (
        <div>
          <TextFiles />
        </div>
      );
    }
  };

  const sessionTemplates = () => {
    const curUrl = window.location.href;
    if (curUrl.substr(curUrl.length - 5) !== "/data") {
      return (
        <div>
          <SessionTemplates />
        </div>
      );
    }
  };

  return (
    <div>
      <TopMenu />
      <div className="page">
        <Segment>
          <Container>
            <Route path="/researcher/data" component={DataGraph} />
            {textDocuments()}
            <Divider />
            {sessionTemplates()}
          </Container>
        </Segment>
      </div>
    </div>
  );
};

export default ResearcherView;
