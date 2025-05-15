"use client";

import React, { useEffect, useState, useRef } from 'react';
import Map, { ViewState, MapRef, Source, Layer, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useViewContext } from '@/contexts/ViewContext';
import { useRegulation } from '@/contexts/RegulationProvider';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function MapBox() {
  const { view, network, line, setView } = useViewContext();
  const { traces, stops } = useRegulation();
  
  const [loaded, setLoaded] = useState(false);
  const mapRef = useRef<MapRef>(null);
  
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 11,
  });

  const [popupInfo, setPopupInfo] = useState<{ coordinates: number[], name: string } | null>(null);

  const onLoad = () => {
    if (!mapRef.current) return;

    mapRef.current.loadImage('/images/rail.png', (error, image) => {
      if (error) throw error;
      if (!image) throw new Error('Image not found');
      mapRef.current?.addImage('rail', image);

      console.log('loaded')
      setLoaded(true);
    });

    mapRef.current?.on('mouseenter', 'stops-layer', (e) => {
      mapRef.current!.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features?.[0]?.geometry?.bbox;
      const name = e.features?.[0]?.properties?.name;
      if (coordinates && name) {
        setPopupInfo({ coordinates, name });
      }
    });

    mapRef.current?.on('mouseleave', 'stops-layer', () => {
      mapRef.current!.getCanvas().style.cursor = 'grab';
      setPopupInfo(null);
    });

    mapRef.current?.on('click', 'stops-layer', (e) => {
      const stopId = e.features?.[0]?.properties?.id;
      if (stopId) {
        setView('stop', stopId);
        if (e.features?.[0]?.geometry?.bbox) {
          mapRef.current?.flyTo({
            center: [e.features[0].geometry.bbox[0], e.features[0].geometry.bbox[1]],
            zoom: 19,
          });
        }
      }
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (!network || !line || !stops) return;

    if (view === 'global') {
      mapRef.current?.flyTo({
        center: [2.3522, 48.8566],
        zoom: 9,
      });
    }
  }, [view, network, line, stops]);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt: { viewState: Partial<ViewState> }) => setViewState(evt.viewState)}
      dragRotate={false}
      onLoad={onLoad}
      style={{ position: 'absolute', width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/spct/cm8r63qeo00a601s70s8z2hur"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {loaded && traces && traces.type === 'FeatureCollection' && (
        <Source id="line-trace" type="geojson" data={traces}>
          <Layer
            id="line-trace-layer"
            type="line"
            filter={['>=', ['zoom'], 19]}
            paint={{
              'line-pattern': 'rail',
              'line-width': 20
            }}
          />
          <Layer
            id="line-trace-layer-zoomed"
            type="line"
            filter={['<', ['zoom'], 19]}
            paint={{
              'line-color': line?.color || '#ffbe02',
              'line-width': 4
            }}
          />
        </Source>
      )}

      {loaded && stops && stops.type === 'FeatureCollection' && (
        <Source id="stops" type="geojson" data={stops}>
          <Layer
            id="stops-layer"
            type="circle"
            paint={{
              'circle-radius': 3,
              'circle-color': 'white',
              'circle-stroke-width': 2,
              'circle-stroke-color': 'gray',
            }}
          />
        </Source>
      )}
      {popupInfo && (
        <Popup
          longitude={popupInfo.coordinates[0]}
          latitude={popupInfo.coordinates[1]}
          closeButton={false}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
        >
          <p className="font-bold">{popupInfo.name}</p>
        </Popup>
      )}
    </Map>
  );
}
