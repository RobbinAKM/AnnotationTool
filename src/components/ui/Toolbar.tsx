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
} from "lucide-react";

export const Toolbar = () => {
  const {
    activeTool,
    setActiveTool,
    selectedIds,
    updateSelectedStates,
    deleteSelected,
    annotations,
  } = useStore();

  const hasSelection = selectedIds.length > 0;
  const hasAnnotations = annotations.length > 0;

  // Tools Configuration
  const tools: { type: ShapeType; icon: React.ReactNode; label: string }[] = [
    {
      type: "CURSOR",
      icon: <MousePointer2 size={18} />,
      label: "Select / Drag",
    },
    { type: "RECTANGLE", icon: <Square size={18} />, label: "Rectangle" },
    { type: "ELLIPSE", icon: <Circle size={18} />, label: "Ellipse" },
    { type: "ICON", icon: <Camera size={18} />, label: "Camera Icon" },
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
    <div className="flex flex-col h-full gap-6">
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Tools
        </h2>
        <div className="flex flex-col gap-2">
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => setActiveTool(tool.type)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                activeTool === tool.type
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tool.icon}
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Annotation State
        </h2>
        <div className="flex flex-col gap-2">
          {colorStates.map((cs) => (
            <button
              key={cs.state}
              disabled={!hasSelection}
              onClick={() => updateSelectedStates(cs.state)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md border border-transparent transition-all ${
                hasSelection
                  ? cs.colorClass
                  : "opacity-30 cursor-not-allowed text-gray-500"
              }`}
            >
              {cs.icon}
              <span className="text-sm font-medium">{cs.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-auto flex flex-col gap-2">
        <button
          onClick={deleteSelected}
          disabled={!hasSelection}
          className={`flex items-center justify-center gap-2 w-full py-2 rounded-md text-sm font-medium transition-colors ${
            hasSelection
              ? "bg-red-900/50 text-red-400 hover:bg-red-900/80"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          <Trash2 size={16} /> Delete Selected
        </button>

        <button
          onClick={handleExport}
          disabled={!hasAnnotations}
          className={`flex items-center justify-center gap-2 w-full py-2 rounded-md text-sm font-medium transition-colors ${
            hasAnnotations
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          <Download size={16} /> Export JSON
        </button>
      </section>
    </div>
  );
};
