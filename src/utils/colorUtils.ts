/**
 * Adjusts a hex color by a given percentage
 * @param color - Hex color string (e.g., "#FF0000" or "#F00")
 * @param percent - Percentage to adjust (-100 to 100). Negative makes it darker, positive makes it lighter
 * @returns Adjusted hex color string
 */
export const adjustColor = (color: string, percent: number): string => {
  // Remove # if present
  let hex = color.replace('#', '');

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust each channel
  const adjustChannel = (channel: number): number => {
    const adjusted = Math.round(channel * (1 + percent / 100));
    return Math.min(255, Math.max(0, adjusted));
  };

  // Convert adjusted RGB back to hex
  const toHex = (n: number): string => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const adjustedR = adjustChannel(r);
  const adjustedG = adjustChannel(g);
  const adjustedB = adjustChannel(b);

  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
};
