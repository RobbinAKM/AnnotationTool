import { useRef } from "react";
import { Stage, Layer, Rect, Ellipse, Text } from "react-konva";
import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useStore } from "../../store/useStore";
import { toPixel, toPercentage } from "../../utills/coordinates";
import { v4 as uuidv4 } from "uuid";
import { SelectionTransformer } from "./SelectionTransformer";

interface Props {
  width: number;
  height: number;
}

const getColor = (state: string) => {
  switch (state) {
    case "ACTIVE":
      return "#22c55e";
    case "WARNING":
      return "#ef4444";
    case "INACTIVE":
      return "#6b7280";
    default:
      return "#22c55e";
  }
};

export const AnnotationCanvas = ({ width, height }: Props) => {
  const stageRef = useRef<Konva.Stage>(null);
  const {
    activeTool,
    annotations,
    selectedIds,
    addAnnotation,
    updateAnnotation,
    setSelectedIds,
  } = useStore();

  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
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
        width: toPercentage(activeTool === "ICON" ? 40 : 100, width),
        height: toPercentage(activeTool === "ICON" ? 40 : 100, height),
        iconType: activeTool === "ICON" ? "\uf030" : undefined,
        colorState: "ACTIVE" as const,
        groupId: null,
      };

      addAnnotation(newAnnotation);
    }
  };

  const handleShapeClick = (e: KonvaEventObject<MouseEvent>, id: string) => {
    if (activeTool !== "CURSOR") return;

    if (e.evt.shiftKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((selId) => selId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    updateAnnotation(id, {
      x: toPercentage(e.target.x(), width),
      y: toPercentage(e.target.y(), height),
    });
  };

  const handleTransformEnd = (e: KonvaEventObject<Event>, id: string) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    updateAnnotation(id, {
      x: toPercentage(node.x(), width),
      y: toPercentage(node.y(), height),
      width: toPercentage(Math.max(5, node.width() * scaleX), width),
      height: toPercentage(Math.max(5, node.height() * scaleY), height),
    });
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 z-10"
      style={{ cursor: activeTool === "CURSOR" ? "default" : "crosshair" }}
      onMouseDown={handleStageMouseDown}
    >
      <Layer>
        {annotations.map((ann) => {
          const strokeColor = getColor(ann.colorState);
          const commonProps = {
            id: ann.id,
            x: toPixel(ann.x, width),
            y: toPixel(ann.y, height),
            width: toPixel(ann.width, width),
            height: toPixel(ann.height, height),
            stroke: ann.type === "ICON" ? undefined : strokeColor,
            fill: ann.type === "ICON" ? strokeColor : undefined,
            strokeWidth: 2,
            draggable: activeTool === "CURSOR",
            onClick: (e: KonvaEventObject<MouseEvent>) =>
              handleShapeClick(e, ann.id),
            onDragEnd: (e: KonvaEventObject<DragEvent>) =>
              handleDragEnd(e, ann.id),
            onTransformEnd: (e: KonvaEventObject<Event>) =>
              handleTransformEnd(e, ann.id),
          };

          if (ann.type === "RECTANGLE")
            return <Rect key={ann.id} {...commonProps} />;
          if (ann.type === "ELLIPSE")
            return (
              <Ellipse
                key={ann.id}
                {...commonProps}
                radiusX={commonProps.width / 2}
                radiusY={commonProps.height / 2}
                offset={{
                  x: -commonProps.width / 2,
                  y: -commonProps.height / 2,
                }}
              />
            );

          if (ann.type === "ICON") {
            return (
              <Text
                key={ann.id}
                {...commonProps}
                text={ann.iconType}
                fontFamily='"Font Awesome 6 Free"'
                fontStyle="900"
                fontSize={commonProps.height}
                align="center"
                verticalAlign="middle"
              />
            );
          }
          return null;
        })}

        <SelectionTransformer stageRef={stageRef} />
      </Layer>
    </Stage>
  );
};
