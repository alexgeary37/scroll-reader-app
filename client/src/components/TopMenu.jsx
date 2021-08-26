import { Menu, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

const TopMenu = () => {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item>
          <Link to="/researcher/create-session-template">Create Session Template</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/researcher/data">Data</Link>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default TopMenu;
