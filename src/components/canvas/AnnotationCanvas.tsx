import { useRef, useState } from "react";
import { Stage, Layer, Rect, Line } from "react-konva";
import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useStore } from "../../store/useStore";
import { toPixel } from "../../utills/coordinates";
import { SelectionTransformer } from "./SelectionTransformer";
import ShapeRenderer from "./shapes";
import { getColor } from "./utils/colors";
import { useCanvasHandlers } from "./hooks/useCanvasHandlers";

interface Props {
  width: number;
  height: number;
}

export const AnnotationCanvas = ({ width, height }: Props) => {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  const [editingText, setEditingText] = useState<{
    id: string;
    x: number;
    y: number;
    value: string;
    width: number;
    fontSize: number;
  } | null>(null);

  const { activeTool, annotations, updateAnnotation } = useStore();

  const {
    isDrawing,
    currentLine,
    selectionBox,
    handleStageMouseDown,
    handleStageMouseMove,
    handleStageMouseUp,
    handleShapeClick,
    handleDragEnd,
    handleTransformEnd,
  } = useCanvasHandlers({ layerRef, width, height });

  return (
    <>
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
              rotation: ann.rotation || 0,
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

            return (
              <ShapeRenderer
                key={ann.id}
                ann={ann}
                common={commonProps}
                width={width}
                height={height}
                onDblClick={(e: KonvaEventObject<MouseEvent>) => {
                  if (ann.type !== "TEXT") return;
                  const absPos = e.target.absolutePosition();
                  setEditingText({
                    id: ann.id,
                    x: absPos.x,
                    y: absPos.y,
                    value: ann.textValue || "",
                    width: Math.max(200, e.target.width() * e.target.scaleX()),
                    fontSize: toPixel(ann.height, height) * e.target.scaleY(),
                  });
                }}
              />
            );
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

          {isDrawing && currentLine.length > 0 && (
            <Line
              points={currentLine.map((p, i) =>
                i % 2 === 0 ? toPixel(p, width) : toPixel(p, height),
              )}
              stroke="#10b981" // Emerald-500
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          )}
          <SelectionTransformer stageRef={stageRef} />
        </Layer>
      </Stage>

      {editingText && (
        <input
          value={editingText.value}
          onChange={(e) =>
            setEditingText({ ...editingText, value: e.target.value })
          }
          onBlur={() => {
            // Save to Zustand when the user clicks away
            updateAnnotation(editingText.id, { textValue: editingText.value });
            setEditingText(null);
          }}
          onKeyDown={(e) => {
            // Save to Zustand when the user hits Enter
            if (e.key === "Enter") {
              updateAnnotation(editingText.id, {
                textValue: editingText.value,
              });
              setEditingText(null);
            }
          }}
          style={{
            position: "absolute",
            top: `${editingText.y}px`,
            left: `${editingText.x}px`,
            width: `${editingText.width}px`,
            fontSize: `${editingText.fontSize}px`,
            color: "#fff",
            backgroundColor: "rgba(15, 23, 42, 0.8)", // Slate-900 with opacity
            border: "2px solid #06b6d4", // Cyan-500
            borderRadius: "4px",
            padding: "2px 8px",
            outline: "none",
            zIndex: 50,
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
          autoFocus // Automatically highlights the input so they can start typing instantly
        />
      )}
    </>
  );
};
