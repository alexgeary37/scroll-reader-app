import { Menu, Container } from "semantic-ui-react";
// import { AmplifySignOut } from "@aws-amplify/ui-react";
import { Link, useHistory } from "react-router-dom";

const TopMenu = () => {
  let history = useHistory();
  const handleSignOut = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/data">Data</Link>
        </Menu.Item>
        {/* <Menu.Item fitted position="right"> */}
        {/* <AmplifySignOut onClick={handleSignOut} /> */}
        {/* </Menu.Item> */}
      </Container>
    </Menu>
  );
};

export default TopMenu;
