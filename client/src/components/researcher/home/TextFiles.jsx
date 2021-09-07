import { List, Item, Header, Segment, Icon } from "semantic-ui-react";
import FileUpload from "./FileUpload";

const TextFiles = ({ textFiles, appendTextFile }) => {
  const displayTextFiles = () => {
    return (
      <List relaxed divided>
        {textFiles.map((file) => (
          <Item key={file.key}>
            <Icon size="large" name="file outline" />
            <Item.Content>
              <Item.Header as="h4" style={{ margin: 5 }} content={file.name} />
              <Item.Description
                style={{ margin: 5 }}
                content={`Uploaded: ${file.uploadedAt}`}
              />
            </Item.Content>
          </Item>
        ))}
      </List>
    );
  };

  return (
    <div>
      <Header as="h2" textAlign="center" content="Uploaded Text Documents:" />
      <div>
        <Segment basic>{displayTextFiles()}</Segment>
      </div>
      <FileUpload uploadSubmitted={(file) => appendTextFile(file)} />
    </div>
  );
};

export default TextFiles;
