import Rectangle from "./Rectangle";
import EllipseShape from "./EllipseShape";
import IconShape from "./IconShape";
import LineShape from "./LineShape";
import FreehandShape from "./FreehandShape";
import TextShape from "./TextShape";
import type { ShapeRendererProps } from "./types";

export default function ShapeRenderer(props: ShapeRendererProps) {
  const { ann, common, width, height, onDblClick } = props;
  if (ann.type === "RECTANGLE")
    return (
      <Rectangle ann={ann} common={common} width={width} height={height} />
    );
  if (ann.type === "ELLIPSE")
    return (
      <EllipseShape ann={ann} common={common} width={width} height={height} />
    );
  if (ann.type === "ICON")
    return (
      <IconShape ann={ann} common={common} width={width} height={height} />
    );
  if (ann.type === "LINE")
    return (
      <LineShape ann={ann} common={common} width={width} height={height} />
    );
  if (ann.type === "FREEHAND")
    return (
      <FreehandShape
        ann={ann}
        width={width!}
        height={height!}
        onClick={onDblClick}
        onTransformEnd={common.onTransformEnd}
      />
    );
  if (ann.type === "TEXT")
    return (
      <TextShape
        ann={ann}
        common={common}
        width={width}
        height={height}
        onDblClick={onDblClick}
      />
    );
  return null;
}
