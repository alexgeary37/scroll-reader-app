import { useEffect, useState } from "react";
import { Modal, Divider, Button, Header, List, Item } from "semantic-ui-react";
import AddStyleToTextFile from "./AddStyleToTextFile";
import axios from "axios";

const TextFileStylesView = ({
  isOpen,
  fileID,
  styles,
  usedInTemplate,
  updateFileStyles,
  removeStyle,
  close,
}) => {
  const [openAddStyle, setOpenAddStyle] = useState(false);

  const addStyle = (style) => {
    axios
      .put("http://localhost:3001/addTextFileStyle", {
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
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Header as="h4" content="Styles" />

      <Button
        positive
        content="Add Style"
        onClick={() => setOpenAddStyle(true)}
      />
      <List ordered divided relaxed>
        {styles.map((style) => (
          <Item key={style._id}>
            <div className="wrapper">
              <Item.Description content={`font-family: ${style.fontFamily}`} />
              <Item.Description content={`font-size: ${style.fontSize}`} />
              <Item.Description content={`line-height: ${style.lineHeight}`} />

              <Button
                floated="right"
                disabled={usedInTemplate}
                content="Remove"
                onClick={() => removeStyle(style)}
              />
            </div>
          </Item>
        ))}
      </List>
      <Divider />
      <Button floated="right" content="Close" onClick={close} />

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
