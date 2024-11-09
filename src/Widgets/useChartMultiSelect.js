import { useEffect, useRef, useState } from "react";

import { OPACITY, updateChartOpacity } from "./chartOpacityUtils";

/**
 * Determines if two points are equal based on their coordinates.
 *
 * @param {Object} p1 first point.
 * @param {Object} p2 second point.
 * @return {boolean} true if equal.  false if not.
 */
const arePointsEqual = (p1, p2) => {
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  return x1 === x2 && y1 === y2;
};

/**
 * Multi-selecting will only be enabled for keyboard + click events.
 *
 * @param {Object} e chart click event.
 * @returns {boolean}
 */
const isMultiSelectKeyPressed = (e) => e.ctrlKey || e.shiftKey;

/**
 * Returns a function that when called determines the opacity of a
 * single point in a chart series.
 *
 * @param {Array<Object>} points list of points to highlight/un-highlight.
 * @return {function(point: Point)} callback to invoke on each point to set
 *   opacity.
 */
const getOpacityGetter = (points) => (point) => {
  if (points.length === 0) {
    return OPACITY.MAX;
  }

  return points.some((p) => arePointsEqual(p, point))
    ? OPACITY.MAX
    : OPACITY.MIN;
};

/**
 * Highlights all selected points and un-highlights all un-selected points.
 *
 * @param {Object} chart ref to chart component.
 * @param {Array<Object>} points list of points to highlight/un-highlight.
 * @param {Object} props all props passed to this hook with local state.
 * @return {void}
 */
const highlightPoints = (chart, points, props) => {
  const { onHighlightPoints } = props;
  if (onHighlightPoints != null) {
    onHighlightPoints(chart, points);
    return;
  }

  const getOpacity = getOpacityGetter(points);
  updateChartOpacity(chart, getOpacity);
};

/**
 * @param {Object} chart ref to chart component.
 * @param {Array<Object>} nextPoints list of points after click
 * @param {Array<Object>} prevPoints list of points before click.
 * @param {Object} props all props passed to this hook with local state.
 * @return {void}
 */
const updateSelectedPoints = (chart, nextPoints, prevPoints, props) => {
  const { onSelect, setSelectedPoints } = props;
  highlightPoints(chart, nextPoints, props);
  onSelect(nextPoints, prevPoints);
  setSelectedPoints(nextPoints);
};

/**
 * @param {Object} e chart click event.
 * @param {Array<Object>} selectedPoints list of selected points.
 * @returns {Array<Object>} next selected points.
 */
const getNextSelectedPoints = (e, selectedPoints) => {
  const { point: clickedPoint } = e;
  const isAlreadySelectedPoint = selectedPoints.some((p) =>
    arePointsEqual(p, clickedPoint)
  );
  return isAlreadySelectedPoint
    ? selectedPoints.filter((point) => !arePointsEqual(point, clickedPoint))
    : [
        { ...clickedPoint },
        ...(isMultiSelectKeyPressed(e) ? selectedPoints : []),
      ];
};

/**
 * Click handler that's attached to the chart's container component.
 *
 * @param {Object} e chart click event.
 * @param {Object} chart ref to chart component.
 * @param {Object} props all props passed to this hook with local state.
 * @return {void}
 */
const onClick = (e, chart, props) => {
  const { point: clickedPoint, target } = e;
  const { selectedPoints } = props;

  // Ignore clicks within the chart legend.
  if (target.closest(".highcharts-legend-item") != null) {
    return;
  }

  // If the click wasn't on a point, de-select everything.
  if (clickedPoint == null) {
    updateSelectedPoints(chart, [], selectedPoints, props);
    return;
  }

  // Update selected points.
  const nextSelectedPoints = getNextSelectedPoints(e, selectedPoints);
  updateSelectedPoints(chart, nextSelectedPoints, selectedPoints, props);
};

/**
 * Generic hook that provides multi-select behavior to any Highcharts chart.
 *
 * @param {Object} props.chartRef ref to chart component.
 * @param {boolean} props.isDisabled disables the hook based on some external condition.
 * @param {Array<Object>} props.initialPoints list of initial points to select.
 * @param {function(chart: Object, points: Array<Object>)} props.onHighlightPoints
 *  custom highlight function.
 * @param {function(nextPoints: Array<Object>, prevPoints: Array<Object>)} props.onSelect
 *  passes both the next and prev points to the caller.
 * @return {void}
 */
const useChartMultiSelect = (props) => {
  const { chartRef, initialPoints } = props;
  const [selectedPoints, setSelectedPoints] = useState(initialPoints ?? []);
  const initializedRef = useRef(false);

  useEffect(() => {
    const { chart, container: containerRef } = chartRef.current;
    const container = containerRef.current;
    const extraProps = { ...props, selectedPoints, setSelectedPoints };

    // Clear all selected points if this hook is disabled.
    if (props.isDisabled) {
      if (selectedPoints.length > 0) {
        updateSelectedPoints(chart, [], selectedPoints, extraProps);
      }
      return;
    }

    // Initialize chart with existing selectedPoints, if available.
    if (!initializedRef.current) {
      highlightPoints(chart, selectedPoints, extraProps);
      initializedRef.current = true;
    }

    const handleClick = (e) => onClick(e, chart, extraProps);

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [chartRef, props, selectedPoints]);
};

export default useChartMultiSelect;
