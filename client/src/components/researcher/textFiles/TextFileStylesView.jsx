import { useEffect, useState } from "react";
import {
  Modal,
  Divider,
  Button,
  Header,
  List,
  Item,
  Segment,
} from "semantic-ui-react";
import AddStyleToTextFile from "./AddStyleToTextFile";
import axios from "axios";

const TextFileStylesView = ({
  isOpen,
  fileID,
  styles,
  updateFileStyles,
  removeStyle,
  close,
}) => {
  const [openAddStyle, setOpenAddStyle] = useState(false);
  const [usedStyleIDs, setUsedStyleIDs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchTemplateStyles();
    }
  }, [isOpen]);

  const fetchTemplateStyles = () => {
    axios
      .get("/api/getUsedStyles")
      .then((response) => {
        setUsedStyleIDs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching used styles:", error);
      });
  };

  const addStyle = (style) => {
    axios
      .put("/api/addTextFileStyle", {
        id: fileID,
        style: style,
      })
      .then((response) => {
        // Return the latest style just added.
        const newStyle = response.data.styles.at(-1);
        updateFileStyles(newStyle);
      })
      .catch((error) => {
        console.error("Error updating file.styles:", error);
      });
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
      <AddStyleToTextFile
        isOpen={openAddStyle}
        fileID={fileID}
        addStyle={addStyle}
        close={() => setOpenAddStyle(false)}
      />
    </Modal>
  );
};

export default TextFileStylesView;
