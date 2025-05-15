"use server";

import networks from "@/data/networks";
import { NextRequest } from "next/server";
import queries from "@/lib/overpass-queries";
import { queryOverpass, findNode } from "@/lib/overpass";
import { OverpassNode, OverpassRelation } from "overpass-ts";

export interface Stop {
  id: number;
  name: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ network: string, line: string }> }) {
  const { network, line } = await params;
  if (!networks.find(n => n.id === network)) {
    return new Response('Network not found', { status: 404 });
  }
  if (!networks.find(n => n.lines.find(l => l.id === line))) {
    return new Response('Line not found', { status: 404 });
  }
  const lineData = networks.find(n => n.lines.find(l => l.id === line))?.lines.find(l => l.id === line);

  const { features, error } = await getStops(lineData!.osmRelationId);
  if (error) return new Response(error, { status: 500 });
  
  return new Response(JSON.stringify({
    type: 'FeatureCollection',
    features
  }), { headers: { "Content-Type": "application/json" } });
}

const getStops = async (lineId: string) => {
  "use cache";
  const query = queries.getLineStops(lineId);
  const osmData = await queryOverpass(query);
  if (!osmData || !osmData.elements.length) return { error: 'Error fetching line stops' };

  const nodes = osmData.elements.filter(e => e.type === 'node') as OverpassNode[];
  const stops = osmData.elements.filter(e => e.type === 'relation' && e.tags?.['public_transport'] === 'stop_area') as OverpassRelation[];
  if (!stops.length) return { error: 'Error fetching line stops (no stops)' };
  
  return { features: stops.map(s => {
    const station = findNode(nodes, s.members.find(m => m.type === 'node' && findNode(nodes, m.ref)?.tags?.["public_transport"] == "station")?.ref ?? 0);
    console.log(station)
    if (!station) return { error: 'Error fetching line stops (no station)' };
    return ({
      type: 'Feature',
      properties: {
        id: s.id,
        name: s.tags?.['name'] || `Stop ${s.id}`,
      },
      geometry: {
        type: 'Point',
        coordinates: [station.lon, station.lat]
      }
    });
  }) };
};