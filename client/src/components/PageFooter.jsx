import { Segment, Container, List } from "semantic-ui-react";

const PageFooter = () => {
  return (
    <Segment vertical inverted style={{ height: 75 }}>
      <Container textAlign="center">
        <List horizontal size="small" inverted>
          <List.Item content="University of Waikato" />
        </List>
      </Container>
    </Segment>
  );
};

export default PageFooter;
