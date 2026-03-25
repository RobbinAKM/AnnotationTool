import { useEffect } from "react";
import { useStore } from "../store/useStore";

export const useKeyboardShortcuts = () => {
  const { deleteSelected, selectedIds, undo, redo } = useStore();

  useEffect(() => {
    const state = useStore.getState();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Deletion
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) deleteSelected();
        return;
      }

      //Select All (Ctrl/Cmd + A)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();

        const allIds = state.annotations.map((ann) => ann.id);

        state.setSelectedIds(allIds);
        if (state.activeTool !== "CURSOR") {
          state.setActiveTool("CURSOR");
        }
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "z" &&
        !e.shiftKey
      ) {
        e.preventDefault(); // Prevent browser's native undo
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z OR Ctrl/Cmd + Y
      if (
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          e.key.toLowerCase() === "z") ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        redo();
        return;
      }

      if (e.key === " " || e.code === "Space") {
        e.preventDefault(); // Stop the browser from scrolling down

        // If a toolbar button or the video is currently focused,
        // pressing space will try to natively click it. We forcefully remove focus
        // so our global shortcut works flawlessly every time.
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        state.togglePlayback();
        return;
      }
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const key = e.key.toLowerCase();
        switch (key) {
          case "v":
            state.setActiveTool("CURSOR");
            break; // 'V' is the universal standard for the Selection/Move tool
          case "t":
            state.setActiveTool("TEXT");
            break;
          case "f":
            state.setActiveTool("FREEHAND");
            break;
          case "r":
            state.setActiveTool("RECTANGLE");
            break;
          case "e":
            state.setActiveTool("ELLIPSE");
            break;
          case "a":
            state.setActiveTool("LINE");
            break;
          case "m":
            state.setActiveTool("ICON", "\uf1b9");
            break;
          case "p":
            state.setActiveTool("ICON", "\uf007");
            break;
          case "l":
            state.setActiveTool("ICON", "\uf06c");
            break;
          case "c":
            state.setActiveTool("ICON", "\uf030");
            break;

          case "1":
            if (state.selectedIds.length > 0)
              state.updateSelectedStates("ACTIVE");
            break;
          case "2":
            if (state.selectedIds.length > 0)
              state.updateSelectedStates("WARNING");
            break;
          case "3":
            if (state.selectedIds.length > 0)
              state.updateSelectedStates("INACTIVE");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, selectedIds, undo, redo]);
};
