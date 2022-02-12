import { useEffect, useState } from "react";
import { Modal, Item, Button, Header, Dropdown, List } from "semantic-ui-react";
import { v4 as uuid_v4 } from "uuid";

const TextStylesView = ({ isOpen, styles, updateStyle }) => {
  const [dropdownStyles, setDropdownStyles] = useState([]);
  const [h1, setH1] = useState(styles[0]._id);
  const [h2, setH2] = useState(styles[0]._id);
  const [h3, setH3] = useState(styles[0]._id);
  const [paragraph, setParagraph] = useState(styles[0]._id);

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

  const displayDropdownSelections = () => {
    return (
      <div>
        <Dropdown
          placeholder="Select an h1 style"
          fluid
          selection
          options={dropdownStyles}
          onChange={(e, data) => setH1(data.value)}
        />
        <Dropdown
          placeholder="Select an h2 style"
          fluid
          selection
          options={dropdownStyles}
          onChange={(e, data) => setH2(data.value)}
        />
        <Dropdown
          placeholder="Select an h3 style"
          fluid
          selection
          options={dropdownStyles}
          onChange={(e, data) => setH3(data.value)}
        />
        <Dropdown
          placeholder="Select a paragraph style"
          fluid
          selection
          options={dropdownStyles}
          onChange={(e, data) => setParagraph(data.value)}
        />
      </div>
    );
  };

  const displaySetStyles = () => {
    const setStyles = [
      { name: "h1", id: h1 },
      { name: "h2", id: h2 },
      { name: "h3", id: h3 },
      { name: "paragraph", id: paragraph },
    ];
    return (
      <List>
        {setStyles.map((style) => (
          <Item key={uuid_v4()} style={{ marginTop: 10 }}>
            <Item.Content>
              <Item.Header as="h5" content={style.name} />
              <Item.Description
                content={`font-family: ${
                  styles.find((s) => s._id === style.id).fontFamily
                }`}
              />
              <Item.Description
                content={`font-size: ${
                  styles.find((s) => s._id === style.id).fontSize
                }`}
              />
              <Item.Description
                content={`line-height: ${
                  styles.find((s) => s._id === style.id).lineHeight
                }`}
              />
              <Item.Description
                content={`bold: ${styles.find((s) => s._id === style.id).bold}`}
              />
            </Item.Content>
          </Item>
        ))}
      </List>
    );
  };

  return (
    <Modal style={{ padding: 10 }} size="tiny" open={isOpen}>
      <Header content="Styles:" />
      {displayDropdownSelections()}
      {displaySetStyles()}

      <Button floated="right" content="Save" onClick={() => updateStyle(h1)} />
    </Modal>
  );
};

export default TextStylesView;
