import { useEffect, useState } from "react";
import { Modal, Button, Header, Dropdown, Input } from "semantic-ui-react";

const MINIMUM_FONT_SIZE = 10;
const MINIMUM_LINEHEIGHT = 100;
const FONT_WEIGHTS = [
  { key: 100, value: 100, text: "100" },
  { key: 200, value: 200, text: "200" },
  { key: 300, value: 300, text: "300" },
  { key: 400, value: 400, text: "400 (normal)" },
  { key: 500, value: 500, text: "500" },
  { key: 600, value: 600, text: "600" },
  { key: 700, value: 700, text: "700 (bold)" },
  { key: 800, value: 800, text: "800" },
  { key: 900, value: 900, text: "900" },
];

const TextStylesView = ({ isOpen, styles, updateStyles }) => {
  // TODO: Change default styles for h1, h2, h3, paragraph
  // http://zuga.net/articles/html-heading-elements/

  const [dropdownFontFamilies, setDropdownFontFamilies] = useState([]);
  const [h1, setH1] = useState({
    fontFamily: styles[0].fontFamily,
    fontSize: 32,
    lineHeight: 125,
    fontWeight: 700,
  });
  const [h2, setH2] = useState({
    fontFamily: styles[0].fontFamily,
    fontSize: 24,
    lineHeight: 125,
    fontWeight: 700,
  });
  const [h3, setH3] = useState({
    fontFamily: styles[0].fontFamily,
    fontSize: 18.72,
    lineHeight: 125,
    fontWeight: 700,
  });
  const [paragraph, setParagraph] = useState({
    fontFamily: styles[0].fontFamily,
    fontSize: 15,
    lineHeight: 125,
    fontWeight: 400,
  });

  useEffect(() => {
    updateStyles(h1, h2, h3, paragraph, false);
  }, []);

  useEffect(() => {
    setDropdownFontFamilies(formatDropdownFontFamilies());
  }, [styles]);

  const formatDropdownFontFamilies = () => {
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
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Dropdown
            style={{ width: "15em" }}
            placeholder="h1 font-family"
            selection
            options={dropdownFontFamilies}
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
            placeholder="h1 font-size (pixels)"
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
            placeholder="h1 line-height (percent of font-size)"
            onChange={(e) =>
              setH1({
                fontFamily: h1.fontFamily,
                fontSize: h1.fontSize,
                lineHeight: Number(e.target.value),
                fontWeight: h1.fontWeight,
              })
            }
          />
          <Dropdown
            style={{ width: "15em" }}
            placeholder="h1 font-weight"
            selection
            options={FONT_WEIGHTS}
            onChange={(e, data) =>
              setH1({
                fontFamily: h1.fontFamily,
                fontSize: h1.fontSize,
                lineHeight: h1.lineHeight,
                fontWeight: data.value,
              })
            }
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Dropdown
            style={{ width: "15em" }}
            placeholder="h2 font-family"
            selection
            options={dropdownFontFamilies}
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
            placeholder="h2 font-size (pixels)"
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
            placeholder="h2 line-height (percent of font-size)"
            onChange={(e) =>
              setH2({
                fontFamily: h2.fontFamily,
                fontSize: h2.fontSize,
                lineHeight: Number(e.target.value),
                fontWeight: h2.fontWeight,
              })
            }
          />
          <Dropdown
            style={{ width: "15em" }}
            placeholder="h2 font-weight"
            selection
            options={FONT_WEIGHTS}
            onChange={(e, data) =>
              setH2({
                fontFamily: h2.fontFamily,
                fontSize: h2.fontSize,
                lineHeight: h2.lineHeight,
                fontWeight: data.value,
              })
            }
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Dropdown
            style={{ width: "15em" }}
            placeholder="h3 font-family"
            selection
            options={dropdownFontFamilies}
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
            placeholder="h3 font-size (pixels)"
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
            placeholder="h3 line-height (percent of font-size)"
            onChange={(e) =>
              setH3({
                fontFamily: h3.fontFamily,
                fontSize: h3.fontSize,
                lineHeight: Number(e.target.value),
                fontWeight: h3.fontWeight,
              })
            }
          />
          <Dropdown
            style={{ width: "15em" }}
            placeholder="h3 font-weight"
            selection
            options={FONT_WEIGHTS}
            onChange={(e, data) =>
              setH3({
                fontFamily: h3.fontFamily,
                fontSize: h3.fontSize,
                lineHeight: h3.lineHeight,
                fontWeight: data.value,
              })
            }
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Dropdown
            style={{ width: "15em" }}
            placeholder="Paragraph font-family"
            selection
            options={dropdownFontFamilies}
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
            placeholder="Paragraph font-size (pixels)"
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
            placeholder="Paragraph line-height (percent of font-size)"
            onChange={(e) =>
              setParagraph({
                fontFamily: paragraph.fontFamily,
                fontSize: paragraph.fontSize,
                lineHeight: Number(e.target.value),
                fontWeight: paragraph.fontWeight,
              })
            }
          />
          <Dropdown
            style={{ width: "15em" }}
            placeholder="Paragraph font-weight"
            selection
            options={FONT_WEIGHTS}
            onChange={(e, data) =>
              setParagraph({
                fontFamily: paragraph.fontFamily,
                fontSize: paragraph.fontSize,
                lineHeight: paragraph.lineHeight,
                fontWeight: data.value,
              })
            }
          />
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
