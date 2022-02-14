import { useEffect, useState } from "react";
import { Modal, Button, Header, Dropdown, Input } from "semantic-ui-react";

const MINIMUM_FONT_SIZE = 10;
const MINIMUM_LINEHEIGHT = 100;

const TextStylesView = ({ isOpen, styles, updateStyles }) => {
  const [dropdownStyles, setDropdownStyles] = useState([]);
  const [h1, setH1] = useState({
    fontFamily: styles[0].fontFamily,
    fontSize: 12,
    lineHeight: 110,
    fontWeight: false,
  });
  const [h2, setH2] = useState({
    fontFamily: styles[0].fontFamily,
    fontSize: 12,
    lineHeight: 110,
    fontWeight: false,
  });
  const [h3, setH3] = useState({
    fontFamily: styles[0].fontFamily,
    fontSize: 12,
    lineHeight: 110,
    fontWeight: false,
  });
  const [paragraph, setParagraph] = useState({
    fontFamily: styles[0].fontFamily,
    fontSize: 12,
    lineHeight: 110,
    fontWeight: false,
  });

  useEffect(() => {
    updateStyles(h1, h2, h3, paragraph, false);
  }, []);

  useEffect(() => {
    setDropdownStyles(formatDropdownStyles());
  }, [styles]);

  const formatDropdownStyles = () => {
    return styles.map((style) => {
      return {
        key: style._id,
        value: style.fontFamily,
        text: `family: ${style.fontFamily}`,
      };
    });
  };

  const displayInputs = () => {
    return (
      <div>
        <div>
          <Dropdown
            style={{ width: "20em" }}
            placeholder="h1 font-family"
            selection
            options={dropdownStyles}
            onChange={(e, data) =>
              setH1({
                fontFamily: data.value,
                fontSize: h1.fontSize,
                lineHeight: h1.lineHeight,
                fontWeight: h1.fontWeight,
              })
            }
          />
          <Input
            type="Number"
            min={MINIMUM_FONT_SIZE}
            placeholder="font-size (pixels)"
            onChange={(e) =>
              setH1({
                fontFamily: h1.fontFamily,
                fontSize: Number(e.target.value),
                lineHeight: h1.lineHeight,
                fontWeight: h1.fontWeight,
              })
            }
          />
          <Input
            type="Number"
            min={MINIMUM_LINEHEIGHT}
            placeholder="line-height (percent of font-size)"
            onChange={(e) =>
              setH1({
                fontFamily: h1.fontFamily,
                fontSize: h1.fontSize,
                lineHeight: Number(e.target.value),
                fontWeight: h1.fontWeight,
              })
            }
          />
          <div className="ui checkbox">
            <input
              type="checkbox"
              onClick={() =>
                setH1({
                  fontFamily: h1.fontFamily,
                  fontSize: h1.fontSize,
                  lineHeight: h1.lineHeight,
                  fontWeight: !h1.fontWeight,
                })
              }
            />
            <label>Bold</label>
          </div>
        </div>
        <div>
          <Dropdown
            style={{ width: "20em" }}
            placeholder="h2 font-family"
            selection
            options={dropdownStyles}
            onChange={(e, data) =>
              setH2({
                fontFamily: data.value,
                fontSize: h2.fontSize,
                lineHeight: h2.lineHeight,
                fontWeight: h2.fontWeight,
              })
            }
          />
          <Input
            type="Number"
            min={MINIMUM_FONT_SIZE}
            placeholder="font-size (pixels)"
            onChange={(e) =>
              setH2({
                fontFamily: h2.fontFamily,
                fontSize: Number(e.target.value),
                lineHeight: h2.lineHeight,
                fontWeight: h2.fontWeight,
              })
            }
          />
          <Input
            type="Number"
            min={MINIMUM_LINEHEIGHT}
            placeholder="line-height (percent of font-size)"
            onChange={(e) =>
              setH2({
                fontFamily: h2.fontFamily,
                fontSize: h2.fontSize,
                lineHeight: Number(e.target.value),
                fontWeight: h2.fontWeight,
              })
            }
          />
          <div className="ui checkbox">
            <input
              type="checkbox"
              onClick={() =>
                setH2({
                  fontFamily: h2.fontFamily,
                  fontSize: h2.fontSize,
                  lineHeight: h2.lineHeight,
                  fontWeight: !h2.fontWeight,
                })
              }
            />
            <label>Bold</label>
          </div>
        </div>
        <div>
          <Dropdown
            style={{ width: "20em" }}
            placeholder="h3 font-family"
            selection
            options={dropdownStyles}
            onChange={(e, data) =>
              setH3({
                fontFamily: data.value,
                fontSize: h3.fontSize,
                lineHeight: h3.lineHeight,
                fontWeight: h3.fontWeight,
              })
            }
          />
          <Input
            type="Number"
            min={MINIMUM_FONT_SIZE}
            placeholder="font-size (pixels)"
            onChange={(e) =>
              setH3({
                fontFamily: h3.fontFamily,
                fontSize: Number(e.target.value),
                lineHeight: h3.lineHeight,
                fontWeight: h3.fontWeight,
              })
            }
          />
          <Input
            type="Number"
            min={MINIMUM_LINEHEIGHT}
            placeholder="line-height (percent of font-size)"
            onChange={(e) =>
              setH3({
                fontFamily: h3.fontFamily,
                fontSize: h3.fontSize,
                lineHeight: Number(e.target.value),
                fontWeight: h3.fontWeight,
              })
            }
          />
          <div className="ui checkbox">
            <input
              type="checkbox"
              onClick={() =>
                setH3({
                  fontFamily: h3.fontFamily,
                  fontSize: h3.fontSize,
                  lineHeight: h3.lineHeight,
                  fontWeight: !h3.fontWeight,
                })
              }
            />
            <label>Bold</label>
          </div>
        </div>
        <div>
          <Dropdown
            style={{ width: "20em" }}
            placeholder="Paragraph font-family"
            selection
            options={dropdownStyles}
            onChange={(e, data) =>
              setParagraph({
                fontFamily: data.value,
                fontSize: paragraph.fontSize,
                lineHeight: paragraph.lineHeight,
                fontWeight: paragraph.fontWeight,
              })
            }
          />
          <Input
            type="Number"
            min={MINIMUM_FONT_SIZE}
            placeholder="font-size (pixels)"
            onChange={(e) =>
              setParagraph({
                fontFamily: paragraph.fontFamily,
                fontSize: Number(e.target.value),
                lineHeight: paragraph.lineHeight,
                fontWeight: paragraph.fontWeight,
              })
            }
          />
          <Input
            type="Number"
            min={MINIMUM_LINEHEIGHT}
            placeholder="line-height (percent of font-size)"
            onChange={(e) =>
              setParagraph({
                fontFamily: paragraph.fontFamily,
                fontSize: paragraph.fontSize,
                lineHeight: Number(e.target.value),
                fontWeight: paragraph.fontWeight,
              })
            }
          />
          <div className="ui checkbox">
            <input
              type="checkbox"
              onClick={() =>
                setParagraph({
                  fontFamily: paragraph.fontFamily,
                  fontSize: paragraph.fontSize,
                  lineHeight: paragraph.lineHeight,
                  fontWeight: !paragraph.fontWeight,
                })
              }
            />
            <label>Bold</label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal style={{ padding: 10 }} open={isOpen}>
      <Header content="Styles:" />
      {displayInputs()}
      <Button
        floated="right"
        content="Save"
        onClick={() => updateStyles(h1, h2, h3, paragraph, true)}
      />
    </Modal>
  );
};

export default TextStylesView;
