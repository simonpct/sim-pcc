"use client";

import { useViewContext, ViewProvider } from "@/contexts/ViewContext";
import { RegulationProvider } from "@/contexts/RegulationProvider";
import ReactFlowView from "@/components/reactflow/ReactFlowView";
import MapBox from "@/components/map/MapBox";
import Navbar from "@/components/navbar/navbar";

export default function LineLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewProvider>
      <InnerLayout>{children}</InnerLayout>
    </ViewProvider>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { view } = useViewContext();
  return (
    <RegulationProvider>
      <div className="flex h-screen">
        <Navbar />
        <div className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            {view === "reactflow" ? <ReactFlowView /> : <MapBox />}
          </div>
          <div className="relative flex flex-col p-2 z-10 h-full gap-4 pointer-events-none">
            {children}
          </div>
        </div>
      </div>
    </RegulationProvider>
  );
}