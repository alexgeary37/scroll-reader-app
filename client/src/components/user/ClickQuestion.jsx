import { Card, Button, Grid } from "semantic-ui-react";

const ClickQuestion = ({
  question,
  disable,
  answerIsEnabled,
  enableAnswer,
  skip,
}) => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header content="Question:" />
        <Card.Description style={{ marginBottom: 10 }} content={question} />
        <Grid>
          <Grid.Column width="8">
            <Button
              fluid
              toggle
              active={answerIsEnabled}
              disabled={disable}
              content="Answer"
              onClick={enableAnswer}
            />
          </Grid.Column>
          <Grid.Column width="8">
            <Button
              fluid
              negative
              disabled={disable}
              content="Skip"
              onClick={skip}
            />
          </Grid.Column>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default ClickQuestion;
