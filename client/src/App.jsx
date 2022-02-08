import { Route, useHistory } from "react-router-dom";
import "./App.css";
import UserHome from "./components/user/UserHome.jsx";
import { SessionProvider } from "./contexts/SessionContext.jsx";
import SpeedTestWrapper from "./components/user/speed/SpeedTestWrapper.jsx";
import ScrollTestWrapper from "./components/user/scroll/ScrollTestWrapper";
import EndPage from "./components/user/EndPage.jsx";
import ResearcherViewWrapper from "./components/researcher/ResearcherViewWrapper";
import Home from "./components/Home";
// import { useEffect, useState } from "react";

const App = () => {
  // const history = useHistory();
  // const [locations, setLocations] = useState([]);
  // const [locationKeys, setLocationKeys] = useState([]);
  // const [currentPathname, setCurrentPathname] = useState(null);
  // const [currentSearch, setCurrentSearch] = useState(null);

  return (
    <div>
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
//       if (locations[1].pathname === location.pathname) {
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
