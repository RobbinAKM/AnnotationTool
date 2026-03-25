import {
  MousePointer2,
  Square,
  Circle,
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Car,
  User,
  Leaf,
  ArrowUpRight,
  PenTool,
  Type,
} from "lucide-react";
import type { AnnotationState, ShapeType } from "../../../store/useStore";

// Tools Configuration
// 1. Add the shortcut strings to the mapping
export const tools: {
  type: ShapeType;
  icon: React.ReactNode;
  label: string;
  faCode?: string;
  shortcut?: string;
}[] = [
  {
    type: "CURSOR",
    icon: <MousePointer2 size={18} />,
    label: "Select / Drag",
    shortcut: "V",
  },
  {
    type: "TEXT",
    icon: <Type size={18} />,
    label: "Text Label",
    shortcut: "T",
  },
  {
    type: "FREEHAND",
    icon: <PenTool size={18} />,
    label: "Freehand Draw",
    shortcut: "F",
  },
  {
    type: "RECTANGLE",
    icon: <Square size={18} />,
    label: "Rectangle Box",
    shortcut: "R",
  },
  {
    type: "ELLIPSE",
    icon: <Circle size={18} />,
    label: "Ellipse Radius",
    shortcut: "E",
  },
  {
    type: "LINE",
    icon: <ArrowUpRight size={18} />,
    label: "Directional Arrow",
    shortcut: "A",
  },
  {
    type: "ICON",
    faCode: "\uf030",
    icon: <Camera size={18} />,
    label: "Camera Node",
    shortcut: "C",
  },
  {
    type: "ICON",
    faCode: "\uf1b9",
    icon: <Car size={18} />,
    label: "Vehicle Node",
    shortcut: "M",
  },
  {
    type: "ICON",
    faCode: "\uf007",
    icon: <User size={18} />,
    label: "Person Node",
    shortcut: "P",
  },
  {
    type: "ICON",
    faCode: "\uf06c",
    icon: <Leaf size={18} />,
    label: "Environment Node",
    shortcut: "L",
  },
];
// Color States Configuration
export const colorStates: {
  state: AnnotationState;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
  shortcut?: string;
}[] = [
  {
    state: "ACTIVE",
    icon: <CheckCircle2 size={18} />,
    label: "Active",
    colorClass: "text-green-500 hover:bg-green-500/10 border-green-500",
    shortcut: "1",
  },
  {
    state: "WARNING",
    icon: <AlertTriangle size={18} />,
    label: "Warning",
    colorClass: "text-red-500 hover:bg-red-500/10 border-red-500",
    shortcut: "2",
  },
  {
    state: "INACTIVE",
    icon: <XCircle size={18} />,
    label: "Inactive",
    colorClass: "text-gray-400 hover:bg-gray-500/10 border-gray-400",
    shortcut: "3",
  },
];
