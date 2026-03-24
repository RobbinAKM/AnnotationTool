export type ShapeType =
  | "CURSOR"
  | "RECTANGLE"
  | "ELLIPSE"
  | "ICON"
  | "LINE"
  | "FREEHAND"
  | "TEXT";

export type AnnotationState = "ACTIVE" | "WARNING" | "INACTIVE";

export interface Annotation {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  points?: number[];
  textValue?: string;
  iconType?: string;
  colorState: AnnotationState;
  groupId?: string | null;
}
