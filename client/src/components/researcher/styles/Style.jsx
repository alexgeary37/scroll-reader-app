import { useState } from "react";
import { Item, Button } from "semantic-ui-react";
import ConfirmDeleteStyleMessage from "./ConfirmDeleteStyleMessage";

const styles = [
  `{fontFamily: "Times, 'Times New Roman', Georgia, serif", fontSize: "36px"}`,
  `{fontFamily: "Times, 'Times New Roman', Georgia, serif", fontSize: "30px"}`,
  `{fontFamily: "Times, 'Times New Roman', Georgia, serif", fontSize: "24px"}`,
  `{fontFamily: "Times, 'Times New Roman', Georgia, serif", fontSize: "15px"}`,
  `{fontFamily: "Helvetica, 'Helvetica Neue', Arial, Verdana, sans-serif", fontSize: "15px"}`,
];

const Style = ({ style, deleteStyle }) => {
  const [openConfirmDeleteStyleMessage, setOpenConfirmDeleteStyleMessage] =
    useState(false);

  return (
    <Item>
      <Item.Content>
        <div className="wrapper">
          <Item.Description content={`${style.style}`} />
          <Button
            floated="right"
            disabled={styles.includes(style.style)}
            content="Remove"
            onClick={() => setOpenConfirmDeleteStyleMessage(true)}
          />
        </div>
        <ConfirmDeleteStyleMessage
          isOpen={openConfirmDeleteStyleMessage}
          answerYes={deleteStyle}
          answerNo={() => setOpenConfirmDeleteStyleMessage(false)}
        />
      </Item.Content>
    </Item>
  );
};

export default Style;
