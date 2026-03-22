import { create } from "zustand";

export type ShapeType = "RECTANGLE" | "ELLIPSE" | "CURSOR";
export type AnnotationState = "ACTIVE" | "WARNING" | "INACTIVE";

export interface Annotation {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  colorState: AnnotationState;
  groupId: string | null;
}

interface AppState {
  // Media State
  mediaUrl: string | null;
  mediaType: "image" | "video" | null;
  setMedia: (url: string, type: "image" | "video") => void;

  // Tool State
  activeTool: ShapeType;
  setActiveTool: (tool: ShapeType) => void;

  // Annotation State
  annotations: Annotation[];
  selectedIds: string[];
  addAnnotation: (ann: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  setSelectedIds: (ids: string[]) => void;
}

export const useStore = create<AppState>((set) => ({
  mediaUrl: null,
  mediaType: null,
  setMedia: (url, type) => set({ mediaUrl: url, mediaType: type }),

  activeTool: "CURSOR",
  setActiveTool: (tool) => set({ activeTool: tool }),

  annotations: [],
  selectedIds: [],

  addAnnotation: (ann) =>
    set((state) => ({
      annotations: [...state.annotations, ann],
      selectedIds: [ann.id],
    })),

  updateAnnotation: (id, updates) =>
    set((state) => ({
      annotations: state.annotations.map((ann) =>
        ann.id === id ? { ...ann, ...updates } : ann,
      ),
    })),

  setSelectedIds: (ids) => set({ selectedIds: ids }),
}));
