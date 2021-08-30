import { List, Item, Header, Segment, Icon } from "semantic-ui-react";
import FileUpload from "./FileUpload";
import { useEffect, useState } from "react";
import Axios from "axios";

const TextFiles = () => {
  const [textFiles, setTextFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Run! Like go get some data from an API.
    fetchTextFiles();
  }, []);

  async function fetchTextFiles() {
    setIsLoading(true);
    Axios.get("http://localhost:3001/getTextFiles").then((response) => {
      const files = response.data;
      const options = [];
      files.forEach((file) => {
        options.push({
          key: file._id,
          value: file._id,
          name: file.fileName,
        });
      });
      setTextFiles(options);
      setIsLoading(false);
    });
  }

  const displayTextFiles = () => {
    if (!isLoading) {
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
              </Item.Content>
            </Item>
          ))}
        </List>
      );
    }
  };
  return (
    <div>
      <Header as="h2" textAlign="center" content="Uploaded Text Documents:" />
      <div>
        <Segment>{displayTextFiles()}</Segment>
      </div>
      <FileUpload uploadSubmitted={() => fetchTextFiles()} />
    </div>
  );
};

export default TextFiles;
