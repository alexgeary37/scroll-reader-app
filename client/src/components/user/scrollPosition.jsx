// dev.to/n8tb1t/tracking-scroll-position-with-react-hooks-3bbj

import { useLayoutEffect } from "react";

const isBrowser = typeof window !== `undefined`;

const getScrollPosition = () => {
  return !isBrowser ? { x: 0, y: 0 } : { x: window.scrollX, y: window.scrollY };
};

const useScrollPosition = (effect, wait) => {
  let throttleTimeout = null;

  const callBack = () => {
    const currPos = getScrollPosition();
    effect(currPos);
    throttleTimeout = null;
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          setTimeout(callBack, wait);
        }
      } else {
        callBack();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });
};

export default useScrollPosition;
