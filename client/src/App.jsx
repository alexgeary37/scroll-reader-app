import { Route } from "react-router-dom";
import "./App.css";
import Home from "./components/user/Home.jsx";
import { SessionProvider } from "./contexts/SessionContext.jsx";
import SpeedTestWrapper from "./components/user/speed/SpeedTestWrapper.jsx";
import ScrollTestWrapper from "./components/user/scroll/ScrollTestWrapper";
import EndPage from "./components/user/EndPage.jsx";
import ResearcherViewWrapper from "./components/researcher/ResearcherViewWrapper";

const App = () => {
  return (
    <div>
      <Route path={`/researcher`} component={ResearcherViewWrapper} />
      <SessionProvider>
        <Route path={`/user`} component={Home} />
        <Route path={`/speedtest`} component={SpeedTestWrapper} />
        <Route path={`/scrolltest`} component={ScrollTestWrapper} />
        <Route path={`/end`} component={EndPage} />
      </SessionProvider>
    </div>
  );
};

export default App;
