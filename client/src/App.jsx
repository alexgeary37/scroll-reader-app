import { Route } from "react-router-dom";
import "./App.css";
import ResearcherView from "./components/ResearcherView.jsx";
import Home from "./components/Home.jsx";
import PageFooter from "./components/PageFooter.jsx";
import { SessionProvider } from "./contexts/SessionContext.jsx";
import { TextProvider } from "./contexts/TextContext.jsx";

const App = () => {
  return (
    <div>
      <TextProvider>
        <SessionProvider>
          <Route path="/researcher/" component={ResearcherView} />
          <Route exact path="/" component={Home} />
        </SessionProvider>
      </TextProvider>
      <PageFooter />
    </div>
  );
};

export default App;
