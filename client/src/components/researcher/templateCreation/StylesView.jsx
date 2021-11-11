import { useEffect, useState } from "react";
import { Modal, Item, Button, Header, Dropdown } from "semantic-ui-react";

const StylesView = ({ isOpen, availableStyles, updateStyle }) => {
  const [dropdownStyles, setDropdownStyles] = useState([]);
  const [styleID, setStyleID] = useState([]);

  useEffect(() => {
    setDropdownStyles(formatDropdownStyles(availableStyles));
  }, [availableStyles]);

  const formatDropdownStyles = (styles) => {
    return styles.map((style) => {
      return {
        key: style._id,
        value: style._id,
        text: style.fontFamily,
      };
    });
  };

  return (
    <Modal style={{ padding: 10 }} size="tiny" open={isOpen}>
      <Header as="h4" content="Style:" />
      <Dropdown
        placeholder="Select a style for this text"
        fluid
        search
        selection
        multiple
        options={dropdownStyles}
        onChange={(e, data) => setStyleID(data.value)}
      />
      <Item>
        <Item.Description content={styleID} />
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
