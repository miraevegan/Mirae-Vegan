"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AppLoader from "./AppLoader";

const SHOW_DELAY = 0;   // ms before loader appears
const MIN_DURATION = 1600; // ms loader stays visible

export default function RouteLoader() {
  const pathname = usePathname();
  const firstLoadRef = useRef(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    const showTimer = setTimeout(() => {
      setLoading(true);

      const hideTimer = setTimeout(() => {
        setLoading(false);
      }, MIN_DURATION);

      // cleanup inner timer
      return () => clearTimeout(hideTimer);
    }, SHOW_DELAY);

    return () => {
      clearTimeout(showTimer);
    };
  }, [pathname]);

  return <AppLoader loading={loading} />;
}
