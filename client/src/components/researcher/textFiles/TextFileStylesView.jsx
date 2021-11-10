import { useState } from "react";
import { Modal, Divider, Button, Header } from "semantic-ui-react";

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
  //   const addStyle = (style) => {
  //     axios
  //       .put("http://localhost:3001/addTextFileStyle", {
  //         id: fileID,
  //         style: style,
  //       })
  //       .then((response) => {
  //         // Return the latest style just added.
  //         const newStyle = response.data.styles.at(-1);
  //         updateFileStyles(newStyle);
  //       })
  //       .catch((error) => {
  //         console.error(
  //           "Error updating file.styles:",
  //           error
  //         );
  //       });
  //   };

  return (
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Header as="h4" content="Styles" />

      <Button
        positive
        disabled={usedInTemplate}
        content="Add Style"
        onClick={() => setOpenAddStyle(true)}
      />
      {/* <List ordered divided relaxed>
        {styles.map((style) => (
          <Item key={style._id}>
            <div className="wrapper">
              <Item.Description content={style.............} />
              
              <Button
                floated="right"
                // disabled={usedInTemplate}
                content="Remove"
                onClick={() => removeStyle(style)}
              />
            </div>
          </Item>
        ))}
      </List> */}
      <Divider />
      <Button floated="right" content="Close" onClick={close} />

      {/* <AddStyleToTextFile
        isOpen={openAddStyle}
        fileID={fileID}
        addStyle={addStyle}
        close={() => setOpenAddStyle(false)}
      /> */}
    </Modal>
  );
};

export default TextFileStylesView;
