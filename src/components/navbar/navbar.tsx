"use client";

import { NavButton } from "@/components/ui/nav-button";
import { useViewContext } from "@/contexts/ViewContext";
import { Lightning, MapTrifold, Phone, Subway, GitBranch } from "@phosphor-icons/react";
import Image from "next/image";

export default function Navbar() {
  const { view, setView } = useViewContext();
  return (
    <div className="flex flex-col items-center bg-zinc-800 gap-4 h-full p-2.5 py-5">
      <Image src="/images/networks/ratp.svg" alt="RATP Logo" width={32} height={32} />
      <Image src="/images/lines/ratp/6.svg" alt="RATP Logo" width={32} height={32} />
        
      <div className="flex flex-col gap-3 mt-5">
        <NavButton icon={MapTrifold} active={view === 'mapbox'} onClick={() => setView('mapbox')} />
        <NavButton icon={GitBranch} active={view === 'reactflow'} onClick={() => setView('reactflow')} />
        <NavButton icon={MapTrifold} active={view === 'global'} onClick={() => setView('global')} />
        <NavButton icon={Subway} active={view === 'lines'} onClick={() => setView('lines')} />
        <NavButton icon={Lightning} active={view === 'stops'} onClick={() => setView('stops')} />
        <NavButton icon={Phone} active={view === 'phonie'} onClick={() => setView('phonie')} />
      </div>
    </div>
  );
}