import { useState, useMemo, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { formatNumber } from '../utils/formatNumber';
import {
  COUNTRIES,
  ADMIN_REGIONS,
  CAT_CITIES,
  filterData,
  dailyData,
} from '../data/fakeData';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const ADMIN1_URL = '/admin1.json';

// Crimea overlay — ensures Crimea renders as part of Russia on the base map
const CRIMEA_GEO = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    id: '643',
    properties: { name: 'Crimea' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [32.49, 45.34], [33.38, 46.10], [34.07, 46.10], [35.18, 45.68],
        [35.82, 45.39], [36.52, 45.19], [36.64, 45.06], [36.42, 44.96],
        [35.37, 44.52], [34.22, 44.42], [33.74, 44.39], [33.37, 44.50],
        [32.49, 44.59], [32.49, 45.34],
      ]],
    },
  }],
};

const NUMERIC_TO_ALPHA3 = {
  '840': 'USA', '76': 'BRA', '826': 'GBR', '276': 'DEU', '250': 'FRA',
  '356': 'IND', '156': 'CHN', '392': 'JPN', '410': 'KOR', '36': 'AUS',
  '124': 'CAN', '484': 'MEX', '32': 'ARG', '152': 'CHL', '643': 'RUS',
  '792': 'TUR', '360': 'IDN', '764': 'THA', '724': 'ESP', '380': 'ITA',
  '566': 'NGA', '710': 'ZAF', '818': 'EGY', '170': 'COL', '608': 'PHL',
};

const COUNTRY_BY_CODE = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

const COUNTRY_SCALE = {
  USA: 600, CAN: 380, MEX: 900, BRA: 550, ARG: 700,
  CHL: 700, COL: 1200, GBR: 2200, DEU: 2200, FRA: 1600,
  ESP: 1700, ITA: 1700, RUS: 280, TUR: 1500, IND: 800,
  CHN: 500, JPN: 1300, KOR: 3500, IDN: 550, THA: 1500,
  PHL: 1300, NGA: 1500, ZAF: 1200, EGY: 1500, AUS: 550,
};

function sum(arr, key) {
  return arr.reduce((s, d) => s + (d[key] || 0), 0);
}

