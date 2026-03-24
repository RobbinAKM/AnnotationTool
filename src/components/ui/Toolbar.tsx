import {
  useStore,
  type ShapeType,
  type AnnotationState,
} from "../../store/useStore";
import {
  MousePointer2,
  Square,
  Circle,
  Camera,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Undo,
  Redo,
  Car,
  User,
  Leaf,
  ArrowUpRight,
  PenTool,
} from "lucide-react";
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-1 h-3 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
      {title}
    </h2>
  </div>
);

export const Toolbar = () => {
  const {
    activeTool,
    activeIcon,
    setActiveTool,
    selectedIds,
    updateSelectedStates,
    deleteSelected,
    annotations,
    past,
    future,
    undo,
    redo,
  } = useStore();

  const hasSelection = selectedIds.length > 0;
  const hasAnnotations = annotations.length > 0;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Tools Configuration
  const tools: {
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
  const colorStates: {
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

  const handleExport = () => {
    const dataStr = JSON.stringify(annotations, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `annotations-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* DRAWING TOOLS */}
      <section>
        <SectionHeader title="Deployment Tools" />
        <div className="flex flex-col gap-2">
          {tools.map((tool) => {
            const isActive =
              activeTool === tool.type &&
              (tool.type !== "ICON" || activeIcon === tool.faCode);
            return (
              <button
                key={tool.type}
                onClick={() => setActiveTool(tool.type, tool.faCode)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 group ${
                  isActive
                    ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-[inset_0_0_20px_rgba(6,182,212,0.15)]"
                    : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                <div
                  className={`transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "group-hover:scale-110"}`}
                >
                  {tool.icon}
                </div>
                <span className="text-sm font-medium tracking-wide">
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* COLOR STATES */}
      <section>
        <SectionHeader title="Node State" />
        <div className="flex flex-col gap-2">
          {colorStates.map((cs) => (
            <button
              key={cs.state}
              disabled={!hasSelection}
              onClick={() => updateSelectedStates(cs.state)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                hasSelection
                  ? `${cs.colorClass} shadow-sm`
                  : "opacity-40 cursor-not-allowed border-slate-800 bg-slate-800/20 text-slate-600 grayscale"
              }`}
            >
              {cs.icon}
              <span className="text-sm font-medium tracking-wide">
                {cs.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/*HISTORY & ACTIONS (Pushed to bottom) */}
      <section className="mt-auto flex flex-col gap-3 mb-[30px]">
        {/* Undo / Redo Pill */}
        <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              canUndo
                ? "text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md"
                : "text-slate-600 cursor-not-allowed"
            }`}
          >
            <Undo size={14} /> Undo
          </button>
          <div className="w-px bg-slate-700/50 my-1 mx-1"></div>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              canRedo
                ? "text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-md"
                : "text-slate-600 cursor-not-allowed"
            }`}
          >
            <Redo size={14} /> Redo
          </button>
        </div>

        {/* Delete Action */}
        <button
          onClick={deleteSelected}
          disabled={!hasSelection}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
            hasSelection
              ? "bg-rose-950/30 text-rose-400 border-rose-900/50 hover:bg-rose-900/40 hover:text-rose-300 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(225,29,72,0.15)]"
              : "bg-slate-800/20 text-slate-600 border-slate-800 cursor-not-allowed"
          }`}
        >
          <Trash2 size={16} /> Purge Selected Node
        </button>

        {/* Export Action */}
        <button
          onClick={handleExport}
          disabled={!hasAnnotations}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 border ${
            hasAnnotations
              ? "bg-cyan-600 text-white border-cyan-500 hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              : "bg-slate-800/40 text-slate-600 border-slate-700/50 cursor-not-allowed"
          }`}
        >
          <Download size={18} /> Export Telemetry Data
        </button>
      </section>
    </div>
  );
};
