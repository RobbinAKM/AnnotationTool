import { useRef, useState } from "react";
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
  const layerRef = useRef<Konva.Layer>(null);
  const {
    activeTool,
    annotations,
    selectedIds,
    addAnnotation,
    updateAnnotation,
    setSelectedIds,
  } = useStore();

  const [selectionBox, setSelectionBox] = useState({
    visible: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      console.log(
        "Stage clicked at:",
        e.target.getStage()?.getPointerPosition(),
      );
      const stage = e.target.getStage();
      const pointer = stage?.getPointerPosition();
      if (!pointer) return;

      if (activeTool === "CURSOR") {
        setSelectionBox({
          visible: true,
          startX: pointer.x,
          startY: pointer.y,
          x: pointer.x,
          y: pointer.y,
          width: 0,
          height: 0,
        });
        setSelectedIds([]);
        return;
      }

      const defaultWidth = activeTool === "ICON" ? 40 : 100;
      const defaultHeight = activeTool === "ICON" ? 40 : 100;

      const startX = pointer.x - defaultWidth / 2;
      const startY = pointer.y - defaultHeight / 2;

      const newAnnotation = {
        id: uuidv4(),
        type: activeTool,
        x: toPercentage(startX, width),
        y: toPercentage(startY, height),
        width: toPercentage(defaultWidth, width),
        height: toPercentage(defaultHeight, height),
        iconType: activeTool === "ICON" ? "\uf030" : undefined,
        colorState: "ACTIVE" as const,
        groupId: null,
      };

      addAnnotation(newAnnotation);
    }
  };

  const handleStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!selectionBox.visible || activeTool !== "CURSOR") return;

    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    setSelectionBox((prev) => ({
      ...prev,
      x: Math.min(pointer.x, prev.startX),
      y: Math.min(pointer.y, prev.startY),
      width: Math.abs(pointer.x - prev.startX),
      height: Math.abs(pointer.y - prev.startY),
    }));
  };

  const handleStageMouseUp = () => {
    if (!selectionBox.visible || activeTool !== "CURSOR") return;

    setSelectionBox((prev) => ({ ...prev, visible: false }));

    if (selectionBox.width === 0 && selectionBox.height === 0) return;

    setTimeout(() => {
      if (!layerRef.current) return;
      const shapes = layerRef.current.getChildren();
      const boxRect = {
        x: selectionBox.x,
        y: selectionBox.y,
        width: selectionBox.width,
        height: selectionBox.height,
      };

      const newSelectedIds: string[] = [];

      shapes.forEach((shape) => {
        if (
          shape.name() === "selection-box" ||
          shape.className === "Transformer"
        )
          return;

        const shapeRect = shape.getClientRect({ skipTransform: false });

        const hasIntersection = Konva.Util.haveIntersection(boxRect, shapeRect);

        if (hasIntersection) {
          newSelectedIds.push(shape.id());
        }
      });

      setSelectedIds(newSelectedIds);
    });
  };

  const handleShapeClick = (e: KonvaEventObject<MouseEvent>, id: string) => {
    console.log("Shape clicked:", id, "Shift pressed:", e.evt.shiftKey);
    if (activeTool !== "CURSOR") return;
    if (e.evt.shiftKey) {
      if (selectedIds.includes(id))
        setSelectedIds(selectedIds.filter((selId) => selId !== id));
      else setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    console.log("Drag ended for:", id, "New position:", {
      x: e.target.x(),
      y: e.target.y(),
    });
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
      onMouseMove={handleStageMouseMove}
      onMouseUp={handleStageMouseUp}
    >
      <Layer ref={layerRef}>
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

        {selectionBox.visible && (
          <Rect
            name="selection-box"
            x={selectionBox.x}
            y={selectionBox.y}
            width={selectionBox.width}
            height={selectionBox.height}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth={1}
            listening={false}
          />
        )}
        <SelectionTransformer stageRef={stageRef} />
      </Layer>
    </Stage>
  );
};