export default function WorldHeatmap({ filters, onChange }) {
  const {
    period = 'ALL',
    continent = 'ALL',
    country = 'ALL',
    platform = 'ALL',
    catType = 'ALL',
  } = filters || {};

  const [tooltip, setTooltip] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isCountryView = country !== 'ALL';
  const selectedCountry = isCountryView ? COUNTRY_BY_CODE[country] : null;

  const enabledCodes = useMemo(() => {
    if (continent !== 'ALL') {
      return new Set(COUNTRIES.filter((c) => c.continent === continent).map((c) => c.code));
    }
    return new Set(COUNTRIES.map((c) => c.code));
  }, [continent]);

  const countryAgg = useMemo(() => {
    const out = {};
    COUNTRIES.forEach((c) => {
      const series = filterData(dailyData, {
        period,
        continent: 'ALL',
        country: c.code,
        platform,
        catType,
      });
      out[c.code] = {
        code: c.code,
        name: c.name,
        users: sum(series, 'newUsers'),
        cats: sum(series, 'newCats'),
        shots: sum(series, 'shots'),
      };
    });
    return out;
  }, [period, platform, catType]);

  const maxVal = useMemo(() => {
    const codes = [...enabledCodes];
    const values = codes.map((code) => countryAgg[code]?.cats ?? 0);
    return Math.max(...values, 1);
  }, [countryAgg, enabledCodes]);

  const getColor = useCallback(
    (value) => {
      if (!value) return '#f1f5f9';
      const intensity = Math.pow(value / maxVal, 0.5);
      const r = Math.round(241 - intensity * (241 - 30));
      const g = Math.round(245 - intensity * (245 - 64));
      const b = Math.round(249 - intensity * (249 - 175));
      return `rgb(${r}, ${g}, ${b})`;
    },
    [maxVal],
  );

  // Projection config
  const projectionConfig = useMemo(() => {
    if (selectedCountry) {
      return {
        scale: COUNTRY_SCALE[selectedCountry.code] || 800,
        center: selectedCountry.center || [0, 30],
      };
    }
    return { scale: 135, center: [0, 25] };
  }, [selectedCountry]);

  // Region data for country drill-down — distribute country metrics across admin regions
  const regionData = useMemo(() => {
    if (!selectedCountry) return {};
    const code = selectedCountry.code;
    const agg = countryAgg[code] || { users: 0, cats: 0, shots: 0 };

    const regions = ADMIN_REGIONS.filter((r) => r.countryCode === code);
    const cities = CAT_CITIES.filter((c) => c.countryCode === code);

    // Compute weights from cities mapped to regions
    const regionWeights = {};
    regions.forEach((r) => { regionWeights[r.id] = r.weight || 0; });
    cities.forEach((c) => {
      if (regionWeights[c.regionId] !== undefined) {
        regionWeights[c.regionId] += c.weight;
      }
    });

    const totalWeight = Object.values(regionWeights).reduce((s, w) => s + w, 0);

    const out = {};
    regions.forEach((r) => {
      const share = totalWeight > 0 ? (regionWeights[r.id] || 0) / totalWeight : 0;
      out[r.isoCode] = {
        ...r,
        users: Math.round(agg.users * share),
        cats: Math.round(agg.cats * share),
        shots: Math.round(agg.shots * share),
      };
    });
    return out;
  }, [selectedCountry, countryAgg]);

  const maxRegionCats = useMemo(() => {
    const values = Object.values(regionData).map((r) => r.cats);
    return Math.max(...values, 1);
  }, [regionData]);

  const getRegionColor = useCallback(
    (value) => {
      if (!value) return '#f1f5f9';
      const intensity = Math.pow(value / maxRegionCats, 0.5);
      const r = Math.round(241 - intensity * (241 - 30));
      const g = Math.round(245 - intensity * (245 - 64));
      const b = Math.round(249 - intensity * (249 - 175));
      return `rgb(${r}, ${g}, ${b})`;
    },
    [maxRegionCats],
  );

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleCountryClick = (code) => {
    onChange?.({ ...filters, country: code });
    setTooltip(null);
  };

  const handleBackToWorld = () => {
    onChange?.({ ...filters, country: 'ALL' });
    setTooltip(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {isCountryView ? (
          <nav className="flex items-center gap-1 text-sm">
            <button
              onClick={handleBackToWorld}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              World
            </button>
            <span className="text-gray-400">&rsaquo;</span>
            <span className="text-gray-700 font-semibold">
              {selectedCountry?.name || country}
            </span>
          </nav>
        ) : (
          <h3 className="text-sm font-semibold text-gray-700">Cats Map</h3>
        )}
      </div>

      {/* Map */}
      <div className="relative" onMouseMove={handleMouseMove}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={projectionConfig}
          style={{ width: '100%', height: 'auto' }}
        >
          {/* Base country layer */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const alpha3 = NUMERIC_TO_ALPHA3[String(geo.id)];
                const info = alpha3 ? countryAgg[alpha3] : null;
                const isEnabled = alpha3 ? enabledCodes.has(alpha3) : false;
                const value = isEnabled && info ? info.cats : 0;
                const isSelected = isCountryView && alpha3 === country;
                const isClickable = !isCountryView && isEnabled && !!info;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      isCountryView
                        ? isSelected ? '#eef2ff' : '#f1f5f9'
                        : isEnabled ? getColor(value) : '#f1f5f9'
                    }
                    stroke={isSelected ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    onMouseEnter={() => {
                      if (isClickable) {
                        setTooltip({
                          type: 'country',
                          name: info.name,
                          users: info.users,
                          cats: info.cats,
                          shots: info.shots,
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      if (isClickable) handleCountryClick(alpha3);
                    }}
                    style={{
                      default: {
                        outline: 'none',
                        cursor: isClickable ? 'pointer' : 'default',
                      },
                      hover: {
                        outline: 'none',
                        fill: isClickable ? '#93c5fd' : undefined,
                      },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Crimea overlay — always render as Russia's color */}
          <Geographies geography={CRIMEA_GEO}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const rusInfo = countryAgg['RUS'];
                const isRusEnabled = enabledCodes.has('RUS');
                const value = isRusEnabled && rusInfo ? rusInfo.cats : 0;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      isCountryView
                        ? country === 'RUS' ? '#eef2ff' : '#f1f5f9'
                        : isRusEnabled ? getColor(value) : '#f1f5f9'
                    }
                    stroke={country === 'RUS' ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth={country === 'RUS' ? 1.5 : 0.5}
                    onMouseEnter={() => {
                      if (!isCountryView && isRusEnabled && rusInfo) {
                        setTooltip({
                          type: 'country',
                          name: 'Russia',
                          users: rusInfo.users,
                          cats: rusInfo.cats,
                          shots: rusInfo.shots,
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      if (!isCountryView && isRusEnabled && rusInfo) handleCountryClick('RUS');
                    }}
                    style={{
                      default: {
                        outline: 'none',
                        cursor: !isCountryView && isRusEnabled && rusInfo ? 'pointer' : 'default',
                      },
                      hover: {
                        outline: 'none',
                        fill: !isCountryView && isRusEnabled && rusInfo ? '#93c5fd' : undefined,
                      },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Admin-1 layer — only shown in country drill-down */}
          {isCountryView && (
            <Geographies geography={ADMIN1_URL}>
              {({ geographies }) => {
                // Filter to admin-1 features for the selected country
                const countryGeos = geographies.filter(
                  (geo) => geo.properties.adm0_a3 === country,
                );

                return countryGeos.map((geo) => {
                  const isoCode = geo.properties.iso_3166_2;
                  const regionInfo = regionData[isoCode];
                  const cats = regionInfo?.cats ?? 0;
                  const displayName = regionInfo?.name || geo.properties.name;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getRegionColor(cats)}
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth={0.5}
                      onMouseEnter={() =>
                        setTooltip({
                          type: 'region',
                          name: displayName,
                          users: regionInfo?.users ?? 0,
                          cats,
                          shots: regionInfo?.shots ?? 0,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      onClick={handleBackToWorld}
                      style={{
                        default: { outline: 'none', cursor: 'pointer' },
                        hover: {
                          outline: 'none',
                          fill: '#93c5fd',
                        },
                        pressed: { outline: 'none' },
                      }}
                    />
                  );
                });
              }}
            </Geographies>
          )}
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap"
            style={{ left: mousePos.x + 12, top: mousePos.y - 10 }}
          >
            <span className="font-semibold">{tooltip.name}</span>
            <span className="text-gray-400 mx-1">|</span>
            Users {formatNumber(tooltip.users)}
            <span className="text-gray-400 mx-1">&middot;</span>
            Cats {formatNumber(tooltip.cats)}
            <span className="text-gray-400 mx-1">&middot;</span>
            Shots {formatNumber(tooltip.shots)}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span>Low</span>
        <div
          className="h-2 flex-1 rounded"
          style={{ background: 'linear-gradient(to right, #f1f5f9, #1e40af)' }}
        />
        <span>High</span>
      </div>

      <div className="mt-1 text-[11px] text-gray-400">
        {!isCountryView
          ? 'Click a country to explore.'
          : 'Click a region to go back.'}
      </div>
    </div>
  );
}
