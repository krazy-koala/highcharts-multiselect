import { useMemo } from "react";

const ChartSelector = ({ onChange, value }) => {
  const chartTypes = useMemo(
    () => [
      {
        label: "Basic Chart",
        value: "column",
      },
      {
        label: "Heat Map",
        value: "heatmap",
      },
      {
        label: "Geo Map",
        value: "geomap",
      },
    ],
    []
  );

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label style={{ fontSize: 14 }}>Select Widget:</label>
      <select onChange={onChange} value={value}>
        {chartTypes.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChartSelector;
