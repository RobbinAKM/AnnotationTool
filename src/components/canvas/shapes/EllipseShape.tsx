import { Ellipse } from "react-konva";
import type { ShapeRendererProps } from "./types";

export default function EllipseShape({ ann, common }: ShapeRendererProps) {
  return (
    <Ellipse
      key={ann.id}
      {...common}
      radiusX={common.width / 2}
      radiusY={common.height / 2}
      offset={{ x: -common.width / 2, y: -common.height / 2 }}
    />
  );
}
