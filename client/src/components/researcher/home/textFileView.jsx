import { Button, Header, Modal } from "semantic-ui-react";

const TextFileView = ({ textFile, isOpen, close }) => {
  return (
    <Modal open={isOpen} style={{ height: "70vh", padding: 10 }}>
      <Header as="h1" content={textFile.name} />

      <Modal.Description content={textFile.textContent} />
      <Modal.Description content={textFile.createdAt} />
      <Button
        style={{ position: "absolute", right: 10, bottom: 10 }}
        content="Close"
        onClick={close}
      />
    </Modal>
  );
};

export default TextFileView;
