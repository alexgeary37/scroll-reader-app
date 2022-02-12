import { useState } from "react";
import { Item, Button } from "semantic-ui-react";
import StylesView from "./StylesView";

const SpeedTextListItem = ({ text, styles, selectStyle }) => {
  const [viewStyles, setViewStyles] = useState(false);

  const updateStyle = (style) => {
    setViewStyles(false);
    selectStyle(text, style);
  };

  return (
    <Item key={text.fileID}>
      <Item.Content>
        <div className="wrapper">
          <div>
            <Item.Header style={{ margin: 5 }} content={text.fileName} />
          </div>
          <Button content="Styles" onClick={() => setViewStyles(true)} />
          <StylesView
            isOpen={viewStyles}
            styles={styles}
            updateStyle={updateStyle}
          />
        </div>
      </Item.Content>
    </Item>
  );
};

export default SpeedTextListItem;
