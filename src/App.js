import React, { useState } from "react";
import Highcharts from "highcharts";
import ChartSelector from "./Widgets/ChartSelector";
import GeoMap from "./Widgets/GeoMap";
import BasicChart from "./Widgets/BasicChart";
import HeatMap from "./Widgets/HeatMap";

import "./App.css";

require("highcharts/modules/map")(Highcharts);

const Chart = ({ type }) => {
  switch (type) {
    case "column":
      return <BasicChart />;
    case "heatmap":
      return <HeatMap />;
    case "geomap":
      return <GeoMap />;
    default:
      throw new Error("Unsupported chart type");
  }
};

const App = () => {
  const [chartType, setChartType] = useState("column");

  const handleSetChartType = (e) => {
    const chartType = e.target.value;
    setChartType(chartType);
  };

  return (
    <div className="container">
      <div>
        <ChartSelector onChange={handleSetChartType} value={chartType} />
      </div>
      <Chart type={chartType} />
    </div>
  );
};

export default App;
