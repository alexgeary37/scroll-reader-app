import { useState } from "react";
import { Item, Button } from "semantic-ui-react";
import ConfirmDeleteStyleMessage from "./ConfirmDeleteStyleMessage";

const Style = ({ style, deleteStyle }) => {
  const [openConfirmDeleteStyleMessage, setOpenConfirmDeleteStyleMessage] =
    useState(false);

  return (
    <Item>
      <Item.Content>
        <div className="wrapper">
          <Item.Description content={`font-family: ${style.fontFamily}`} />
          <Button
            floated="right"
            disabled={
              style.fontFamily === `Times, "Times New Roman", Georgia, serif` ||
              style.fontFamily ===
                `Helvetica, "Helvetica Neue", Arial, Verdana, sans-serif`
            }
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
