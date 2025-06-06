import {Map, Source} from '@vis.gl/react-mapbox';
import * as React from 'react';
import {createRoot} from 'react-dom/client';
import test from 'tape-promise/tape';
import {sleep, waitForMapLoad} from '../utils/test-utils';
import {MapboxAccessToken} from '../utils/token';

test('Source/Layer', async t => {
  const root = createRoot(document.createElement('div'));
  const mapRef = {current: null};

  const mapStyle = {version: 8, sources: {}, layers: []};
  const geoJSON = {
    type: 'Point',
    coordinates: [0, 0]
  };
  const geoJSON2 = {
    type: 'Point',
    coordinates: [1, 1]
  };

  root.render(
    <Map ref={mapRef} mapLib={import('mapbox-gl-v3')} mapboxAccessToken={MapboxAccessToken}>
      <Source id="my-data" type="geojson" data={geoJSON} />
    </Map>
  );
  await waitForMapLoad(mapRef);
  await sleep(1);
  t.ok(mapRef.current.getSource('my-data'), 'Source is added');

  root.render(
    <Map
      ref={mapRef}
      mapLib={import('mapbox-gl-v3')}
      mapStyle={mapStyle}
      mapboxAccessToken={MapboxAccessToken}
    >
      <Source id="my-data" type="geojson" data={geoJSON} />
    </Map>
  );
  await sleep(50);
  t.ok(mapRef.current.getSource('my-data'), 'Source is added after style change');

  root.render(
    <Map
      ref={mapRef}
      mapLib={import('mapbox-gl-v3')}
      mapStyle={mapStyle}
      mapboxAccessToken={MapboxAccessToken}
    >
      <Source id="my-data" type="geojson" data={geoJSON2} />
    </Map>
  );
  await sleep(1);
  const sourceData = await mapRef.current.getSource('my-data')?._data;
  t.deepEqual(sourceData, geoJSON2, 'Source is updated');

  root.render(
    <Map
      ref={mapRef}
      mapLib={import('mapbox-gl-v3')}
      mapStyle={mapStyle}
      mapboxAccessToken={MapboxAccessToken}
    />
  );
  await sleep(1);
  t.notOk(mapRef.current.getSource('my-data'), 'Source is removed');

  root.unmount();

  t.end();
});
