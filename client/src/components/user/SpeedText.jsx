import { Container } from "semantic-ui-react";
import { SessionContext } from "../../contexts/SessionContext.jsx";
import { useContext, useEffect, useState } from "react";
import Axios from "axios";

const SpeedText = () => {
  const sessionContext = useContext(SessionContext);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchText();
  }, []);

  const fetchText = () => {
    const speedTextFileID = sessionContext.template.speedTextFileID;

    Axios.get("http://localhost:3001/getTextFile", {
      params: { _id: speedTextFileID },
    })
      .then((response) => {
        setText(response.data.text);
      })
      .catch((error) => {
        console.error("Error fetching text in SpeedText:", error);
      });
  };

  return (
    <Container text>
      <p>{text}</p>
    </Container>
  );
};

export default SpeedText;
