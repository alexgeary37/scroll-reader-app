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
    <div
    // style={{ backgroundColor: "green" }}
    >
      <Route path={`/researcher`} component={ResearcherView} />
      <SessionProvider>
        <Route path={`/user`} component={Home} />
        <Route path={`/speedtest`} component={SpeedTest} />
        <Route path={`/scrolltest`} component={ScrollTest} />
        <Route path={`/end`} component={EndPage} />
      </SessionProvider>
      <PageFooter />
    </div>
  );
};

export default App;

// const [locations, setLocations] = useState([]);
// const history = useHistory();
// const [currentPathName, setCurrentPathName] = useState(null);
// const [currentSearch, setCurrentSearch] = useState(null);

// https://subwaymatch.medium.com/disabling-back-button-in-react-with-react-router-v5-34bb316c99d7
// useEffect(() => {
//   return history.listen((newLocation, action) => {
//     console.log("history::", history);
//     if (action === "PUSH") {
//       console.log("PUSH");
//       if (
//         newLocation.pathname !== currentPathName ||
//         newLocation.search !== currentSearch
//       ) {
//         // Save new location
//         setCurrentPathName(newLocation.pathname);
//         setCurrentSearch(newLocation.search);

//         // Clone location object and push it to history
//         history.push({
//           pathname: newLocation.pathname,
//           search: newLocation.search,
//         });
//       }
//     } else {
//       // Send user back if they try to navigate back
//       history.go(1);
//       console.log("POP");
//     }
//   });
// });

// https://stackoverflow.com/questions/39342195/intercept-handle-browsers-back-button-in-react-router
// useEffect(() => {
//   return history.listen((location) => {
//     console.log("history::", history);
//     console.log("locations::", locations);
//     if (history.action === "PUSH") {
//       console.log("Push");
//       setLocations([location]);
//     }
//     if (history.action === "POP") {
//       console.log("POP");
//       if (locations[1] === location) {
//         console.log("Forward");
//         // Remove (pop) the first (current) location from locations.
//         setLocations(([_, ...locations]) => locations);
//       } else {
//         console.log("Back");
//         // Add the new location to the beginning of locations.
//         setLocations([location, ...locations]);
//       }
//     }
//   });
// }, [locations]);
