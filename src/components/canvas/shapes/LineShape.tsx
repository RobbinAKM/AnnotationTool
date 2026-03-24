import { Arrow } from "react-konva";
import type { ShapeRendererProps } from "./types";

export default function LineShape({ ann, common }: ShapeRendererProps) {
  return (
    <Arrow
      key={ann.id}
      {...common}
      points={[0, 0, common.width, common.height]}
      pointerLength={6}
      pointerWidth={6}
      fill={common.stroke}
      strokeWidth={15}
    />
  );
}
