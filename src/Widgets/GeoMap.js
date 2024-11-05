import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import useChartMultiSelect from "./useChartMultiSelect";

const TOPOLOGY_URL =
  "https://code.highcharts.com/mapdata/countries/gb/gb-all.topo.json";

const GeoMap = () => {
  const [topology, setTopology] = useState();
  const chartRef = useRef();

  useChartMultiSelect({
    chartRef,
    onSelect: (selectedPoints) => {
      console.log(`GeoMap onSelect ${selectedPoints}`);
    },
  });

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        const response = await fetch(TOPOLOGY_URL);
        const json = await response.json();
        setTopology(json);
      } catch (e) {
        console.log(e);
      }
    };
    fetchTopology();
  }, []);

  const options = {
    chart: {
      map: topology,
    },

    title: {
      text: "Highmaps basic lat/lon demo",
    },

    accessibility: {
      description:
        "Map where city locations have been defined using " +
        "latitude/longitude.",
    },

    mapNavigation: {
      enabled: true,
    },

    tooltip: {
      headerFormat: "",
      pointFormat: "<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}",
    },

    series: [
      {
        // Use the gb-all map with no data as a basemap
        name: "Great Britain",
        borderColor: "#A0A0A0",
        showInLegend: false,
      },
      {
        // Specify points using lat/lon
        type: "mappoint",
        name: "Cities",
        accessibility: {
          point: {
            valueDescriptionFormat:
              "{xDescription}. Lat: " +
              "{point.lat:.2f}, lon: {point.lon:.2f}.",
          },
        },
        color: Highcharts.getOptions().colors[1],
        data: [
          {
            name: "London",
            lat: 51.507222,
            lon: -0.1275,
          },
          {
            name: "Birmingham",
            lat: 52.483056,
            lon: -1.893611,
          },
          {
            name: "Leeds",
            lat: 53.799722,
            lon: -1.549167,
          },
          {
            name: "Glasgow",
            lat: 55.858,
            lon: -4.259,
          },
          {
            name: "Sheffield",
            lat: 53.383611,
            lon: -1.466944,
          },
          {
            name: "Liverpool",
            lat: 53.4,
            lon: -3,
          },
          {
            name: "Bristol",
            lat: 51.45,
            lon: -2.583333,
          },
          {
            name: "Belfast",
            lat: 54.597,
            lon: -5.93,
          },
          {
            name: "Lerwick",
            lat: 60.155,
            lon: -1.145,
            dataLabels: {
              align: "left",
              x: 5,
              verticalAlign: "middle",
            },
          },
        ],
      },
    ],
  };

  return (
    <HighchartsReact
      ref={chartRef}
      constructorType={"mapChart"}
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default GeoMap;
