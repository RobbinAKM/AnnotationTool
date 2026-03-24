import { create } from "zustand";

export type ShapeType =
  | "RECTANGLE"
  | "ELLIPSE"
  | "CURSOR"
  | "ICON"
  | "LINE"
  | "FREEHAND";
export type AnnotationState = "ACTIVE" | "WARNING" | "INACTIVE";

export interface Annotation {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  iconType?: string;
  colorState: AnnotationState;
  groupId: string | null;
  rotation?: number;
  points?: number[];
}

interface AppState {
  // Media State
  mediaUrl: string | null;
  mediaType: "image" | "video" | null;
  setMedia: (url: string, type: "image" | "video") => void;

  // Tool State
  activeTool: ShapeType;
  activeIcon: string;
  setActiveTool: (tool: ShapeType, iconUnicode?: string) => void;

  // Annotation State
  annotations: Annotation[];
  selectedIds: string[];
  addAnnotation: (ann: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  setSelectedIds: (ids: string[]) => void;

  updateSelectedStates: (colorState: AnnotationState) => void;
  deleteSelected: () => void;

  // History State
  past: Annotation[][];
  future: Annotation[][];
  // History Actions
  undo: () => void;
  redo: () => void;
}

export const useStore = create<AppState>((set) => ({
  mediaUrl: null,
  mediaType: null,
  setMedia: (url, type) => set({ mediaUrl: url, mediaType: type }),

  activeTool: "CURSOR",
  activeIcon: "\uf030", // Default to camera icon for ICON tool
  setActiveTool: (tool, iconUnicode) =>
    set({ activeTool: tool, activeIcon: iconUnicode || "\uf030" }),

  annotations: [],
  selectedIds: [],

  addAnnotation: (ann) =>
    set((state) => ({
      past: [...state.past, state.annotations],
      future: [],
      annotations: [...state.annotations, ann],
      selectedIds: [ann.id],
    })),

  updateAnnotation: (id, updates) =>
    set((state) => ({
      past: [...state.past, state.annotations],
      future: [],
      annotations: state.annotations.map((ann) =>
        ann.id === id ? { ...ann, ...updates } : ann,
      ),
    })),

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  updateSelectedStates: (colorState) =>
    set((state) => ({
      annotations: state.annotations.map((ann) =>
        state.selectedIds.includes(ann.id) ? { ...ann, colorState } : ann,
      ),
    })),

  deleteSelected: () =>
    set((state) => ({
      annotations: state.annotations.filter(
        (ann) => !state.selectedIds.includes(ann.id),
      ),
      selectedIds: [],
    })),

  past: [],
  future: [],

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);

      return {
        past: newPast,
        future: [state.annotations, ...state.future],
        annotations: previous,
        selectedIds: [],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [...state.past, state.annotations],
        future: newFuture,
        annotations: next,
        selectedIds: [],
      };
    }),
}));
