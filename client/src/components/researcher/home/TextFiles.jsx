import {
  List,
  Item,
  Header,
  Segment,
  Icon,
  ItemDescription,
} from "semantic-ui-react";
import FileUpload from "./FileUpload";

const TextFiles = ({ textFiles, fetchTextFiles }) => {
  const displayTextFiles = () => {
    return (
      <List relaxed divided>
        {textFiles.map((file) => (
          <Item key={file.key}>
            <Icon size="large" name="file outline" />
            <Item.Content>
              <Header
                style={{ margin: 5 }}
                size="small"
                content={`Filename: ${file.name}`}
              />
              <ItemDescription
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
      <FileUpload uploadSubmitted={() => fetchTextFiles()} />
    </div>
  );
};

export default TextFiles;
