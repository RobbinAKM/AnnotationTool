export const toPixel = (percentage: number, totalPixels: number) => {
  return percentage * totalPixels;
};

export const toPercentage = (pixel: number, totalPixels: number) => {
  return pixel / totalPixels;
};
