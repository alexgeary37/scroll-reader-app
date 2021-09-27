import { Card, Button } from "semantic-ui-react";

const Question = ({ question, skip }) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header content="Question:" />
        <Card.Description content={question} />
      </Card.Content>
      <Button negative content="Skip" onClick={skip} />
    </Card>
  );
};

export default Question;
