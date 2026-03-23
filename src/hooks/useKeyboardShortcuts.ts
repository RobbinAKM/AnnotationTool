import { useEffect } from "react";
import { useStore } from "../store/useStore";

export const useKeyboardShortcuts = () => {
  const { deleteSelected, selectedIds, undo, redo } = useStore();

  useEffect(() => {
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, selectedIds, undo, redo]);
};
