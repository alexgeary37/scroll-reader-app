import { Route } from "react-router-dom";
import "./App.css";
import TopMenu from "./components/TopMenu.jsx";
import PageFooter from "./components/PageFooter.jsx";
import Home from "./components/Home.jsx";
import DataGraph from "./components/DataGraph.jsx";
import { SessionProvider } from "./contexts/SessionContext.jsx";
import { TextProvider } from "./contexts/TextContext";
import { Segment } from "semantic-ui-react";

const App = () => {
  return (
    <div>
      <TopMenu />
      <div className="page">
        <SessionProvider>
          <TextProvider>
            <Segment>
              <Route exact path="/" component={Home} />
              <Route exact path="/data" component={DataGraph} />
            </Segment>
          </TextProvider>
        </SessionProvider>
      </div>
      <PageFooter />
    </div>
  );
};

export default App;
