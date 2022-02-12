import { useEffect, useState } from "react";
import { Modal, Button, Header, List, Item, Segment } from "semantic-ui-react";
import CreateStyle from "./CreateStyle";
import axios from "axios";

const StylesView = ({ isOpen, close }) => {
  const [openAddStyle, setOpenAddStyle] = useState(false);
  const [styles, setStyles] = useState([]);
  const [usedStyleIDs, setUsedStyleIDs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchStyles();
      fetchTemplateStyles();
    }
  }, [isOpen]);

  const fetchStyles = () => {
    axios
      .get("/api/getStyles")
      .then((response) => setStyles(response.data))
      .catch((error) => console.error("Error fetching used styles:", error));
  };

  const fetchTemplateStyles = () => {
    axios
      .get("/api/getUsedStyles")
      .then((response) => {
        setUsedStyleIDs(response.data);
      })
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

  const removeStyle = (style) => {
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
            <Item key={style._id}>
              <div className="wrapper">
                <Item.Description
                  content={`font-family: ${style.fontFamily}`}
                />
                <Item.Description content={`font-size: ${style.fontSize}`} />
                <Item.Description
                  content={`line-height: ${style.lineHeight}`}
                />
                <Item.Description content={`bold: ${style.bold}`} />

                <Button
                  floated="right"
                  disabled={
                    usedStyleIDs.includes(style._id) || styles.length < 2
                  }
                  content="Remove"
                  onClick={() => removeStyle(style)}
                />
              </div>
            </Item>
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
        addStyle={addStyle}
        close={() => setOpenAddStyle(false)}
      />
    </Modal>
  );
};

export default StylesView;
