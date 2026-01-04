import { useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(ref: React.RefObject<T | null>, handler: (event: MouseEvent) => void, active: boolean) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    if (active) {
      document.addEventListener("mousedown", listener);
    }

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, active]);
}
