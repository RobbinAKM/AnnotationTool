import { Line } from "react-konva";
import type { ShapeRendererProps } from "./types";
import { toPixel } from "../../../utills/coordinates";

type Props = {
  ann: ShapeRendererProps["ann"];
  width: number;
  height: number;
  onClick?: ShapeRendererProps["onDblClick"];
  onTransformEnd?: ShapeRendererProps["onDblClick"];
};

export default function FreehandShape({
  ann,
  width,
  height,
  onClick,
  onTransformEnd,
}: Props) {
  return (
    <Line
      key={ann.id}
      id={ann.id}
      x={toPixel(ann.x, width)}
      y={toPixel(ann.y, height)}
      points={
        ann.points?.map((p, i) =>
          i % 2 === 0 ? toPixel(p, width) : toPixel(p, height),
        ) || []
      }
      stroke={
        ann.colorState === "ACTIVE"
          ? "#22c55e"
          : ann.colorState === "WARNING"
            ? "#ef4444"
            : "#6b7280"
      }
      strokeWidth={2}
      tension={0.5}
      lineCap="round"
      lineJoin="round"
      hitStrokeWidth={15}
      draggable
      rotation={ann.rotation || 0}
      onClick={onClick}
      onTransformEnd={onTransformEnd}
    />
  );
}
