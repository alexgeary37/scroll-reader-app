import { Route } from "react-router-dom";
import "./App.css";
import UserHome from "./components/user/UserHome.jsx";
import { SessionProvider } from "./contexts/SessionContext.jsx";
import SpeedTestWrapper from "./components/user/speed/SpeedTestWrapper.jsx";
import ScrollTestWrapper from "./components/user/scroll/ScrollTestWrapper";
import EndPage from "./components/user/EndPage.jsx";
import ResearcherViewWrapper from "./components/researcher/ResearcherViewWrapper";
import Home from "./components/Home";

const App = () => {
  return (
    <div>
      {/* https://subwaymatch.medium.com/disabling-back-button-in-react-with-react-router-v5-34bb316c99d7 */}
      {/* https://stackoverflow.com/questions/39342195/intercept-handle-browsers-back-button-in-react-router */}
      <Route exact path={`/`} component={Home} />
      <Route path={`/researcher`} component={ResearcherViewWrapper} />
      <SessionProvider>
        <Route path={`/user`} component={UserHome} />
        <Route path={`/speedtest`} component={SpeedTestWrapper} />
        <Route path={`/scrolltest`} component={ScrollTestWrapper} />
        <Route path={`/end`} component={EndPage} />
      </SessionProvider>
    </div>
  );
};

export default App;
