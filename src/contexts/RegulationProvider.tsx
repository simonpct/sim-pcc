import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useViewContext } from "./ViewContext";

export interface Vehicle {
  id: string;
  label?: string;
  position: {
    lat: number;
    lon: number;
    bearing?: number;
  };
  routeId?: string;
  tripId?: string;
  status?: string;
  [key: string]: unknown;
}

export type TraceGeoJSON = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.FeatureCollection<GeoJSON.LineString>;
export type StopGeoJSON = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.FeatureCollection<GeoJSON.Point>;

interface RegulationContextType {
  vehicles: Vehicle[];
  traces: TraceGeoJSON | null;
  stops: StopGeoJSON | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  moveVehicle: (vehicleId: string, newPosition: { lat: number; lon: number }) => Promise<void>;
  regulateVehicle: (vehicleId: string, action: string, payload?: unknown) => Promise<void>;
}

const RegulationContext = createContext<RegulationContextType | undefined>(undefined);

export const useRegulation = () => {
  const ctx = useContext(RegulationContext);
  if (!ctx) throw new Error("useRegulation must be used within a RegulationProvider");
  return ctx;
};

export const RegulationProvider = ({ children }: { children: ReactNode }) => {
  const { network, line } = useViewContext();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [traces, setTraces] = useState<TraceGeoJSON | null>(null);
  const [stops, setStops] = useState<StopGeoJSON | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère les traces et véhicules depuis l'API Next.js
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/${network?.id}/${line?.id}`);
      if (!res.ok) throw new Error("Erreur lors de la récupération des traces");
      const data = await res.json();
      // On suppose que l'API retourne { vehicles: Vehicle[], traces: GeoJSON }
      setVehicles(data.vehicles || []);
      setTraces(data.traces || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération des traces");
    } finally {
      setLoading(false);
    }

    try {
      const res = await fetch(`/api/${network?.id}/${line?.id}/stops`);
      if (!res.ok) throw new Error("Erreur lors de la récupération des arrêts");
      const data = await res.json() as StopGeoJSON;
      setStops(data || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération des arrêts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, line]);

  // Action de régulation générique (à adapter selon l'API backend)
  const regulateVehicle = async (vehicleId: string, action: string, payload?: unknown) => {
    try {
      await fetch(`/api/${network?.id}/${line?.id}/regulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, action, payload }),
      });
      // On peut rafraîchir les données après une action
      fetchData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la régulation");
    }
  };

  // Exemple d'action : déplacer un véhicule
  const moveVehicle = async (vehicleId: string, newPosition: { lat: number; lon: number }) => {
    await regulateVehicle(vehicleId, "move", { position: newPosition });
  };

  return (
    <RegulationContext.Provider
      value={{ vehicles, traces, stops, loading, error, refresh: fetchData, moveVehicle, regulateVehicle }}
    >
      {children}
    </RegulationContext.Provider>
  );
};
