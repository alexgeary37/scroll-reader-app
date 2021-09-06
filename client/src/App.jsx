import { Route } from "react-router-dom";
import "./App.css";
import ResearcherView from "./components/researcher/ResearcherView.jsx";
import Home from "./components/user/Home.jsx";
import PageFooter from "./components/PageFooter.jsx";
import { SessionProvider } from "./contexts/SessionContext.jsx";
import SpeedTest from "./components/user/SpeedTest.jsx";
import ScrollTest from "./components/user/ScrollTest.jsx";
import EndPage from "./components/user/EndPage.jsx";

const App = () => {
  return (
    <div>
      <Route path="/researcher" component={ResearcherView} />
      <SessionProvider>
        <Route path="/user" component={Home} />
        <Route path="/speedtest" component={SpeedTest} />
        <Route path="/scrolltest" component={ScrollTest} />
        <Route path="/end" component={EndPage} />
      </SessionProvider>
      <PageFooter />
    </div>
  );
};

export default App;
