import { useEffect } from "react";
import { useStore } from "../store/useStore";

export const useKeyboardShortcuts = () => {
  const { deleteSelected, selectedIds } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) {
          deleteSelected();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, selectedIds]);
};
