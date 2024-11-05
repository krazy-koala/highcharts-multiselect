import { getColorFormat, getRgbString, hexToRgb } from "../utils/colorUtils";

const OPACITY = {
  MIN: 0.2,
  MAX: 1,
};

const updatePointOpacity = (point, opacity) => {
  let color =
    getColorFormat(point.color) === "hex"
      ? getRgbString(hexToRgb(point.color))
      : point.color;
  const [, r, g, b] = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/
  );
  const a = opacity;

  point.update(
    {
      color: `rgba(${r},${g},${b},${a})`,
      dataLabels: {
        style: {
          opacity,
        },
      },
    },
    false
  );
};

const updateChartOpacity = (chart, getOpacity) => {
  chart.series.forEach((series) => {
    series.points.forEach((point) => {
      const opacity = getOpacity(point);
      updatePointOpacity(point, opacity);
    });
  });
  chart.redraw();
};

export { OPACITY, updateChartOpacity };