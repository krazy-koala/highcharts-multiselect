import React, { useMemo, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import useChartMultiSelect from "./useChartMultiSelect";

const BasicChart = () => {
  const chartRef = useRef();

  useChartMultiSelect({
    chartRef,
    onSelect: (selectedPoints) => {
      console.log(`BasicChart onSelect ${selectedPoints}`);
    },
  });

  const options = useMemo(
    () => ({
      chart: {
        type: "column",
      },
      title: {
        text: "My chart",
      },
      series: [
        {
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
      ],
    }),
    []
  );

  return (
    <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
  );
};

export default BasicChart;
