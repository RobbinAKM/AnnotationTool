import { Stage, Layer } from "react-konva";

interface Props {
  width: number;
  height: number;
}

export const AnnotationCanvas = ({ width, height }: Props) => {
  return (
    <Stage
      width={width}
      height={height}
      className="absolute top-0 left-0 z-10 cursor-crosshair"
    >
      <Layer></Layer>
    </Stage>
  );
};
