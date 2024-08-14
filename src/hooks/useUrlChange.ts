import { useEffect, useState } from "react";

export default function useURLChange() {
  const [path, setPath] = useState(window.location.href);

  useEffect(() => {
    const onPopState = () => {
      console.log("testing");
      setPath(window.location.href);
    };

    window.addEventListener("popstate", onPopState);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return path;
}

export const shallowUpdateUrlAndNotify = (url: string) => {
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new PopStateEvent("popstate", { state: {} }));
};
