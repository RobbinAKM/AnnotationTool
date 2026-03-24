import { Text } from "react-konva";
import type { ShapeRendererProps } from "./types";

export default function TextShape({
  ann,
  common,
  onDblClick,
}: ShapeRendererProps) {
  return (
    <Text
      key={ann.id}
      {...common}
      text={ann.textValue || "TEXT LABEL"}
      fontSize={common.height}
      fill={common.stroke}
      fontFamily="sans-serif"
      fontStyle="bold"
      onDblClick={onDblClick}
    />
  );
}
