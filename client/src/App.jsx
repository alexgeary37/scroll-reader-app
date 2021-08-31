import { Route } from "react-router-dom";
import "./App.css";
import ResearcherView from "./components/researcher/ResearcherView.jsx";
import Home from "./components/Home.jsx";
import PageFooter from "./components/PageFooter.jsx";
import { SessionProvider } from "./contexts/SessionContext.jsx";
import ScrollText from "./components/ScrollText.jsx";
import SpeedText from "./components/SpeedText.jsx";

const App = () => {
  return (
    <div>
      <Route path="/researcher" component={ResearcherView} />
      <SessionProvider>
        <Route path="/user" component={Home} />
        <Route path="/scrolltext" component={ScrollText} />
        <Route path="/speedtext" component={SpeedText} />
      </SessionProvider>
      <PageFooter />
    </div>
  );
};

export default App;
