/**
 * Build compact admin-1 TopoJSON from Natural Earth data.
 *
 * Fetches ne_10m_admin_1_states_provinces GeoJSON, filters to the 25
 * dashboard countries, simplifies boundaries, and writes public/admin1.json.
 *
 * Run once:  node scripts/build-admin1.mjs
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as topojsonServer from 'topojson-server';
import * as topojsonSimplify from 'topojson-simplify';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ISO A3 codes for the 25 dashboard countries
const TARGET_COUNTRIES = new Set([
  'USA', 'CAN', 'MEX',
  'BRA', 'ARG', 'CHL', 'COL',
  'GBR', 'DEU', 'FRA', 'ESP', 'ITA', 'RUS', 'TUR',
  'IND', 'CHN', 'JPN', 'KOR', 'IDN', 'THA', 'PHL',
  'NGA', 'ZAF', 'EGY',
  'AUS',
]);

// Natural Earth uses some non-standard codes; map them to our codes
const CODE_FIXES = {
  'US-': 'USA',
};

const GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson';

async function main() {
  console.log('Fetching Natural Earth admin-1 GeoJSON...');
  const res = await fetch(GEOJSON_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const geojson = await res.json();
  console.log(`Total features: ${geojson.features.length}`);

  // Filter to target countries
  const filtered = geojson.features.filter((f) => {
    const props = f.properties;
    const code = props.adm0_a3 || props.iso_a3 || props.gu_a3 || '';
    return TARGET_COUNTRIES.has(code);
  });

  console.log(`Filtered features (25 countries): ${filtered.length}`);

  // Trim properties to what we need
  const trimmed = filtered.map((f) => ({
    type: 'Feature',
    properties: {
      iso_3166_2: f.properties.iso_3166_2 || '',
      name: f.properties.name || '',
      admin: f.properties.admin || '',
      adm0_a3: f.properties.adm0_a3 || '',
    },
    geometry: f.geometry,
  }));

  const fc = { type: 'FeatureCollection', features: trimmed };

  // Convert to TopoJSON
  console.log('Converting to TopoJSON...');
  let topo = topojsonServer.topology({ admin1: fc });

  // Simplify — target ~1-3 MB output
  topo = topojsonSimplify.presimplify(topo);
  topo = topojsonSimplify.simplify(topo, topojsonSimplify.quantile(topo, 0.05));

  // Quantize to reduce coordinate precision
  topo = topojsonServer.topology(
    { admin1: { type: 'FeatureCollection', features: trimmed } },
  );
  topo = topojsonSimplify.presimplify(topo);
  topo = topojsonSimplify.simplify(topo, topojsonSimplify.quantile(topo, 0.05));

  const outPath = join(__dirname, '..', 'public', 'admin1.json');
  const json = JSON.stringify(topo);
  writeFileSync(outPath, json);

  const sizeMB = (Buffer.byteLength(json) / 1024 / 1024).toFixed(2);
  console.log(`Written ${outPath} (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
