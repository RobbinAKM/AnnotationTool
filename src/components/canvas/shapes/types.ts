import type { KonvaEventObject } from "konva/lib/Node";
import type { Annotation } from "../types";

export type CommonProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  draggable?: boolean;
  onClick?: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
  onTransformEnd?: (e: KonvaEventObject<Event>) => void;
};

export type ShapeRendererProps = {
  ann: Annotation;
  common: CommonProps;
  width: number;
  height: number;
  onDblClick?: (e: KonvaEventObject<MouseEvent>) => void;
};
