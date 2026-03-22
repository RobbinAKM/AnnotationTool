import { create } from "zustand";

interface AppState {
  mediaUrl: string | null;
  mediaType: "image" | "video" | null;
  setMedia: (url: string, type: "image" | "video") => void;
}

export const useStore = create<AppState>((set) => ({
  mediaUrl: null,
  mediaType: null,

  setMedia: (url, type) => set({ mediaUrl: url, mediaType: type }),
}));
