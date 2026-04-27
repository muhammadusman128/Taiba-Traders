"use client";

import { useEffect, useRef } from "react";

export default function VisitorTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      fetch("/api/track", { method: "POST", cache: "no-store" }).catch(
        () => {},
      );
    }
  }, []);

  return null;
}
