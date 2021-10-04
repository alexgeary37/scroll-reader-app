import { useEffect } from "react";
import { Card, Button } from "semantic-ui-react";

const Question = ({ question, disable, skip }) => {
  // useEffect(() => {
  //   console.log("question::", question);
  // }, [question]);

  return (
    <Card>
      <Card.Content>
        <Card.Header content="Question:" />
        <Card.Description content={question} />
      </Card.Content>
      <Button negative disabled={disable} content="Skip" onClick={skip} />
    </Card>
  );
};

export default Question;
