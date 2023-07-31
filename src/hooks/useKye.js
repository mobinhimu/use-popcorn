import { useEffect } from "react";

export function useKye(onClose, key) {
  useEffect(() => {
    const keydownEvent = (eve) => {
      if (eve.code.toLowerCase() === key.toLowerCase()) {
        onClose(null);
      }
    };
    document.addEventListener("keydown", keydownEvent);

    return () => document.removeEventListener("keydown", keydownEvent);
  }, [onClose, key]);
}
