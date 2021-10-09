import { Item, Icon } from "semantic-ui-react";

const TextFile = ({ file }) => {
  return (
    <Item>
      <Icon size="large" name="file outline" />
      <Item.Content>
        <Item.Header as="h4" style={{ margin: 5 }} content={file.name} />
        <Item.Description
          style={{ margin: 5 }}
          content={`Uploaded: ${file.uploadedAt}`}
        />
      </Item.Content>
    </Item>
  );
};

export default TextFile;
