import { Rect } from "react-konva";
import type { ShapeRendererProps } from "./types";

export default function Rectangle({ ann, common }: ShapeRendererProps) {
  return <Rect key={ann.id} {...common} />;
}
