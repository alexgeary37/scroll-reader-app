import { useEffect, useState } from "react";
import Login from "../login";
import ResearcherView from "./ResearcherView";

const ResearcherViewWrapper = () => {
  const [userIsSignedIn, setUserIsSignedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserIsSignedIn(true);
    } else {
      setUserIsSignedIn(false);
    }
  }, []);

  const onLoginSuccessful = () => {
    setUserIsSignedIn(true);
  };

  const onLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    setUserIsSignedIn(false);
  };

  const displayPage = () => {
    if (userIsSignedIn) {
      return <ResearcherView onLogout={onLogout} />;
    } else {
      return <Login onLoginSuccessful={onLoginSuccessful} />;
    }
  };

  return displayPage();
};

export default ResearcherViewWrapper;
