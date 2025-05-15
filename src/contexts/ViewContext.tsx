"use client";

import { createContext, useContext, useState } from 'react';
import { useParams } from 'next/navigation';
import networks, { Line, Network } from '@/data/networks';

interface ViewContextType {
  view: string;
  setView: (viewType: string, paramId?: number) => void;
  network: Network | null;
  line: Line | null;
}

const defaultContext: ViewContextType = {
  view: 'global',
  setView: () => {},
  network: null,
  line: null,
};

const ViewContext = createContext<ViewContextType>(defaultContext);

export const useViewContext = () => useContext(ViewContext);

interface ViewProviderProps {
  children: React.ReactNode;
}

export function ViewProvider({ children }: ViewProviderProps) {
  const { network, line, view: defaultView } = useParams<{ network: string, line: string, view: string }>();

  if (!networks.some(n => n.id === network && n.lines.some(l => l.id === line))) {
    throw new Error(`Network ${network} and line ${line} not found in @/data/networks`);
  }

  const [viewState, setViewState] = useState<string>(defaultView as string);

  const setView = (newViewType: string, paramId?: number) => {
    setViewState(newViewType);

    const url = new URL(`/${network}/${line}/${newViewType}`, window.location.origin);
    if (['vehicle', 'stop'].includes(newViewType) && paramId) url.searchParams.set(newViewType + 'Id', paramId.toString());
    window.history.pushState(null, '', url.toString());
  };

  const contextValue: ViewContextType = {
    view: viewState,
    setView,
    network: networks.find(n => n.id === network) || null,
    line: networks.find(n => n.id === network)?.lines.find(l => l.id === line) || null,
  };

  return (
    <ViewContext.Provider value={contextValue}>
      {children}
    </ViewContext.Provider>
  );
}
