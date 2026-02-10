import { useState, useMemo, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { formatNumber } from '../utils/formatNumber';
import { countryData } from '../data/fakeData';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const METRICS = [
  { key: 'users', label: 'Users' },
  { key: 'cats', label: 'Cats' },
  { key: 'shots', label: 'Shots' },
];

// world-atlas TopoJSON uses numeric IDs without leading zeros
const NUMERIC_TO_ALPHA3 = {
  '840': 'USA', '76': 'BRA', '826': 'GBR', '276': 'DEU', '250': 'FRA',
  '356': 'IND', '156': 'CHN', '392': 'JPN', '410': 'KOR', '36': 'AUS',
  '124': 'CAN', '484': 'MEX', '32': 'ARG', '152': 'CHL', '643': 'RUS',
  '792': 'TUR', '360': 'IDN', '764': 'THA', '724': 'ESP', '380': 'ITA',
  '566': 'NGA', '710': 'ZAF', '818': 'EGY', '170': 'COL', '608': 'PHL',
};

export default function WorldHeatmap() {
  const [metric, setMetric] = useState('users');
  const [tooltip, setTooltip] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const dataMap = useMemo(() => {
    const map = {};
    countryData.forEach((c) => { map[c.code] = c; });
    return map;
  }, []);

  const maxVal = useMemo(() => {
    return Math.max(...countryData.map((c) => c[metric]), 1);
  }, [metric]);

  const getColor = (value) => {
    if (!value) return '#f1f5f9';
    const intensity = Math.pow(value / maxVal, 0.5);
    const r = Math.round(241 - intensity * (241 - 30));
    const g = Math.round(245 - intensity * (245 - 64));
    const b = Math.round(249 - intensity * (249 - 175));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">World Heatmap</h3>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 border-none cursor-pointer"
        >
          {METRICS.map((m) => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="relative" onMouseMove={handleMouseMove}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [0, 30] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numericCode = String(geo.id);
                const alpha3 = NUMERIC_TO_ALPHA3[numericCode];
                const info = alpha3 ? dataMap[alpha3] : null;
                const value = info ? info[metric] : 0;

                return (
                  <Geography
                    key={`${geo.rsmKey}-${metric}`}
                    geography={geo}
                    fill={getColor(value)}
                    stroke="#cbd5e1"
                    strokeWidth={0.5}
                    onMouseEnter={() => {
                      if (alpha3 && info) {
                        setTooltip({
                          code: alpha3,
                          users: info.users,
                          cats: info.cats,
                          shots: info.shots,
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: value ? '#93c5fd' : '#e2e8f0' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltip && (
          <div
            className="absolute bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap"
            style={{ left: mousePos.x + 12, top: mousePos.y - 10 }}
          >
            <span className="font-semibold">{tooltip.code}</span>
            <span className="text-gray-400 mx-1">|</span>
            Users {formatNumber(tooltip.users)}
            <span className="text-gray-400 mx-1">&middot;</span>
            Cats {formatNumber(tooltip.cats)}
            <span className="text-gray-400 mx-1">&middot;</span>
            Shots {formatNumber(tooltip.shots)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span>Low</span>
        <div
          className="h-2 flex-1 rounded"
          style={{ background: 'linear-gradient(to right, #f1f5f9, #1e40af)' }}
        />
        <span>High</span>
      </div>
    </div>
  );
}
