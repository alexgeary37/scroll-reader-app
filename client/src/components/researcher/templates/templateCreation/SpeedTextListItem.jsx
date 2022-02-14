import { useState } from "react";
import { Item, Button } from "semantic-ui-react";
import TextStylesView from "./TextStylesView";

const SpeedTextListItem = ({ text, styles, selectStyles }) => {
  const [viewStyles, setViewStyles] = useState(false);

  const updateStyles = (h1, h2, h3, paragraph, closeViewStyles) => {
    if (closeViewStyles) {
      setViewStyles(false);
    }
    selectStyles(text, h1, h2, h3, paragraph);
  };

  return (
    <Item key={text.fileID}>
      <Item.Content>
        <div className="wrapper">
          <div>
            <Item.Header style={{ margin: 5 }} content={text.fileName} />
          </div>
          <Button content="Styles" onClick={() => setViewStyles(true)} />
          <TextStylesView
            isOpen={viewStyles}
            styles={styles}
            updateStyles={updateStyles}
          />
        </div>
      </Item.Content>
    </Item>
  );
};

export default SpeedTextListItem;
