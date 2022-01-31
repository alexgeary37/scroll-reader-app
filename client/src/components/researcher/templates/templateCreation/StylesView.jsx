import { useEffect, useState } from "react";
import { Modal, Item, Button, Header, Dropdown } from "semantic-ui-react";

const StylesView = ({ isOpen, availableStyles, updateStyle }) => {
  const [dropdownStyles, setDropdownStyles] = useState([]);
  const [styleID, setStyleID] = useState(availableStyles[0]._id);

  useEffect(() => {
    setDropdownStyles(formatDropdownStyles(availableStyles));
  }, [availableStyles]);

  const formatDropdownStyles = (styles) => {
    return styles.map((style) => {
      return {
        key: style._id,
        value: style._id,
        text: `family: ${style.fontFamily}, size: ${style.fontSize}, line-height: ${style.lineHeight}`,
      };
    });
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

      <Item style={{ marginTop: 10 }}>
        <Item.Content>
          <Item.Header as="h5" content="Selected Style:" />
          <Item.Description
            content={`font-family: ${
              availableStyles.find((s) => s._id === styleID).fontFamily
            }`}
          />
          <Item.Description
            content={`font-size: ${
              availableStyles.find((s) => s._id === styleID).fontSize
            }`}
          />
          <Item.Description
            content={`line-height: ${
              availableStyles.find((s) => s._id === styleID).lineHeight
            }`}
          />
        </Item.Content>
      </Item>

      <Button
        floated="right"
        content="Save"
        onClick={() => updateStyle(styleID)}
      />
    </Modal>
  );
};

export default StylesView;
