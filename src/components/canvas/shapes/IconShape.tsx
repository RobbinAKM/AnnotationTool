import { Text } from "react-konva";
import type { ShapeRendererProps } from "./types";

export default function IconShape({ ann, common }: ShapeRendererProps) {
  return (
    <Text
      key={ann.id}
      {...common}
      text={ann.iconType}
      fontFamily='"Font Awesome 6 Free"'
      fontStyle="900"
      fontSize={common.height}
      align="center"
      verticalAlign="middle"
    />
  );
}
