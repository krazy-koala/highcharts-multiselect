import { useEffect, useState } from "react";

import { OPACITY, updateChartOpacity } from "./chartOpacityUtils";

const emptyFn = () => {};

const useChartMultiSelect = ({
  chartRef,
  onHighlightPoints,
  onClear = emptyFn,
  onSelect,
}) => {
  const [selectedPoints, setSelectedPoints] = useState([]);

  useEffect(() => {
    if (chartRef.current == null) {
      return;
    }

    const { chart, container: containerRef } = chartRef.current;
    const container = containerRef.current;

    const highlightPoints = (points) => {
      if (onHighlightPoints != null) {
        onHighlightPoints(chart, points);
        return;
      }

      const getOpacity = (point) => {
        if (points.length === 0) {
          return OPACITY.MAX;
        }
        return points.includes(point) ? OPACITY.MAX : OPACITY.MIN;
      };
      updateChartOpacity(chart, getOpacity);
    };

    const updateSelectedPoints = (points) => {
      highlightPoints(points);
      onSelect(points);
      setSelectedPoints(points);
    };

    const handleClick = (e) => {
      const { point: clickedPoint, target } = e;
      if (target.closest(".highcharts-legend-item") != null) {
        return;
      }

      // If the click wasn't on a point, de-select everything.
      if (clickedPoint == null) {
        updateSelectedPoints([]);
        onClear(selectedPoints);
        return;
      }

      // Update selected points.
      const newSelectedPoints = selectedPoints.includes(clickedPoint)
        ? selectedPoints.filter((point) => point !== clickedPoint)
        : [...selectedPoints, clickedPoint];
      updateSelectedPoints(newSelectedPoints);
    };

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [chartRef, onHighlightPoints, onClear, onSelect, selectedPoints]);
};

export default useChartMultiSelect;
