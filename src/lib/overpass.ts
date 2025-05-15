// Type definitions for the Overpass API response
export interface OverpassNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

export interface OverpassWay {
  type: 'way';
  id: number;
  nodes: number[];
  tags?: Record<string, string>;
}

export interface OverpassRelation {
  type: 'relation';
  id: number;
  members: Array<{
    type: 'node' | 'way' | 'relation';
    ref: number;
    role: string;
  }>;
  tags?: Record<string, string>;
}

export type OverpassElement = OverpassNode | OverpassWay | OverpassRelation;

export interface OverpassResponse {
  elements: OverpassElement[];
}

// GeoJSON types
export interface GeoJSONFeature {
  type: 'Feature';
  id?: string;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][] | number[][][][];
  };
  properties: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// Custom function to directly query the Overpass API without external packages
export async function queryOverpass(query: string): Promise<OverpassResponse | null> {
  try {
    const url = "https://overpass-api.de/api/interpreter";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
      cache: 'force-cache' // Cache results to improve performance
    });

    if (!response.ok) {
      throw new Error(`Overpass API responded with ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error querying Overpass API:', error);
    return null;
  }
}

// Helper to find a node by ID in the Overpass result
export function findNode(nodes: OverpassNode[], id: number): OverpassNode | undefined {
  return nodes.find(n => n.type === 'node' && n.id === id);
}

// Convert OSM data to GeoJSON format
export function osmToGeoJSON(osmData: OverpassResponse): GeoJSONFeatureCollection {
  const features: GeoJSONFeature[] = [];
  
  // Filter out nodes and ways from the elements array
  const nodes = osmData.elements.filter(
    (el): el is OverpassNode => el.type === 'node'
  );

  console.log(osmData);
  
  const ways = osmData.elements.filter(
    (el): el is OverpassWay => el.type === 'way'
  );

  for (const node of nodes) {
    features.push({
      type: 'Feature',
      id: `node/${node.id}`,
      geometry: {
        type: 'Point',
        coordinates: [[node.lon, node.lat]]
      },
      properties: node.tags || {}
    });
  }

  for (const way of ways) {
    const coordinates: number[][] = [];
    
    // Get coordinates for each node in the way
    for (const nodeId of way.nodes) {
      const node = findNode(nodes, nodeId);
      if (node) {
        coordinates.push([node.lon, node.lat]);
      }
    }

    if (coordinates.length > 1) {
      features.push({
        type: 'Feature',
        id: `way/${way.id}`,
        geometry: {
          type: 'LineString',
          coordinates
        },
        properties: way.tags || {}
      });
    }
  }
  
  return {
    type: 'FeatureCollection',
    features
  };
}
