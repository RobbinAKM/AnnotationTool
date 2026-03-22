import { Stage, Layer, Rect, Ellipse } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useStore } from "../../store/useStore";
import { toPixel, toPercentage } from "../../utills/coordinates";
import { v4 as uuidv4 } from "uuid";

interface Props {
  width: number;
  height: number;
}

const getColor = (state: string) => {
  switch (state) {
    case "ACTIVE":
      return "#22c55e"; // Green
    case "WARNING":
      return "#ef4444"; // Red
    case "INACTIVE":
      return "#6b7280"; // Gray
    default:
      return "#22c55e"; // Default to green if unknown state
  }
};

export const AnnotationCanvas = ({ width, height }: Props) => {
  const {
    activeTool,
    annotations,
    selectedIds,
    addAnnotation,
    updateAnnotation,
    setSelectedIds,
  } = useStore();

  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    if (activeTool === "CURSOR") {
      setSelectedIds([]);
      return;
    }

    const stage = e.target.getStage();
    const pointerPosition = stage?.getPointerPosition();
    if (!pointerPosition) return;

    const newAnnotation = {
      id: uuidv4(),
      type: activeTool,
      x: toPercentage(pointerPosition.x, width),
      y: toPercentage(pointerPosition.y, height),
      width: toPercentage(100, width),
      height: toPercentage(100, height),
      colorState: "ACTIVE" as const,
      groupId: null,
    };

    addAnnotation(newAnnotation);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    const node = e.target;
    updateAnnotation(id, {
      x: toPercentage(node.x(), width),
      y: toPercentage(node.y(), height),
    });
  };

  return (
    <Stage
      width={width}
      height={height}
      className="absolute top-0 left-0 z-10"
      style={{ cursor: activeTool === "CURSOR" ? "default" : "crosshair" }}
      onMouseDown={handleStageMouseDown}
    >
      <Layer>
        {annotations.map((ann) => {
          const isSelected = selectedIds.includes(ann.id);
          const strokeColor = getColor(ann.colorState);

          const pixelX = toPixel(ann.x, width);
          const pixelY = toPixel(ann.y, height);
          const pixelWidth = toPixel(ann.width, width);
          const pixelHeight = toPixel(ann.height, height);

          const commonProps = {
            id: ann.id,
            x: pixelX,
            y: pixelY,
            width: pixelWidth,
            height: pixelHeight,
            stroke: strokeColor,
            strokeWidth: isSelected ? 4 : 2,
            draggable: activeTool === "CURSOR",
            onClick: () => setSelectedIds([ann.id]),
            onDragEnd: (e: KonvaEventObject<DragEvent>) =>
              handleDragEnd(e, ann.id),
          };

          if (ann.type === "RECTANGLE") {
            return <Rect key={ann.id} {...commonProps} />;
          }

          if (ann.type === "ELLIPSE") {
            return (
              <Ellipse
                key={ann.id}
                {...commonProps}
                radiusX={pixelWidth / 2}
                radiusY={pixelHeight / 2}
                offset={{ x: -pixelWidth / 2, y: -pixelHeight / 2 }}
              />
            );
          }

          return null;
        })}
      </Layer>
    </Stage>
  );
};
