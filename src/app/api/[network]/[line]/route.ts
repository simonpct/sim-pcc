"use server";

import networks from "@/data/networks";
import { NextRequest } from "next/server";
import queries from "@/lib/overpass-queries";
import { queryOverpass, osmToGeoJSON, OverpassResponse } from "@/lib/overpass";
import Terraformer from "terraformer";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ network: string, line: string }> }) {

  const { network, line } = await params;
  if (!networks.find(n => n.id === network)) {
    return new Response('Network not found', { status: 404 });
  }
  if (!networks.find(n => n.lines.find(l => l.id === line))) {
    return new Response('Line not found', { status: 404 });
  }
  const lineData = networks.find(n => n.lines.find(l => l.id === line))?.lines.find(l => l.id === line);

  const { traces, bounds, error } = await getLineData(lineData!.osmRelationId);
  if (error) return new Response(error, { status: 500 });
  
  return new Response(JSON.stringify({
    ...lineData,
    traces,
    bounds
  }), { headers: { "Content-Type": "application/json" } });
}

const getLineData = async (lineId: string) => {
  "use cache";
  const query = queries.getLineTracks(lineId);
  const osmData = await queryOverpass(query);
  if (!osmData) return { error: 'Error fetching line trace' };
  const traces = osmToGeoJSON(osmData as OverpassResponse);
  const bounds = Terraformer.Tools.calculateBounds(traces);
  return { traces, bounds };
};