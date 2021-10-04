import { Modal, Segment, Button } from "semantic-ui-react";

const ConfirmSkipQuestionWindow = ({ isOpen, skip, cancel }) => {
  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ textAlign: "center", padding: 10 }}
    >
      <Segment as="h4">Are you sure you want to skip this question?</Segment>
      <Button primary content="Yes" onClick={skip} />
      <Button content="No" onClick={cancel} />
    </Modal>
  );
};

export default ConfirmSkipQuestionWindow;
