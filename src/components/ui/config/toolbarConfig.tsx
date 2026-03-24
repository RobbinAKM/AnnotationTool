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
export const tools: {
  type: ShapeType;
  icon: React.ReactNode;
  label: string;
  faCode?: string;
}[] = [
  {
    type: "CURSOR",
    icon: <MousePointer2 size={18} />,
    label: "Select / Drag",
  },
  { type: "TEXT", icon: <Type size={18} />, label: "Text Label" },
  { type: "RECTANGLE", icon: <Square size={18} />, label: "Rectangle Box" },
  { type: "ELLIPSE", icon: <Circle size={18} />, label: "Ellipse Radius" },
  {
    type: "LINE",
    icon: <ArrowUpRight size={18} />,
    label: "Directional Arrow",
  },
  {
    type: "ICON",
    faCode: "\uf030",
    icon: <Camera size={18} />,
    label: "Camera Node",
  },
  {
    type: "ICON",
    faCode: "\uf1b9",
    icon: <Car size={18} />,
    label: "Vehicle Node",
  },
  {
    type: "ICON",
    faCode: "\uf007",
    icon: <User size={18} />,
    label: "Person Node",
  },
  {
    type: "ICON",
    faCode: "\uf06c",
    icon: <Leaf size={18} />,
    label: "Environment Node",
  },
  { type: "FREEHAND", icon: <PenTool size={18} />, label: "Freehand Draw" },
];

// Color States Configuration
export const colorStates: {
  state: AnnotationState;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
}[] = [
  {
    state: "ACTIVE",
    icon: <CheckCircle2 size={18} />,
    label: "Active",
    colorClass: "text-green-500 hover:bg-green-500/10 border-green-500",
  },
  {
    state: "WARNING",
    icon: <AlertTriangle size={18} />,
    label: "Warning",
    colorClass: "text-red-500 hover:bg-red-500/10 border-red-500",
  },
  {
    state: "INACTIVE",
    icon: <XCircle size={18} />,
    label: "Inactive",
    colorClass: "text-gray-400 hover:bg-gray-500/10 border-gray-400",
  },
];
