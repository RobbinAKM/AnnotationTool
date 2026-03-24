import { useState } from "react";
import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../../../store/useStore";
import { toPercentage } from "../../../utills/coordinates";

type UseCanvasHandlersArgs = {
  layerRef: React.RefObject<Konva.Layer | null>;
  width: number;
  height: number;
};

export function useCanvasHandlers({
  layerRef,
  width,
  height,
}: UseCanvasHandlersArgs) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<number[]>([]);
  const [selectionBox, setSelectionBox] = useState({
    visible: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const {
    activeTool,
    activeIcon,
    annotations,
    selectedIds,
    setActiveTool,
    addAnnotation,
    updateAnnotation,
    setSelectedIds,
  } = useStore();

  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
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

      if (activeTool === "FREEHAND") {
        setIsDrawing(true);
        setCurrentLine([
          toPercentage(pointer.x, width),
          toPercentage(pointer.y, height),
        ]);
        setSelectedIds([]);
        return;
      }

      if (activeTool === "TEXT") {
        const defaultFontSize = width * 0.03; // Scales with the media
        addAnnotation({
          id: uuidv4(),
          type: "TEXT",
          x: toPercentage(pointer.x, width),
          y: toPercentage(pointer.y, height),
          width: toPercentage(defaultFontSize * 8, width),
          height: toPercentage(defaultFontSize, height),
          textValue: "DOUBLE CLICK TO EDIT",
          colorState: "ACTIVE" as const,
          groupId: null,
        });
        setActiveTool("CURSOR");
        return;
      }

      const defaultWidth = activeTool === "ICON" ? width * 0.04 : width * 0.1;
      const defaultHeight = activeTool === "ICON" ? width * 0.04 : width * 0.1;

      const startX = pointer.x - defaultWidth / 2;
      const startY = pointer.y - defaultHeight / 2;

      addAnnotation({
        id: uuidv4(),
        type: activeTool,
        x: toPercentage(startX, width),
        y: toPercentage(startY, height),
        width: toPercentage(defaultWidth, width),
        height: toPercentage(defaultHeight, height),
        iconType: activeTool === "ICON" ? activeIcon : undefined,
        colorState: "ACTIVE" as const,
        groupId: null,
      });
    }
  };

  const handleStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    if (activeTool === "FREEHAND" && isDrawing) {
      setCurrentLine((prev) => [
        ...prev,
        toPercentage(pointer.x, width),
        toPercentage(pointer.y, height),
      ]);
      return;
    }

    if (selectionBox.visible && activeTool === "CURSOR") {
      setSelectionBox((prev) => ({
        ...prev,
        x: Math.min(pointer.x, prev.startX),
        y: Math.min(pointer.y, prev.startY),
        width: Math.abs(pointer.x - prev.startX),
        height: Math.abs(pointer.y - prev.startY),
      }));
    }
  };

  const handleStageMouseUp = () => {
    if (activeTool === "FREEHAND" && isDrawing) {
      setIsDrawing(false);
      if (currentLine.length > 2) {
        addAnnotation({
          id: uuidv4(),
          type: "FREEHAND",
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          points: [...currentLine],
          colorState: "ACTIVE" as const,
          groupId: null,
        });
      }
      setCurrentLine([]);
      setActiveTool("CURSOR");
      return;
    }

    if (activeTool === "CURSOR" && selectionBox.visible) {
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
          if (Konva.Util.haveIntersection(boxRect, shapeRect))
            newSelectedIds.push(shape.id());
        });
        setSelectedIds(newSelectedIds);
      });
    }

    setActiveTool("CURSOR");
  };

  const handleShapeClick = (e: KonvaEventObject<MouseEvent>, id: string) => {
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

    const ann = annotations.find((a) => a.id === id);

    if (ann?.type === "FREEHAND" && ann.points) {
      const scaledPoints = ann.points.map((p, i) =>
        i % 2 === 0 ? p * scaleX : p * scaleY,
      );
      updateAnnotation(id, {
        x: toPercentage(node.x(), width),
        y: toPercentage(node.y(), height),
        points: scaledPoints,
        rotation: node.rotation(),
      });
    } else {
      updateAnnotation(id, {
        x: toPercentage(node.x(), width),
        y: toPercentage(node.y(), height),
        width: toPercentage(Math.max(5, node.width() * scaleX), width),
        height: toPercentage(Math.max(5, node.height() * scaleY), height),
        rotation: node.rotation(),
      });
    }
  };

  return {
    isDrawing,
    currentLine,
    selectionBox,
    setSelectionBox,
    setCurrentLine,
    setIsDrawing,
    handleStageMouseDown,
    handleStageMouseMove,
    handleStageMouseUp,
    handleShapeClick,
    handleDragEnd,
    handleTransformEnd,
  };
}
