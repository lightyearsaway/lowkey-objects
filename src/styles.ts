import { Color } from "./types";

export const getRed = (alpha = 1) => `rgba(245, 34, 45, ${alpha})`;

export const getBlue = (alpha = 1) => `rgba(24, 144, 255, ${alpha})`;

export const getGray = (alpha = 1) => `rgba(140, 140, 140, ${alpha})`;

export const getColoredObjectCss = (color: Color | null, selected: boolean) => {
  let colorGetter = null;
  if (color !== null) {
    colorGetter = color === Color.RED ? getRed : getBlue;
  }

  return {
    background: colorGetter ? colorGetter(0.2) : "transparent",
    paddingBottom: "100%",
    borderRadius: 8,
    border: selected && colorGetter ? `2px solid ${colorGetter(0.5)}` : "none",
    margin: selected && colorGetter ? -2 : 0,
    cursor: "pointer",
    position: "relative" as const,
    transition: "background 0.3s ease-in-out",
  };
};

export const menuItemWrapperStyle = { display: "flex", alignItems: "center" };

export const menuItemSwatchStyle = {
  marginLeft: 8,
  borderRadius: 4,
  width: 20,
  height: 20,
};
