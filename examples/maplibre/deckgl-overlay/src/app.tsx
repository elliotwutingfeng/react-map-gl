import * as React from 'react';
import {createRoot} from 'react-dom/client';
import {ArcLayer} from '@deck.gl/layers';
import {DeckProps, PickingInfo} from '@deck.gl/core';
import {MapboxOverlay} from '@deck.gl/mapbox';
import {Map, useControl, NavigationControl} from 'react-map-gl/maplibre';

const initialViewState = {
  latitude: 37.78,
  longitude: -122.45,
  zoom: 12,
  pitch: 45
};

function DeckGLOverlay(props: DeckProps) {
  const deck = useControl<MapboxOverlay>(() => new MapboxOverlay(props));

  deck.setProps(props);
  return null;
}

// Type of elements in https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json
type DataT = {
  inbound: number;
  outbound: number;
  from: {
    name: string;
    coordinates: [number, number];
  };
  to: {
    name: string;
    coordinates: [number, number];
  };
};

export default function App() {
  const arcLayer = new ArcLayer<DataT>({
    data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',
    getSourcePosition: d => d.from.coordinates,
    getTargetPosition: d => d.to.coordinates,
    getSourceColor: [255, 200, 0],
    getTargetColor: [0, 140, 255],
    getWidth: 12,
    pickable: true,
    autoHighlight: true
  });

  return (
    <Map
      initialViewState={initialViewState}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
      <DeckGLOverlay layers={[arcLayer]} getTooltip={getTooltip} />
      <NavigationControl />
    </Map>
  );
}

function getTooltip(info: PickingInfo) {
  const d = info.object as DataT;
  return d && `${d.from.name} -- ${d.to.name}`;
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
