import { useEffect, useState } from "react";
import { Modal, Item, Button, Header, Dropdown } from "semantic-ui-react";

const StylesView = ({ isOpen, styles, updateStyle }) => {
  const [dropdownStyles, setDropdownStyles] = useState([]);
  const [styleID, setStyleID] = useState(styles[0]._id);

  useEffect(() => {
    setDropdownStyles(formatDropdownStyles());
  }, [styles]);

  const formatDropdownStyles = () => {
    return styles.map((style) => {
      return {
        key: style._id,
        value: style._id,
        text: `family: ${style.fontFamily}, size: ${style.fontSize}, line-height: ${style.lineHeight}, bold: ${style.bold}`,
      };
    });
  };

  const displaySetStyle = () => {
    return (
      <Item style={{ marginTop: 10 }}>
        <Item.Content>
          <Item.Header as="h5" content="Selected Style:" />
          <Item.Description
            content={`font-family: ${
              styles.find((s) => s._id === styleID).fontFamily
            }`}
          />
          <Item.Description
            content={`font-size: ${
              styles.find((s) => s._id === styleID).fontSize
            }`}
          />
          <Item.Description
            content={`line-height: ${
              styles.find((s) => s._id === styleID).lineHeight
            }`}
          />
          <Item.Description
            content={`bold: ${styles.find((s) => s._id === styleID).bold}`}
          />
        </Item.Content>
      </Item>
    );
  };

  return (
    <Modal style={{ padding: 10 }} size="tiny" open={isOpen}>
      <Header as="h4" content="Styles:" />
      <Dropdown
        placeholder="Select a style for this text"
        fluid
        selection
        options={dropdownStyles}
        onChange={(e, data) => setStyleID(data.value)}
      />
      {displaySetStyle()}

      <Button
        floated="right"
        content="Save"
        onClick={() => updateStyle(styleID)}
      />
    </Modal>
  );
};

export default StylesView;
