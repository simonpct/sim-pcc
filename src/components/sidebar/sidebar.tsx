"use client";

import { useViewContext } from "@/contexts/ViewContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { view, network, line } = useViewContext();

  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (view === "global") setWidth(0);
    else if (view === "lines") setWidth(300);
    else setWidth(150);
  }, [view]);
  
  return (
    <div
      className={cn(
        "h-full flex flex-col p-4 bg-white rounded-md transition-all duration-300 pointer-events-auto",
        width === 0 ? "w-0 opacity-0" : "opacity-100",
        width === 300 ? "w-[300px]" : "w-[150px]"
      )}
    >
      <h2 className="animate-fadeIn">Vue {view === "global" ? "global" : view === "lines" ? "lines" : "stops"}</h2>
      <p className="animate-fadeIn">{line?.name}</p>
      <p className="animate-fadeIn">
        Réseau {network?.name}, Ligne {line?.name}
      </p>
    </div>
  );
}
      