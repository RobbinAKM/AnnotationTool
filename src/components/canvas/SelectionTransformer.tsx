import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import Konva from "konva";
import { useStore } from "../../store/useStore";

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export const SelectionTransformer = ({ stageRef }: Props) => {
  const trRef = useRef<Konva.Transformer>(null);
  const selectedIds = useStore((state) => state.selectedIds);

  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;

    const stage = stageRef.current;
    const selectedNodes = selectedIds
      .map((id) => stage.findOne(`#${id}`))
      .filter((node): node is Konva.Node => node !== undefined);

    trRef.current.nodes(selectedNodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds, stageRef]);

  return (
    <Transformer
      ref={trRef}
      borderStroke="#3b82f6"
      anchorStroke="#3b82f6"
      anchorFill="#ffffff"
      anchorSize={8}
      rotateEnabled={false}
    />
  );
};
