import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Button, Container, Divider } from "semantic-ui-react";
import DownloadForm from "./DownloadForm.jsx";

const DataGraph = () => {
  const [scrollData, setScrollData] = useState(null);
  const [openDownloadForm, setOpenDownloadForm] = useState(false);
  const [pointRadius, setPointRadius] = useState(0);

  const graphData = {
    labels: scrollData !== null ? scrollData.timestamps : [],
    datasets: [
      {
        radius: pointRadius,
        label: "Scroll Position Over Time",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: scrollData !== null ? scrollData.yPositions : [],
      },
    ],
  };

  const toggleShowPoints = () => {
    setPointRadius(pointRadius === 0 ? 2 : 0);
  };

  const openForm = () => {
    setOpenDownloadForm(true);
    setPointRadius(0);
  };

  const closeForm = () => {
    setOpenDownloadForm(false);
  };

  const displayShowButton = () => {
    if (!openDownloadForm && typeof scrollData !== null) {
      return (
        <Button
          content="Show Points"
          positive={pointRadius === 0}
          negative={pointRadius === 2}
          onClick={toggleShowPoints}
        />
      );
    }
  };

  const displayLineGraph = () => {
    if (scrollData !== null) {
      return (
        <Line
          data={graphData}
          options={{
            title: {
              display: true,
              text: "Scroll Position Over Time",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      );
    }
  };

  return (
    <div>
      <div className="wrapper">
        <Button
          primary
          icon="download"
          content="Download Data"
          onClick={openForm}
        />
        {displayShowButton()}
      </div>
      <Divider />
      <DownloadForm
        open={openDownloadForm}
        closeForm={closeForm}
        setScrollData={setScrollData}
      />
      <Container>{displayLineGraph()}</Container>
    </div>
  );
};

export default DataGraph;
