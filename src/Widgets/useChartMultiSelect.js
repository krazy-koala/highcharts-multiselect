import { useEffect, useState } from "react";

import { OPACITY, updateChartOpacity } from "./chartOpacityUtils";

const useChartMultiSelect = ({ chartRef, onSelect }) => {
  const [selectedPoints, setSelectedPoints] = useState([]);

  useEffect(() => {
    if (chartRef.current == null) {
      return;
    }

    const { chart, container: containerRef } = chartRef.current;
    const container = containerRef.current;

    const handleClick = (e) => {
      const clickedPoint = e.point;

      // If the click wasn't on a point, de-select everything.
      if (clickedPoint == null) {
        setSelectedPoints([]);
        updateChartOpacity(chart, () => OPACITY.MAX);
        onSelect([]);
        return;
      }

      // Update selected points.
      const newSelectedPoints = selectedPoints.includes(clickedPoint)
        ? selectedPoints.filter((point) => point !== clickedPoint)
        : [...selectedPoints, clickedPoint];
      setSelectedPoints(newSelectedPoints);

      // Update chart opacity based on selected points.
      const getOpacity = (point) => {
        if (newSelectedPoints.length === 0) {
          return OPACITY.MAX;
        }
        return newSelectedPoints.includes(point) ? OPACITY.MAX : OPACITY.MIN;
      }
      updateChartOpacity(chart, getOpacity);
      onSelect(newSelectedPoints);
    };

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [chartRef, onSelect, selectedPoints]);
}

export default useChartMultiSelect;