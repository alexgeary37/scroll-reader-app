import { useState } from "react";
import { Modal, Button, Header, List, Segment } from "semantic-ui-react";
import CreateStyle from "./CreateStyle";
import axios from "axios";
import Style from "./Style";

const StylesView = ({ isOpen, styles, setStyles, close }) => {
  const [openAddStyle, setOpenAddStyle] = useState(false);

  const addStyle = (style) => {
    setOpenAddStyle(false);
    axios
      .post("/api/createStyle", {
        style: style,
      })
      .then((response) => {
        setStyles({ data: [...styles.data, response.data], isFetching: false });
      })
      .catch((error) => console.error("Error updating file.styles:", error));
  };

  const handleDeleteStyle = (style) => {
    let displayedStyles = styles.data;
    displayedStyles = displayedStyles.filter((s) => s !== style);
    setStyles({ data: displayedStyles, isFetching: false });

    axios
      .put("/api/deleteStyle", {
        styleID: style._id,
      })
      .catch((error) => console.error("Error deleting style:", error));
  };

  const displayStylesList = () => {
    if (!styles.isFetching) {
      return (
        <List ordered divided relaxed>
          {styles.data.map((style) => (
            <Style
              key={style._id}
              style={style}
              deleteStyle={() => handleDeleteStyle(style)}
            />
          ))}
        </List>
      );
    }
  };

  return (
    <Modal style={{ height: "70vh", padding: 10 }} open={isOpen}>
      <Header as="h4" content="Styles" />
      <Segment style={{ overflow: "auto", maxHeight: "75%" }}>
        {displayStylesList()}
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
        styles={styles.data}
        addStyle={addStyle}
        close={() => setOpenAddStyle(false)}
      />
    </Modal>
  );
};

export default StylesView;
