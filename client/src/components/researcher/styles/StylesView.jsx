import { useEffect, useState } from "react";
import { Modal, Button, Header, List, Segment } from "semantic-ui-react";
import CreateStyle from "./CreateStyle";
import axios from "axios";
import Style from "./Style";

const StylesView = ({ isOpen, close }) => {
  const [openAddStyle, setOpenAddStyle] = useState(false);
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchStyles();
    }
  }, [isOpen]);

  const fetchStyles = () => {
    axios
      .get("/api/getAllStyles")
      .then((response) => setStyles(response.data))
      .catch((error) => console.error("Error fetching used styles:", error));
  };

  const addStyle = (style) => {
    setOpenAddStyle(false);
    axios
      .post("/api/createStyle", {
        style: style,
      })
      .then((response) => {
        setStyles([...styles, response.data]);
      })
      .catch((error) => console.error("Error updating file.styles:", error));
  };

  const handleDeleteStyle = (style) => {
    let displayedStyles = styles;
    displayedStyles = displayedStyles.filter((s) => s !== style);
    setStyles(displayedStyles);

    axios
      .put("/api/deleteStyle", {
        styleID: style._id,
      })
      .catch((error) => console.error("Error deleting style:", error));
  };

  return (
    <Modal style={{ height: "70vh", padding: 10 }} open={isOpen}>
      <Header as="h4" content="Styles" />
      <Segment style={{ overflow: "auto", maxHeight: "75%" }}>
        <List ordered divided relaxed>
          {styles.map((style) => (
            <Style
              key={style._id}
              style={style}
              deleteStyle={() => handleDeleteStyle(style)}
            />
          ))}
        </List>
      </Segment>
      <div style={{ display: "flex", float: "right" }}>
        <Button
          positive
          content="Add Style"
          onClick={() => setOpenAddStyle(true)}
        />
        <Button floated="right" content="Close" onClick={close} />
      </div>
      <CreateStyle
        isOpen={openAddStyle}
        styles={styles}
        addStyle={addStyle}
        close={() => setOpenAddStyle(false)}
      />
    </Modal>
  );
};

export default StylesView;