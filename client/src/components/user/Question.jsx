import { Card, Button } from "semantic-ui-react";

const Question = ({ question, disable, skip }) => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header content="Question:" />
        <Card.Description content={question} />
      </Card.Content>
      <Button negative disabled={disable} content="Skip" onClick={skip} />
    </Card>
  );
};

export default Question;
