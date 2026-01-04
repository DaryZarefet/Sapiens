import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type ScrollBehaviorOption = ScrollBehavior;

interface ScrollToTopProps {
  behavior?: ScrollBehaviorOption;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ behavior = "auto" }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    requestAnimationFrame(() => {
      const main = document.getElementById("main-content") as HTMLElement | null;

      const header = document.querySelector("header, .main-header, .site-header") as HTMLElement | null;

      const headerHeight = header ? header.getBoundingClientRect().height : 0;

      if (main) {
        const top = main.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: Math.max(0, top),
          left: 0,
          behavior,
        });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior,
        });
      }
    });
  }, [pathname, behavior]);

  return null;
};
