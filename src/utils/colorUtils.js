// 6 levels of brightness from 0 to 5, 0 being the darkest.
const CHROMA = {
  LIGHT: 5,
  DARK: 0,
};

const adjustChroma = (rgb, darkness) => {
  const [r, g, b] = rgb;
  // 51 => 255/5
  const mix = [darkness * 51, darkness * 51, darkness * 51];
  return [r + mix[0], g + mix[1], b + mix[2]].map((x) => {
    return Math.round(x / 2.0);
  });
};

const getColorFormat = (color) => {
  // Regex for hex color
  const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;

  // Regex for rgb or rgba color
  const rgbPattern =
    /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*(0|1|0?\.\d+))?\)$/;

  if (hexPattern.test(color)) {
    return "hex";
  } else if (rgbPattern.test(color)) {
    return "rgb";
  } else {
    return "unknown";
  }
};

const getSimpleGradient = (hex) => {
  const rgb = hexToRgb(hex);
  return {
    minColor: rgbToHex(adjustChroma(rgb, CHROMA.LIGHT)),
    maxColor: rgbToHex(adjustChroma(rgb, CHROMA.DARK)),
  };
};

const rgbToHex = (rgb) => {
  const [r, g, b] = rgb;
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
  );
};

const hexToRgb = (hex) => {
  // Ensure the hex color code is in the correct format
  let cleanHex = hex.replace(/^#/, "");

  // Parse the hex color code into RGB components
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return [r, g, b];
};

const getRgbString = (rgb) => {
  const [r, g, b] = rgb;
  return `rgb(${r},${g},${b})`;
};

function interleaveColors(colors) {
  // Arrays to hold odd and even indexed colors
  let oddColors = [];
  let evenColors = [];

  // Iterate through the colors array
  for (let i = 0; i < colors.length; i++) {
    if (i % 2 === 0) {
      // Even index
      evenColors.push(colors[i]);
    } else {
      // Odd index
      oddColors.push(colors[i]);
    }
  }

  // Concatenate oddColors and evenColors
  return oddColors.concat(evenColors);
}

export {
  CHROMA,
  adjustChroma,
  getColorFormat,
  getRgbString,
  getSimpleGradient,
  hexToRgb,
  interleaveColors,
  rgbToHex,
};