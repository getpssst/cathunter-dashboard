import { COUNTRIES, CONTINENTS } from '../data/fakeData';

const PERIODS = ['D', 'W', 'M', 'Y', 'ALL'];

const CONTINENT_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'North America', label: 'N. America' },
  { value: 'South America', label: 'S. America' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Oceania', label: 'Oceania' },
];

const PLATFORMS = [
  { value: 'ALL', label: 'All' },
  { value: 'iOS', label: 'iOS' },
  { value: 'Android', label: 'Android' },
];

const CAT_TYPES = [
  { value: 'ALL', label: 'All' },
  { value: 'Stray', label: 'Stray' },
  { value: 'Home', label: 'Home' },
];

function Btn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

export default function Filters({ filters, onChange }) {
  const { period, continent, country, platform, catType } = filters;

  const visibleCountries = (continent === 'ALL'
    ? COUNTRIES
    : COUNTRIES.filter((c) => c.continent === continent)
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100 sticky top-0 z-30">
      {/* Period */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-1 font-medium">Period</span>
        {PERIODS.map((p) => (
          <Btn key={p} active={period === p} onClick={() => onChange({ ...filters, period: p })}>
            {p}
          </Btn>
        ))}
      </div>

      {/* Continent */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-1 font-medium">Continent</span>
        <select
          value={continent}
          onChange={(e) => onChange({ ...filters, continent: e.target.value, country: 'ALL' })}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 border-none cursor-pointer"
        >
          {CONTINENT_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Country */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-1 font-medium">Country</span>
        <select
          value={country}
          onChange={(e) => onChange({ ...filters, country: e.target.value })}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 border-none cursor-pointer"
        >
          <option value="ALL">All Countries</option>
          {visibleCountries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Platform */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-1 font-medium">Platform</span>
        {PLATFORMS.map((p) => (
          <Btn key={p.value} active={platform === p.value} onClick={() => onChange({ ...filters, platform: p.value })}>
            {p.label}
          </Btn>
        ))}
      </div>

      {/* Cat Type */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-1 font-medium">Cat Type</span>
        {CAT_TYPES.map((t) => (
          <Btn key={t.value} active={catType === t.value} onClick={() => onChange({ ...filters, catType: t.value })}>
            {t.label}
          </Btn>
        ))}
      </div>
    </div>
  );
}
