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
          <Item.Description content={`${style.style}`} />
          <Button
            floated="right"
            disabled={
              style.style === `Times, "Times New Roman", Georgia, serif` ||
              style.style ===
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
