// Seeded pseudo-random for reproducible fake data
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

// Box-Muller transform for normal distribution
function randNormal(mean, stddev) {
  const u1 = rand();
  const u2 = rand();
  const safe = Math.min(Math.max(u1, 0.0001), 0.9999);
  const z = Math.sqrt(-2 * Math.log(safe)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stddev;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function sumBy(arr, fn) {
  return arr.reduce((s, x) => s + fn(x), 0);
}

function averageBy(arr, valueFn, weightFn) {
  if (arr.length === 0) return 0;
  if (!weightFn) return sumBy(arr, valueFn) / arr.length;
  const w = sumBy(arr, weightFn);
  if (w <= 0) return 0;
  return sumBy(arr, (x) => valueFn(x) * weightFn(x)) / w;
}

export function distributeInt(total, weights) {
  const n = weights.length;
  if (n === 0) return [];
  if (total <= 0) return Array.from({ length: n }, () => 0);

  const sumW = weights.reduce((s, w) => s + Math.max(0, w), 0);
  if (sumW <= 0) {
    const out = Array.from({ length: n }, () => 0);
    out[0] = total;
    return out;
  }

  const raw = weights.map((w) => (total * Math.max(0, w)) / sumW);
  const base = raw.map((x) => Math.floor(x));
  let remaining = total - base.reduce((s, x) => s + x, 0);

  // Largest remainder method, stable tie-breaker by index.
  const order = raw
    .map((x, idx) => ({ idx, frac: x - base[idx] }))
    .sort((a, b) => (b.frac - a.frac) || (a.idx - b.idx));

  for (let i = 0; i < remaining; i++) {
    base[order[i % order.length].idx] += 1;
  }

  return base;
}

// --- Continents ---
export const CONTINENTS = [
  'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania',
];

// --- Countries with unique behavioral profiles ---
export const COUNTRIES = [
  {
    code: 'USA', name: 'United States', continent: 'North America',
    userWeight: 100, catsPerUser: 1.4, shotsPerCat: 3.2, iosShare: 0.58, strayShare: 0.45,
    center: [-98, 39],
  },
  {
    code: 'CAN', name: 'Canada', continent: 'North America',
    userWeight: 15, catsPerUser: 1.0, shotsPerCat: 2.8, iosShare: 0.56, strayShare: 0.30,
    center: [-106, 56],
  },
  {
    code: 'MEX', name: 'Mexico', continent: 'North America',
    userWeight: 20, catsPerUser: 1.6, shotsPerCat: 3.0, iosShare: 0.18, strayShare: 0.70,
    center: [-102, 23],
  },
  {
    code: 'BRA', name: 'Brazil', continent: 'South America',
    userWeight: 45, catsPerUser: 1.5, shotsPerCat: 3.0, iosShare: 0.20, strayShare: 0.65,
    center: [-52, -10],
  },
  {
    code: 'ARG', name: 'Argentina', continent: 'South America',
    userWeight: 8, catsPerUser: 1.3, shotsPerCat: 2.8, iosShare: 0.15, strayShare: 0.58,
    center: [-64, -34],
  },
  {
    code: 'CHL', name: 'Chile', continent: 'South America',
    userWeight: 4, catsPerUser: 1.2, shotsPerCat: 2.6, iosShare: 0.22, strayShare: 0.52,
    center: [-71, -35],
  },
  {
    code: 'COL', name: 'Colombia', continent: 'South America',
    userWeight: 7, catsPerUser: 1.4, shotsPerCat: 2.8, iosShare: 0.16, strayShare: 0.65,
    center: [-74, 4.7],
  },
  {
    code: 'GBR', name: 'United Kingdom', continent: 'Europe',
    userWeight: 30, catsPerUser: 0.9, shotsPerCat: 3.0, iosShare: 0.52, strayShare: 0.15,
    center: [-2, 54],
  },
  {
    code: 'DEU', name: 'Germany', continent: 'Europe',
    userWeight: 25, catsPerUser: 0.8, shotsPerCat: 2.8, iosShare: 0.35, strayShare: 0.18,
    center: [10, 51],
  },
  {
    code: 'FRA', name: 'France', continent: 'Europe',
    userWeight: 22, catsPerUser: 1.0, shotsPerCat: 3.0, iosShare: 0.40, strayShare: 0.28,
    center: [2, 46],
  },
  {
    code: 'ESP', name: 'Spain', continent: 'Europe',
    userWeight: 15, catsPerUser: 1.1, shotsPerCat: 2.8, iosShare: 0.38, strayShare: 0.42,
    center: [-3, 40],
  },
  {
    code: 'ITA', name: 'Italy', continent: 'Europe',
    userWeight: 17, catsPerUser: 1.2, shotsPerCat: 3.0, iosShare: 0.32, strayShare: 0.45,
    center: [12.5, 42.5],
  },
  {
    code: 'RUS', name: 'Russia', continent: 'Europe',
    userWeight: 28, catsPerUser: 1.4, shotsPerCat: 3.2, iosShare: 0.30, strayShare: 0.58,
    center: [100, 60],
  },
  {
    code: 'TUR', name: 'Turkey', continent: 'Europe',
    userWeight: 16, catsPerUser: 2.0, shotsPerCat: 4.5, iosShare: 0.22, strayShare: 0.85,
    center: [35, 39],
  },
  {
    code: 'IND', name: 'India', continent: 'Asia',
    userWeight: 80, catsPerUser: 1.8, shotsPerCat: 3.0, iosShare: 0.08, strayShare: 0.80,
    center: [78, 22],
  },
  {
    code: 'CHN', name: 'China', continent: 'Asia',
    userWeight: 60, catsPerUser: 1.2, shotsPerCat: 2.8, iosShare: 0.25, strayShare: 0.50,
    center: [104, 35],
  },
  {
    code: 'JPN', name: 'Japan', continent: 'Asia',
    userWeight: 35, catsPerUser: 1.1, shotsPerCat: 5.0, iosShare: 0.70, strayShare: 0.35,
    center: [138, 37],
  },
  {
    code: 'KOR', name: 'South Korea', continent: 'Asia',
    userWeight: 18, catsPerUser: 1.1, shotsPerCat: 3.5, iosShare: 0.30, strayShare: 0.38,
    center: [127.5, 36.5],
  },
  {
    code: 'IDN', name: 'Indonesia', continent: 'Asia',
    userWeight: 40, catsPerUser: 1.7, shotsPerCat: 2.8, iosShare: 0.10, strayShare: 0.75,
    center: [117, -2],
  },
  {
    code: 'THA', name: 'Thailand', continent: 'Asia',
    userWeight: 14, catsPerUser: 1.6, shotsPerCat: 3.2, iosShare: 0.25, strayShare: 0.72,
    center: [101, 15],
  },
  {
    code: 'PHL', name: 'Philippines', continent: 'Asia',
    userWeight: 13, catsPerUser: 1.5, shotsPerCat: 2.8, iosShare: 0.12, strayShare: 0.68,
    center: [122, 12],
  },
  {
    code: 'NGA', name: 'Nigeria', continent: 'Africa',
    userWeight: 10, catsPerUser: 2.2, shotsPerCat: 2.2, iosShare: 0.06, strayShare: 0.78,
    center: [8, 9],
  },
  {
    code: 'ZAF', name: 'South Africa', continent: 'Africa',
    userWeight: 6, catsPerUser: 1.3, shotsPerCat: 2.8, iosShare: 0.20, strayShare: 0.48,
    center: [25, -29],
  },
  {
    code: 'EGY', name: 'Egypt', continent: 'Africa',
    userWeight: 9, catsPerUser: 2.0, shotsPerCat: 4.0, iosShare: 0.12, strayShare: 0.85,
    center: [30, 26],
  },
  {
    code: 'AUS', name: 'Australia', continent: 'Oceania',
    userWeight: 12, catsPerUser: 1.0, shotsPerCat: 2.8, iosShare: 0.55, strayShare: 0.25,
    center: [133, -25],
  },
];

// --- Real admin-1 regions (states, provinces, oblasts) ---
export const ADMIN_REGIONS = [
  // USA — major states
  { id: 'US-CA', countryCode: 'USA', name: 'California', isoCode: 'US-CA', center: [-119.4, 36.8], weight: 12 },
  { id: 'US-TX', countryCode: 'USA', name: 'Texas', isoCode: 'US-TX', center: [-99.9, 31.0], weight: 10 },
  { id: 'US-NY', countryCode: 'USA', name: 'New York', isoCode: 'US-NY', center: [-75.5, 43.0], weight: 10 },
  { id: 'US-FL', countryCode: 'USA', name: 'Florida', isoCode: 'US-FL', center: [-81.5, 27.8], weight: 8 },
  { id: 'US-IL', countryCode: 'USA', name: 'Illinois', isoCode: 'US-IL', center: [-89.4, 40.0], weight: 6 },
  { id: 'US-PA', countryCode: 'USA', name: 'Pennsylvania', isoCode: 'US-PA', center: [-77.2, 41.2], weight: 5 },
  { id: 'US-OH', countryCode: 'USA', name: 'Ohio', isoCode: 'US-OH', center: [-82.9, 40.4], weight: 4 },
  { id: 'US-WA', countryCode: 'USA', name: 'Washington', isoCode: 'US-WA', center: [-120.7, 47.8], weight: 4 },

  // CAN — provinces
  { id: 'CA-ON', countryCode: 'CAN', name: 'Ontario', isoCode: 'CA-ON', center: [-85.3, 51.3], weight: 8 },
  { id: 'CA-QC', countryCode: 'CAN', name: 'Quebec', isoCode: 'CA-QC', center: [-71.2, 46.8], weight: 6 },
  { id: 'CA-BC', countryCode: 'CAN', name: 'British Columbia', isoCode: 'CA-BC', center: [-124.7, 53.7], weight: 5 },
  { id: 'CA-AB', countryCode: 'CAN', name: 'Alberta', isoCode: 'CA-AB', center: [-114.4, 53.9], weight: 4 },

  // MEX — states
  { id: 'MX-DIF', countryCode: 'MEX', name: 'Ciudad de Mexico', isoCode: 'MX-DIF', center: [-99.1, 19.4], weight: 9 },
  { id: 'MX-JAL', countryCode: 'MEX', name: 'Jalisco', isoCode: 'MX-JAL', center: [-103.3, 20.7], weight: 5 },
  { id: 'MX-NLE', countryCode: 'MEX', name: 'Nuevo Leon', isoCode: 'MX-NLE', center: [-99.9, 25.6], weight: 5 },
  { id: 'MX-MEX', countryCode: 'MEX', name: 'Mexico State', isoCode: 'MX-MEX', center: [-99.6, 19.4], weight: 7 },

  // BRA — states
  { id: 'BR-SP', countryCode: 'BRA', name: 'Sao Paulo', isoCode: 'BR-SP', center: [-48.5, -22.3], weight: 10 },
  { id: 'BR-RJ', countryCode: 'BRA', name: 'Rio de Janeiro', isoCode: 'BR-RJ', center: [-43.2, -22.9], weight: 7 },
  { id: 'BR-MG', countryCode: 'BRA', name: 'Minas Gerais', isoCode: 'BR-MG', center: [-44.7, -18.5], weight: 5 },
  { id: 'BR-BA', countryCode: 'BRA', name: 'Bahia', isoCode: 'BR-BA', center: [-41.7, -12.6], weight: 4 },

  // ARG — provinces
  { id: 'AR-B', countryCode: 'ARG', name: 'Buenos Aires', isoCode: 'AR-B', center: [-59.5, -36.6], weight: 9 },
  { id: 'AR-C', countryCode: 'ARG', name: 'CABA', isoCode: 'AR-C', center: [-58.4, -34.6], weight: 6 },
  { id: 'AR-X', countryCode: 'ARG', name: 'Cordoba', isoCode: 'AR-X', center: [-64.2, -31.4], weight: 4 },

  // CHL — regions
  { id: 'CL-RM', countryCode: 'CHL', name: 'Santiago Metropolitan', isoCode: 'CL-RM', center: [-70.6, -33.4], weight: 8 },
  { id: 'CL-VS', countryCode: 'CHL', name: 'Valparaiso', isoCode: 'CL-VS', center: [-71.2, -33.0], weight: 4 },
  { id: 'CL-BI', countryCode: 'CHL', name: 'Biobio', isoCode: 'CL-BI', center: [-72.7, -37.0], weight: 3 },

  // COL — departments
  { id: 'CO-CUN', countryCode: 'COL', name: 'Bogota', isoCode: 'CO-CUN', center: [-74.1, 4.7], weight: 8 },
  { id: 'CO-ANT', countryCode: 'COL', name: 'Antioquia', isoCode: 'CO-ANT', center: [-75.6, 7.0], weight: 5 },
  { id: 'CO-VAC', countryCode: 'COL', name: 'Valle del Cauca', isoCode: 'CO-VAC', center: [-76.5, 3.4], weight: 4 },

  // GBR — major areas (Natural Earth uses local authorities; we pick representative ones)
  { id: 'GB-LND', countryCode: 'GBR', name: 'London', isoCode: 'GB-LND', center: [-0.1, 51.5], weight: 10 },
  { id: 'GB-MAN', countryCode: 'GBR', name: 'Manchester', isoCode: 'GB-MAN', center: [-2.2, 53.5], weight: 4 },
  { id: 'GB-EDH', countryCode: 'GBR', name: 'Edinburgh', isoCode: 'GB-EDH', center: [-3.2, 55.9], weight: 3 },

  // DEU — Bundeslander
  { id: 'DE-BY', countryCode: 'DEU', name: 'Bavaria', isoCode: 'DE-BY', center: [11.4, 48.8], weight: 7 },
  { id: 'DE-NW', countryCode: 'DEU', name: 'North Rhine-Westphalia', isoCode: 'DE-NW', center: [7.6, 51.4], weight: 8 },
  { id: 'DE-BE', countryCode: 'DEU', name: 'Berlin', isoCode: 'DE-BE', center: [13.4, 52.5], weight: 5 },
  { id: 'DE-HH', countryCode: 'DEU', name: 'Hamburg', isoCode: 'DE-HH', center: [10.0, 53.6], weight: 3 },

  // FRA — departments (Natural Earth uses departments, not regions)
  { id: 'FR-75', countryCode: 'FRA', name: 'Paris', isoCode: 'FR-75', center: [2.3, 48.9], weight: 9 },
  { id: 'FR-69', countryCode: 'FRA', name: 'Rhone', isoCode: 'FR-69', center: [4.8, 45.8], weight: 5 },
  { id: 'FR-13', countryCode: 'FRA', name: 'Bouches-du-Rhone', isoCode: 'FR-13', center: [5.1, 43.5], weight: 4 },
  { id: 'FR-31', countryCode: 'FRA', name: 'Haute-Garonne', isoCode: 'FR-31', center: [1.4, 43.6], weight: 3 },
  { id: 'FR-33', countryCode: 'FRA', name: 'Gironde', isoCode: 'FR-33', center: [-0.6, 44.8], weight: 3 },
  { id: 'FR-06', countryCode: 'FRA', name: 'Alpes-Maritimes', isoCode: 'FR-06', center: [7.0, 43.9], weight: 3 },
  { id: 'FR-59', countryCode: 'FRA', name: 'Nord', isoCode: 'FR-59', center: [3.1, 50.3], weight: 3 },
  { id: 'FR-44', countryCode: 'FRA', name: 'Loire-Atlantique', isoCode: 'FR-44', center: [-1.6, 47.2], weight: 2 },

  // ESP — provinces (Natural Earth uses provinces)
  { id: 'ES-M', countryCode: 'ESP', name: 'Madrid', isoCode: 'ES-M', center: [-3.7, 40.4], weight: 8 },
  { id: 'ES-B', countryCode: 'ESP', name: 'Barcelona', isoCode: 'ES-B', center: [2.2, 41.4], weight: 7 },
  { id: 'ES-V', countryCode: 'ESP', name: 'Valencia', isoCode: 'ES-V', center: [-0.4, 39.5], weight: 5 },
  { id: 'ES-SE', countryCode: 'ESP', name: 'Sevilla', isoCode: 'ES-SE', center: [-5.9, 37.4], weight: 5 },
  { id: 'ES-MA', countryCode: 'ESP', name: 'Malaga', isoCode: 'ES-MA', center: [-4.4, 36.7], weight: 4 },
  { id: 'ES-BI', countryCode: 'ESP', name: 'Bizkaia', isoCode: 'ES-BI', center: [-2.9, 43.2], weight: 3 },
  { id: 'ES-Z', countryCode: 'ESP', name: 'Zaragoza', isoCode: 'ES-Z', center: [-0.9, 41.7], weight: 3 },
  { id: 'ES-A', countryCode: 'ESP', name: 'Alicante', isoCode: 'ES-A', center: [-0.5, 38.3], weight: 3 },
  { id: 'ES-GI', countryCode: 'ESP', name: 'Gerona', isoCode: 'ES-GI', center: [2.8, 42.0], weight: 2 },
  { id: 'ES-T', countryCode: 'ESP', name: 'Tarragona', isoCode: 'ES-T', center: [1.2, 41.1], weight: 2 },
  { id: 'ES-MU', countryCode: 'ESP', name: 'Murcia', isoCode: 'ES-MU', center: [-1.1, 37.9], weight: 2 },

  // ITA — provinces (Natural Earth uses provinces)
  { id: 'IT-MI', countryCode: 'ITA', name: 'Milano', isoCode: 'IT-MI', center: [9.2, 45.5], weight: 8 },
  { id: 'IT-RM', countryCode: 'ITA', name: 'Roma', isoCode: 'IT-RM', center: [12.5, 41.9], weight: 6 },
  { id: 'IT-NA', countryCode: 'ITA', name: 'Napoli', isoCode: 'IT-NA', center: [14.3, 40.9], weight: 5 },
  { id: 'IT-TO', countryCode: 'ITA', name: 'Turin', isoCode: 'IT-TO', center: [7.7, 45.1], weight: 4 },
  { id: 'IT-FI', countryCode: 'ITA', name: 'Firenze', isoCode: 'IT-FI', center: [11.3, 43.8], weight: 4 },
  { id: 'IT-BO', countryCode: 'ITA', name: 'Bologna', isoCode: 'IT-BO', center: [11.3, 44.5], weight: 3 },
  { id: 'IT-VE', countryCode: 'ITA', name: 'Venezia', isoCode: 'IT-VE', center: [12.3, 45.4], weight: 3 },
  { id: 'IT-PA', countryCode: 'ITA', name: 'Palermo', isoCode: 'IT-PA', center: [13.4, 38.1], weight: 3 },

  // RUS — federal subjects
  { id: 'RU-MOW', countryCode: 'RUS', name: 'Moscow', isoCode: 'RU-MOW', center: [37.6, 55.8], weight: 10 },
  { id: 'RU-SPE', countryCode: 'RUS', name: 'Saint Petersburg', isoCode: 'RU-SPE', center: [30.3, 59.9], weight: 6 },
  { id: 'RU-KDA', countryCode: 'RUS', name: 'Krasnodar Krai', isoCode: 'RU-KDA', center: [39.7, 45.3], weight: 4 },
  { id: 'RU-NVS', countryCode: 'RUS', name: 'Novosibirsk Oblast', isoCode: 'RU-NVS', center: [78.0, 55.0], weight: 3 },

  { id: 'RU-SVE', countryCode: 'RUS', name: 'Sverdlovsk Oblast', isoCode: 'RU-SVE', center: [60.6, 56.8], weight: 3 },
  { id: 'RU-TA', countryCode: 'RUS', name: 'Tatarstan', isoCode: 'RU-TA', center: [49.1, 55.8], weight: 3 },
  { id: 'RU-OMS', countryCode: 'RUS', name: 'Omsk Oblast', isoCode: 'RU-OMS', center: [73.4, 56.0], weight: 2 },
  { id: 'RU-KYA', countryCode: 'RUS', name: 'Krasnoyarsk Krai', isoCode: 'RU-KYA', center: [93.0, 56.0], weight: 2 },
  { id: 'RU-SAM', countryCode: 'RUS', name: 'Samara Oblast', isoCode: 'RU-SAM', center: [50.2, 53.2], weight: 2 },
  { id: 'RU-CHE', countryCode: 'RUS', name: 'Chelyabinsk Oblast', isoCode: 'RU-CHE', center: [59.9, 54.7], weight: 2 },

  // RUS — Crimea & Sevastopol
  { id: 'RU-CR', countryCode: 'RUS', name: 'Crimea', isoCode: 'UA-43', center: [34.1, 44.9], weight: 3 },
  { id: 'RU-SEV', countryCode: 'RUS', name: 'Sevastopol', isoCode: 'UA-40', center: [33.5, 44.6], weight: 2 },

  // TUR — provinces (iller)
  { id: 'TR-34', countryCode: 'TUR', name: 'Istanbul', isoCode: 'TR-34', center: [29.0, 41.0], weight: 10 },
  { id: 'TR-06', countryCode: 'TUR', name: 'Ankara', isoCode: 'TR-06', center: [32.9, 39.9], weight: 6 },
  { id: 'TR-35', countryCode: 'TUR', name: 'Izmir', isoCode: 'TR-35', center: [27.1, 38.4], weight: 5 },
  { id: 'TR-07', countryCode: 'TUR', name: 'Antalya', isoCode: 'TR-07', center: [30.7, 36.9], weight: 4 },
  { id: 'TR-16', countryCode: 'TUR', name: 'Bursa', isoCode: 'TR-16', center: [29.1, 40.2], weight: 3 },
  { id: 'TR-01', countryCode: 'TUR', name: 'Adana', isoCode: 'TR-01', center: [35.3, 37.0], weight: 3 },
  { id: 'TR-42', countryCode: 'TUR', name: 'Konya', isoCode: 'TR-42', center: [32.5, 37.9], weight: 2 },
  { id: 'TR-21', countryCode: 'TUR', name: 'Diyarbakir', isoCode: 'TR-21', center: [40.2, 37.9], weight: 2 },

  // IND — states
  { id: 'IN-MH', countryCode: 'IND', name: 'Maharashtra', isoCode: 'IN-MH', center: [75.7, 19.7], weight: 9 },
  { id: 'IN-DL', countryCode: 'IND', name: 'Delhi', isoCode: 'IN-DL', center: [77.2, 28.6], weight: 7 },
  { id: 'IN-KA', countryCode: 'IND', name: 'Karnataka', isoCode: 'IN-KA', center: [75.7, 15.3], weight: 6 },
  { id: 'IN-TN', countryCode: 'IND', name: 'Tamil Nadu', isoCode: 'IN-TN', center: [78.7, 11.1], weight: 5 },

  // CHN — provinces
  { id: 'CN-BJ', countryCode: 'CHN', name: 'Beijing', isoCode: 'CN-BJ', center: [116.4, 39.9], weight: 8 },
  { id: 'CN-SH', countryCode: 'CHN', name: 'Shanghai', isoCode: 'CN-SH', center: [121.5, 31.2], weight: 8 },
  { id: 'CN-GD', countryCode: 'CHN', name: 'Guangdong', isoCode: 'CN-GD', center: [113.3, 23.1], weight: 7 },
  { id: 'CN-ZJ', countryCode: 'CHN', name: 'Zhejiang', isoCode: 'CN-ZJ', center: [120.2, 29.2], weight: 5 },

  // JPN — regions/prefectures
  { id: 'JP-13', countryCode: 'JPN', name: 'Tokyo', isoCode: 'JP-13', center: [139.7, 35.7], weight: 10 },
  { id: 'JP-27', countryCode: 'JPN', name: 'Osaka', isoCode: 'JP-27', center: [135.5, 34.7], weight: 6 },
  { id: 'JP-01', countryCode: 'JPN', name: 'Hokkaido', isoCode: 'JP-01', center: [143.2, 43.1], weight: 4 },

  // KOR — provinces/cities
  { id: 'KR-11', countryCode: 'KOR', name: 'Seoul', isoCode: 'KR-11', center: [127.0, 37.6], weight: 10 },
  { id: 'KR-26', countryCode: 'KOR', name: 'Busan', isoCode: 'KR-26', center: [129.1, 35.2], weight: 5 },
  { id: 'KR-41', countryCode: 'KOR', name: 'Gyeonggi', isoCode: 'KR-41', center: [127.0, 37.3], weight: 7 },

  // IDN — provinces
  { id: 'ID-JK', countryCode: 'IDN', name: 'Jakarta', isoCode: 'ID-JK', center: [106.8, -6.2], weight: 9 },
  { id: 'ID-JB', countryCode: 'IDN', name: 'West Java', isoCode: 'ID-JB', center: [107.6, -6.9], weight: 6 },
  { id: 'ID-JT', countryCode: 'IDN', name: 'Central Java', isoCode: 'ID-JT', center: [110.4, -7.2], weight: 5 },
  { id: 'ID-JI', countryCode: 'IDN', name: 'East Java', isoCode: 'ID-JI', center: [112.8, -7.5], weight: 5 },

  // THA — provinces/regions
  { id: 'TH-10', countryCode: 'THA', name: 'Bangkok', isoCode: 'TH-10', center: [100.5, 13.8], weight: 10 },
  { id: 'TH-50', countryCode: 'THA', name: 'Chiang Mai', isoCode: 'TH-50', center: [98.9, 18.8], weight: 4 },
  { id: 'TH-83', countryCode: 'THA', name: 'Phuket', isoCode: 'TH-83', center: [98.3, 7.9], weight: 3 },

  // PHL — provinces (Natural Earth uses provinces)
  { id: 'PH-MNL', countryCode: 'PHL', name: 'Manila', isoCode: 'PH-MNL', center: [121.0, 14.6], weight: 9 },
  { id: 'PH-CEB', countryCode: 'PHL', name: 'Cebu', isoCode: 'PH-CEB', center: [123.8, 10.3], weight: 4 },
  { id: 'PH-DAV', countryCode: 'PHL', name: 'Davao', isoCode: 'PH-DAV', center: [125.6, 7.2], weight: 3 },

  // NGA — states
  { id: 'NG-LA', countryCode: 'NGA', name: 'Lagos', isoCode: 'NG-LA', center: [3.4, 6.5], weight: 9 },
  { id: 'NG-FC', countryCode: 'NGA', name: 'Abuja FCT', isoCode: 'NG-FC', center: [7.4, 9.1], weight: 4 },
  { id: 'NG-KN', countryCode: 'NGA', name: 'Kano', isoCode: 'NG-KN', center: [8.5, 12.0], weight: 4 },

  // ZAF — provinces
  { id: 'ZA-GT', countryCode: 'ZAF', name: 'Gauteng', isoCode: 'ZA-GT', center: [28.0, -26.2], weight: 8 },
  { id: 'ZA-WC', countryCode: 'ZAF', name: 'Western Cape', isoCode: 'ZA-WC', center: [19.1, -33.2], weight: 5 },
  { id: 'ZA-NL', countryCode: 'ZAF', name: 'KwaZulu-Natal', isoCode: 'ZA-NL', center: [30.3, -29.0], weight: 4 },

  // EGY — governorates
  { id: 'EG-C', countryCode: 'EGY', name: 'Cairo', isoCode: 'EG-C', center: [31.2, 30.0], weight: 9 },
  { id: 'EG-ALX', countryCode: 'EGY', name: 'Alexandria', isoCode: 'EG-ALX', center: [29.9, 31.2], weight: 5 },
  { id: 'EG-GZ', countryCode: 'EGY', name: 'Giza', isoCode: 'EG-GZ', center: [31.0, 30.0], weight: 4 },

  // AUS — states/territories
  { id: 'AU-NSW', countryCode: 'AUS', name: 'New South Wales', isoCode: 'AU-NSW', center: [146.9, -32.2], weight: 7 },
  { id: 'AU-VIC', countryCode: 'AUS', name: 'Victoria', isoCode: 'AU-VIC', center: [145.0, -37.4], weight: 6 },
  { id: 'AU-QLD', countryCode: 'AUS', name: 'Queensland', isoCode: 'AU-QLD', center: [144.7, -22.6], weight: 4 },

  // --- Auto-generated from TopoJSON admin-1 ---
  // USA
  { id: 'US-ID', countryCode: 'USA', name: 'Idaho', isoCode: 'US-ID', center: [-114.7, 45.5], weight: 1 },
  { id: 'US-MT', countryCode: 'USA', name: 'Montana', isoCode: 'US-MT', center: [-112.9, 46.1], weight: 1 },
  { id: 'US-ND', countryCode: 'USA', name: 'North Dakota', isoCode: 'US-ND', center: [-99.1, 47.8], weight: 1 },
  { id: 'US-MN', countryCode: 'USA', name: 'Minnesota', isoCode: 'US-MN', center: [-93.6, 47], weight: 1 },
  { id: 'US-MI', countryCode: 'USA', name: 'Michigan', isoCode: 'US-MI', center: [-86.1, 45.2], weight: 1 },
  { id: 'US-VT', countryCode: 'USA', name: 'Vermont', isoCode: 'US-VT', center: [-72.7, 44], weight: 1 },
  { id: 'US-NH', countryCode: 'USA', name: 'New Hampshire', isoCode: 'US-NH', center: [-71.6, 43.9], weight: 1 },
  { id: 'US-ME', countryCode: 'USA', name: 'Maine', isoCode: 'US-ME', center: [-68.8, 44.6], weight: 1 },
  { id: 'US-AZ', countryCode: 'USA', name: 'Arizona', isoCode: 'US-AZ', center: [-113.9, 34.2], weight: 1 },
  { id: 'US-NM', countryCode: 'USA', name: 'New Mexico', isoCode: 'US-NM', center: [-106.5, 33.3], weight: 1 },
  { id: 'US-AK', countryCode: 'USA', name: 'Alaska', isoCode: 'US-AK', center: [-144.2, 59], weight: 1 },
  { id: 'US-LA', countryCode: 'USA', name: 'Louisiana', isoCode: 'US-LA', center: [-90.3, 29.8], weight: 1 },
  { id: 'US-MS', countryCode: 'USA', name: 'Mississippi', isoCode: 'US-MS', center: [-89.8, 31.7], weight: 1 },
  { id: 'US-AL', countryCode: 'USA', name: 'Alabama', isoCode: 'US-AL', center: [-87.1, 31.4], weight: 1 },
  { id: 'US-GA', countryCode: 'USA', name: 'Georgia', isoCode: 'US-GA', center: [-82.4, 32], weight: 1 },
  { id: 'US-SC', countryCode: 'USA', name: 'South Carolina', isoCode: 'US-SC', center: [-80.7, 33.5], weight: 1 },
  { id: 'US-NC', countryCode: 'USA', name: 'North Carolina', isoCode: 'US-NC', center: [-77.8, 35.3], weight: 1 },
  { id: 'US-VA', countryCode: 'USA', name: 'Virginia', isoCode: 'US-VA', center: [-77.4, 37.6], weight: 1 },
  { id: 'US-DC', countryCode: 'USA', name: 'District of Columbia', isoCode: 'US-DC', center: [-77, 38.9], weight: 1 },
  { id: 'US-MD', countryCode: 'USA', name: 'Maryland', isoCode: 'US-MD', center: [-76.5, 38.6], weight: 1 },
  { id: 'US-DE', countryCode: 'USA', name: 'Delaware', isoCode: 'US-DE', center: [-75.4, 39], weight: 1 },
  { id: 'US-NJ', countryCode: 'USA', name: 'New Jersey', isoCode: 'US-NJ', center: [-74.6, 40], weight: 1 },
  { id: 'US-CT', countryCode: 'USA', name: 'Connecticut', isoCode: 'US-CT', center: [-73, 41.4], weight: 1 },
  { id: 'US-RI', countryCode: 'USA', name: 'Rhode Island', isoCode: 'US-RI', center: [-71.4, 41.5], weight: 1 },
  { id: 'US-MA', countryCode: 'USA', name: 'Massachusetts', isoCode: 'US-MA', center: [-70.8, 41.8], weight: 1 },
  { id: 'US-OR', countryCode: 'USA', name: 'Oregon', isoCode: 'US-OR', center: [-121.4, 44.9], weight: 1 },
  { id: 'US-HI', countryCode: 'USA', name: 'Hawaii', isoCode: 'US-HI', center: [-161.1, 22.3], weight: 1 },
  { id: 'US-UT', countryCode: 'USA', name: 'Utah', isoCode: 'US-UT', center: [-111.3, 40.3], weight: 1 },
  { id: 'US-WY', countryCode: 'USA', name: 'Wyoming', isoCode: 'US-WY', center: [-108.5, 42.7], weight: 1 },
  { id: 'US-NV', countryCode: 'USA', name: 'Nevada', isoCode: 'US-NV', center: [-115.7, 37.9], weight: 1 },
  { id: 'US-CO', countryCode: 'USA', name: 'Colorado', isoCode: 'US-CO', center: [-105, 39.4], weight: 1 },
  { id: 'US-SD', countryCode: 'USA', name: 'South Dakota', isoCode: 'US-SD', center: [-98.4, 44], weight: 1 },
  { id: 'US-NE', countryCode: 'USA', name: 'Nebraska', isoCode: 'US-NE', center: [-98.3, 41.7], weight: 1 },
  { id: 'US-KS', countryCode: 'USA', name: 'Kansas', isoCode: 'US-KS', center: [-97, 38.8], weight: 1 },
  { id: 'US-OK', countryCode: 'USA', name: 'Oklahoma', isoCode: 'US-OK', center: [-97.8, 34.7], weight: 1 },
  { id: 'US-IA', countryCode: 'USA', name: 'Iowa', isoCode: 'US-IA', center: [-93.2, 42], weight: 1 },
  { id: 'US-MO', countryCode: 'USA', name: 'Missouri', isoCode: 'US-MO', center: [-91.7, 38.4], weight: 1 },
  { id: 'US-WI', countryCode: 'USA', name: 'Wisconsin', isoCode: 'US-WI', center: [-89.8, 44.9], weight: 1 },
  { id: 'US-KY', countryCode: 'USA', name: 'Kentucky', isoCode: 'US-KY', center: [-86.1, 37.6], weight: 1 },
  { id: 'US-AR', countryCode: 'USA', name: 'Arkansas', isoCode: 'US-AR', center: [-91.4, 34.7], weight: 1 },
  { id: 'US-TN', countryCode: 'USA', name: 'Tennessee', isoCode: 'US-TN', center: [-86.2, 35.9], weight: 1 },
  { id: 'US-WV', countryCode: 'USA', name: 'West Virginia', isoCode: 'US-WV', center: [-80.4, 38.9], weight: 1 },
  { id: 'US-IN', countryCode: 'USA', name: 'Indiana', isoCode: 'US-IN', center: [-86.5, 39.1], weight: 1 },
  // CAN
  { id: 'CA-SK', countryCode: 'CAN', name: 'Saskatchewan', isoCode: 'CA-SK', center: [-104.8, 53.1], weight: 1 },
  { id: 'CA-MB', countryCode: 'CAN', name: 'Manitoba', isoCode: 'CA-MB', center: [-94, 56], weight: 1 },
  { id: 'CA-NB', countryCode: 'CAN', name: 'New Brunswick', isoCode: 'CA-NB', center: [-66.2, 46.5], weight: 1 },
  { id: 'CA-YT', countryCode: 'CAN', name: 'Yukon', isoCode: 'CA-YT', center: [-132.8, 64.5], weight: 1 },
  { id: 'CA-NU', countryCode: 'CAN', name: 'Nunavut', isoCode: 'CA-NU', center: [-86.8, 71], weight: 1 },
  { id: 'CA-NL', countryCode: 'CAN', name: 'Newfoundland and Labrador', isoCode: 'CA-NL', center: [-59.2, 53], weight: 1 },
  { id: 'CA-NS', countryCode: 'CAN', name: 'Nova Scotia', isoCode: 'CA-NS', center: [-62.6, 45.3], weight: 1 },
  { id: 'CA-NT', countryCode: 'CAN', name: 'Northwest Territories', isoCode: 'CA-NT', center: [-120.4, 71.9], weight: 1 },
  { id: 'CA-PE', countryCode: 'CAN', name: 'Prince Edward Island', isoCode: 'CA-PE', center: [-63.3, 46.4], weight: 1 },
  // MEX
  { id: 'MX-SON', countryCode: 'MEX', name: 'Sonora', isoCode: 'MX-SON', center: [-111, 28.8], weight: 1 },
  { id: 'MX-BCN', countryCode: 'MEX', name: 'Baja California', isoCode: 'MX-BCN', center: [-114.8, 29.6], weight: 1 },
  { id: 'MX-CHH', countryCode: 'MEX', name: 'Chihuahua', isoCode: 'MX-CHH', center: [-106.7, 28.3], weight: 1 },
  { id: 'MX-COA', countryCode: 'MEX', name: 'Coahuila', isoCode: 'MX-COA', center: [-101.6, 27], weight: 1 },
  { id: 'MX-TAM', countryCode: 'MEX', name: 'Tamaulipas', isoCode: 'MX-TAM', center: [-98.9, 24.9], weight: 1 },
  { id: 'MX-ROO', countryCode: 'MEX', name: 'Quintana Roo', isoCode: 'MX-ROO', center: [-87.7, 19.7], weight: 1 },
  { id: 'MX-CAM', countryCode: 'MEX', name: 'Campeche', isoCode: 'MX-CAM', center: [-90.8, 18.9], weight: 1 },
  { id: 'MX-TAB', countryCode: 'MEX', name: 'Tabasco', isoCode: 'MX-TAB', center: [-92.4, 17.9], weight: 1 },
  { id: 'MX-CHP', countryCode: 'MEX', name: 'Chiapas', isoCode: 'MX-CHP', center: [-92.6, 16.7], weight: 1 },
  { id: 'MX-COL', countryCode: 'MEX', name: 'Colima', isoCode: 'MX-COL', center: [-103.7, 19.2], weight: 1 },
  { id: 'MX-NAY', countryCode: 'MEX', name: 'Nayarit', isoCode: 'MX-NAY', center: [-105.5, 21.7], weight: 1 },
  { id: 'MX-BCS', countryCode: 'MEX', name: 'Baja California Sur', isoCode: 'MX-BCS', center: [-111.9, 25.7], weight: 1 },
  { id: 'MX-SIN', countryCode: 'MEX', name: 'Sinaloa', isoCode: 'MX-SIN', center: [-107.7, 25.1], weight: 1 },
  { id: 'MX-YUC', countryCode: 'MEX', name: 'Yucatán', isoCode: 'MX-YUC', center: [-89, 20.7], weight: 1 },
  { id: 'MX-VER', countryCode: 'MEX', name: 'Veracruz', isoCode: 'MX-VER', center: [-96.8, 19.8], weight: 1 },
  { id: 'MX-MIC', countryCode: 'MEX', name: 'Michoacán', isoCode: 'MX-MIC', center: [-101.9, 19.3], weight: 1 },
  { id: 'MX-GRO', countryCode: 'MEX', name: 'Guerrero', isoCode: 'MX-GRO', center: [-100, 17.9], weight: 1 },
  { id: 'MX-OAX', countryCode: 'MEX', name: 'Oaxaca', isoCode: 'MX-OAX', center: [-96.2, 17], weight: 1 },
  { id: 'MX-X01~', countryCode: 'MEX', name: '', isoCode: 'MX-X01~', center: [-89.7, 22.4], weight: 1 },
  { id: 'MX-PUE', countryCode: 'MEX', name: 'Puebla', isoCode: 'MX-PUE', center: [-97.9, 19.1], weight: 1 },
  { id: 'MX-MOR', countryCode: 'MEX', name: 'Morelos', isoCode: 'MX-MOR', center: [-99, 18.8], weight: 1 },
  { id: 'MX-QUE', countryCode: 'MEX', name: 'Querétaro', isoCode: 'MX-QUE', center: [-99.8, 20.9], weight: 1 },
  { id: 'MX-HID', countryCode: 'MEX', name: 'Hidalgo', isoCode: 'MX-HID', center: [-98.8, 20.5], weight: 1 },
  { id: 'MX-GUA', countryCode: 'MEX', name: 'Guanajuato', isoCode: 'MX-GUA', center: [-101, 20.8], weight: 1 },
  { id: 'MX-SLP', countryCode: 'MEX', name: 'San Luis Potosí', isoCode: 'MX-SLP', center: [-100.2, 22.6], weight: 1 },
  { id: 'MX-ZAC', countryCode: 'MEX', name: 'Zacatecas', isoCode: 'MX-ZAC', center: [-102.8, 22.9], weight: 1 },
  { id: 'MX-AGU', countryCode: 'MEX', name: 'Aguascalientes', isoCode: 'MX-AGU', center: [-102.3, 22], weight: 1 },
  { id: 'MX-DUR', countryCode: 'MEX', name: 'Durango', isoCode: 'MX-DUR', center: [-104.9, 24.8], weight: 1 },
  { id: 'MX-TLA', countryCode: 'MEX', name: 'Tlaxcala', isoCode: 'MX-TLA', center: [-98.1, 19.4], weight: 1 },
  // BRA
  { id: 'BR-RS', countryCode: 'BRA', name: 'Rio Grande do Sul', isoCode: 'BR-RS', center: [-53.3, -30.3], weight: 1 },
  { id: 'BR-RR', countryCode: 'BRA', name: 'Roraima', isoCode: 'BR-RR', center: [-61.6, 2.4], weight: 1 },
  { id: 'BR-PA', countryCode: 'BRA', name: 'Pará', isoCode: 'BR-PA', center: [-51.3, -1.6], weight: 1 },
  { id: 'BR-AC', countryCode: 'BRA', name: 'Acre', isoCode: 'BR-AC', center: [-70.8, -9.5], weight: 1 },
  { id: 'BR-AP', countryCode: 'BRA', name: 'Amapá', isoCode: 'BR-AP', center: [-51.9, 1.5], weight: 1 },
  { id: 'BR-MS', countryCode: 'BRA', name: 'Mato Grosso do Sul', isoCode: 'BR-MS', center: [-54.8, -20.3], weight: 1 },
  { id: 'BR-PR', countryCode: 'BRA', name: 'Paraná', isoCode: 'BR-PR', center: [-51.2, -24.9], weight: 1 },
  { id: 'BR-SC', countryCode: 'BRA', name: 'Santa Catarina', isoCode: 'BR-SC', center: [-50.6, -27.1], weight: 1 },
  { id: 'BR-AM', countryCode: 'BRA', name: 'Amazonas', isoCode: 'BR-AM', center: [-65.1, -2.7], weight: 1 },
  { id: 'BR-RO', countryCode: 'BRA', name: 'Rondônia', isoCode: 'BR-RO', center: [-63.4, -10.6], weight: 1 },
  { id: 'BR-MT', countryCode: 'BRA', name: 'Mato Grosso', isoCode: 'BR-MT', center: [-56.2, -13.6], weight: 1 },
  { id: 'BR-MA', countryCode: 'BRA', name: 'Maranhão', isoCode: 'BR-MA', center: [-44.9, -4.4], weight: 1 },
  { id: 'BR-PI', countryCode: 'BRA', name: 'Piauí', isoCode: 'BR-PI', center: [-42.9, -7.1], weight: 1 },
  { id: 'BR-CE', countryCode: 'BRA', name: 'Ceará', isoCode: 'BR-CE', center: [-39.5, -5.2], weight: 1 },
  { id: 'BR-RN', countryCode: 'BRA', name: 'Rio Grande do Norte', isoCode: 'BR-RN', center: [-35.8, -5.2], weight: 1 },
  { id: 'BR-PB', countryCode: 'BRA', name: 'Paraíba', isoCode: 'BR-PB', center: [-36.8, -7.1], weight: 1 },
  { id: 'BR-PE', countryCode: 'BRA', name: 'Pernambuco', isoCode: 'BR-PE', center: [-38, -8.3], weight: 1 },
  { id: 'BR-AL', countryCode: 'BRA', name: 'Alagoas', isoCode: 'BR-AL', center: [-36.6, -9.4], weight: 1 },
  { id: 'BR-SE', countryCode: 'BRA', name: 'Sergipe', isoCode: 'BR-SE', center: [-37.5, -10.6], weight: 1 },
  { id: 'BR-ES', countryCode: 'BRA', name: 'Espírito Santo', isoCode: 'BR-ES', center: [-40.3, -19.5], weight: 1 },
  { id: 'BR-GO', countryCode: 'BRA', name: 'Goiás', isoCode: 'BR-GO', center: [-49.1, -15.5], weight: 1 },
  { id: 'BR-DF', countryCode: 'BRA', name: 'Distrito Federal', isoCode: 'BR-DF', center: [-47.7, -15.8], weight: 1 },
  { id: 'BR-TO', countryCode: 'BRA', name: 'Tocantins', isoCode: 'BR-TO', center: [-48.1, -9.8], weight: 1 },
  // ARG
  { id: 'AR-E', countryCode: 'ARG', name: 'Entre Ríos', isoCode: 'AR-E', center: [-59, -32.1], weight: 1 },
  { id: 'AR-A', countryCode: 'ARG', name: 'Salta', isoCode: 'AR-A', center: [-65.5, -24.3], weight: 1 },
  { id: 'AR-Y', countryCode: 'ARG', name: 'Jujuy', isoCode: 'AR-Y', center: [-65.7, -23.4], weight: 1 },
  { id: 'AR-P', countryCode: 'ARG', name: 'Formosa', isoCode: 'AR-P', center: [-59.9, -25], weight: 1 },
  { id: 'AR-N', countryCode: 'ARG', name: 'Misiones', isoCode: 'AR-N', center: [-54.8, -26.8], weight: 1 },
  { id: 'AR-H', countryCode: 'ARG', name: 'Chaco', isoCode: 'AR-H', center: [-60.2, -26.1], weight: 1 },
  { id: 'AR-W', countryCode: 'ARG', name: 'Corrientes', isoCode: 'AR-W', center: [-57.7, -28.8], weight: 1 },
  { id: 'AR-K', countryCode: 'ARG', name: 'Catamarca', isoCode: 'AR-K', center: [-66.9, -27.4], weight: 1 },
  { id: 'AR-F', countryCode: 'ARG', name: 'La Rioja', isoCode: 'AR-F', center: [-67.5, -29.5], weight: 1 },
  { id: 'AR-J', countryCode: 'ARG', name: 'San Juan', isoCode: 'AR-J', center: [-69, -30.9], weight: 1 },
  { id: 'AR-M', countryCode: 'ARG', name: 'Mendoza', isoCode: 'AR-M', center: [-68.9, -34.3], weight: 1 },
  { id: 'AR-Q', countryCode: 'ARG', name: 'Neuquén', isoCode: 'AR-Q', center: [-70.4, -38.7], weight: 1 },
  { id: 'AR-U', countryCode: 'ARG', name: 'Chubut', isoCode: 'AR-U', center: [-68.2, -43.7], weight: 1 },
  { id: 'AR-R', countryCode: 'ARG', name: 'Río Negro', isoCode: 'AR-R', center: [-67.3, -39.9], weight: 1 },
  { id: 'AR-Z', countryCode: 'ARG', name: 'Santa Cruz', isoCode: 'AR-Z', center: [-70, -49.2], weight: 1 },
  { id: 'AR-V', countryCode: 'ARG', name: 'Tierra del Fuego', isoCode: 'AR-V', center: [-66.8, -54.4], weight: 1 },
  { id: 'AR-S', countryCode: 'ARG', name: 'Santa Fe', isoCode: 'AR-S', center: [-60.8, -31.4], weight: 1 },
  { id: 'AR-T', countryCode: 'ARG', name: 'Tucumán', isoCode: 'AR-T', center: [-65.4, -27], weight: 1 },
  { id: 'AR-G', countryCode: 'ARG', name: 'Santiago del Estero', isoCode: 'AR-G', center: [-63.9, -27.9], weight: 1 },
  { id: 'AR-D', countryCode: 'ARG', name: 'San Luis', isoCode: 'AR-D', center: [-66.1, -33.5], weight: 1 },
  { id: 'AR-L', countryCode: 'ARG', name: 'La Pampa', isoCode: 'AR-L', center: [-66, -37.7], weight: 1 },
  // CHL
  { id: 'CL-AP', countryCode: 'CHL', name: 'Arica y Parinacota', isoCode: 'CL-AP', center: [-69.7, -18.5], weight: 1 },
  { id: 'CL-TA', countryCode: 'CHL', name: 'Tarapacá', isoCode: 'CL-TA', center: [-69.2, -20.2], weight: 1 },
  { id: 'CL-AN', countryCode: 'CHL', name: 'Antofagasta', isoCode: 'CL-AN', center: [-69.1, -23.6], weight: 1 },
  { id: 'CL-AT', countryCode: 'CHL', name: 'Atacama', isoCode: 'CL-AT', center: [-69.9, -27.5], weight: 1 },
  { id: 'CL-CO', countryCode: 'CHL', name: 'Coquimbo', isoCode: 'CL-CO', center: [-70.7, -30.4], weight: 1 },
  { id: 'CL-ML', countryCode: 'CHL', name: 'Maule', isoCode: 'CL-ML', center: [-71.4, -35.6], weight: 1 },
  { id: 'CL-LI', countryCode: 'CHL', name: 'Libertador General Bernardo O\'Higgins', isoCode: 'CL-LI', center: [-71, -34.4], weight: 1 },
  { id: 'CL-NB', countryCode: 'CHL', name: 'Ñuble', isoCode: 'CL-NB', center: [-71.9, -36.6], weight: 1 },
  { id: 'CL-AR', countryCode: 'CHL', name: 'La Araucanía', isoCode: 'CL-AR', center: [-72.4, -38.7], weight: 1 },
  { id: 'CL-LR', countryCode: 'CHL', name: 'Los Ríos', isoCode: 'CL-LR', center: [-72.5, -39.9], weight: 1 },
  { id: 'CL-LL', countryCode: 'CHL', name: 'Los Lagos', isoCode: 'CL-LL', center: [-72.6, -41.5], weight: 1 },
  { id: 'CL-AI', countryCode: 'CHL', name: 'Aisén del General Carlos Ibáñez del Campo', isoCode: 'CL-AI', center: [-72.1, -45.6], weight: 1 },
  { id: 'CL-MA', countryCode: 'CHL', name: 'Magallanes y Antártica Chilena', isoCode: 'CL-MA', center: [-72.5, -52.6], weight: 1 },
  // COL
  { id: 'CO-NAR', countryCode: 'COL', name: 'Nariño', isoCode: 'CO-NAR', center: [-77.8, 1.7], weight: 1 },
  { id: 'CO-PUT', countryCode: 'COL', name: 'Putumayo', isoCode: 'CO-PUT', center: [-75.9, 0.4], weight: 1 },
  { id: 'CO-CHO', countryCode: 'COL', name: 'Chocó', isoCode: 'CO-CHO', center: [-77.1, 6.1], weight: 1 },
  { id: 'CO-GUA', countryCode: 'COL', name: 'Guainía', isoCode: 'CO-GUA', center: [-68.7, 2.7], weight: 1 },
  { id: 'CO-VAU', countryCode: 'COL', name: 'Vaupés', isoCode: 'CO-VAU', center: [-70.2, 0.4], weight: 1 },
  { id: 'CO-AMA', countryCode: 'COL', name: 'Amazonas', isoCode: 'CO-AMA', center: [-71.7, -1.5], weight: 1 },
  { id: 'CO-LAG', countryCode: 'COL', name: 'La Guajira', isoCode: 'CO-LAG', center: [-72.5, 11.4], weight: 1 },
  { id: 'CO-CES', countryCode: 'COL', name: 'Cesar', isoCode: 'CO-CES', center: [-73.5, 9.4], weight: 1 },
  { id: 'CO-NSA', countryCode: 'COL', name: 'Norte de Santander', isoCode: 'CO-NSA', center: [-72.9, 7.9], weight: 1 },
  { id: 'CO-ARA', countryCode: 'COL', name: 'Arauca', isoCode: 'CO-ARA', center: [-71.1, 6.6], weight: 1 },
  { id: 'CO-BOY', countryCode: 'COL', name: 'Boyacá', isoCode: 'CO-BOY', center: [-73.2, 5.9], weight: 1 },
  { id: 'CO-VID', countryCode: 'COL', name: 'Vichada', isoCode: 'CO-VID', center: [-69.1, 4.6], weight: 1 },
  { id: 'CO-CAU', countryCode: 'COL', name: 'Cauca', isoCode: 'CO-CAU', center: [-77.1, 2.4], weight: 1 },
  { id: 'CO-COR', countryCode: 'COL', name: 'Córdoba', isoCode: 'CO-COR', center: [-75.7, 8.4], weight: 1 },
  { id: 'CO-SUC', countryCode: 'COL', name: 'Sucre', isoCode: 'CO-SUC', center: [-75.2, 9.2], weight: 1 },
  { id: 'CO-BOL', countryCode: 'COL', name: 'Bolívar', isoCode: 'CO-BOL', center: [-74.8, 9.2], weight: 1 },
  { id: 'CO-ATL', countryCode: 'COL', name: 'Atlántico', isoCode: 'CO-ATL', center: [-75.1, 10.7], weight: 1 },
  { id: 'CO-MAG', countryCode: 'COL', name: 'Magdalena', isoCode: 'CO-MAG', center: [-74.2, 10.3], weight: 1 },
  { id: 'CO-SAP', countryCode: 'COL', name: 'San Andrés y Providencia', isoCode: 'CO-SAP', center: [-81.1, 13.1], weight: 1 },
  { id: 'CO-X01~', countryCode: 'COL', name: '', isoCode: 'CO-X01~', center: [-81.6, 4], weight: 1 },
  { id: 'CO-CAQ', countryCode: 'COL', name: 'Caquetá', isoCode: 'CO-CAQ', center: [-74, 1], weight: 1 },
  { id: 'CO-HUI', countryCode: 'COL', name: 'Huila', isoCode: 'CO-HUI', center: [-75.6, 2.6], weight: 1 },
  { id: 'CO-GUV', countryCode: 'COL', name: 'Guaviare', isoCode: 'CO-GUV', center: [-71.9, 1.9], weight: 1 },
  { id: 'CO-CAL', countryCode: 'COL', name: 'Caldas', isoCode: 'CO-CAL', center: [-75.3, 5.4], weight: 1 },
  { id: 'CO-CAS', countryCode: 'COL', name: 'Casanare', isoCode: 'CO-CAS', center: [-71.8, 5.5], weight: 1 },
  { id: 'CO-MET', countryCode: 'COL', name: 'Meta', isoCode: 'CO-MET', center: [-73.4, 3.3], weight: 1 },
  { id: 'CO-SAN', countryCode: 'COL', name: 'Santander', isoCode: 'CO-SAN', center: [-73.6, 6.7], weight: 1 },
  { id: 'CO-TOL', countryCode: 'COL', name: 'Tolima', isoCode: 'CO-TOL', center: [-75.3, 4], weight: 1 },
  { id: 'CO-QUI', countryCode: 'COL', name: 'Quindío', isoCode: 'CO-QUI', center: [-75.6, 4.6], weight: 1 },
  { id: 'CO-RIS', countryCode: 'COL', name: 'Risaralda', isoCode: 'CO-RIS', center: [-75.8, 5.1], weight: 1 },
  // GBR
  { id: 'GB-DRY', countryCode: 'GBR', name: 'Derry', isoCode: 'GB-DRY', center: [-7.2, 54.9], weight: 1 },
  { id: 'GB-STB', countryCode: 'GBR', name: 'Strabane', isoCode: 'GB-STB', center: [-7.4, 54.8], weight: 1 },
  { id: 'GB-FER', countryCode: 'GBR', name: 'Fermanagh', isoCode: 'GB-FER', center: [-7.6, 54.4], weight: 1 },
  { id: 'GB-DGN', countryCode: 'GBR', name: 'Dungannon', isoCode: 'GB-DGN', center: [-6.9, 54.4], weight: 1 },
  { id: 'GB-ARM', countryCode: 'GBR', name: 'Armagh', isoCode: 'GB-ARM', center: [-6.6, 54.3], weight: 1 },
  { id: 'GB-NYM', countryCode: 'GBR', name: 'Newry and Mourne', isoCode: 'GB-NYM', center: [-6.3, 54.2], weight: 1 },
  { id: 'GB-FLN', countryCode: 'GBR', name: 'Flintshire', isoCode: 'GB-FLN', center: [-3.2, 53.2], weight: 1 },
  { id: 'GB-CHW', countryCode: 'GBR', name: 'Cheshire West and Chester', isoCode: 'GB-CHW', center: [-2.8, 53.2], weight: 1 },
  { id: 'GB-WRX', countryCode: 'GBR', name: 'Wrexham', isoCode: 'GB-WRX', center: [-3, 53], weight: 1 },
  { id: 'GB-SHR', countryCode: 'GBR', name: 'Shropshire', isoCode: 'GB-SHR', center: [-2.7, 52.7], weight: 1 },
  { id: 'GB-POW', countryCode: 'GBR', name: 'Powys', isoCode: 'GB-POW', center: [-3.4, 52.3], weight: 1 },
  { id: 'GB-HEF', countryCode: 'GBR', name: 'Herefordshire', isoCode: 'GB-HEF', center: [-2.8, 52.1], weight: 1 },
  { id: 'GB-MON', countryCode: 'GBR', name: 'Monmouthshire', isoCode: 'GB-MON', center: [-2.9, 51.8], weight: 1 },
  { id: 'GB-GLS', countryCode: 'GBR', name: 'Gloucestershire', isoCode: 'GB-GLS', center: [-2.2, 51.8], weight: 1 },
  { id: 'GB-SCB', countryCode: 'GBR', name: 'Scottish Borders', isoCode: 'GB-SCB', center: [-2.8, 55.6], weight: 1 },
  { id: 'GB-NBL', countryCode: 'GBR', name: 'Northumberland', isoCode: 'GB-NBL', center: [-2.2, 55.2], weight: 1 },
  { id: 'GB-CMA', countryCode: 'GBR', name: 'Cumbria', isoCode: 'GB-CMA', center: [-2.8, 54.7], weight: 1 },
  { id: 'GB-DGY', countryCode: 'GBR', name: 'Dumfries and Galloway', isoCode: 'GB-DGY', center: [-4, 55.1], weight: 1 },
  { id: 'GB-LMV', countryCode: 'GBR', name: 'Limavady', isoCode: 'GB-LMV', center: [-7, 55], weight: 1 },
  { id: 'GB-CLR', countryCode: 'GBR', name: 'Coleraine', isoCode: 'GB-CLR', center: [-6.7, 55.1], weight: 1 },
  { id: 'GB-MYL', countryCode: 'GBR', name: 'Moyle', isoCode: 'GB-MYL', center: [-6.3, 55.2], weight: 1 },
  { id: 'GB-LRN', countryCode: 'GBR', name: 'Larne', isoCode: 'GB-LRN', center: [-5.9, 54.9], weight: 1 },
  { id: 'GB-CKF', countryCode: 'GBR', name: 'Carrickfergus', isoCode: 'GB-CKF', center: [-5.8, 54.7], weight: 1 },
  { id: 'GB-NTA', countryCode: 'GBR', name: 'Newtownabbey', isoCode: 'GB-NTA', center: [-6, 54.7], weight: 1 },
  { id: 'GB-BFS', countryCode: 'GBR', name: 'Belfast', isoCode: 'GB-BFS', center: [-5.9, 54.6], weight: 1 },
  { id: 'GB-NDN', countryCode: 'GBR', name: 'North Down', isoCode: 'GB-NDN', center: [-5.8, 54.6], weight: 1 },
  { id: 'GB-ARD', countryCode: 'GBR', name: 'Ards', isoCode: 'GB-ARD', center: [-5.6, 54.5], weight: 1 },
  { id: 'GB-DOW', countryCode: 'GBR', name: 'Down', isoCode: 'GB-DOW', center: [-5.8, 54.4], weight: 1 },
  { id: 'GB-CLK', countryCode: 'GBR', name: 'Clackmannanshire', isoCode: 'GB-CLK', center: [-3.8, 56.1], weight: 1 },
  { id: 'GB-STG', countryCode: 'GBR', name: 'Stirling', isoCode: 'GB-STG', center: [-4.2, 56.2], weight: 1 },
  { id: 'GB-FAL', countryCode: 'GBR', name: 'Falkirk', isoCode: 'GB-FAL', center: [-3.8, 56], weight: 1 },
  { id: 'GB-WLN', countryCode: 'GBR', name: 'West Lothian', isoCode: 'GB-WLN', center: [-3.6, 55.9], weight: 1 },
  { id: 'GB-MLN', countryCode: 'GBR', name: 'Midlothian', isoCode: 'GB-MLN', center: [-3.1, 55.9], weight: 1 },
  { id: 'GB-ELN', countryCode: 'GBR', name: 'East Lothian', isoCode: 'GB-ELN', center: [-2.8, 55.9], weight: 1 },
  { id: 'GB-NTY', countryCode: 'GBR', name: 'North Tyneside', isoCode: 'GB-NTY', center: [-1.5, 55], weight: 1 },
  { id: 'GB-STY', countryCode: 'GBR', name: 'South Tyneside', isoCode: 'GB-STY', center: [-1.5, 55], weight: 1 },
  { id: 'GB-SND', countryCode: 'GBR', name: 'Sunderland', isoCode: 'GB-SND', center: [-1.4, 54.9], weight: 1 },
  { id: 'GB-DUR', countryCode: 'GBR', name: 'Durham', isoCode: 'GB-DUR', center: [-1.7, 54.7], weight: 1 },
  { id: 'GB-HPL', countryCode: 'GBR', name: 'Hartlepool', isoCode: 'GB-HPL', center: [-1.3, 54.7], weight: 1 },
  { id: 'GB-RCC', countryCode: 'GBR', name: 'Redcar and Cleveland', isoCode: 'GB-RCC', center: [-1.1, 54.6], weight: 1 },
  { id: 'GB-NYK', countryCode: 'GBR', name: 'North Yorkshire', isoCode: 'GB-NYK', center: [-1.3, 54.1], weight: 1 },
  { id: 'GB-ERY', countryCode: 'GBR', name: 'East Riding of Yorkshire', isoCode: 'GB-ERY', center: [-0.5, 53.8], weight: 1 },
  { id: 'GB-KHL', countryCode: 'GBR', name: 'Kingston upon Hull', isoCode: 'GB-KHL', center: [-0.3, 53.7], weight: 1 },
  { id: 'GB-NLN', countryCode: 'GBR', name: 'North Lincolnshire', isoCode: 'GB-NLN', center: [-0.6, 53.6], weight: 1 },
  { id: 'GB-NEL', countryCode: 'GBR', name: 'North East Lincolnshire', isoCode: 'GB-NEL', center: [-0.2, 53.6], weight: 1 },
  { id: 'GB-LIN', countryCode: 'GBR', name: 'Lincolnshire', isoCode: 'GB-LIN', center: [-0.2, 53.1], weight: 1 },
  { id: 'GB-NFK', countryCode: 'GBR', name: 'Norfolk', isoCode: 'GB-NFK', center: [0.8, 52.7], weight: 1 },
  { id: 'GB-SFK', countryCode: 'GBR', name: 'Suffolk', isoCode: 'GB-SFK', center: [1.1, 52.2], weight: 1 },
  { id: 'GB-ESS', countryCode: 'GBR', name: 'Essex', isoCode: 'GB-ESS', center: [0.6, 51.8], weight: 1 },
  { id: 'GB-SOS', countryCode: 'GBR', name: 'Southend-on-Sea', isoCode: 'GB-SOS', center: [0.8, 51.5], weight: 1 },
  { id: 'GB-THR', countryCode: 'GBR', name: 'Thurrock', isoCode: 'GB-THR', center: [0.4, 51.5], weight: 1 },
  { id: 'GB-KEN', countryCode: 'GBR', name: 'Kent', isoCode: 'GB-KEN', center: [0.7, 51.3], weight: 1 },
  { id: 'GB-MDW', countryCode: 'GBR', name: 'Medway', isoCode: 'GB-MDW', center: [0.5, 51.4], weight: 1 },
  { id: 'GB-ESX', countryCode: 'GBR', name: 'East Sussex', isoCode: 'GB-ESX', center: [0.3, 51], weight: 1 },
  { id: 'GB-BNH', countryCode: 'GBR', name: 'Brighton and Hove', isoCode: 'GB-BNH', center: [-0.1, 50.8], weight: 1 },
  { id: 'GB-WSX', countryCode: 'GBR', name: 'West Sussex', isoCode: 'GB-WSX', center: [-0.4, 50.9], weight: 1 },
  { id: 'GB-HAM', countryCode: 'GBR', name: 'Hampshire', isoCode: 'GB-HAM', center: [-1.2, 51], weight: 1 },
  { id: 'GB-POR', countryCode: 'GBR', name: 'Portsmouth', isoCode: 'GB-POR', center: [-1, 50.8], weight: 1 },
  { id: 'GB-STH', countryCode: 'GBR', name: 'Southampton', isoCode: 'GB-STH', center: [-1.4, 50.9], weight: 1 },
  { id: 'GB-DOR', countryCode: 'GBR', name: 'Dorset', isoCode: 'GB-DOR', center: [-2.2, 50.8], weight: 1 },
  { id: 'GB-BMH', countryCode: 'GBR', name: 'Bournemouth', isoCode: 'GB-BMH', center: [-1.9, 50.7], weight: 1 },
  { id: 'GB-POL', countryCode: 'GBR', name: 'Poole', isoCode: 'GB-POL', center: [-1.9, 50.7], weight: 1 },
  { id: 'GB-DEV', countryCode: 'GBR', name: 'Devon', isoCode: 'GB-DEV', center: [-4, 50.8], weight: 1 },
  { id: 'GB-TOB', countryCode: 'GBR', name: 'Torbay', isoCode: 'GB-TOB', center: [-3.5, 50.5], weight: 1 },
  { id: 'GB-PLY', countryCode: 'GBR', name: 'Plymouth', isoCode: 'GB-PLY', center: [-4.1, 50.4], weight: 1 },
  { id: 'GB-CON', countryCode: 'GBR', name: 'Cornwall', isoCode: 'GB-CON', center: [-4.9, 50.4], weight: 1 },
  { id: 'GB-SOM', countryCode: 'GBR', name: 'Somerset', isoCode: 'GB-SOM', center: [-3, 51.1], weight: 1 },
  { id: 'GB-NSM', countryCode: 'GBR', name: 'North Somerset', isoCode: 'GB-NSM', center: [-2.8, 51.4], weight: 1 },
  { id: 'GB-BST', countryCode: 'GBR', name: 'Bristol', isoCode: 'GB-BST', center: [-2.7, 51.5], weight: 1 },
  { id: 'GB-SGC', countryCode: 'GBR', name: 'South Gloucestershire', isoCode: 'GB-SGC', center: [-2.5, 51.5], weight: 1 },
  { id: 'GB-NWP', countryCode: 'GBR', name: 'Newport', isoCode: 'GB-NWP', center: [-3, 51.6], weight: 1 },
  { id: 'GB-CRF', countryCode: 'GBR', name: 'Cardiff', isoCode: 'GB-CRF', center: [-3.2, 51.5], weight: 1 },
  { id: 'GB-VGL', countryCode: 'GBR', name: 'Vale of Glamorgan', isoCode: 'GB-VGL', center: [-3.3, 51.5], weight: 1 },
  { id: 'GB-BGE', countryCode: 'GBR', name: 'Bridgend', isoCode: 'GB-BGE', center: [-3.6, 51.5], weight: 1 },
  { id: 'GB-NTL', countryCode: 'GBR', name: 'Neath Port Talbot', isoCode: 'GB-NTL', center: [-3.8, 51.7], weight: 1 },
  { id: 'GB-SWA', countryCode: 'GBR', name: 'Swansea', isoCode: 'GB-SWA', center: [-4, 51.6], weight: 1 },
  { id: 'GB-CMN', countryCode: 'GBR', name: 'Carmarthenshire', isoCode: 'GB-CMN', center: [-4.2, 51.9], weight: 1 },
  { id: 'GB-PEM', countryCode: 'GBR', name: 'Pembrokeshire', isoCode: 'GB-PEM', center: [-4.8, 51.9], weight: 1 },
  { id: 'GB-CGN', countryCode: 'GBR', name: 'Ceredigion', isoCode: 'GB-CGN', center: [-4.2, 52.3], weight: 1 },
  { id: 'GB-GWN', countryCode: 'GBR', name: 'Gwynedd', isoCode: 'GB-GWN', center: [-4, 52.8], weight: 1 },
  { id: 'GB-CWY', countryCode: 'GBR', name: 'Conwy', isoCode: 'GB-CWY', center: [-3.8, 53.1], weight: 1 },
  { id: 'GB-DEN', countryCode: 'GBR', name: 'Denbighshire', isoCode: 'GB-DEN', center: [-3.4, 53.1], weight: 1 },
  { id: 'GB-WRL', countryCode: 'GBR', name: 'Halton', isoCode: 'GB-WRL', center: [-3, 53.3], weight: 1 },
  { id: 'GB-HAL', countryCode: 'GBR', name: 'Halton', isoCode: 'GB-HAL', center: [-2.7, 53.3], weight: 1 },
  { id: 'GB-KWL', countryCode: 'GBR', name: 'Knowsley', isoCode: 'GB-KWL', center: [-2.8, 53.4], weight: 1 },
  { id: 'GB-LIV', countryCode: 'GBR', name: 'Liverpool', isoCode: 'GB-LIV', center: [-2.9, 53.4], weight: 1 },
  { id: 'GB-SFT', countryCode: 'GBR', name: 'Sefton', isoCode: 'GB-SFT', center: [-3, 53.5], weight: 1 },
  { id: 'GB-LAN', countryCode: 'GBR', name: 'Lancashire', isoCode: 'GB-LAN', center: [-2.7, 53.8], weight: 1 },
  { id: 'GB-BPL', countryCode: 'GBR', name: 'Blackpool', isoCode: 'GB-BPL', center: [-3, 53.8], weight: 1 },
  { id: 'GB-SAY', countryCode: 'GBR', name: 'South Ayrshire', isoCode: 'GB-SAY', center: [-4.7, 55.3], weight: 1 },
  { id: 'GB-NAY', countryCode: 'GBR', name: 'North Ayshire', isoCode: 'GB-NAY', center: [-4.7, 55.7], weight: 1 },
  { id: 'GB-IVC', countryCode: 'GBR', name: 'Inverclyde', isoCode: 'GB-IVC', center: [-4.8, 55.9], weight: 1 },
  { id: 'GB-RFW', countryCode: 'GBR', name: 'Renfrewshire', isoCode: 'GB-RFW', center: [-4.5, 55.9], weight: 1 },
  { id: 'GB-WDU', countryCode: 'GBR', name: 'West Dunbartonshire', isoCode: 'GB-WDU', center: [-4.5, 55.9], weight: 1 },
  { id: 'GB-AGB', countryCode: 'GBR', name: 'Argyll and Bute', isoCode: 'GB-AGB', center: [-5.7, 56.2], weight: 1 },
  { id: 'GB-HLD', countryCode: 'GBR', name: 'Highland', isoCode: 'GB-HLD', center: [-5.4, 57.4], weight: 1 },
  { id: 'GB-MRY', countryCode: 'GBR', name: 'Moray', isoCode: 'GB-MRY', center: [-3.3, 57.4], weight: 1 },
  { id: 'GB-ABD', countryCode: 'GBR', name: 'Aberdeenshire', isoCode: 'GB-ABD', center: [-2.7, 57.2], weight: 1 },
  { id: 'GB-ABE', countryCode: 'GBR', name: 'Aberdeen', isoCode: 'GB-ABE', center: [-2.2, 57.2], weight: 1 },
  { id: 'GB-ANS', countryCode: 'GBR', name: 'Angus', isoCode: 'GB-ANS', center: [-2.9, 56.7], weight: 1 },
  { id: 'GB-DND', countryCode: 'GBR', name: 'Dundee', isoCode: 'GB-DND', center: [-2.9, 56.5], weight: 1 },
  { id: 'GB-PKN', countryCode: 'GBR', name: 'Perthshire and Kinross', isoCode: 'GB-PKN', center: [-3.7, 56.5], weight: 1 },
  { id: 'GB-FIF', countryCode: 'GBR', name: 'Fife', isoCode: 'GB-FIF', center: [-3.2, 56.2], weight: 1 },
  { id: 'GB-IOW', countryCode: 'GBR', name: 'Isle of Wight', isoCode: 'GB-IOW', center: [-1.2, 50.7], weight: 1 },
  { id: 'GB-AGY', countryCode: 'GBR', name: 'Anglesey', isoCode: 'GB-AGY', center: [-4.4, 53.3], weight: 1 },
  { id: 'GB-ELS', countryCode: 'GBR', name: 'Eilean Siar', isoCode: 'GB-ELS', center: [-7.7, 57.7], weight: 1 },
  { id: 'GB-ORK', countryCode: 'GBR', name: 'Orkney', isoCode: 'GB-ORK', center: [-2.9, 59.1], weight: 1 },
  { id: 'GB-ZET', countryCode: 'GBR', name: 'Shetland Islands', isoCode: 'GB-ZET', center: [-1.2, 60.3], weight: 1 },
  { id: 'GB-IOS', countryCode: 'GBR', name: 'Isles of Scilly', isoCode: 'GB-IOS', center: [-6.3, 49.9], weight: 1 },
  { id: 'GB-CAY', countryCode: 'GBR', name: 'Caerphilly', isoCode: 'GB-CAY', center: [-3.2, 51.7], weight: 1 },
  { id: 'GB-RCT', countryCode: 'GBR', name: 'Rhondda, Cynon, Taff', isoCode: 'GB-RCT', center: [-3.4, 51.6], weight: 1 },
  { id: 'GB-BGW', countryCode: 'GBR', name: 'Blaenau Gwent', isoCode: 'GB-BGW', center: [-3.2, 51.8], weight: 1 },
  { id: 'GB-TOF', countryCode: 'GBR', name: 'Torfaen', isoCode: 'GB-TOF', center: [-3.1, 51.7], weight: 1 },
  { id: 'GB-MTY', countryCode: 'GBR', name: 'Merthyr Tydfil', isoCode: 'GB-MTY', center: [-3.4, 51.8], weight: 1 },
  { id: 'GB-NLK', countryCode: 'GBR', name: 'North Lanarkshire', isoCode: 'GB-NLK', center: [-4, 55.9], weight: 1 },
  { id: 'GB-EDU', countryCode: 'GBR', name: 'East Dunbartonshire', isoCode: 'GB-EDU', center: [-4.2, 56], weight: 1 },
  { id: 'GB-GLG', countryCode: 'GBR', name: 'Glasgow', isoCode: 'GB-GLG', center: [-4.3, 55.9], weight: 1 },
  { id: 'GB-ERW', countryCode: 'GBR', name: 'East Renfrewshire', isoCode: 'GB-ERW', center: [-4.4, 55.8], weight: 1 },
  { id: 'GB-EAY', countryCode: 'GBR', name: 'East Ayrshire', isoCode: 'GB-EAY', center: [-4.3, 55.5], weight: 1 },
  { id: 'GB-SLK', countryCode: 'GBR', name: 'South Lanarkshire', isoCode: 'GB-SLK', center: [-3.9, 55.6], weight: 1 },
  { id: 'GB-MFT', countryCode: 'GBR', name: 'Magherafelt', isoCode: 'GB-MFT', center: [-6.7, 54.8], weight: 1 },
  { id: 'GB-OMH', countryCode: 'GBR', name: 'Omagh', isoCode: 'GB-OMH', center: [-7.3, 54.6], weight: 1 },
  { id: 'GB-CKT', countryCode: 'GBR', name: 'Mid Ulster', isoCode: 'GB-CKT', center: [-6.7, 54.6], weight: 1 },
  { id: 'GB-CGV', countryCode: 'GBR', name: 'Craigavon', isoCode: 'GB-CGV', center: [-6.4, 54.5], weight: 1 },
  { id: 'GB-BNB', countryCode: 'GBR', name: 'Banbridge', isoCode: 'GB-BNB', center: [-6.2, 54.3], weight: 1 },
  { id: 'GB-ANT', countryCode: 'GBR', name: 'Antrim', isoCode: 'GB-ANT', center: [-6.3, 54.7], weight: 1 },
  { id: 'GB-LSB', countryCode: 'GBR', name: 'Lisburn', isoCode: 'GB-LSB', center: [-6, 54.5], weight: 1 },
  { id: 'GB-BLY', countryCode: 'GBR', name: 'Ballymoney', isoCode: 'GB-BLY', center: [-6.4, 55], weight: 1 },
  { id: 'GB-BLA', countryCode: 'GBR', name: 'Ballymena', isoCode: 'GB-BLA', center: [-6.3, 54.9], weight: 1 },
  { id: 'GB-CSR', countryCode: 'GBR', name: 'Castlereagh', isoCode: 'GB-CSR', center: [-5.8, 54.5], weight: 1 },
  { id: 'GB-WND', countryCode: 'GBR', name: 'Wandsworth', isoCode: 'GB-WND', center: [-0.2, 51.5], weight: 1 },
  { id: 'GB-MRT', countryCode: 'GBR', name: 'Merton', isoCode: 'GB-MRT', center: [-0.2, 51.4], weight: 1 },
  { id: 'GB-WSM', countryCode: 'GBR', name: 'Westminster', isoCode: 'GB-WSM', center: [-0.2, 51.5], weight: 1 },
  { id: 'GB-KEC', countryCode: 'GBR', name: 'Kensington and Chelsea', isoCode: 'GB-KEC', center: [-0.2, 51.5], weight: 1 },
  { id: 'GB-HNS', countryCode: 'GBR', name: 'Hounslow', isoCode: 'GB-HNS', center: [-0.3, 51.5], weight: 1 },
  { id: 'GB-EAL', countryCode: 'GBR', name: 'Ealing', isoCode: 'GB-EAL', center: [-0.3, 51.5], weight: 1 },
  { id: 'GB-HMF', countryCode: 'GBR', name: 'Hammersmith and Fulham', isoCode: 'GB-HMF', center: [-0.2, 51.5], weight: 1 },
  { id: 'GB-STT', countryCode: 'GBR', name: 'Stockton-on-Tees', isoCode: 'GB-STT', center: [-1.3, 54.6], weight: 1 },
  { id: 'GB-DAL', countryCode: 'GBR', name: 'Darlington', isoCode: 'GB-DAL', center: [-1.5, 54.6], weight: 1 },
  { id: 'GB-MDB', countryCode: 'GBR', name: 'Middlesbrough', isoCode: 'GB-MDB', center: [-1.2, 54.5], weight: 1 },
  { id: 'GB-RIC', countryCode: 'GBR', name: 'Richmond upon Thames', isoCode: 'GB-RIC', center: [-0.3, 51.4], weight: 1 },
  { id: 'GB-TWH', countryCode: 'GBR', name: 'Tower Hamlets', isoCode: 'GB-TWH', center: [0, 51.5], weight: 1 },
  { id: 'GB-GAT', countryCode: 'GBR', name: 'Gateshead', isoCode: 'GB-GAT', center: [-1.7, 54.9], weight: 1 },
  { id: 'GB-NET', countryCode: 'GBR', name: 'Newcastle upon Tyne', isoCode: 'GB-NET', center: [-1.6, 55], weight: 1 },
  { id: 'GB-YOR', countryCode: 'GBR', name: 'York', isoCode: 'GB-YOR', center: [-1, 53.9], weight: 1 },
  { id: 'GB-SHN', countryCode: 'GBR', name: 'Merseyside', isoCode: 'GB-SHN', center: [-2.7, 53.4], weight: 1 },
  { id: 'GB-ENF', countryCode: 'GBR', name: 'Enfield', isoCode: 'GB-ENF', center: [-0.1, 51.6], weight: 1 },
  { id: 'GB-HRT', countryCode: 'GBR', name: 'Hertfordshire', isoCode: 'GB-HRT', center: [-0.3, 51.8], weight: 1 },
  { id: 'GB-BNE', countryCode: 'GBR', name: 'Barnet', isoCode: 'GB-BNE', center: [-0.2, 51.6], weight: 1 },
  { id: 'GB-WFT', countryCode: 'GBR', name: 'Waltham Forest', isoCode: 'GB-WFT', center: [0, 51.6], weight: 1 },
  { id: 'GB-RDB', countryCode: 'GBR', name: 'Redbridge', isoCode: 'GB-RDB', center: [0.1, 51.6], weight: 1 },
  { id: 'GB-HAV', countryCode: 'GBR', name: 'Havering', isoCode: 'GB-HAV', center: [0.2, 51.6], weight: 1 },
  { id: 'GB-CAM', countryCode: 'GBR', name: 'Cambridgeshire', isoCode: 'GB-CAM', center: [0, 52.3], weight: 1 },
  { id: 'GB-BEX', countryCode: 'GBR', name: 'Bexley', isoCode: 'GB-BEX', center: [0.2, 51.5], weight: 1 },
  { id: 'GB-STN', countryCode: 'GBR', name: 'Sutton', isoCode: 'GB-STN', center: [-0.2, 51.4], weight: 1 },
  { id: 'GB-MIK', countryCode: 'GBR', name: 'Milton Keynes', isoCode: 'GB-MIK', center: [-0.7, 52.1], weight: 1 },
  { id: 'GB-BKM', countryCode: 'GBR', name: 'Buckinghamshire', isoCode: 'GB-BKM', center: [-0.8, 51.7], weight: 1 },
  { id: 'GB-HIL', countryCode: 'GBR', name: 'Hillingdon', isoCode: 'GB-HIL', center: [-0.4, 51.5], weight: 1 },
  { id: 'GB-BEN', countryCode: 'GBR', name: 'Brent', isoCode: 'GB-BEN', center: [-0.2, 51.5], weight: 1 },
  { id: 'GB-LUT', countryCode: 'GBR', name: 'Luton', isoCode: 'GB-LUT', center: [-0.4, 51.9], weight: 1 },
  { id: 'GB-HRW', countryCode: 'GBR', name: 'Harrow', isoCode: 'GB-HRW', center: [-0.3, 51.6], weight: 1 },
  { id: 'GB-CBF', countryCode: 'GBR', name: 'Central Bedfordshire', isoCode: 'GB-CBF', center: [-0.5, 52], weight: 1 },
  { id: 'GB-BDF', countryCode: 'GBR', name: 'Bedford', isoCode: 'GB-BDF', center: [-0.5, 52.2], weight: 1 },
  { id: 'GB-RUT', countryCode: 'GBR', name: 'Rutland', isoCode: 'GB-RUT', center: [-0.7, 52.7], weight: 1 },
  { id: 'GB-NTT', countryCode: 'GBR', name: 'Nottinghamshire', isoCode: 'GB-NTT', center: [-1, 53.1], weight: 1 },
  { id: 'GB-NTH', countryCode: 'GBR', name: 'Northamptonshire', isoCode: 'GB-NTH', center: [-0.8, 52.3], weight: 1 },
  { id: 'GB-CMD', countryCode: 'GBR', name: 'Camden', isoCode: 'GB-CMD', center: [-0.1, 51.5], weight: 1 },
  { id: 'GB-ISL', countryCode: 'GBR', name: 'Islington', isoCode: 'GB-ISL', center: [-0.1, 51.5], weight: 1 },
  { id: 'GB-PTE', countryCode: 'GBR', name: 'Peterborough', isoCode: 'GB-PTE', center: [-0.3, 52.6], weight: 1 },
  { id: 'GB-LBH', countryCode: 'GBR', name: 'Lambeth', isoCode: 'GB-LBH', center: [-0.1, 51.4], weight: 1 },
  { id: 'GB-SWK', countryCode: 'GBR', name: 'Southwark', isoCode: 'GB-SWK', center: [-0.1, 51.5], weight: 1 },
  { id: 'GB-DNC', countryCode: 'GBR', name: 'Doncaster', isoCode: 'GB-DNC', center: [-1.1, 53.6], weight: 1 },
  { id: 'GB-CRY', countryCode: 'GBR', name: 'Croydon', isoCode: 'GB-CRY', center: [-0.1, 51.4], weight: 1 },
  { id: 'GB-LEW', countryCode: 'GBR', name: 'Lewisham', isoCode: 'GB-LEW', center: [0, 51.5], weight: 1 },
  { id: 'GB-HRY', countryCode: 'GBR', name: 'Haringey', isoCode: 'GB-HRY', center: [-0.1, 51.6], weight: 1 },
  { id: 'GB-KTT', countryCode: 'GBR', name: 'Kingston upon Thames', isoCode: 'GB-KTT', center: [-0.3, 51.4], weight: 1 },
  { id: 'GB-NWM', countryCode: 'GBR', name: 'Newham', isoCode: 'GB-NWM', center: [0, 51.5], weight: 1 },
  { id: 'GB-GRE', countryCode: 'GBR', name: 'Greenwich', isoCode: 'GB-GRE', center: [0, 51.5], weight: 1 },
  { id: 'GB-HCK', countryCode: 'GBR', name: 'Hackney', isoCode: 'GB-HCK', center: [-0.1, 51.5], weight: 1 },
  { id: 'GB-BDG', countryCode: 'GBR', name: 'Barking and Dagenham', isoCode: 'GB-BDG', center: [0.1, 51.5], weight: 1 },
  { id: 'GB-LEC', countryCode: 'GBR', name: 'Leicestershire', isoCode: 'GB-LEC', center: [-1.1, 52.7], weight: 1 },
  { id: 'GB-CHE', countryCode: 'GBR', name: 'Cheshire East', isoCode: 'GB-CHE', center: [-2.3, 53.2], weight: 1 },
  { id: 'GB-DBY', countryCode: 'GBR', name: 'Derbyshire', isoCode: 'GB-DBY', center: [-1.6, 53.1], weight: 1 },
  { id: 'GB-ROT', countryCode: 'GBR', name: 'Rotherham', isoCode: 'GB-ROT', center: [-1.3, 53.4], weight: 1 },
  { id: 'GB-SHF', countryCode: 'GBR', name: 'Sheffield', isoCode: 'GB-SHF', center: [-1.5, 53.4], weight: 1 },
  { id: 'GB-STE', countryCode: 'GBR', name: 'Stoke-on-Trent', isoCode: 'GB-STE', center: [-2.2, 53.1], weight: 1 },
  { id: 'GB-TFW', countryCode: 'GBR', name: 'Telford and Wrekin', isoCode: 'GB-TFW', center: [-2.4, 52.8], weight: 1 },
  { id: 'GB-STS', countryCode: 'GBR', name: 'Staffordshire', isoCode: 'GB-STS', center: [-2, 52.8], weight: 1 },
  { id: 'GB-BRY', countryCode: 'GBR', name: 'Bromley', isoCode: 'GB-BRY', center: [0, 51.4], weight: 1 },
  { id: 'GB-WOR', countryCode: 'GBR', name: 'Worcestershire', isoCode: 'GB-WOR', center: [-2.1, 52.2], weight: 1 },
  { id: 'GB-WAR', countryCode: 'GBR', name: 'Warwickshire', isoCode: 'GB-WAR', center: [-1.7, 52.3], weight: 1 },
  { id: 'GB-OXF', countryCode: 'GBR', name: 'Oxfordshire', isoCode: 'GB-OXF', center: [-1.3, 51.8], weight: 1 },
  { id: 'GB-WGN', countryCode: 'GBR', name: 'Wigan', isoCode: 'GB-WGN', center: [-2.6, 53.5], weight: 1 },
  { id: 'GB-SKP', countryCode: 'GBR', name: 'Stockport', isoCode: 'GB-SKP', center: [-2.1, 53.4], weight: 1 },
  { id: 'GB-WRT', countryCode: 'GBR', name: 'Warrington', isoCode: 'GB-WRT', center: [-2.5, 53.4], weight: 1 },
  { id: 'GB-WBK', countryCode: 'GBR', name: 'West Berkshire', isoCode: 'GB-WBK', center: [-1.3, 51.4], weight: 1 },
  { id: 'GB-WOK', countryCode: 'GBR', name: 'Wokingham', isoCode: 'GB-WOK', center: [-0.9, 51.4], weight: 1 },
  { id: 'GB-BRC', countryCode: 'GBR', name: 'Bracknell Forest', isoCode: 'GB-BRC', center: [-0.8, 51.4], weight: 1 },
  { id: 'GB-WNM', countryCode: 'GBR', name: 'Royal Borough of Windsor and Maidenhead', isoCode: 'GB-WNM', center: [-0.7, 51.5], weight: 1 },
  { id: 'GB-SLG', countryCode: 'GBR', name: 'Slough', isoCode: 'GB-SLG', center: [-0.6, 51.5], weight: 1 },
  { id: 'GB-RDG', countryCode: 'GBR', name: 'Reading', isoCode: 'GB-RDG', center: [-1, 51.5], weight: 1 },
  { id: 'GB-SRY', countryCode: 'GBR', name: 'Surrey', isoCode: 'GB-SRY', center: [-0.3, 51.3], weight: 1 },
  { id: 'GB-BBD', countryCode: 'GBR', name: 'Blackburn with Darwen', isoCode: 'GB-BBD', center: [-2.4, 53.6], weight: 1 },
  { id: 'GB-SWD', countryCode: 'GBR', name: 'Swindon', isoCode: 'GB-SWD', center: [-1.7, 51.6], weight: 1 },
  { id: 'GB-BAS', countryCode: 'GBR', name: 'Bath and North East Somerset', isoCode: 'GB-BAS', center: [-2.5, 51.4], weight: 1 },
  { id: 'GB-WIL', countryCode: 'GBR', name: 'Wiltshire', isoCode: 'GB-WIL', center: [-1.9, 51.3], weight: 1 },
  { id: 'GB-CLD', countryCode: 'GBR', name: 'Calderdale', isoCode: 'GB-CLD', center: [-2, 53.7], weight: 1 },
  { id: 'GB-KIR', countryCode: 'GBR', name: 'Kirklees', isoCode: 'GB-KIR', center: [-1.8, 53.6], weight: 1 },
  { id: 'GB-NGM', countryCode: 'GBR', name: 'Nottingham', isoCode: 'GB-NGM', center: [-1.2, 52.9], weight: 1 },
  { id: 'GB-LCE', countryCode: 'GBR', name: 'Leicester', isoCode: 'GB-LCE', center: [-1.1, 52.6], weight: 1 },
  { id: 'GB-DER', countryCode: 'GBR', name: 'Derby', isoCode: 'GB-DER', center: [-1.4, 52.8], weight: 1 },
  { id: 'GB-LDS', countryCode: 'GBR', name: 'Leeds', isoCode: 'GB-LDS', center: [-1.5, 53.8], weight: 1 },
  { id: 'GB-BRD', countryCode: 'GBR', name: 'Bradford', isoCode: 'GB-BRD', center: [-1.8, 53.8], weight: 1 },
  { id: 'GB-WKF', countryCode: 'GBR', name: 'Wakefield', isoCode: 'GB-WKF', center: [-1.4, 53.6], weight: 1 },
  { id: 'GB-BNS', countryCode: 'GBR', name: 'Barnsley', isoCode: 'GB-BNS', center: [-1.6, 53.5], weight: 1 },
  { id: 'GB-SLF', countryCode: 'GBR', name: 'Salford', isoCode: 'GB-SLF', center: [-2.4, 53.5], weight: 1 },
  { id: 'GB-BOL', countryCode: 'GBR', name: 'Bolton', isoCode: 'GB-BOL', center: [-2.5, 53.6], weight: 1 },
  { id: 'GB-TRF', countryCode: 'GBR', name: 'Trafford', isoCode: 'GB-TRF', center: [-2.4, 53.4], weight: 1 },
  { id: 'GB-OLD', countryCode: 'GBR', name: 'Oldham', isoCode: 'GB-OLD', center: [-2.1, 53.5], weight: 1 },
  { id: 'GB-RCH', countryCode: 'GBR', name: 'Rochdale', isoCode: 'GB-RCH', center: [-2.1, 53.6], weight: 1 },
  { id: 'GB-TAM', countryCode: 'GBR', name: 'Tameside', isoCode: 'GB-TAM', center: [-2.1, 53.5], weight: 1 },
  { id: 'GB-BUR', countryCode: 'GBR', name: 'Bury', isoCode: 'GB-BUR', center: [-2.3, 53.6], weight: 1 },
  { id: 'GB-SOL', countryCode: 'GBR', name: 'Solihull', isoCode: 'GB-SOL', center: [-1.7, 52.4], weight: 1 },
  { id: 'GB-COV', countryCode: 'GBR', name: 'Coventry', isoCode: 'GB-COV', center: [-1.6, 52.4], weight: 1 },
  { id: 'GB-BIR', countryCode: 'GBR', name: 'Birmingham', isoCode: 'GB-BIR', center: [-1.9, 52.5], weight: 1 },
  { id: 'GB-SAW', countryCode: 'GBR', name: 'Sandwell', isoCode: 'GB-SAW', center: [-2, 52.5], weight: 1 },
  { id: 'GB-DUD', countryCode: 'GBR', name: 'Dudley', isoCode: 'GB-DUD', center: [-2.1, 52.5], weight: 1 },
  { id: 'GB-WLL', countryCode: 'GBR', name: 'Walsall', isoCode: 'GB-WLL', center: [-2, 52.6], weight: 1 },
  { id: 'GB-WLV', countryCode: 'GBR', name: 'Wolverhampton', isoCode: 'GB-WLV', center: [-2.1, 52.6], weight: 1 },
  // DEU
  { id: 'DE-SN', countryCode: 'DEU', name: 'Sachsen', isoCode: 'DE-SN', center: [13.2, 51], weight: 1 },
  { id: 'DE-RP', countryCode: 'DEU', name: 'Rheinland-Pfalz', isoCode: 'DE-RP', center: [7.3, 50], weight: 1 },
  { id: 'DE-SL', countryCode: 'DEU', name: 'Saarland', isoCode: 'DE-SL', center: [6.8, 49.4], weight: 1 },
  { id: 'DE-SH', countryCode: 'DEU', name: 'Schleswig-Holstein', isoCode: 'DE-SH', center: [9.3, 54.3], weight: 1 },
  { id: 'DE-NI', countryCode: 'DEU', name: 'Niedersachsen', isoCode: 'DE-NI', center: [8.4, 53.1], weight: 1 },
  { id: 'DE-BW', countryCode: 'DEU', name: 'Baden-Württemberg', isoCode: 'DE-BW', center: [9.1, 48.6], weight: 1 },
  { id: 'DE-BB', countryCode: 'DEU', name: 'Brandenburg', isoCode: 'DE-BB', center: [13.3, 52.6], weight: 1 },
  { id: 'DE-MV', countryCode: 'DEU', name: 'Mecklenburg-Vorpommern', isoCode: 'DE-MV', center: [12.7, 53.9], weight: 1 },
  { id: 'DE-HB', countryCode: 'DEU', name: 'Bremen', isoCode: 'DE-HB', center: [8.6, 53.3], weight: 1 },
  { id: 'DE-HE', countryCode: 'DEU', name: 'Hessen', isoCode: 'DE-HE', center: [9.1, 50.6], weight: 1 },
  { id: 'DE-TH', countryCode: 'DEU', name: 'Thüringen', isoCode: 'DE-TH', center: [11.1, 50.9], weight: 1 },
  { id: 'DE-ST', countryCode: 'DEU', name: 'Sachsen-Anhalt', isoCode: 'DE-ST', center: [11.7, 51.9], weight: 1 },
  // FRA
  { id: 'FR-GF', countryCode: 'FRA', name: 'Guyane française', isoCode: 'FR-GF', center: [-53.3, 3.8], weight: 1 },
  { id: 'FR-08', countryCode: 'FRA', name: 'Ardennes', isoCode: 'FR-08', center: [4.7, 49.6], weight: 1 },
  { id: 'FR-02', countryCode: 'FRA', name: 'Aisne', isoCode: 'FR-02', center: [3.7, 49.6], weight: 1 },
  { id: 'FR-55', countryCode: 'FRA', name: 'Meuse', isoCode: 'FR-55', center: [5.4, 49.1], weight: 1 },
  { id: 'FR-54', countryCode: 'FRA', name: 'Meurthe-et-Moselle', isoCode: 'FR-54', center: [6.1, 48.9], weight: 1 },
  { id: 'FR-57', countryCode: 'FRA', name: 'Moselle', isoCode: 'FR-57', center: [6.8, 49], weight: 1 },
  { id: 'FR-04', countryCode: 'FRA', name: 'Alpes-de-Haute-Provence', isoCode: 'FR-04', center: [6.3, 44.2], weight: 1 },
  { id: 'FR-05', countryCode: 'FRA', name: 'Hautes-Alpes', isoCode: 'FR-05', center: [6.4, 44.7], weight: 1 },
  { id: 'FR-73', countryCode: 'FRA', name: 'Savoie', isoCode: 'FR-73', center: [6.4, 45.5], weight: 1 },
  { id: 'FR-74', countryCode: 'FRA', name: 'Haute-Savoie', isoCode: 'FR-74', center: [6.5, 46], weight: 1 },
  { id: 'FR-64', countryCode: 'FRA', name: 'Pyrénées-Atlantiques', isoCode: 'FR-64', center: [-0.6, 43.3], weight: 1 },
  { id: 'FR-65', countryCode: 'FRA', name: 'Hautes-Pyrénées', isoCode: 'FR-65', center: [0, 43.2], weight: 1 },
  { id: 'FR-09', countryCode: 'FRA', name: 'Ariège', isoCode: 'FR-09', center: [1.5, 42.8], weight: 1 },
  { id: 'FR-66', countryCode: 'FRA', name: 'Pyrénées-Orientales', isoCode: 'FR-66', center: [2.3, 42.6], weight: 1 },
  { id: 'FR-67', countryCode: 'FRA', name: 'Bas-Rhin', isoCode: 'FR-67', center: [7.5, 48.7], weight: 1 },
  { id: 'FR-68', countryCode: 'FRA', name: 'Haute-Rhin', isoCode: 'FR-68', center: [7.3, 47.8], weight: 1 },
  { id: 'FR-90', countryCode: 'FRA', name: 'Territoire de Belfort', isoCode: 'FR-90', center: [6.9, 47.6], weight: 1 },
  { id: 'FR-25', countryCode: 'FRA', name: 'Doubs', isoCode: 'FR-25', center: [6.4, 47.1], weight: 1 },
  { id: 'FR-01', countryCode: 'FRA', name: 'Ain', isoCode: 'FR-01', center: [5.5, 46.1], weight: 1 },
  { id: 'FR-39', countryCode: 'FRA', name: 'Jura', isoCode: 'FR-39', center: [5.7, 46.7], weight: 1 },
  { id: 'FR-83', countryCode: 'FRA', name: 'Var', isoCode: 'FR-83', center: [6.3, 43.4], weight: 1 },
  { id: 'FR-30', countryCode: 'FRA', name: 'Gard', isoCode: 'FR-30', center: [4, 43.9], weight: 1 },
  { id: 'FR-34', countryCode: 'FRA', name: 'Hérault', isoCode: 'FR-34', center: [3.4, 43.6], weight: 1 },
  { id: 'FR-11', countryCode: 'FRA', name: 'Aude', isoCode: 'FR-11', center: [2.5, 43.1], weight: 1 },
  { id: 'FR-40', countryCode: 'FRA', name: 'Landes', isoCode: 'FR-40', center: [-0.7, 43.9], weight: 1 },
  { id: 'FR-17', countryCode: 'FRA', name: 'Charente-Maritime', isoCode: 'FR-17', center: [-0.8, 45.8], weight: 1 },
  { id: 'FR-85', countryCode: 'FRA', name: 'Vendée', isoCode: 'FR-85', center: [-1.7, 46.7], weight: 1 },
  { id: 'FR-56', countryCode: 'FRA', name: 'Morbihan', isoCode: 'FR-56', center: [-2.9, 47.7], weight: 1 },
  { id: 'FR-29', countryCode: 'FRA', name: 'Finistère', isoCode: 'FR-29', center: [-4.2, 48.2], weight: 1 },
  { id: 'FR-22', countryCode: 'FRA', name: 'Côtes-d\'Armor', isoCode: 'FR-22', center: [-2.8, 48.5], weight: 1 },
  { id: 'FR-35', countryCode: 'FRA', name: 'Ille-et-Vilaine', isoCode: 'FR-35', center: [-1.7, 48.2], weight: 1 },
  { id: 'FR-50', countryCode: 'FRA', name: 'Manche', isoCode: 'FR-50', center: [-1.3, 49], weight: 1 },
  { id: 'FR-14', countryCode: 'FRA', name: 'Calvados', isoCode: 'FR-14', center: [-0.5, 49.1], weight: 1 },
  { id: 'FR-27', countryCode: 'FRA', name: 'Eure', isoCode: 'FR-27', center: [1, 49.2], weight: 1 },
  { id: 'FR-76', countryCode: 'FRA', name: 'Seine-Maritime', isoCode: 'FR-76', center: [0.9, 49.6], weight: 1 },
  { id: 'FR-80', countryCode: 'FRA', name: 'Somme', isoCode: 'FR-80', center: [2.2, 50], weight: 1 },
  { id: 'FR-62', countryCode: 'FRA', name: 'Pas-de-Calais', isoCode: 'FR-62', center: [2.5, 50.4], weight: 1 },
  { id: 'FR-MQ', countryCode: 'FRA', name: 'Martinique', isoCode: 'FR-MQ', center: [-61, 14.6], weight: 1 },
  { id: 'FR-GP', countryCode: 'FRA', name: 'Guadeloupe', isoCode: 'FR-GP', center: [-61.4, 16.1], weight: 1 },
  { id: 'FR-RE', countryCode: 'FRA', name: 'La Réunion', isoCode: 'FR-RE', center: [55.5, -21.1], weight: 1 },
  { id: 'FR-YT', countryCode: 'FRA', name: 'Mayotte', isoCode: 'FR-YT', center: [45.2, -12.8], weight: 1 },
  { id: 'FR-2B', countryCode: 'FRA', name: 'Haute-Corse', isoCode: 'FR-2B', center: [9.2, 42.5], weight: 1 },
  { id: 'FR-2A', countryCode: 'FRA', name: 'Corse-du-Sud', isoCode: 'FR-2A', center: [9, 41.9], weight: 1 },
  { id: 'FR-32', countryCode: 'FRA', name: 'Gers', isoCode: 'FR-32', center: [0.4, 43.6], weight: 1 },
  { id: 'FR-87', countryCode: 'FRA', name: 'Haute-Vienne', isoCode: 'FR-87', center: [1.2, 45.9], weight: 1 },
  { id: 'FR-19', countryCode: 'FRA', name: 'Corrèze', isoCode: 'FR-19', center: [1.9, 45.4], weight: 1 },
  { id: 'FR-82', countryCode: 'FRA', name: 'Tarn-et-Garonne', isoCode: 'FR-82', center: [1.3, 44.2], weight: 1 },
  { id: 'FR-81', countryCode: 'FRA', name: 'Tarn', isoCode: 'FR-81', center: [2.2, 43.8], weight: 1 },
  { id: 'FR-38', countryCode: 'FRA', name: 'Isère', isoCode: 'FR-38', center: [5.5, 45.3], weight: 1 },
  { id: 'FR-26', countryCode: 'FRA', name: 'Drôme', isoCode: 'FR-26', center: [5.2, 44.6], weight: 1 },
  { id: 'FR-12', countryCode: 'FRA', name: 'Aveyron', isoCode: 'FR-12', center: [2.6, 44.3], weight: 1 },
  { id: 'FR-46', countryCode: 'FRA', name: 'Lot', isoCode: 'FR-46', center: [1.7, 44.6], weight: 1 },
  { id: 'FR-37', countryCode: 'FRA', name: 'Indre-et-Loire', isoCode: 'FR-37', center: [0.8, 47.2], weight: 1 },
  { id: 'FR-36', countryCode: 'FRA', name: 'Indre', isoCode: 'FR-36', center: [1.6, 46.8], weight: 1 },
  { id: 'FR-41', countryCode: 'FRA', name: 'Loir-et-Cher', isoCode: 'FR-41', center: [1.5, 47.6], weight: 1 },
  { id: 'FR-23', countryCode: 'FRA', name: 'Creuse', isoCode: 'FR-23', center: [2.1, 46], weight: 1 },
  { id: 'FR-53', countryCode: 'FRA', name: 'Mayenne', isoCode: 'FR-53', center: [-0.6, 48.1], weight: 1 },
  { id: 'FR-72', countryCode: 'FRA', name: 'Sarthe', isoCode: 'FR-72', center: [0.2, 48], weight: 1 },
  { id: 'FR-84', countryCode: 'FRA', name: 'Vaucluse', isoCode: 'FR-84', center: [5.1, 44.1], weight: 1 },
  { id: 'FR-52', countryCode: 'FRA', name: 'Haute-Marne', isoCode: 'FR-52', center: [5.2, 48.1], weight: 1 },
  { id: 'FR-51', countryCode: 'FRA', name: 'Marne', isoCode: 'FR-51', center: [4.4, 48.9], weight: 1 },
  { id: 'FR-24', countryCode: 'FRA', name: 'Dordogne', isoCode: 'FR-24', center: [0.6, 45.1], weight: 1 },
  { id: 'FR-88', countryCode: 'FRA', name: 'Vosges', isoCode: 'FR-88', center: [6.4, 48.2], weight: 1 },
  { id: 'FR-07', countryCode: 'FRA', name: 'Ardèche', isoCode: 'FR-07', center: [4.5, 44.8], weight: 1 },
  { id: 'FR-42', countryCode: 'FRA', name: 'Loire', isoCode: 'FR-42', center: [4.2, 45.8], weight: 1 },
  { id: 'FR-63', countryCode: 'FRA', name: 'Puy-de-Dôme', isoCode: 'FR-63', center: [3.1, 45.7], weight: 1 },
  { id: 'FR-03', countryCode: 'FRA', name: 'Allier', isoCode: 'FR-03', center: [3.2, 46.4], weight: 1 },
  { id: 'FR-45', countryCode: 'FRA', name: 'Loiret', isoCode: 'FR-45', center: [2.3, 47.9], weight: 1 },
  { id: 'FR-49', countryCode: 'FRA', name: 'Maine-et-Loire', isoCode: 'FR-49', center: [-0.7, 47.4], weight: 1 },
  { id: 'FR-10', countryCode: 'FRA', name: 'Aube', isoCode: 'FR-10', center: [4.2, 48.3], weight: 1 },
  { id: 'FR-92', countryCode: 'FRA', name: 'Hauts-de-Seine', isoCode: 'FR-92', center: [2.3, 48.9], weight: 1 },
  { id: 'FR-93', countryCode: 'FRA', name: 'Seine-Saint-Denis', isoCode: 'FR-93', center: [2.4, 48.9], weight: 1 },
  { id: 'FR-95', countryCode: 'FRA', name: 'Val-d\'Oise', isoCode: 'FR-95', center: [2.2, 49], weight: 1 },
  { id: 'FR-78', countryCode: 'FRA', name: 'Yvelines', isoCode: 'FR-78', center: [1.9, 48.8], weight: 1 },
  { id: 'FR-16', countryCode: 'FRA', name: 'Charente', isoCode: 'FR-16', center: [0.1, 45.7], weight: 1 },
  { id: 'FR-18', countryCode: 'FRA', name: 'Cher', isoCode: 'FR-18', center: [2.3, 47], weight: 1 },
  { id: 'FR-28', countryCode: 'FRA', name: 'Eure-et-Loir', isoCode: 'FR-28', center: [1.2, 48.4], weight: 1 },
  { id: 'FR-43', countryCode: 'FRA', name: 'Haute-Loire', isoCode: 'FR-43', center: [3.7, 45.2], weight: 1 },
  { id: 'FR-15', countryCode: 'FRA', name: 'Cantal', isoCode: 'FR-15', center: [2.8, 45], weight: 1 },
  { id: 'FR-47', countryCode: 'FRA', name: 'Lot-et-Garonne', isoCode: 'FR-47', center: [0.4, 44.4], weight: 1 },
  { id: 'FR-48', countryCode: 'FRA', name: 'Lozère', isoCode: 'FR-48', center: [3.5, 44.6], weight: 1 },
  { id: 'FR-58', countryCode: 'FRA', name: 'Nièvre', isoCode: 'FR-58', center: [3.6, 47.1], weight: 1 },
  { id: 'FR-21', countryCode: 'FRA', name: 'Côte-d\'Or', isoCode: 'FR-21', center: [4.7, 47.5], weight: 1 },
  { id: 'FR-60', countryCode: 'FRA', name: 'Oise', isoCode: 'FR-60', center: [2.5, 49.5], weight: 1 },
  { id: 'FR-61', countryCode: 'FRA', name: 'Orne', isoCode: 'FR-61', center: [0, 48.6], weight: 1 },
  { id: 'FR-70', countryCode: 'FRA', name: 'Haute-Saône', isoCode: 'FR-70', center: [6.1, 47.6], weight: 1 },
  { id: 'FR-71', countryCode: 'FRA', name: 'Saône-et-Loire', isoCode: 'FR-71', center: [4.5, 46.6], weight: 1 },
  { id: 'FR-79', countryCode: 'FRA', name: 'Deux-Sèvres', isoCode: 'FR-79', center: [-0.4, 46.5], weight: 1 },
  { id: 'FR-86', countryCode: 'FRA', name: 'Vienne', isoCode: 'FR-86', center: [0.5, 46.6], weight: 1 },
  { id: 'FR-89', countryCode: 'FRA', name: 'Yonne', isoCode: 'FR-89', center: [3.5, 47.8], weight: 1 },
  { id: 'FR-91', countryCode: 'FRA', name: 'Essonne', isoCode: 'FR-91', center: [2.2, 48.6], weight: 1 },
  { id: 'FR-77', countryCode: 'FRA', name: 'Seien-et-Marne', isoCode: 'FR-77', center: [2.8, 48.6], weight: 1 },
  { id: 'FR-94', countryCode: 'FRA', name: 'Val-de-Marne', isoCode: 'FR-94', center: [2.5, 48.8], weight: 1 },
  // ESP
  { id: 'ES-CE', countryCode: 'ESP', name: 'Ceuta', isoCode: 'ES-CE', center: [-5.3, 35.8], weight: 1 },
  { id: 'ES-ML', countryCode: 'ESP', name: 'Melilla', isoCode: 'ES-ML', center: [-2.9, 35.3], weight: 1 },
  { id: 'ES-NA', countryCode: 'ESP', name: 'Navarra', isoCode: 'ES-NA', center: [-1.5, 42.6], weight: 1 },
  { id: 'ES-SS', countryCode: 'ESP', name: 'Gipuzkoa', isoCode: 'ES-SS', center: [-2.1, 43.2], weight: 1 },
  { id: 'ES-HU', countryCode: 'ESP', name: 'Huesca', isoCode: 'ES-HU', center: [-0.2, 42.2], weight: 1 },
  { id: 'ES-L', countryCode: 'ESP', name: 'Lérida', isoCode: 'ES-L', center: [1.1, 42.1], weight: 1 },
  { id: 'ES-BA', countryCode: 'ESP', name: 'Badajoz', isoCode: 'ES-BA', center: [-6.2, 38.8], weight: 1 },
  { id: 'ES-CA', countryCode: 'ESP', name: 'Cádiz', isoCode: 'ES-CA', center: [-5.7, 36.6], weight: 1 },
  { id: 'ES-OR', countryCode: 'ESP', name: 'Orense', isoCode: 'ES-OR', center: [-7.6, 42.2], weight: 1 },
  { id: 'ES-CC', countryCode: 'ESP', name: 'Cáceres', isoCode: 'ES-CC', center: [-6.3, 39.7], weight: 1 },
  { id: 'ES-SA', countryCode: 'ESP', name: 'Salamanca', isoCode: 'ES-SA', center: [-6, 40.8], weight: 1 },
  { id: 'ES-ZA', countryCode: 'ESP', name: 'Zamora', isoCode: 'ES-ZA', center: [-6, 41.7], weight: 1 },
  { id: 'ES-PO', countryCode: 'ESP', name: 'Pontevedra', isoCode: 'ES-PO', center: [-8.5, 42.4], weight: 1 },
  { id: 'ES-H', countryCode: 'ESP', name: 'Huelva', isoCode: 'ES-H', center: [-6.7, 37.7], weight: 1 },
  { id: 'ES-CS', countryCode: 'ESP', name: 'Castellón', isoCode: 'ES-CS', center: [-0.1, 40.3], weight: 1 },
  { id: 'ES-AL', countryCode: 'ESP', name: 'Almería', isoCode: 'ES-AL', center: [-2.3, 37.3], weight: 1 },
  { id: 'ES-GR', countryCode: 'ESP', name: 'Granada', isoCode: 'ES-GR', center: [-3.2, 37.3], weight: 1 },
  { id: 'ES-C', countryCode: 'ESP', name: 'La Coruña', isoCode: 'ES-C', center: [-8.4, 43.1], weight: 1 },
  { id: 'ES-LU', countryCode: 'ESP', name: 'Lugo', isoCode: 'ES-LU', center: [-7.5, 43], weight: 1 },
  { id: 'ES-O', countryCode: 'ESP', name: 'Asturias', isoCode: 'ES-O', center: [-6.1, 43.3], weight: 1 },
  { id: 'ES-S', countryCode: 'ESP', name: 'Cantabria', isoCode: 'ES-S', center: [-3.9, 43.2], weight: 1 },
  { id: 'ES-TF', countryCode: 'ESP', name: 'Santa Cruz de Tenerife', isoCode: 'ES-TF', center: [-17.3, 28.2], weight: 1 },
  { id: 'ES-GC', countryCode: 'ESP', name: 'Las Palmas', isoCode: 'ES-GC', center: [-14.3, 28.6], weight: 1 },
  { id: 'ES-PM', countryCode: 'ESP', name: 'Baleares', isoCode: 'ES-PM', center: [2.8, 39.4], weight: 1 },
  { id: 'ES-LO', countryCode: 'ESP', name: 'La Rioja', isoCode: 'ES-LO', center: [-2.4, 42.3], weight: 1 },
  { id: 'ES-VI', countryCode: 'ESP', name: 'Álava', isoCode: 'ES-VI', center: [-2.7, 42.8], weight: 1 },
  { id: 'ES-AB', countryCode: 'ESP', name: 'Albacete', isoCode: 'ES-AB', center: [-1.9, 38.8], weight: 1 },
  { id: 'ES-TE', countryCode: 'ESP', name: 'Teruel', isoCode: 'ES-TE', center: [-0.8, 40.6], weight: 1 },
  { id: 'ES-CU', countryCode: 'ESP', name: 'Cuenca', isoCode: 'ES-CU', center: [-2.1, 39.9], weight: 1 },
  { id: 'ES-TO', countryCode: 'ESP', name: 'Toledo', isoCode: 'ES-TO', center: [-4.3, 39.8], weight: 1 },
  { id: 'ES-LE', countryCode: 'ESP', name: 'León', isoCode: 'ES-LE', center: [-5.7, 42.6], weight: 1 },
  { id: 'ES-SO', countryCode: 'ESP', name: 'Soria', isoCode: 'ES-SO', center: [-2.4, 41.6], weight: 1 },
  { id: 'ES-BU', countryCode: 'ESP', name: 'Burgos', isoCode: 'ES-BU', center: [-3.5, 42.4], weight: 1 },
  { id: 'ES-AV', countryCode: 'ESP', name: 'Ávila', isoCode: 'ES-AV', center: [-4.8, 40.5], weight: 1 },
  { id: 'ES-P', countryCode: 'ESP', name: 'Palencia', isoCode: 'ES-P', center: [-4.4, 42.3], weight: 1 },
  { id: 'ES-CR', countryCode: 'ESP', name: 'Ciudad Real', isoCode: 'ES-CR', center: [-3.9, 39], weight: 1 },
  { id: 'ES-CO', countryCode: 'ESP', name: 'Córdoba', isoCode: 'ES-CO', center: [-4.7, 37.8], weight: 1 },
  { id: 'ES-GU', countryCode: 'ESP', name: 'Guadalajara', isoCode: 'ES-GU', center: [-2.6, 40.7], weight: 1 },
  { id: 'ES-J', countryCode: 'ESP', name: 'Jaén', isoCode: 'ES-J', center: [-3.4, 38.1], weight: 1 },
  { id: 'ES-SG', countryCode: 'ESP', name: 'Segovia', isoCode: 'ES-SG', center: [-4.1, 41.1], weight: 1 },
  { id: 'ES-VA', countryCode: 'ESP', name: 'Valladolid', isoCode: 'ES-VA', center: [-5, 41.8], weight: 1 },
  // ITA
  { id: 'IT-AO', countryCode: 'ITA', name: 'Aoste', isoCode: 'IT-AO', center: [7.4, 45.8], weight: 1 },
  { id: 'IT-VB', countryCode: 'ITA', name: 'Verbano-Cusio-Ossola', isoCode: 'IT-VB', center: [8.2, 46], weight: 1 },
  { id: 'IT-VA', countryCode: 'ITA', name: 'Varese', isoCode: 'IT-VA', center: [8.8, 45.8], weight: 1 },
  { id: 'IT-CO', countryCode: 'ITA', name: 'Como', isoCode: 'IT-CO', center: [9.2, 45.9], weight: 1 },
  { id: 'IT-SO', countryCode: 'ITA', name: 'Sondrio', isoCode: 'IT-SO', center: [9.9, 46.3], weight: 1 },
  { id: 'IT-BZ', countryCode: 'ITA', name: 'Bozen', isoCode: 'IT-BZ', center: [11.3, 46.7], weight: 1 },
  { id: 'IT-IM', countryCode: 'ITA', name: 'Imperia', isoCode: 'IT-IM', center: [7.8, 43.9], weight: 1 },
  { id: 'IT-CN', countryCode: 'ITA', name: 'Cuneo', isoCode: 'IT-CN', center: [7.6, 44.4], weight: 1 },
  { id: 'IT-RN', countryCode: 'ITA', name: 'Rimini', isoCode: 'IT-RN', center: [12.4, 43.9], weight: 1 },
  { id: 'IT-PU', countryCode: 'ITA', name: 'Pesaro e Urbino', isoCode: 'IT-PU', center: [12.5, 43.7], weight: 1 },
  { id: 'IT-BL', countryCode: 'ITA', name: 'Belluno', isoCode: 'IT-BL', center: [12.2, 46.3], weight: 1 },
  { id: 'IT-UD', countryCode: 'ITA', name: 'Udine', isoCode: 'IT-UD', center: [13.1, 46.2], weight: 1 },
  { id: 'IT-GO', countryCode: 'ITA', name: 'Gorizia', isoCode: 'IT-GO', center: [13.5, 45.9], weight: 1 },
  { id: 'IT-TS', countryCode: 'ITA', name: 'Trieste', isoCode: 'IT-TS', center: [13.7, 45.7], weight: 1 },
  { id: 'IT-PD', countryCode: 'ITA', name: 'Padova', isoCode: 'IT-PD', center: [11.9, 45.4], weight: 1 },
  { id: 'IT-RO', countryCode: 'ITA', name: 'Rovigo', isoCode: 'IT-RO', center: [12, 45], weight: 1 },
  { id: 'IT-FE', countryCode: 'ITA', name: 'Ferrara', isoCode: 'IT-FE', center: [11.8, 44.8], weight: 1 },
  { id: 'IT-RA', countryCode: 'ITA', name: 'Ravenna', isoCode: 'IT-RA', center: [12, 44.4], weight: 1 },
  { id: 'IT-FC', countryCode: 'ITA', name: 'Forlì-Cesena', isoCode: 'IT-FC', center: [12.2, 44.1], weight: 1 },
  { id: 'IT-AN', countryCode: 'ITA', name: 'Ancona', isoCode: 'IT-AN', center: [13.2, 43.5], weight: 1 },
  { id: 'IT-MC', countryCode: 'ITA', name: 'Macerata', isoCode: 'IT-MC', center: [13.3, 43.2], weight: 1 },
  { id: 'IT-FM', countryCode: 'ITA', name: 'Fermo', isoCode: 'IT-FM', center: [13.6, 43.1], weight: 1 },
  { id: 'IT-AP', countryCode: 'ITA', name: 'Ascoli Piceno', isoCode: 'IT-AP', center: [13.5, 42.9], weight: 1 },
  { id: 'IT-TE', countryCode: 'ITA', name: 'Teramo', isoCode: 'IT-TE', center: [13.7, 42.7], weight: 1 },
  { id: 'IT-PE', countryCode: 'ITA', name: 'Pescara', isoCode: 'IT-PE', center: [14, 42.4], weight: 1 },
  { id: 'IT-CH', countryCode: 'ITA', name: 'Chieti', isoCode: 'IT-CH', center: [14.3, 42.1], weight: 1 },
  { id: 'IT-CB', countryCode: 'ITA', name: 'Campobasso', isoCode: 'IT-CB', center: [14.8, 41.7], weight: 1 },
  { id: 'IT-FG', countryCode: 'ITA', name: 'Foggia', isoCode: 'IT-FG', center: [15.5, 41.6], weight: 1 },
  { id: 'IT-BT', countryCode: 'ITA', name: 'Barletta-Andria Trani', isoCode: 'IT-BT', center: [16.1, 41.2], weight: 1 },
  { id: 'IT-BA', countryCode: 'ITA', name: 'Bari', isoCode: 'IT-BA', center: [16.7, 41], weight: 1 },
  { id: 'IT-BR', countryCode: 'ITA', name: 'Brindisi', isoCode: 'IT-BR', center: [17.6, 40.7], weight: 1 },
  { id: 'IT-LE', countryCode: 'ITA', name: 'Lecce', isoCode: 'IT-LE', center: [18.1, 40.2], weight: 1 },
  { id: 'IT-TA', countryCode: 'ITA', name: 'Taranto', isoCode: 'IT-TA', center: [17.3, 40.5], weight: 1 },
  { id: 'IT-MT', countryCode: 'ITA', name: 'Matera', isoCode: 'IT-MT', center: [16.3, 40.5], weight: 1 },
  { id: 'IT-CS', countryCode: 'ITA', name: 'Cosenza', isoCode: 'IT-CS', center: [16.3, 39.7], weight: 1 },
  { id: 'IT-KR', countryCode: 'ITA', name: 'Crotene', isoCode: 'IT-KR', center: [16.9, 39.2], weight: 1 },
  { id: 'IT-CZ', countryCode: 'ITA', name: 'Catanzaro', isoCode: 'IT-CZ', center: [16.5, 38.9], weight: 1 },
  { id: 'IT-RC', countryCode: 'ITA', name: 'Reggio Calabria', isoCode: 'IT-RC', center: [16.1, 38.3], weight: 1 },
  { id: 'IT-VV', countryCode: 'ITA', name: 'Vibo Valentia', isoCode: 'IT-VV', center: [16.1, 38.6], weight: 1 },
  { id: 'IT-PZ', countryCode: 'ITA', name: 'Potenza', isoCode: 'IT-PZ', center: [16, 40.4], weight: 1 },
  { id: 'IT-SA', countryCode: 'ITA', name: 'Salerno', isoCode: 'IT-SA', center: [15.2, 40.4], weight: 1 },
  { id: 'IT-CE', countryCode: 'ITA', name: 'Caserta', isoCode: 'IT-CE', center: [14.1, 41.2], weight: 1 },
  { id: 'IT-LT', countryCode: 'ITA', name: 'Latina', isoCode: 'IT-LT', center: [13.3, 41.2], weight: 1 },
  { id: 'IT-VT', countryCode: 'ITA', name: 'Viterbo', isoCode: 'IT-VT', center: [12, 42.5], weight: 1 },
  { id: 'IT-GR', countryCode: 'ITA', name: 'Grosseto', isoCode: 'IT-GR', center: [11.1, 42.6], weight: 1 },
  { id: 'IT-LI', countryCode: 'ITA', name: 'Livorno', isoCode: 'IT-LI', center: [10.3, 42.9], weight: 1 },
  { id: 'IT-PI', countryCode: 'ITA', name: 'Pisa', isoCode: 'IT-PI', center: [10.6, 43.5], weight: 1 },
  { id: 'IT-LU', countryCode: 'ITA', name: 'Lucca', isoCode: 'IT-LU', center: [10.5, 44], weight: 1 },
  { id: 'IT-MS', countryCode: 'ITA', name: 'Massa-Carrara', isoCode: 'IT-MS', center: [10, 44.2], weight: 1 },
  { id: 'IT-SP', countryCode: 'ITA', name: 'La Spezia', isoCode: 'IT-SP', center: [9.8, 44.2], weight: 1 },
  { id: 'IT-GE', countryCode: 'ITA', name: 'Genova', isoCode: 'IT-GE', center: [9.1, 44.4], weight: 1 },
  { id: 'IT-SV', countryCode: 'ITA', name: 'Savona', isoCode: 'IT-SV', center: [8.3, 44.3], weight: 1 },
  { id: 'IT-TP', countryCode: 'ITA', name: 'Trapani', isoCode: 'IT-TP', center: [12.51, 37.88], weight: 1 },
  { id: 'IT-ME', countryCode: 'ITA', name: 'Messina', isoCode: 'IT-ME', center: [15.55, 38.19], weight: 1 },
  { id: 'IT-AG', countryCode: 'ITA', name: 'Agrigento', isoCode: 'IT-AG', center: [13.58, 37.31], weight: 1 },
  { id: 'IT-CL', countryCode: 'ITA', name: 'Caltanissetta', isoCode: 'IT-CL', center: [14.1, 37.4], weight: 1 },
  { id: 'IT-RG', countryCode: 'ITA', name: 'Ragusa', isoCode: 'IT-RG', center: [14.7, 36.9], weight: 1 },
  { id: 'IT-SR', countryCode: 'ITA', name: 'Siracusa', isoCode: 'IT-SR', center: [15.1, 37.1], weight: 1 },
  { id: 'IT-CT', countryCode: 'ITA', name: 'Catania', isoCode: 'IT-CT', center: [14.8, 37.5], weight: 1 },
  { id: 'IT-CI', countryCode: 'ITA', name: 'Carbonia-Iglesias', isoCode: 'IT-CI', center: [8.5, 39.2], weight: 1 },
  { id: 'IT-SS', countryCode: 'ITA', name: 'Sassari', isoCode: 'IT-SS', center: [8.6, 40.7], weight: 1 },
  { id: 'IT-NU', countryCode: 'ITA', name: 'Nuoro', isoCode: 'IT-NU', center: [9.2, 40.3], weight: 1 },
  { id: 'IT-OT', countryCode: 'ITA', name: 'Olbia-Tempio', isoCode: 'IT-OT', center: [9.3, 41], weight: 1 },
  { id: 'IT-OR', countryCode: 'ITA', name: 'Oristrano', isoCode: 'IT-OR', center: [8.7, 40], weight: 1 },
  { id: 'IT-VS', countryCode: 'ITA', name: 'Medio Campidano', isoCode: 'IT-VS', center: [8.6, 39.6], weight: 1 },
  { id: 'IT-CA', countryCode: 'ITA', name: 'Cagliari', isoCode: 'IT-CA', center: [9.1, 39.4], weight: 1 },
  { id: 'IT-OG', countryCode: 'ITA', name: 'Ogliastra', isoCode: 'IT-OG', center: [9.5, 40], weight: 1 },
  { id: 'IT-EN', countryCode: 'ITA', name: 'Enna', isoCode: 'IT-EN', center: [14.5, 37.6], weight: 1 },
  { id: 'IT-BN', countryCode: 'ITA', name: 'Benevento', isoCode: 'IT-BN', center: [14.7, 41.2], weight: 1 },
  { id: 'IT-AT', countryCode: 'ITA', name: 'Asti', isoCode: 'IT-AT', center: [8.2, 44.8], weight: 1 },
  { id: 'IT-BG', countryCode: 'ITA', name: 'Bergamo', isoCode: 'IT-BG', center: [9.8, 45.8], weight: 1 },
  { id: 'IT-BS', countryCode: 'ITA', name: 'Brescia', isoCode: 'IT-BS', center: [10.3, 45.7], weight: 1 },
  { id: 'IT-CR', countryCode: 'ITA', name: 'Cremona', isoCode: 'IT-CR', center: [10, 45.3], weight: 1 },
  { id: 'IT-MN', countryCode: 'ITA', name: 'Mantova', isoCode: 'IT-MN', center: [10.7, 45.1], weight: 1 },
  { id: 'IT-LC', countryCode: 'ITA', name: 'Lecco', isoCode: 'IT-LC', center: [9.4, 45.9], weight: 1 },
  { id: 'IT-MB', countryCode: 'ITA', name: 'Monza e Brianza', isoCode: 'IT-MB', center: [9.3, 45.7], weight: 1 },
  { id: 'IT-LO', countryCode: 'ITA', name: 'Lodi', isoCode: 'IT-LO', center: [9.5, 45.3], weight: 1 },
  { id: 'IT-SI', countryCode: 'ITA', name: 'Siena', isoCode: 'IT-SI', center: [11.6, 43.2], weight: 1 },
  { id: 'IT-AR', countryCode: 'ITA', name: 'Arezzo', isoCode: 'IT-AR', center: [12, 43.6], weight: 1 },
  { id: 'IT-VC', countryCode: 'ITA', name: 'Vercelli', isoCode: 'IT-VC', center: [8.2, 45.5], weight: 1 },
  { id: 'IT-PV', countryCode: 'ITA', name: 'Pavia', isoCode: 'IT-PV', center: [9, 45.1], weight: 1 },
  { id: 'IT-RI', countryCode: 'ITA', name: 'Rieti', isoCode: 'IT-RI', center: [13, 42.4], weight: 1 },
  { id: 'IT-NO', countryCode: 'ITA', name: 'Novara', isoCode: 'IT-NO', center: [8.5, 45.6], weight: 1 },
  { id: 'IT-AL', countryCode: 'ITA', name: 'Alessandria', isoCode: 'IT-AL', center: [8.6, 44.9], weight: 1 },
  { id: 'IT-TN', countryCode: 'ITA', name: 'Trento', isoCode: 'IT-TN', center: [11.2, 46.2], weight: 1 },
  { id: 'IT-VI', countryCode: 'ITA', name: 'Vicenza', isoCode: 'IT-VI', center: [11.5, 45.7], weight: 1 },
  { id: 'IT-VR', countryCode: 'ITA', name: 'Verona', isoCode: 'IT-VR', center: [11, 45.5], weight: 1 },
  { id: 'IT-TV', countryCode: 'ITA', name: 'Treviso', isoCode: 'IT-TV', center: [12.3, 45.8], weight: 1 },
  { id: 'IT-PC', countryCode: 'ITA', name: 'Piacenza', isoCode: 'IT-PC', center: [9.6, 44.9], weight: 1 },
  { id: 'IT-PR', countryCode: 'ITA', name: 'Parma', isoCode: 'IT-PR', center: [10, 44.7], weight: 1 },
  { id: 'IT-RE', countryCode: 'ITA', name: 'Reggio Emilia', isoCode: 'IT-RE', center: [10.5, 44.6], weight: 1 },
  { id: 'IT-MO', countryCode: 'ITA', name: 'Modena', isoCode: 'IT-MO', center: [10.9, 44.5], weight: 1 },
  { id: 'IT-PT', countryCode: 'ITA', name: 'Pistoia', isoCode: 'IT-PT', center: [10.8, 44], weight: 1 },
  { id: 'IT-TR', countryCode: 'ITA', name: 'Terni', isoCode: 'IT-TR', center: [12.4, 42.7], weight: 1 },
  { id: 'IT-PG', countryCode: 'ITA', name: 'Perugia', isoCode: 'IT-PG', center: [12.5, 43.1], weight: 1 },
  { id: 'IT-FR', countryCode: 'ITA', name: 'Frosinone', isoCode: 'IT-FR', center: [13.5, 41.6], weight: 1 },
  { id: 'IT-AV', countryCode: 'ITA', name: 'Avellino', isoCode: 'IT-AV', center: [14.9, 41], weight: 1 },
  { id: 'IT-AQ', countryCode: 'ITA', name: 'L\'Aquila', isoCode: 'IT-AQ', center: [13.5, 42.2], weight: 1 },
  { id: 'IT-PN', countryCode: 'ITA', name: 'Pordenone', isoCode: 'IT-PN', center: [12.6, 46.1], weight: 1 },
  { id: 'IT-IS', countryCode: 'ITA', name: 'Isernia', isoCode: 'IT-IS', center: [14.3, 41.7], weight: 1 },
  { id: 'IT-BI', countryCode: 'ITA', name: 'Biella', isoCode: 'IT-BI', center: [8, 45.6], weight: 1 },
  { id: 'IT-PO', countryCode: 'ITA', name: 'Prato', isoCode: 'IT-PO', center: [11.1, 44], weight: 1 },
  // RUS
  { id: 'RU-AL', countryCode: 'RUS', name: 'Gorno-Altay', isoCode: 'RU-AL', center: [87.2, 50.8], weight: 1 },
  { id: 'RU-PSK', countryCode: 'RUS', name: 'Pskov', isoCode: 'RU-PSK', center: [29.5, 57.1], weight: 1 },
  { id: 'RU-KC', countryCode: 'RUS', name: 'Karachay-Cherkess', isoCode: 'RU-KC', center: [41.7, 43.8], weight: 1 },
  { id: 'RU-KB', countryCode: 'RUS', name: 'Kabardin-Balkar', isoCode: 'RU-KB', center: [43.4, 43.5], weight: 1 },
  { id: 'RU-SE', countryCode: 'RUS', name: 'North Ossetia', isoCode: 'RU-SE', center: [44.3, 43.2], weight: 1 },
  { id: 'RU-IN', countryCode: 'RUS', name: 'Ingush', isoCode: 'RU-IN', center: [44.8, 43], weight: 1 },
  { id: 'RU-CE', countryCode: 'RUS', name: 'Chechnya', isoCode: 'RU-CE', center: [45.7, 43.3], weight: 1 },
  { id: 'RU-DA', countryCode: 'RUS', name: 'Dagestan', isoCode: 'RU-DA', center: [46.7, 43.3], weight: 1 },
  { id: 'RU-MUR', countryCode: 'RUS', name: 'Murmansk', isoCode: 'RU-MUR', center: [34, 68.5], weight: 1 },
  { id: 'RU-KR', countryCode: 'RUS', name: 'Karelia', isoCode: 'RU-KR', center: [33.7, 64], weight: 1 },
  { id: 'RU-LEN', countryCode: 'RUS', name: 'Leningrad', isoCode: 'RU-LEN', center: [30.8, 60], weight: 1 },
  { id: 'RU-KGD', countryCode: 'RUS', name: 'Kaliningrad', isoCode: 'RU-KGD', center: [21.4, 54.9], weight: 1 },
  { id: 'RU-SMO', countryCode: 'RUS', name: 'Smolensk', isoCode: 'RU-SMO', center: [32.9, 54.9], weight: 1 },
  { id: 'RU-BRY', countryCode: 'RUS', name: 'Bryansk', isoCode: 'RU-BRY', center: [33.5, 52.9], weight: 1 },
  { id: 'RU-KRS', countryCode: 'RUS', name: 'Kursk', isoCode: 'RU-KRS', center: [36.3, 51.7], weight: 1 },
  { id: 'RU-BEL', countryCode: 'RUS', name: 'Belgorod', isoCode: 'RU-BEL', center: [37.5, 50.7], weight: 1 },
  { id: 'RU-VOR', countryCode: 'RUS', name: 'Voronezh', isoCode: 'RU-VOR', center: [40, 51], weight: 1 },
  { id: 'RU-ROS', countryCode: 'RUS', name: 'Rostov', isoCode: 'RU-ROS', center: [41.3, 47.7], weight: 1 },
  { id: 'RU-BU', countryCode: 'RUS', name: 'Buryat', isoCode: 'RU-BU', center: [108.5, 53.4], weight: 1 },
  { id: 'RU-TY', countryCode: 'RUS', name: 'Tuva', isoCode: 'RU-TY', center: [94.4, 51.7], weight: 1 },
  { id: 'RU-ZAB', countryCode: 'RUS', name: 'Chita', isoCode: 'RU-ZAB', center: [116, 53.3], weight: 1 },
  { id: 'RU-AMU', countryCode: 'RUS', name: 'Amur', isoCode: 'RU-AMU', center: [127.9, 53.7], weight: 1 },
  { id: 'RU-YEV', countryCode: 'RUS', name: 'Yevrey', isoCode: 'RU-YEV', center: [132.5, 48.6], weight: 1 },
  { id: 'RU-KHA', countryCode: 'RUS', name: 'Khabarovsk', isoCode: 'RU-KHA', center: [137.3, 54.7], weight: 1 },
  { id: 'RU-PRI', countryCode: 'RUS', name: 'Primor\'ye', isoCode: 'RU-PRI', center: [134.3, 45], weight: 1 },
  { id: 'RU-TYU', countryCode: 'RUS', name: 'Tyumen\'', isoCode: 'RU-TYU', center: [69.6, 57.4], weight: 1 },
  { id: 'RU-KGN', countryCode: 'RUS', name: 'Kurgan', isoCode: 'RU-KGN', center: [64.9, 55.5], weight: 1 },
  { id: 'RU-ALT', countryCode: 'RUS', name: 'Altay', isoCode: 'RU-ALT', center: [83.1, 52.7], weight: 1 },
  { id: 'RU-ORE', countryCode: 'RUS', name: 'Orenburg', isoCode: 'RU-ORE', center: [55.8, 52], weight: 1 },
  { id: 'RU-SAR', countryCode: 'RUS', name: 'Saratov', isoCode: 'RU-SAR', center: [47.1, 51.5], weight: 1 },
  { id: 'RU-AST', countryCode: 'RUS', name: 'Astrakhan\'', isoCode: 'RU-AST', center: [47.3, 47], weight: 1 },
  { id: 'RU-VGG', countryCode: 'RUS', name: 'Volgograd', isoCode: 'RU-VGG', center: [44.4, 49.5], weight: 1 },
  { id: 'RU-MAG', countryCode: 'RUS', name: 'Maga Buryatdan', isoCode: 'RU-MAG', center: [154, 62.2], weight: 1 },
  { id: 'RU-SAK', countryCode: 'RUS', name: 'Sakhalin', isoCode: 'RU-SAK', center: [143, 50.7], weight: 1 },
  { id: 'RU-CHU', countryCode: 'RUS', name: 'Chukchi Autonomous Okrug', isoCode: 'RU-CHU', center: [166, 66], weight: 1 },
  { id: 'RU-YAN', countryCode: 'RUS', name: 'Yamal-Nenets', isoCode: 'RU-YAN', center: [70, 66.5], weight: 1 },
  { id: 'RU-NEN', countryCode: 'RUS', name: 'Nenets', isoCode: 'RU-NEN', center: [53.6, 68.4], weight: 1 },
  { id: 'RU-SA', countryCode: 'RUS', name: 'Sakha (Yakutia)', isoCode: 'RU-SA', center: [134.2, 68.6], weight: 1 },
  { id: 'RU-ARK', countryCode: 'RUS', name: 'Arkhangel\'sk', isoCode: 'RU-ARK', center: [42, 63], weight: 1 },
  { id: 'RU-KL', countryCode: 'RUS', name: 'Kalmyk', isoCode: 'RU-KL', center: [44.8, 46.6], weight: 1 },
  { id: 'RU-KAM', countryCode: 'RUS', name: 'Kamchatka', isoCode: 'RU-KAM', center: [159, 56], weight: 1 },
  { id: 'RU-X01~', countryCode: 'RUS', name: '', isoCode: 'RU-X01~', center: [67.4, 68.8], weight: 1 },
  { id: 'RU-BA', countryCode: 'RUS', name: 'Bashkortostan', isoCode: 'RU-BA', center: [57, 54.5], weight: 1 },
  { id: 'RU-KHM', countryCode: 'RUS', name: 'Khanty-Mansiy', isoCode: 'RU-KHM', center: [70.8, 62.1], weight: 1 },
  { id: 'RU-LIP', countryCode: 'RUS', name: 'Lipetsk', isoCode: 'RU-LIP', center: [39, 52.7], weight: 1 },
  { id: 'RU-TAM', countryCode: 'RUS', name: 'Tambov', isoCode: 'RU-TAM', center: [41.5, 52.7], weight: 1 },
  { id: 'RU-TOM', countryCode: 'RUS', name: 'Tomsk', isoCode: 'RU-TOM', center: [82.6, 58.5], weight: 1 },
  { id: 'RU-ULY', countryCode: 'RUS', name: 'Ul\'yanovsk', isoCode: 'RU-ULY', center: [48.1, 53.9], weight: 1 },
  { id: 'RU-PNZ', countryCode: 'RUS', name: 'Penza', isoCode: 'RU-PNZ', center: [44.5, 53.2], weight: 1 },
  { id: 'RU-KEM', countryCode: 'RUS', name: 'Kemerovo', isoCode: 'RU-KEM', center: [87.3, 54.7], weight: 1 },
  { id: 'RU-ORL', countryCode: 'RUS', name: 'Orel', isoCode: 'RU-ORL', center: [36.5, 52.8], weight: 1 },
  { id: 'RU-IRK', countryCode: 'RUS', name: 'Irkutsk', isoCode: 'RU-IRK', center: [107.5, 58.1], weight: 1 },
  { id: 'RU-KK', countryCode: 'RUS', name: 'Khakass', isoCode: 'RU-KK', center: [89.6, 53.4], weight: 1 },
  { id: 'RU-MO', countryCode: 'RUS', name: 'Mordovia', isoCode: 'RU-MO', center: [44.1, 54.4], weight: 1 },
  { id: 'RU-KLU', countryCode: 'RUS', name: 'Kaluga', isoCode: 'RU-KLU', center: [35.5, 54.3], weight: 1 },
  { id: 'RU-KOS', countryCode: 'RUS', name: 'Kostroma', isoCode: 'RU-KOS', center: [43.8, 58.5], weight: 1 },
  { id: 'RU-YAR', countryCode: 'RUS', name: 'Yaroslavl\'', isoCode: 'RU-YAR', center: [38.9, 57.8], weight: 1 },
  { id: 'RU-VLA', countryCode: 'RUS', name: 'Vladimir', isoCode: 'RU-VLA', center: [40.5, 56.1], weight: 1 },
  { id: 'RU-RYA', countryCode: 'RUS', name: 'Ryazan\'', isoCode: 'RU-RYA', center: [40.9, 54.3], weight: 1 },
  { id: 'RU-IVA', countryCode: 'RUS', name: 'Ivanovo', isoCode: 'RU-IVA', center: [41.9, 57.1], weight: 1 },
  { id: 'RU-NIZ', countryCode: 'RUS', name: 'Nizhegorod', isoCode: 'RU-NIZ', center: [44.7, 56.3], weight: 1 },
  { id: 'RU-TUL', countryCode: 'RUS', name: 'Tula', isoCode: 'RU-TUL', center: [37.6, 53.9], weight: 1 },
  { id: 'RU-CU', countryCode: 'RUS', name: 'Chuvash', isoCode: 'RU-CU', center: [47.2, 55.5], weight: 1 },
  { id: 'RU-VLG', countryCode: 'RUS', name: 'Vologda', isoCode: 'RU-VLG', center: [40.7, 60], weight: 1 },
  { id: 'RU-NGR', countryCode: 'RUS', name: 'Novgorod', isoCode: 'RU-NGR', center: [32.7, 58.3], weight: 1 },
  { id: 'RU-TVE', countryCode: 'RUS', name: 'Tver\'', isoCode: 'RU-TVE', center: [34.9, 57.1], weight: 1 },
  { id: 'RU-MOS', countryCode: 'RUS', name: 'Moskovskaya', isoCode: 'RU-MOS', center: [37.5, 55.6], weight: 1 },
  { id: 'RU-ME', countryCode: 'RUS', name: 'Mariy-El', isoCode: 'RU-ME', center: [48.1, 56.6], weight: 1 },
  { id: 'RU-KIR', countryCode: 'RUS', name: 'Kirov', isoCode: 'RU-KIR', center: [49.7, 58.5], weight: 1 },
  { id: 'RU-UD', countryCode: 'RUS', name: 'Udmurt', isoCode: 'RU-UD', center: [52.9, 56.9], weight: 1 },
  { id: 'RU-KO', countryCode: 'RUS', name: 'Komi', isoCode: 'RU-KO', center: [55, 63.6], weight: 1 },
  { id: 'RU-PER', countryCode: 'RUS', name: 'Perm\'', isoCode: 'RU-PER', center: [55.8, 58.9], weight: 1 },
  { id: 'RU-STA', countryCode: 'RUS', name: 'Stavropol\'', isoCode: 'RU-STA', center: [43.3, 44.8], weight: 1 },
  { id: 'RU-AD', countryCode: 'RUS', name: 'Adygey', isoCode: 'RU-AD', center: [39.9, 44.7], weight: 1 },
  // TUR
  { id: 'TR-75', countryCode: 'TUR', name: 'Ardahan', isoCode: 'TR-75', center: [42.8, 41.1], weight: 1 },
  { id: 'TR-08', countryCode: 'TUR', name: 'Artvin', isoCode: 'TR-08', center: [41.8, 41.1], weight: 1 },
  { id: 'TR-73', countryCode: 'TUR', name: 'Sirnak', isoCode: 'TR-73', center: [42.5, 37.4], weight: 1 },
  { id: 'TR-30', countryCode: 'TUR', name: 'Hakkari', isoCode: 'TR-30', center: [44.1, 37.4], weight: 1 },
  { id: 'TR-76', countryCode: 'TUR', name: 'Iğdir', isoCode: 'TR-76', center: [44, 39.8], weight: 1 },
  { id: 'TR-04', countryCode: 'TUR', name: 'Agri', isoCode: 'TR-04', center: [43.3, 39.5], weight: 1 },
  { id: 'TR-65', countryCode: 'TUR', name: 'Van', isoCode: 'TR-65', center: [43.5, 38.7], weight: 1 },
  { id: 'TR-39', countryCode: 'TUR', name: 'Kirklareli', isoCode: 'TR-39', center: [27.6, 41.7], weight: 1 },
  { id: 'TR-22', countryCode: 'TUR', name: 'Edirne', isoCode: 'TR-22', center: [26.6, 41.3], weight: 1 },
  { id: 'TR-36', countryCode: 'TUR', name: 'Kars', isoCode: 'TR-36', center: [43.1, 40.5], weight: 1 },
  { id: 'TR-47', countryCode: 'TUR', name: 'Mardin', isoCode: 'TR-47', center: [41.1, 37.3], weight: 1 },
  { id: 'TR-63', countryCode: 'TUR', name: 'Sanliurfa', isoCode: 'TR-63', center: [39, 37.3], weight: 1 },
  { id: 'TR-79', countryCode: 'TUR', name: 'Kilis', isoCode: 'TR-79', center: [37.1, 36.8], weight: 1 },
  { id: 'TR-27', countryCode: 'TUR', name: 'Gaziantep', isoCode: 'TR-27', center: [37.3, 37.1], weight: 1 },
  { id: 'TR-31', countryCode: 'TUR', name: 'Hatay', isoCode: 'TR-31', center: [36.3, 36.5], weight: 1 },
  { id: 'TR-59', countryCode: 'TUR', name: 'Tekirdag', isoCode: 'TR-59', center: [27.4, 41.1], weight: 1 },
  { id: 'TR-17', countryCode: 'TUR', name: 'Çanakkale', isoCode: 'TR-17', center: [26.5, 40.1], weight: 1 },
  { id: 'TR-53', countryCode: 'TUR', name: 'Rize', isoCode: 'TR-53', center: [40.8, 40.9], weight: 1 },
  { id: 'TR-61', countryCode: 'TUR', name: 'Trabzon', isoCode: 'TR-61', center: [39.7, 40.8], weight: 1 },
  { id: 'TR-28', countryCode: 'TUR', name: 'Giresun', isoCode: 'TR-28', center: [38.6, 40.6], weight: 1 },
  { id: 'TR-52', countryCode: 'TUR', name: 'Ordu', isoCode: 'TR-52', center: [37.5, 40.8], weight: 1 },
  { id: 'TR-55', countryCode: 'TUR', name: 'Samsun', isoCode: 'TR-55', center: [36, 41.2], weight: 1 },
  { id: 'TR-57', countryCode: 'TUR', name: 'Sinop', isoCode: 'TR-57', center: [34.8, 41.6], weight: 1 },
  { id: 'TR-37', countryCode: 'TUR', name: 'Kastamonu', isoCode: 'TR-37', center: [33.6, 41.4], weight: 1 },
  { id: 'TR-74', countryCode: 'TUR', name: 'Bartın', isoCode: 'TR-74', center: [32.4, 41.6], weight: 1 },
  { id: 'TR-67', countryCode: 'TUR', name: 'Zinguldak', isoCode: 'TR-67', center: [31.8, 41.2], weight: 1 },
  { id: 'TR-81', countryCode: 'TUR', name: 'Düzce', isoCode: 'TR-81', center: [31.3, 40.9], weight: 1 },
  { id: 'TR-54', countryCode: 'TUR', name: 'Sakarya', isoCode: 'TR-54', center: [30.4, 40.7], weight: 1 },
  { id: 'TR-41', countryCode: 'TUR', name: 'Kocaeli', isoCode: 'TR-41', center: [29.8, 40.9], weight: 1 },
  { id: 'TR-77', countryCode: 'TUR', name: 'Yalova', isoCode: 'TR-77', center: [29.1, 40.6], weight: 1 },
  { id: 'TR-10', countryCode: 'TUR', name: 'Balikesir', isoCode: 'TR-10', center: [27.7, 40], weight: 1 },
  { id: 'TR-09', countryCode: 'TUR', name: 'Aydin', isoCode: 'TR-09', center: [27.9, 37.7], weight: 1 },
  { id: 'TR-48', countryCode: 'TUR', name: 'Mugla', isoCode: 'TR-48', center: [28.3, 36.9], weight: 1 },
  { id: 'TR-33', countryCode: 'TUR', name: 'Mersin', isoCode: 'TR-33', center: [34, 36.7], weight: 1 },
  { id: 'TR-14', countryCode: 'TUR', name: 'Bolu', isoCode: 'TR-14', center: [31.6, 40.6], weight: 1 },
  { id: 'TR-11', countryCode: 'TUR', name: 'Bilecik', isoCode: 'TR-11', center: [30.2, 40.1], weight: 1 },
  { id: 'TR-26', countryCode: 'TUR', name: 'Eskisehir', isoCode: 'TR-26', center: [31, 39.6], weight: 1 },
  { id: 'TR-18', countryCode: 'TUR', name: 'Çankiri', isoCode: 'TR-18', center: [33.4, 40.7], weight: 1 },
  { id: 'TR-78', countryCode: 'TUR', name: 'Karabük', isoCode: 'TR-78', center: [32.7, 41.2], weight: 1 },
  { id: 'TR-60', countryCode: 'TUR', name: 'Tokat', isoCode: 'TR-60', center: [36.5, 40.4], weight: 1 },
  { id: 'TR-58', countryCode: 'TUR', name: 'Sivas', isoCode: 'TR-58', center: [37.5, 39.7], weight: 1 },
  { id: 'TR-19', countryCode: 'TUR', name: 'Çorum', isoCode: 'TR-19', center: [34.6, 40.7], weight: 1 },
  { id: 'TR-05', countryCode: 'TUR', name: 'Amasya', isoCode: 'TR-05', center: [35.7, 40.7], weight: 1 },
  { id: 'TR-43', countryCode: 'TUR', name: 'Kütahya', isoCode: 'TR-43', center: [29.6, 39.3], weight: 1 },
  { id: 'TR-70', countryCode: 'TUR', name: 'Karaman', isoCode: 'TR-70', center: [33.3, 37], weight: 1 },
  { id: 'TR-51', countryCode: 'TUR', name: 'Nigde', isoCode: 'TR-51', center: [34.7, 37.8], weight: 1 },
  { id: 'TR-38', countryCode: 'TUR', name: 'Kayseri', isoCode: 'TR-38', center: [35.7, 38.5], weight: 1 },
  { id: 'TR-32', countryCode: 'TUR', name: 'Isparta', isoCode: 'TR-32', center: [30.9, 37.9], weight: 1 },
  { id: 'TR-45', countryCode: 'TUR', name: 'Manisa', isoCode: 'TR-45', center: [28.2, 38.7], weight: 1 },
  { id: 'TR-20', countryCode: 'TUR', name: 'Denizli', isoCode: 'TR-20', center: [29.3, 37.8], weight: 1 },
  { id: 'TR-15', countryCode: 'TUR', name: 'Burdur', isoCode: 'TR-15', center: [30.1, 37.5], weight: 1 },
  { id: 'TR-68', countryCode: 'TUR', name: 'Aksaray', isoCode: 'TR-68', center: [34, 38.6], weight: 1 },
  { id: 'TR-50', countryCode: 'TUR', name: 'Nevsehir', isoCode: 'TR-50', center: [34.6, 38.8], weight: 1 },
  { id: 'TR-66', countryCode: 'TUR', name: 'Yozgat', isoCode: 'TR-66', center: [35.2, 39.8], weight: 1 },
  { id: 'TR-40', countryCode: 'TUR', name: 'Kirsehir', isoCode: 'TR-40', center: [34.2, 39.3], weight: 1 },
  { id: 'TR-64', countryCode: 'TUR', name: 'Usak', isoCode: 'TR-64', center: [29.5, 38.6], weight: 1 },
  { id: 'TR-24', countryCode: 'TUR', name: 'Erzincan', isoCode: 'TR-24', center: [39.4, 39.7], weight: 1 },
  { id: 'TR-62', countryCode: 'TUR', name: 'Tunceli', isoCode: 'TR-62', center: [39.6, 39.2], weight: 1 },
  { id: 'TR-03', countryCode: 'TUR', name: 'Afyonkarahisar', isoCode: 'TR-03', center: [30.6, 38.7], weight: 1 },
  { id: 'TR-71', countryCode: 'TUR', name: 'Kinkkale', isoCode: 'TR-71', center: [33.7, 39.9], weight: 1 },
  { id: 'TR-46', countryCode: 'TUR', name: 'K. Maras', isoCode: 'TR-46', center: [37, 37.9], weight: 1 },
  { id: 'TR-49', countryCode: 'TUR', name: 'Mus', isoCode: 'TR-49', center: [41.8, 39.1], weight: 1 },
  { id: 'TR-25', countryCode: 'TUR', name: 'Erzurum', isoCode: 'TR-25', center: [41.5, 40], weight: 1 },
  { id: 'TR-44', countryCode: 'TUR', name: 'Malatya', isoCode: 'TR-44', center: [38.2, 38.5], weight: 1 },
  { id: 'TR-23', countryCode: 'TUR', name: 'Elazig', isoCode: 'TR-23', center: [39.5, 38.8], weight: 1 },
  { id: 'TR-13', countryCode: 'TUR', name: 'Bitlis', isoCode: 'TR-13', center: [42.4, 38.6], weight: 1 },
  { id: 'TR-12', countryCode: 'TUR', name: 'Bingöl', isoCode: 'TR-12', center: [40.6, 39.1], weight: 1 },
  { id: 'TR-80', countryCode: 'TUR', name: 'Osmaniye', isoCode: 'TR-80', center: [36.3, 37.3], weight: 1 },
  { id: 'TR-02', countryCode: 'TUR', name: 'Adiyaman', isoCode: 'TR-02', center: [38.3, 37.8], weight: 1 },
  { id: 'TR-72', countryCode: 'TUR', name: 'Batman', isoCode: 'TR-72', center: [41.4, 38.1], weight: 1 },
  { id: 'TR-56', countryCode: 'TUR', name: 'Siirt', isoCode: 'TR-56', center: [42.4, 37.9], weight: 1 },
  { id: 'TR-69', countryCode: 'TUR', name: 'Bayburt', isoCode: 'TR-69', center: [40.3, 40.3], weight: 1 },
  { id: 'TR-29', countryCode: 'TUR', name: 'Gümüshane', isoCode: 'TR-29', center: [39.3, 40.4], weight: 1 },
  // IND
  { id: 'IN-LA', countryCode: 'IND', name: 'Ladakh', isoCode: 'IN-LA', center: [77.8, 33.8], weight: 1 },
  { id: 'IN-AR', countryCode: 'IND', name: 'Arunachal Pradesh', isoCode: 'IN-AR', center: [94.7, 28], weight: 1 },
  { id: 'IN-SK', countryCode: 'IND', name: 'Sikkim', isoCode: 'IN-SK', center: [88.5, 27.5], weight: 1 },
  { id: 'IN-WB', countryCode: 'IND', name: 'West Bengal', isoCode: 'IN-WB', center: [88.2, 23.9], weight: 1 },
  { id: 'IN-AS', countryCode: 'IND', name: 'Assam', isoCode: 'IN-AS', center: [92.5, 26.2], weight: 1 },
  { id: 'IN-UT', countryCode: 'IND', name: 'Uttarakhand', isoCode: 'IN-UT', center: [79.2, 30.1], weight: 1 },
  { id: 'IN-NL', countryCode: 'IND', name: 'Nagaland', isoCode: 'IN-NL', center: [94.5, 26.1], weight: 1 },
  { id: 'IN-MN', countryCode: 'IND', name: 'Manipur', isoCode: 'IN-MN', center: [93.9, 24.9], weight: 1 },
  { id: 'IN-MZ', countryCode: 'IND', name: 'Mizoram', isoCode: 'IN-MZ', center: [92.8, 23.3], weight: 1 },
  { id: 'IN-TR', countryCode: 'IND', name: 'Tripura', isoCode: 'IN-TR', center: [91.8, 23.8], weight: 1 },
  { id: 'IN-ML', countryCode: 'IND', name: 'Meghalaya', isoCode: 'IN-ML', center: [91.3, 25.6], weight: 1 },
  { id: 'IN-PB', countryCode: 'IND', name: 'Punjab', isoCode: 'IN-PB', center: [75.5, 31], weight: 1 },
  { id: 'IN-RJ', countryCode: 'IND', name: 'Rajasthan', isoCode: 'IN-RJ', center: [74.6, 26.1], weight: 1 },
  { id: 'IN-GJ', countryCode: 'IND', name: 'Gujarat', isoCode: 'IN-GJ', center: [71.6, 22.6], weight: 1 },
  { id: 'IN-HP', countryCode: 'IND', name: 'Himachal Pradesh', isoCode: 'IN-HP', center: [77.5, 31.9], weight: 1 },
  { id: 'IN-JK', countryCode: 'IND', name: 'Jammu and Kashmir', isoCode: 'IN-JK', center: [75, 33.5], weight: 1 },
  { id: 'IN-BR', countryCode: 'IND', name: 'Bihar', isoCode: 'IN-BR', center: [85.7, 25.9], weight: 1 },
  { id: 'IN-UP', countryCode: 'IND', name: 'Uttar Pradesh', isoCode: 'IN-UP', center: [80.5, 26.7], weight: 1 },
  { id: 'IN-AP', countryCode: 'IND', name: 'Andhra Pradesh', isoCode: 'IN-AP', center: [80.1, 15.7], weight: 1 },
  { id: 'IN-OR', countryCode: 'IND', name: 'Odisha', isoCode: 'IN-OR', center: [84.2, 20.4], weight: 1 },
  { id: 'IN-DH', countryCode: 'IND', name: 'Dadra and Nagar Haveli and Daman and Diu', isoCode: 'IN-DH', center: [73.0, 20.3], weight: 1 },
  { id: 'IN-GA', countryCode: 'IND', name: 'Goa', isoCode: 'IN-GA', center: [74, 15.3], weight: 1 },
  { id: 'IN-KL', countryCode: 'IND', name: 'Kerala', isoCode: 'IN-KL', center: [76.4, 10.7], weight: 1 },
  { id: 'IN-PY', countryCode: 'IND', name: 'Puducherry', isoCode: 'IN-PY', center: [79.3, 12.9], weight: 1 },
  { id: 'IN-LD', countryCode: 'IND', name: 'Lakshadweep', isoCode: 'IN-LD', center: [73, 10.6], weight: 1 },
  { id: 'IN-AN', countryCode: 'IND', name: 'Andaman and Nicobar', isoCode: 'IN-AN', center: [93.2, 10.6], weight: 1 },
  { id: 'IN-JH', countryCode: 'IND', name: 'Jharkhand', isoCode: 'IN-JH', center: [85.7, 23.5], weight: 1 },
  { id: 'IN-CH', countryCode: 'IND', name: 'Chandigarh', isoCode: 'IN-CH', center: [76.8, 30.8], weight: 1 },
  { id: 'IN-MP', countryCode: 'IND', name: 'Madhya Pradesh', isoCode: 'IN-MP', center: [78.1, 23.9], weight: 1 },
  { id: 'IN-CT', countryCode: 'IND', name: 'Chhattisgarh', isoCode: 'IN-CT', center: [81.9, 21.2], weight: 1 },
  { id: 'IN-HR', countryCode: 'IND', name: 'Haryana', isoCode: 'IN-HR', center: [76.4, 29.2], weight: 1 },
  { id: 'IN-TG', countryCode: 'IND', name: 'Telangana', isoCode: 'IN-TG', center: [79.1, 17.8], weight: 1 },
  // CHN
  { id: 'CN-XJ', countryCode: 'CHN', name: 'Xinjiang', isoCode: 'CN-XJ', center: [84.1, 41.1], weight: 1 },
  { id: 'CN-XZ', countryCode: 'CHN', name: 'Xizang', isoCode: 'CN-XZ', center: [88.8, 31.3], weight: 1 },
  { id: 'CN-NM', countryCode: 'CHN', name: 'Inner Mongol', isoCode: 'CN-NM', center: [114.6, 44.2], weight: 1 },
  { id: 'CN-GS', countryCode: 'CHN', name: 'Gansu', isoCode: 'CN-GS', center: [102.2, 37.1], weight: 1 },
  { id: 'CN-YN', countryCode: 'CHN', name: 'Yunnan', isoCode: 'CN-YN', center: [101.7, 25.5], weight: 1 },
  { id: 'CN-HL', countryCode: 'CHN', name: 'Heilongjiang', isoCode: 'CN-HL', center: [127.4, 48.3], weight: 1 },
  { id: 'CN-JL', countryCode: 'CHN', name: 'Jilin', isoCode: 'CN-JL', center: [126.5, 43.6], weight: 1 },
  { id: 'CN-LN', countryCode: 'CHN', name: 'Liaoning', isoCode: 'CN-LN', center: [122.3, 40.7], weight: 1 },
  { id: 'CN-GX', countryCode: 'CHN', name: 'Guangxi', isoCode: 'CN-GX', center: [108.6, 23.8], weight: 1 },
  { id: 'CN-HI', countryCode: 'CHN', name: 'Hainan', isoCode: 'CN-HI', center: [109.9, 19.3], weight: 1 },
  { id: 'CN-FJ', countryCode: 'CHN', name: 'Fujian', isoCode: 'CN-FJ', center: [118.6, 25.8], weight: 1 },
  { id: 'CN-JS', countryCode: 'CHN', name: 'Jiangsu', isoCode: 'CN-JS', center: [119.3, 32.9], weight: 1 },
  { id: 'CN-SD', countryCode: 'CHN', name: 'Shandong', isoCode: 'CN-SD', center: [119.1, 36.7], weight: 1 },
  { id: 'CN-HE', countryCode: 'CHN', name: 'Hebei', isoCode: 'CN-HE', center: [116.4, 39.7], weight: 1 },
  { id: 'CN-TJ', countryCode: 'CHN', name: 'Tianjin', isoCode: 'CN-TJ', center: [117.4, 39.5], weight: 1 },
  { id: 'CN-X01~', countryCode: 'CHN', name: 'Paracel Islands', isoCode: 'CN-X01~', center: [112, 16.5], weight: 1 },
  { id: 'CN-SC', countryCode: 'CHN', name: 'Sichuan', isoCode: 'CN-SC', center: [103.1, 30.6], weight: 1 },
  { id: 'CN-CQ', countryCode: 'CHN', name: 'Chongqing', isoCode: 'CN-CQ', center: [107.9, 30], weight: 1 },
  { id: 'CN-GZ', countryCode: 'CHN', name: 'Guizhou', isoCode: 'CN-GZ', center: [106.8, 27], weight: 1 },
  { id: 'CN-HN', countryCode: 'CHN', name: 'Hunan', isoCode: 'CN-HN', center: [111.6, 27.4], weight: 1 },
  { id: 'CN-NX', countryCode: 'CHN', name: 'Ningxia', isoCode: 'CN-NX', center: [106.2, 37.1], weight: 1 },
  { id: 'CN-SN', countryCode: 'CHN', name: 'Shaanxi', isoCode: 'CN-SN', center: [108.8, 35.3], weight: 1 },
  { id: 'CN-QH', countryCode: 'CHN', name: 'Qinghai', isoCode: 'CN-QH', center: [96.6, 35.1], weight: 1 },
  { id: 'CN-SX', countryCode: 'CHN', name: 'Shanxi', isoCode: 'CN-SX', center: [112.5, 37.9], weight: 1 },
  { id: 'CN-JX', countryCode: 'CHN', name: 'Jiangxi', isoCode: 'CN-JX', center: [115.7, 27.5], weight: 1 },
  { id: 'CN-HA', countryCode: 'CHN', name: 'Henan', isoCode: 'CN-HA', center: [114.2, 34], weight: 1 },
  { id: 'CN-HB', countryCode: 'CHN', name: 'Hubei', isoCode: 'CN-HB', center: [111.9, 30.9], weight: 1 },
  { id: 'CN-AH', countryCode: 'CHN', name: 'Anhui', isoCode: 'CN-AH', center: [117.3, 32], weight: 1 },
  // JPN
  { id: 'JP-46', countryCode: 'JPN', name: 'Kagoshima', isoCode: 'JP-46', center: [130.56, 31.56], weight: 1 },
  { id: 'JP-44', countryCode: 'JPN', name: 'Ōita', isoCode: 'JP-44', center: [131.5, 33.2], weight: 1 },
  { id: 'JP-40', countryCode: 'JPN', name: 'Fukuoka', isoCode: 'JP-40', center: [130.5, 33.5], weight: 1 },
  { id: 'JP-41', countryCode: 'JPN', name: 'Saga', isoCode: 'JP-41', center: [130.1, 33.3], weight: 1 },
  { id: 'JP-42', countryCode: 'JPN', name: 'Nagasaki', isoCode: 'JP-42', center: [129.87, 32.75], weight: 1 },
  { id: 'JP-43', countryCode: 'JPN', name: 'Kumamoto', isoCode: 'JP-43', center: [130.4, 32.5], weight: 1 },
  { id: 'JP-45', countryCode: 'JPN', name: 'Miyazaki', isoCode: 'JP-45', center: [131.4, 32.3], weight: 1 },
  { id: 'JP-36', countryCode: 'JPN', name: 'Tokushima', isoCode: 'JP-36', center: [134.3, 33.9], weight: 1 },
  { id: 'JP-37', countryCode: 'JPN', name: 'Kagawa', isoCode: 'JP-37', center: [134.04, 34.34], weight: 1 },
  { id: 'JP-38', countryCode: 'JPN', name: 'Ehime', isoCode: 'JP-38', center: [132.9, 33.8], weight: 1 },
  { id: 'JP-39', countryCode: 'JPN', name: 'Kōchi', isoCode: 'JP-39', center: [133.53, 33.56], weight: 1 },
  { id: 'JP-32', countryCode: 'JPN', name: 'Shimane', isoCode: 'JP-32', center: [132.56, 35.07], weight: 1 },
  { id: 'JP-35', countryCode: 'JPN', name: 'Yamaguchi', isoCode: 'JP-35', center: [131.8, 34.1], weight: 1 },
  { id: 'JP-31', countryCode: 'JPN', name: 'Tottori', isoCode: 'JP-31', center: [133.8, 35.3], weight: 1 },
  { id: 'JP-28', countryCode: 'JPN', name: 'Hyōgo', isoCode: 'JP-28', center: [134.8, 35], weight: 1 },
  { id: 'JP-26', countryCode: 'JPN', name: 'Kyōto', isoCode: 'JP-26', center: [135.4, 35.3], weight: 1 },
  { id: 'JP-18', countryCode: 'JPN', name: 'Fukui', isoCode: 'JP-18', center: [136.1, 35.8], weight: 1 },
  { id: 'JP-17', countryCode: 'JPN', name: 'Ishikawa', isoCode: 'JP-17', center: [136.8, 36.8], weight: 1 },
  { id: 'JP-16', countryCode: 'JPN', name: 'Toyama', isoCode: 'JP-16', center: [137.2, 36.7], weight: 1 },
  { id: 'JP-15', countryCode: 'JPN', name: 'Niigata', isoCode: 'JP-15', center: [138.8, 37.5], weight: 1 },
  { id: 'JP-06', countryCode: 'JPN', name: 'Yamagata', isoCode: 'JP-06', center: [140, 38.3], weight: 1 },
  { id: 'JP-05', countryCode: 'JPN', name: 'Akita', isoCode: 'JP-05', center: [140.4, 39.7], weight: 1 },
  { id: 'JP-02', countryCode: 'JPN', name: 'Aomori', isoCode: 'JP-02', center: [140.74, 40.82], weight: 1 },
  { id: 'JP-03', countryCode: 'JPN', name: 'Iwate', isoCode: 'JP-03', center: [141.3, 39.5], weight: 1 },
  { id: 'JP-04', countryCode: 'JPN', name: 'Miyagi', isoCode: 'JP-04', center: [141.1, 38.5], weight: 1 },
  { id: 'JP-07', countryCode: 'JPN', name: 'Fukushima', isoCode: 'JP-07', center: [140.2, 37.4], weight: 1 },
  { id: 'JP-08', countryCode: 'JPN', name: 'Ibaraki', isoCode: 'JP-08', center: [140.3, 36.4], weight: 1 },
  { id: 'JP-12', countryCode: 'JPN', name: 'Chiba', isoCode: 'JP-12', center: [140.2, 35.6], weight: 1 },
  { id: 'JP-14', countryCode: 'JPN', name: 'Kanagawa', isoCode: 'JP-14', center: [139.4, 35.4], weight: 1 },
  { id: 'JP-22', countryCode: 'JPN', name: 'Shizuoka', isoCode: 'JP-22', center: [138.4, 35], weight: 1 },
  { id: 'JP-23', countryCode: 'JPN', name: 'Aichi', isoCode: 'JP-23', center: [137.1, 34.9], weight: 1 },
  { id: 'JP-24', countryCode: 'JPN', name: 'Mie', isoCode: 'JP-24', center: [136.5, 34.5], weight: 1 },
  { id: 'JP-30', countryCode: 'JPN', name: 'Wakayama', isoCode: 'JP-30', center: [135.6, 33.9], weight: 1 },
  { id: 'JP-33', countryCode: 'JPN', name: 'Okayama', isoCode: 'JP-33', center: [133.9, 34.9], weight: 1 },
  { id: 'JP-34', countryCode: 'JPN', name: 'Hiroshima', isoCode: 'JP-34', center: [132.7, 34.4], weight: 1 },
  { id: 'JP-47', countryCode: 'JPN', name: 'Okinawa', isoCode: 'JP-47', center: [127.68, 26.34], weight: 1 },
  { id: 'JP-10', countryCode: 'JPN', name: 'Gunma', isoCode: 'JP-10', center: [139, 36.5], weight: 1 },
  { id: 'JP-20', countryCode: 'JPN', name: 'Nagano', isoCode: 'JP-20', center: [138.1, 36.1], weight: 1 },
  { id: 'JP-09', countryCode: 'JPN', name: 'Tochigi', isoCode: 'JP-09', center: [139.8, 36.7], weight: 1 },
  { id: 'JP-21', countryCode: 'JPN', name: 'Gifu', isoCode: 'JP-21', center: [137, 35.8], weight: 1 },
  { id: 'JP-25', countryCode: 'JPN', name: 'Shiga', isoCode: 'JP-25', center: [136.2, 35.2], weight: 1 },
  { id: 'JP-11', countryCode: 'JPN', name: 'Saitama', isoCode: 'JP-11', center: [139.3, 36], weight: 1 },
  { id: 'JP-19', countryCode: 'JPN', name: 'Yamanashi', isoCode: 'JP-19', center: [138.6, 35.6], weight: 1 },
  { id: 'JP-29', countryCode: 'JPN', name: 'Nara', isoCode: 'JP-29', center: [135.9, 34.3], weight: 1 },
  // KOR
  { id: 'KR-42', countryCode: 'KOR', name: 'Gangwon', isoCode: 'KR-42', center: [128.4, 37.5], weight: 1 },
  { id: 'KR-44', countryCode: 'KOR', name: 'South Chungcheong', isoCode: 'KR-44', center: [126.9, 36.4], weight: 1 },
  { id: 'KR-28', countryCode: 'KOR', name: 'Incheon', isoCode: 'KR-28', center: [126.6, 37.5], weight: 1 },
  { id: 'KR-45', countryCode: 'KOR', name: 'North Jeolla', isoCode: 'KR-45', center: [126.9, 35.7], weight: 1 },
  { id: 'KR-46', countryCode: 'KOR', name: 'South Jeolla', isoCode: 'KR-46', center: [126.6, 34.6], weight: 1 },
  { id: 'KR-48', countryCode: 'KOR', name: 'South Gyeongsang', isoCode: 'KR-48', center: [128.4, 35], weight: 1 },
  { id: 'KR-31', countryCode: 'KOR', name: 'Ulsan', isoCode: 'KR-31', center: [129.2, 35.5], weight: 1 },
  { id: 'KR-47', countryCode: 'KOR', name: 'North Gyeongsang', isoCode: 'KR-47', center: [129, 36.4], weight: 1 },
  { id: 'KR-49', countryCode: 'KOR', name: 'Jeju', isoCode: 'KR-49', center: [126.6, 33.4], weight: 1 },
  { id: 'KR-30', countryCode: 'KOR', name: 'Daejeon', isoCode: 'KR-30', center: [127.3, 36.4], weight: 1 },
  { id: 'KR-50', countryCode: 'KOR', name: 'Sejong', isoCode: 'KR-50', center: [127.2, 36.6], weight: 1 },
  { id: 'KR-43', countryCode: 'KOR', name: 'North Chungcheong', isoCode: 'KR-43', center: [127.8, 36.6], weight: 1 },
  { id: 'KR-29', countryCode: 'KOR', name: 'Gwangju', isoCode: 'KR-29', center: [127, 35.2], weight: 1 },
  { id: 'KR-27', countryCode: 'KOR', name: 'Daegu', isoCode: 'KR-27', center: [128.6, 35.9], weight: 1 },
  // IDN
  { id: 'ID-KI', countryCode: 'IDN', name: 'Kalimantan Timur', isoCode: 'ID-KI', center: [116.5, 0.5], weight: 1 },
  { id: 'ID-NT', countryCode: 'IDN', name: 'Nusa Tenggara Timur', isoCode: 'ID-NT', center: [121.5, -8.7], weight: 1 },
  { id: 'ID-KB', countryCode: 'IDN', name: 'Kalimantan Barat', isoCode: 'ID-KB', center: [110.6, -0.4], weight: 1 },
  { id: 'ID-PA', countryCode: 'IDN', name: 'Papua', isoCode: 'ID-PA', center: [138.5, -4.3], weight: 1 },
  { id: 'ID-MA', countryCode: 'IDN', name: 'Maluku', isoCode: 'ID-MA', center: [128.1, -3.2], weight: 1 },
  { id: 'ID-NB', countryCode: 'IDN', name: 'Nusa Tenggara Barat', isoCode: 'ID-NB', center: [117.5, -8.7], weight: 1 },
  { id: 'ID-SN', countryCode: 'IDN', name: 'Sulawesi Selatan', isoCode: 'ID-SN', center: [120.5, -4.6], weight: 1 },
  { id: 'ID-BT', countryCode: 'IDN', name: 'Banten', isoCode: 'ID-BT', center: [105.9, -6.5], weight: 1 },
  { id: 'ID-YO', countryCode: 'IDN', name: 'Yogyakarta', isoCode: 'ID-YO', center: [110.5, -7.9], weight: 1 },
  { id: 'ID-SG', countryCode: 'IDN', name: 'Sulawesi Tenggara', isoCode: 'ID-SG', center: [122.0, -4.0], weight: 1 },
  { id: 'ID-PB', countryCode: 'IDN', name: 'Papua Barat', isoCode: 'ID-PB', center: [133.8, -1.5], weight: 1 },
  { id: 'ID-ST', countryCode: 'IDN', name: 'Sulawesi Tengah', isoCode: 'ID-ST', center: [121.9, -0.9], weight: 1 },
  { id: 'ID-MU', countryCode: 'IDN', name: 'Maluku Utara', isoCode: 'ID-MU', center: [127.8, 1.5], weight: 1 },
  { id: 'ID-KR', countryCode: 'IDN', name: 'Kepulauan Riau', isoCode: 'ID-KR', center: [104.4, 0.9], weight: 1 },
  { id: 'ID-RI', countryCode: 'IDN', name: 'Riau', isoCode: 'ID-RI', center: [102.3, 0.7], weight: 1 },
  { id: 'ID-GO', countryCode: 'IDN', name: 'Gorontalo', isoCode: 'ID-GO', center: [122.4, 0.5], weight: 1 },
  { id: 'ID-SA', countryCode: 'IDN', name: 'Sulawesi Utara', isoCode: 'ID-SA', center: [124.8, 0.6], weight: 1 },
  { id: 'ID-SR', countryCode: 'IDN', name: 'Sulawesi Barat', isoCode: 'ID-SR', center: [119.3, -2.8], weight: 1 },
  { id: 'ID-JA', countryCode: 'IDN', name: 'Jambi', isoCode: 'ID-JA', center: [102.7, -1.7], weight: 1 },
  { id: 'ID-SS', countryCode: 'IDN', name: 'Sumatera Selatan', isoCode: 'ID-SS', center: [104.1, -3.1], weight: 1 },
  { id: 'ID-LA', countryCode: 'IDN', name: 'Lampung', isoCode: 'ID-LA', center: [104.8, -5], weight: 1 },
  { id: 'ID-BE', countryCode: 'IDN', name: 'Bengkulu', isoCode: 'ID-BE', center: [102.5, -3.9], weight: 1 },
  { id: 'ID-SB', countryCode: 'IDN', name: 'Sumatera Barat', isoCode: 'ID-SB', center: [100.3, -1.4], weight: 1 },
  { id: 'ID-SU', countryCode: 'IDN', name: 'Sumatera Utara', isoCode: 'ID-SU', center: [98.7, 1.6], weight: 1 },
  { id: 'ID-AC', countryCode: 'IDN', name: 'Aceh', isoCode: 'ID-AC', center: [96.7, 3.8], weight: 1 },
  { id: 'ID-KT', countryCode: 'IDN', name: 'Kalimantan Tengah', isoCode: 'ID-KT', center: [113.4, -1.7], weight: 1 },
  { id: 'ID-KS', countryCode: 'IDN', name: 'Kalimantan Selatan', isoCode: 'ID-KS', center: [115.8, -3.1], weight: 1 },
  { id: 'ID-BA', countryCode: 'IDN', name: 'Bali', isoCode: 'ID-BA', center: [115.3, -8.5], weight: 1 },
  { id: 'ID-BB', countryCode: 'IDN', name: 'Bangka-Belitung', isoCode: 'ID-BB', center: [106.4, -2.7], weight: 1 },
  // THA
  { id: 'TH-32', countryCode: 'THA', name: 'Surin', isoCode: 'TH-32', center: [103.6, 15], weight: 1 },
  { id: 'TH-33', countryCode: 'THA', name: 'Si Sa Ket', isoCode: 'TH-33', center: [104.4, 14.9], weight: 1 },
  { id: 'TH-34', countryCode: 'THA', name: 'Ubon Ratchathani', isoCode: 'TH-34', center: [105, 15.2], weight: 1 },
  { id: 'TH-27', countryCode: 'THA', name: 'Sa Kaeo', isoCode: 'TH-27', center: [102.3, 13.8], weight: 1 },
  { id: 'TH-31', countryCode: 'THA', name: 'Buri Ram', isoCode: 'TH-31', center: [103, 14.9], weight: 1 },
  { id: 'TH-23', countryCode: 'THA', name: 'Trat', isoCode: 'TH-23', center: [102.5, 12.2], weight: 1 },
  { id: 'TH-22', countryCode: 'THA', name: 'Chanthaburi', isoCode: 'TH-22', center: [102.1, 12.9], weight: 1 },
  { id: 'TH-91', countryCode: 'THA', name: 'Satun', isoCode: 'TH-91', center: [100.1, 6.6], weight: 1 },
  { id: 'TH-90', countryCode: 'THA', name: 'Songkhla', isoCode: 'TH-90', center: [100.4, 7.1], weight: 1 },
  { id: 'TH-95', countryCode: 'THA', name: 'Yala', isoCode: 'TH-95', center: [101.2, 6.2], weight: 1 },
  { id: 'TH-96', countryCode: 'THA', name: 'Narathiwat', isoCode: 'TH-96', center: [101.7, 6.2], weight: 1 },
  { id: 'TH-57', countryCode: 'THA', name: 'Chiang Rai', isoCode: 'TH-57', center: [99.8, 19.8], weight: 1 },
  { id: 'TH-58', countryCode: 'THA', name: 'Mae Hong Son', isoCode: 'TH-58', center: [98, 18.9], weight: 1 },
  { id: 'TH-63', countryCode: 'THA', name: 'Tak', isoCode: 'TH-63', center: [98.7, 16.8], weight: 1 },
  { id: 'TH-71', countryCode: 'THA', name: 'Kanchanaburi', isoCode: 'TH-71', center: [99.1, 14.8], weight: 1 },
  { id: 'TH-77', countryCode: 'THA', name: 'Prachuap Khiri Khan', isoCode: 'TH-77', center: [99.6, 11.9], weight: 1 },
  { id: 'TH-76', countryCode: 'THA', name: 'Phetchaburi', isoCode: 'TH-76', center: [99.6, 12.9], weight: 1 },
  { id: 'TH-70', countryCode: 'THA', name: 'Ratchaburi', isoCode: 'TH-70', center: [99.6, 13.5], weight: 1 },
  { id: 'TH-86', countryCode: 'THA', name: 'Chumphon', isoCode: 'TH-86', center: [99.1, 10.4], weight: 1 },
  { id: 'TH-85', countryCode: 'THA', name: 'Ranong', isoCode: 'TH-85', center: [98.6, 10], weight: 1 },
  { id: 'TH-56', countryCode: 'THA', name: 'Phayao', isoCode: 'TH-56', center: [100.3, 19.3], weight: 1 },
  { id: 'TH-55', countryCode: 'THA', name: 'Nan', isoCode: 'TH-55', center: [100.8, 18.9], weight: 1 },
  { id: 'TH-53', countryCode: 'THA', name: 'Uttaradit', isoCode: 'TH-53', center: [100.5, 17.7], weight: 1 },
  { id: 'TH-65', countryCode: 'THA', name: 'Phitsanulok', isoCode: 'TH-65', center: [100.6, 17], weight: 1 },
  { id: 'TH-42', countryCode: 'THA', name: 'Loei', isoCode: 'TH-42', center: [101.6, 17.4], weight: 1 },
  { id: 'TH-38', countryCode: 'THA', name: 'Bueng Kan', isoCode: 'TH-38', center: [103.7, 18.1], weight: 1 },
  { id: 'TH-43', countryCode: 'THA', name: 'Nong Khai', isoCode: 'TH-43', center: [102.9, 18], weight: 1 },
  { id: 'TH-48', countryCode: 'THA', name: 'Nakhon Phanom', isoCode: 'TH-48', center: [104.4, 17.4], weight: 1 },
  { id: 'TH-49', countryCode: 'THA', name: 'Mukdahan', isoCode: 'TH-49', center: [104.5, 16.5], weight: 1 },
  { id: 'TH-37', countryCode: 'THA', name: 'Amnat Charoen', isoCode: 'TH-37', center: [104.8, 15.9], weight: 1 },
  { id: 'TH-82', countryCode: 'THA', name: 'Phangnga', isoCode: 'TH-82', center: [98.3, 8.8], weight: 1 },
  { id: 'TH-81', countryCode: 'THA', name: 'Krabi', isoCode: 'TH-81', center: [98.9, 8.1], weight: 1 },
  { id: 'TH-92', countryCode: 'THA', name: 'Trang', isoCode: 'TH-92', center: [99.6, 7.4], weight: 1 },
  { id: 'TH-94', countryCode: 'THA', name: 'Pattani', isoCode: 'TH-94', center: [101.3, 6.7], weight: 1 },
  { id: 'TH-93', countryCode: 'THA', name: 'Phatthalung', isoCode: 'TH-93', center: [100.1, 7.6], weight: 1 },
  { id: 'TH-80', countryCode: 'THA', name: 'Nakhon Si Thammarat', isoCode: 'TH-80', center: [99.8, 8.4], weight: 1 },
  { id: 'TH-84', countryCode: 'THA', name: 'Surat Thani', isoCode: 'TH-84', center: [99.0, 9.1], weight: 1 },
  { id: 'TH-75', countryCode: 'THA', name: 'Samut Songkhram', isoCode: 'TH-75', center: [100, 13.4], weight: 1 },
  { id: 'TH-74', countryCode: 'THA', name: 'Samut Sakhon', isoCode: 'TH-74', center: [100.2, 13.6], weight: 1 },
  { id: 'TH-11', countryCode: 'THA', name: 'Samut Prakan', isoCode: 'TH-11', center: [100.7, 13.6], weight: 1 },
  { id: 'TH-24', countryCode: 'THA', name: 'Chachoengsao', isoCode: 'TH-24', center: [101.2, 13.6], weight: 1 },
  { id: 'TH-20', countryCode: 'THA', name: 'Chon Buri', isoCode: 'TH-20', center: [101.2, 13.1], weight: 1 },
  { id: 'TH-21', countryCode: 'THA', name: 'Rayong', isoCode: 'TH-21', center: [101.5, 12.8], weight: 1 },
  { id: 'TH-40', countryCode: 'THA', name: 'Khon Kaen', isoCode: 'TH-40', center: [102.5, 16.4], weight: 1 },
  { id: 'TH-47', countryCode: 'THA', name: 'Sakon Nakhon', isoCode: 'TH-47', center: [103.8, 17.4], weight: 1 },
  { id: 'TH-72', countryCode: 'THA', name: 'Suphan Buri', isoCode: 'TH-72', center: [99.9, 14.7], weight: 1 },
  { id: 'TH-17', countryCode: 'THA', name: 'Sing Buri', isoCode: 'TH-17', center: [100.3, 14.9], weight: 1 },
  { id: 'TH-18', countryCode: 'THA', name: 'Chai Nat', isoCode: 'TH-18', center: [100, 15.1], weight: 1 },
  { id: 'TH-15', countryCode: 'THA', name: 'Ang Thong', isoCode: 'TH-15', center: [100.4, 14.6], weight: 1 },
  { id: 'TH-19', countryCode: 'THA', name: 'Saraburi', isoCode: 'TH-19', center: [101, 14.6], weight: 1 },
  { id: 'TH-30', countryCode: 'THA', name: 'Nakhon Ratchasima', isoCode: 'TH-30', center: [102, 14.9], weight: 1 },
  { id: 'TH-26', countryCode: 'THA', name: 'Nakhon Nayok', isoCode: 'TH-26', center: [101.2, 14.3], weight: 1 },
  { id: 'TH-13', countryCode: 'THA', name: 'Pathum Thani', isoCode: 'TH-13', center: [100.7, 14.1], weight: 1 },
  { id: 'TH-61', countryCode: 'THA', name: 'Uthai Thani', isoCode: 'TH-61', center: [99.5, 15.3], weight: 1 },
  { id: 'TH-46', countryCode: 'THA', name: 'Kalasin', isoCode: 'TH-46', center: [103.5, 16.7], weight: 1 },
  { id: 'TH-45', countryCode: 'THA', name: 'Roi Et', isoCode: 'TH-45', center: [103.9, 15.9], weight: 1 },
  { id: 'TH-44', countryCode: 'THA', name: 'Maha Sarakham', isoCode: 'TH-44', center: [103.2, 16], weight: 1 },
  { id: 'TH-39', countryCode: 'THA', name: 'Nong Bua Lam Phu', isoCode: 'TH-39', center: [102.3, 17.2], weight: 1 },
  { id: 'TH-16', countryCode: 'THA', name: 'Lop Buri', isoCode: 'TH-16', center: [100.9, 15], weight: 1 },
  { id: 'TH-41', countryCode: 'THA', name: 'Udon Thani', isoCode: 'TH-41', center: [102.9, 17.4], weight: 1 },
  { id: 'TH-14', countryCode: 'THA', name: 'Phra Nakhon Si Ayutthaya', isoCode: 'TH-14', center: [100.5, 14.3], weight: 1 },
  { id: 'TH-12', countryCode: 'THA', name: 'Nonthaburi', isoCode: 'TH-12', center: [100.4, 14], weight: 1 },
  { id: 'TH-73', countryCode: 'THA', name: 'Nakhon Pathom', isoCode: 'TH-73', center: [100.1, 14], weight: 1 },
  { id: 'TH-62', countryCode: 'THA', name: 'Kamphaeng Phet', isoCode: 'TH-62', center: [99.6, 16.4], weight: 1 },
  { id: 'TH-52', countryCode: 'THA', name: 'Lampang', isoCode: 'TH-52', center: [99.5, 18.3], weight: 1 },
  { id: 'TH-64', countryCode: 'THA', name: 'Sukhothai', isoCode: 'TH-64', center: [99.7, 17.1], weight: 1 },
  { id: 'TH-60', countryCode: 'THA', name: 'Nakhon Sawan', isoCode: 'TH-60', center: [100, 15.7], weight: 1 },
  { id: 'TH-67', countryCode: 'THA', name: 'Phetchabun', isoCode: 'TH-67', center: [101.2, 16.3], weight: 1 },
  { id: 'TH-66', countryCode: 'THA', name: 'Phichit', isoCode: 'TH-66', center: [100.4, 16.2], weight: 1 },
  { id: 'TH-36', countryCode: 'THA', name: 'Chaiyaphum', isoCode: 'TH-36', center: [101.9, 15.9], weight: 1 },
  { id: 'TH-54', countryCode: 'THA', name: 'Phrae', isoCode: 'TH-54', center: [100, 18.3], weight: 1 },
  { id: 'TH-51', countryCode: 'THA', name: 'Lamphun', isoCode: 'TH-51', center: [99, 18.1], weight: 1 },
  { id: 'TH-25', countryCode: 'THA', name: 'Prachin Buri', isoCode: 'TH-25', center: [101.6, 14.1], weight: 1 },
  { id: 'TH-35', countryCode: 'THA', name: 'Yasothon', isoCode: 'TH-35', center: [104.4, 15.8], weight: 1 },
  // PHL
  { id: 'PH-SLU', countryCode: 'PHL', name: 'Sulu', isoCode: 'PH-SLU', center: [121.0, 6.0], weight: 1 },
  { id: 'PH-ZSI', countryCode: 'PHL', name: 'Zamboanga Sibugay', isoCode: 'PH-ZSI', center: [122.5, 7.6], weight: 1 },
  { id: 'PH-PLW', countryCode: 'PHL', name: 'Palawan', isoCode: 'PH-PLW', center: [118.7, 9.8], weight: 1 },
  { id: 'PH-SUN', countryCode: 'PHL', name: 'Surigao del Norte', isoCode: 'PH-SUN', center: [125.8, 9.8], weight: 1 },
  { id: 'PH-SUR', countryCode: 'PHL', name: 'Surigao del Sur', isoCode: 'PH-SUR', center: [126.1, 8.8], weight: 1 },
  { id: 'PH-AGN', countryCode: 'PHL', name: 'Agusan del Norte', isoCode: 'PH-AGN', center: [125.5, 9], weight: 1 },
  { id: 'PH-MSR', countryCode: 'PHL', name: 'Misamis Oriental', isoCode: 'PH-MSR', center: [124.8, 8.6], weight: 1 },
  { id: 'PH-LAN', countryCode: 'PHL', name: 'Lanao del Norte', isoCode: 'PH-LAN', center: [124, 8], weight: 1 },
  { id: 'PH-ZAS', countryCode: 'PHL', name: 'Zamboanga del Sur', isoCode: 'PH-ZAS', center: [123.3, 7.9], weight: 1 },
  { id: 'PH-MSC', countryCode: 'PHL', name: 'Misamis Occidental', isoCode: 'PH-MSC', center: [123.7, 8.4], weight: 1 },
  { id: 'PH-ZAN', countryCode: 'PHL', name: 'Zamboanga del Norte', isoCode: 'PH-ZAN', center: [123.0, 8.15], weight: 1 },
  { id: 'PH-LAS', countryCode: 'PHL', name: 'Lanao del Sur', isoCode: 'PH-LAS', center: [124.3, 7.8], weight: 1 },
  { id: 'PH-MAG', countryCode: 'PHL', name: 'Maguindanao', isoCode: 'PH-MAG', center: [124.4, 7.1], weight: 1 },
  { id: 'PH-NCO', countryCode: 'PHL', name: 'Cotabato', isoCode: 'PH-NCO', center: [124.85, 7.0], weight: 1 },
  { id: 'PH-SUK', countryCode: 'PHL', name: 'Sultan Kudarat', isoCode: 'PH-SUK', center: [124.25, 6.5], weight: 1 },
  { id: 'PH-SAR', countryCode: 'PHL', name: 'Sarangani', isoCode: 'PH-SAR', center: [125.3, 5.9], weight: 1 },
  { id: 'PH-DAS', countryCode: 'PHL', name: 'Davao del Sur', isoCode: 'PH-DAS', center: [125.4, 6.2], weight: 1 },
  { id: 'PH-COM', countryCode: 'PHL', name: 'Compostela Valley', isoCode: 'PH-COM', center: [125.9, 7.5], weight: 1 },
  { id: 'PH-DAO', countryCode: 'PHL', name: 'Davao Oriental', isoCode: 'PH-DAO', center: [126.3, 7.3], weight: 1 },
  { id: 'PH-SLE', countryCode: 'PHL', name: 'Southern Leyte', isoCode: 'PH-SLE', center: [125.0, 10.0], weight: 1 },
  { id: 'PH-LEY', countryCode: 'PHL', name: 'Leyte', isoCode: 'PH-LEY', center: [124.95, 10.4], weight: 1 },
  { id: 'PH-EAS', countryCode: 'PHL', name: 'Eastern Samar', isoCode: 'PH-EAS', center: [125.5, 11.5], weight: 1 },
  { id: 'PH-BIL', countryCode: 'PHL', name: 'Biliran', isoCode: 'PH-BIL', center: [124.47, 11.58], weight: 1 },
  { id: 'PH-WSA', countryCode: 'PHL', name: 'Samar', isoCode: 'PH-WSA', center: [124.9, 11.7], weight: 1 },
  { id: 'PH-AUR', countryCode: 'PHL', name: 'Aurora', isoCode: 'PH-AUR', center: [121.7, 15.8], weight: 1 },
  { id: 'PH-QUE', countryCode: 'PHL', name: 'Quezon', isoCode: 'PH-QUE', center: [122, 14.3], weight: 1 },
  { id: 'PH-CAN', countryCode: 'PHL', name: 'Camarines Norte', isoCode: 'PH-CAN', center: [122.7, 14.1], weight: 1 },
  { id: 'PH-CAS', countryCode: 'PHL', name: 'Camarines Sur', isoCode: 'PH-CAS', center: [123.3, 13.7], weight: 1 },
  { id: 'PH-ALB', countryCode: 'PHL', name: 'Albay', isoCode: 'PH-ALB', center: [123.8, 13.3], weight: 1 },
  { id: 'PH-SOR', countryCode: 'PHL', name: 'Sorsogon', isoCode: 'PH-SOR', center: [123.9, 12.9], weight: 1 },
  { id: 'PH-BTG', countryCode: 'PHL', name: 'Batangas', isoCode: 'PH-BTG', center: [121, 13.8], weight: 1 },
  { id: 'PH-CAV', countryCode: 'PHL', name: 'Cavite', isoCode: 'PH-CAV', center: [120.9, 14.3], weight: 1 },
  { id: 'PH-BUL', countryCode: 'PHL', name: 'Bulacan', isoCode: 'PH-BUL', center: [121, 14.9], weight: 1 },
  { id: 'PH-PAM', countryCode: 'PHL', name: 'Pampanga', isoCode: 'PH-PAM', center: [120.6, 15], weight: 1 },
  { id: 'PH-BAN', countryCode: 'PHL', name: 'Bataan', isoCode: 'PH-BAN', center: [120.5, 14.8], weight: 1 },
  { id: 'PH-ZMB', countryCode: 'PHL', name: 'Zambales', isoCode: 'PH-ZMB', center: [120.2, 15.2], weight: 1 },
  { id: 'PH-PAN', countryCode: 'PHL', name: 'Pangasinan', isoCode: 'PH-PAN', center: [120.2, 16.1], weight: 1 },
  { id: 'PH-LUN', countryCode: 'PHL', name: 'La Union', isoCode: 'PH-LUN', center: [120.4, 16.5], weight: 1 },
  { id: 'PH-ILS', countryCode: 'PHL', name: 'Ilocos Sur', isoCode: 'PH-ILS', center: [120.5, 17.2], weight: 1 },
  { id: 'PH-ILN', countryCode: 'PHL', name: 'Ilocos Norte', isoCode: 'PH-ILN', center: [120.7, 18.1], weight: 1 },
  { id: 'PH-CAG', countryCode: 'PHL', name: 'Cagayan', isoCode: 'PH-CAG', center: [121.6, 18.7], weight: 1 },
  { id: 'PH-ISA', countryCode: 'PHL', name: 'Isabela', isoCode: 'PH-ISA', center: [121.8, 16.9], weight: 1 },
  { id: 'PH-TAW', countryCode: 'PHL', name: 'Tawi-Tawi', isoCode: 'PH-TAW', center: [119.95, 5.13], weight: 1 },
  { id: 'PH-BAS', countryCode: 'PHL', name: 'Basilan', isoCode: 'PH-BAS', center: [121.97, 6.7], weight: 1 },
  { id: 'PH-CAM', countryCode: 'PHL', name: 'Camiguin', isoCode: 'PH-CAM', center: [124.72, 9.17], weight: 1 },
  { id: 'PH-SIG', countryCode: 'PHL', name: 'Siquijor', isoCode: 'PH-SIG', center: [123.51, 9.2], weight: 1 },
  { id: 'PH-BOH', countryCode: 'PHL', name: 'Bohol', isoCode: 'PH-BOH', center: [124.0, 9.85], weight: 1 },
  { id: 'PH-GUI', countryCode: 'PHL', name: 'Guimaras', isoCode: 'PH-GUI', center: [122.6, 10.6], weight: 1 },
  { id: 'PH-BCD', countryCode: 'PHL', name: 'Bacolod', isoCode: 'PH-BCD', center: [122.9, 10.6], weight: 1 },
  { id: 'PH-NEC', countryCode: 'PHL', name: 'Negros Occidental', isoCode: 'PH-NEC', center: [122.6, 10.0], weight: 1 },
  { id: 'PH-NER', countryCode: 'PHL', name: 'Negros Oriental', isoCode: 'PH-NER', center: [123.3, 9.6], weight: 1 },
  { id: 'PH-MDE', countryCode: 'PHL', name: 'Mandaue', isoCode: 'PH-MDE', center: [124, 10.4], weight: 1 },
  { id: 'PH-AKL', countryCode: 'PHL', name: 'Aklan', isoCode: 'PH-AKL', center: [122.4, 11.8], weight: 1 },
  { id: 'PH-ANT', countryCode: 'PHL', name: 'Antique', isoCode: 'PH-ANT', center: [121.95, 11.3], weight: 1 },
  { id: 'PH-ILI', countryCode: 'PHL', name: 'Iloilo', isoCode: 'PH-ILI', center: [122.5, 11.0], weight: 1 },
  { id: 'PH-CAP', countryCode: 'PHL', name: 'Capiz', isoCode: 'PH-CAP', center: [122.65, 11.55], weight: 1 },
  { id: 'PH-ROM', countryCode: 'PHL', name: 'Romblon', isoCode: 'PH-ROM', center: [122.27, 12.58], weight: 1 },
  { id: 'PH-NSA', countryCode: 'PHL', name: 'Northern Samar', isoCode: 'PH-NSA', center: [124.4, 12.4], weight: 1 },
  { id: 'PH-MAS', countryCode: 'PHL', name: 'Masbate', isoCode: 'PH-MAS', center: [123.6, 12.35], weight: 1 },
  { id: 'PH-MDR', countryCode: 'PHL', name: 'Mindoro Oriental', isoCode: 'PH-MDR', center: [121.4, 12.9], weight: 1 },
  { id: 'PH-MDC', countryCode: 'PHL', name: 'Mindoro Occidental', isoCode: 'PH-MDC', center: [120.9, 13.1], weight: 1 },
  { id: 'PH-MAD', countryCode: 'PHL', name: 'Marinduque', isoCode: 'PH-MAD', center: [121.97, 13.47], weight: 1 },
  { id: 'PH-CAT', countryCode: 'PHL', name: 'Catanduanes', isoCode: 'PH-CAT', center: [124.24, 13.71], weight: 1 },
  { id: 'PH-BTN', countryCode: 'PHL', name: 'Batanes', isoCode: 'PH-BTN', center: [121.97, 20.45], weight: 1 },
  { id: 'PH-LAP', countryCode: 'PHL', name: 'Lapu-Lapu', isoCode: 'PH-LAP', center: [124, 10.3], weight: 1 },
  { id: 'PH-AGS', countryCode: 'PHL', name: 'Agusan del Sur', isoCode: 'PH-AGS', center: [125.9, 8.5], weight: 1 },
  { id: 'PH-BUK', countryCode: 'PHL', name: 'Bukidnon', isoCode: 'PH-BUK', center: [125, 8.1], weight: 1 },
  { id: 'PH-SCO', countryCode: 'PHL', name: 'South Cotabato', isoCode: 'PH-SCO', center: [124.8, 6.3], weight: 1 },
  { id: 'PH-NUE', countryCode: 'PHL', name: 'Nueva Ecija', isoCode: 'PH-NUE', center: [121, 15.6], weight: 1 },
  { id: 'PH-LAG', countryCode: 'PHL', name: 'Laguna', isoCode: 'PH-LAG', center: [121.3, 14.3], weight: 1 },
  { id: 'PH-RIZ', countryCode: 'PHL', name: 'Rizal', isoCode: 'PH-RIZ', center: [121.2, 14.7], weight: 1 },
  { id: 'PH-QUI', countryCode: 'PHL', name: 'Quirino', isoCode: 'PH-QUI', center: [121.6, 16.4], weight: 1 },
  { id: 'PH-NUV', countryCode: 'PHL', name: 'Nueva Vizcaya', isoCode: 'PH-NUV', center: [121.2, 16.3], weight: 1 },
  { id: 'PH-BEN', countryCode: 'PHL', name: 'Benguet', isoCode: 'PH-BEN', center: [120.7, 16.5], weight: 1 },
  { id: 'PH-IFU', countryCode: 'PHL', name: 'Ifugao', isoCode: 'PH-IFU', center: [121.3, 16.9], weight: 1 },
  { id: 'PH-MOU', countryCode: 'PHL', name: 'Mountain Province', isoCode: 'PH-MOU', center: [121.2, 17.1], weight: 1 },
  { id: 'PH-TAR', countryCode: 'PHL', name: 'Tarlac', isoCode: 'PH-TAR', center: [120.4, 15.4], weight: 1 },
  { id: 'PH-APA', countryCode: 'PHL', name: 'Apayao', isoCode: 'PH-APA', center: [121.2, 18.1], weight: 1 },
  { id: 'PH-KAL', countryCode: 'PHL', name: 'Kalinga', isoCode: 'PH-KAL', center: [121.3, 17.5], weight: 1 },
  { id: 'PH-ABR', countryCode: 'PHL', name: 'Abra', isoCode: 'PH-ABR', center: [120.8, 17.6], weight: 1 },
  // NGA
  { id: 'NG-KE', countryCode: 'NGA', name: 'Kebbi', isoCode: 'NG-KE', center: [4.7, 11.6], weight: 1 },
  { id: 'NG-NI', countryCode: 'NGA', name: 'Niger', isoCode: 'NG-NI', center: [5.5, 10], weight: 1 },
  { id: 'NG-KW', countryCode: 'NGA', name: 'Kwara', isoCode: 'NG-KW', center: [4.5, 8.9], weight: 1 },
  { id: 'NG-OG', countryCode: 'NGA', name: 'Ogun', isoCode: 'NG-OG', center: [3.6, 7], weight: 1 },
  { id: 'NG-OY', countryCode: 'NGA', name: 'Oyo', isoCode: 'NG-OY', center: [3.7, 8], weight: 1 },
  { id: 'NG-BO', countryCode: 'NGA', name: 'Borno', isoCode: 'NG-BO', center: [13, 11.7], weight: 1 },
  { id: 'NG-AD', countryCode: 'NGA', name: 'Adamawa', isoCode: 'NG-AD', center: [12.5, 9.4], weight: 1 },
  { id: 'NG-TA', countryCode: 'NGA', name: 'Taraba', isoCode: 'NG-TA', center: [10.8, 7.8], weight: 1 },
  { id: 'NG-BE', countryCode: 'NGA', name: 'Benue', isoCode: 'NG-BE', center: [8.6, 7.2], weight: 1 },
  { id: 'NG-CR', countryCode: 'NGA', name: 'Cross River', isoCode: 'NG-CR', center: [8.6, 5.8], weight: 1 },
  { id: 'NG-SO', countryCode: 'NGA', name: 'Sokoto', isoCode: 'NG-SO', center: [5.3, 12.8], weight: 1 },
  { id: 'NG-ZA', countryCode: 'NGA', name: 'Zamfara', isoCode: 'NG-ZA', center: [6.3, 12.1], weight: 1 },
  { id: 'NG-YO', countryCode: 'NGA', name: 'Yobe', isoCode: 'NG-YO', center: [11.4, 12.2], weight: 1 },
  { id: 'NG-KT', countryCode: 'NGA', name: 'Katsina', isoCode: 'NG-KT', center: [7.8, 12.3], weight: 1 },
  { id: 'NG-JI', countryCode: 'NGA', name: 'Jigawa', isoCode: 'NG-JI', center: [9.4, 12.2], weight: 1 },
  { id: 'NG-ON', countryCode: 'NGA', name: 'Ondo', isoCode: 'NG-ON', center: [5.2, 6.8], weight: 1 },
  { id: 'NG-DE', countryCode: 'NGA', name: 'Delta', isoCode: 'NG-DE', center: [5.9, 5.7], weight: 1 },
  { id: 'NG-BY', countryCode: 'NGA', name: 'Bayelsa', isoCode: 'NG-BY', center: [6.2, 4.9], weight: 1 },
  { id: 'NG-RI', countryCode: 'NGA', name: 'Rivers', isoCode: 'NG-RI', center: [7.1, 4.8], weight: 1 },
  { id: 'NG-AK', countryCode: 'NGA', name: 'Akwa Ibom', isoCode: 'NG-AK', center: [7.9, 5], weight: 1 },
  { id: 'NG-AB', countryCode: 'NGA', name: 'Abia', isoCode: 'NG-AB', center: [7.5, 5.5], weight: 1 },
  { id: 'NG-EB', countryCode: 'NGA', name: 'Ebonyi', isoCode: 'NG-EB', center: [8, 6.3], weight: 1 },
  { id: 'NG-AN', countryCode: 'NGA', name: 'Anambra', isoCode: 'NG-AN', center: [6.9, 6.1], weight: 1 },
  { id: 'NG-ED', countryCode: 'NGA', name: 'Edo', isoCode: 'NG-ED', center: [5.8, 6.6], weight: 1 },
  { id: 'NG-BA', countryCode: 'NGA', name: 'Bauchi', isoCode: 'NG-BA', center: [9.9, 10.8], weight: 1 },
  { id: 'NG-PL', countryCode: 'NGA', name: 'Plateau', isoCode: 'NG-PL', center: [9.4, 9.3], weight: 1 },
  { id: 'NG-NA', countryCode: 'NGA', name: 'Nassarawa', isoCode: 'NG-NA', center: [8.4, 8.5], weight: 1 },
  { id: 'NG-GO', countryCode: 'NGA', name: 'Gombe', isoCode: 'NG-GO', center: [11.3, 10.4], weight: 1 },
  { id: 'NG-EN', countryCode: 'NGA', name: 'Enugu', isoCode: 'NG-EN', center: [7.4, 6.6], weight: 1 },
  { id: 'NG-KO', countryCode: 'NGA', name: 'Kogi', isoCode: 'NG-KO', center: [6.7, 7.8], weight: 1 },
  { id: 'NG-OS', countryCode: 'NGA', name: 'Osun', isoCode: 'NG-OS', center: [4.5, 7.6], weight: 1 },
  { id: 'NG-IM', countryCode: 'NGA', name: 'Imo', isoCode: 'NG-IM', center: [7, 5.6], weight: 1 },
  { id: 'NG-EK', countryCode: 'NGA', name: 'Ekiti', isoCode: 'NG-EK', center: [5.4, 7.8], weight: 1 },
  { id: 'NG-KD', countryCode: 'NGA', name: 'Kaduna', isoCode: 'NG-KD', center: [7.6, 10.3], weight: 1 },
  // ZAF
  { id: 'ZA-NC', countryCode: 'ZAF', name: 'Northern Cape', isoCode: 'ZA-NC', center: [21.5, -29.3], weight: 1 },
  { id: 'ZA-FS', countryCode: 'ZAF', name: 'Free State', isoCode: 'ZA-FS', center: [27.1, -28.6], weight: 1 },
  { id: 'ZA-EC', countryCode: 'ZAF', name: 'Eastern Cape', isoCode: 'ZA-EC', center: [26.2, -31.9], weight: 1 },
  { id: 'ZA-LP', countryCode: 'ZAF', name: 'Limpopo', isoCode: 'ZA-LP', center: [29.2, -24.2], weight: 1 },
  { id: 'ZA-NW', countryCode: 'ZAF', name: 'North West', isoCode: 'ZA-NW', center: [25.3, -26.3], weight: 1 },
  { id: 'ZA-MP', countryCode: 'ZAF', name: 'Mpumalanga', isoCode: 'ZA-MP', center: [30, -25.8], weight: 1 },
  // EGY
  { id: 'EG-SIN', countryCode: 'EGY', name: 'Shamal Sina\'', isoCode: 'EG-SIN', center: [33.4, 30.7], weight: 1 },
  { id: 'EG-ASN', countryCode: 'EGY', name: 'Aswan', isoCode: 'EG-ASN', center: [32.5, 23.4], weight: 1 },
  { id: 'EG-BA', countryCode: 'EGY', name: 'Al Bahr al Ahmar', isoCode: 'EG-BA', center: [33.2, 25.6], weight: 1 },
  { id: 'EG-MT', countryCode: 'EGY', name: 'Matruh', isoCode: 'EG-MT', center: [27.2, 30.3], weight: 1 },
  { id: 'EG-WAD', countryCode: 'EGY', name: 'Al Wadi at Jadid', isoCode: 'EG-WAD', center: [31.2, 24.9], weight: 1 },
  { id: 'EG-SUZ', countryCode: 'EGY', name: 'As Suways', isoCode: 'EG-SUZ', center: [32.4, 29.7], weight: 1 },
  { id: 'EG-JS', countryCode: 'EGY', name: 'Janub Sina\'', isoCode: 'EG-JS', center: [34.1, 28.7], weight: 1 },
  { id: 'EG-PTS', countryCode: 'EGY', name: 'Bur Sa`id', isoCode: 'EG-PTS', center: [32.4, 31.2], weight: 1 },
  { id: 'EG-DK', countryCode: 'EGY', name: 'Ad Daqahliyah', isoCode: 'EG-DK', center: [31.8, 31.2], weight: 1 },
  { id: 'EG-SHR', countryCode: 'EGY', name: 'Ash Sharqiyah', isoCode: 'EG-SHR', center: [31.9, 30.8], weight: 1 },
  { id: 'EG-IS', countryCode: 'EGY', name: 'Al Isma`iliyah', isoCode: 'EG-IS', center: [32.2, 30.7], weight: 1 },
  { id: 'EG-DT', countryCode: 'EGY', name: 'Dumyat', isoCode: 'EG-DT', center: [31.81, 31.42], weight: 1 },
  { id: 'EG-KFS', countryCode: 'EGY', name: 'Kafr ash Shaykh', isoCode: 'EG-KFS', center: [30.9, 31.4], weight: 1 },
  { id: 'EG-BH', countryCode: 'EGY', name: 'Al Buhayrah', isoCode: 'EG-BH', center: [30.2, 30.8], weight: 1 },
  { id: 'EG-MN', countryCode: 'EGY', name: 'Al Minya', isoCode: 'EG-MN', center: [30, 28.1], weight: 1 },
  { id: 'EG-FYM', countryCode: 'EGY', name: 'Al Fayyum', isoCode: 'EG-FYM', center: [30.7, 29.4], weight: 1 },
  { id: 'EG-BNS', countryCode: 'EGY', name: 'Bani Suwayf', isoCode: 'EG-BNS', center: [30.7, 29.1], weight: 1 },
  { id: 'EG-MNF', countryCode: 'EGY', name: 'Al Minufiyah', isoCode: 'EG-MNF', center: [31, 30.5], weight: 1 },
  { id: 'EG-KB', countryCode: 'EGY', name: 'Al Qalyubiyah', isoCode: 'EG-KB', center: [31.3, 30.4], weight: 1 },
  { id: 'EG-GH', countryCode: 'EGY', name: 'Al Gharbiyah', isoCode: 'EG-GH', center: [31, 30.8], weight: 1 },
  { id: 'EG-SHG', countryCode: 'EGY', name: 'Suhaj', isoCode: 'EG-SHG', center: [31.8, 26.5], weight: 1 },
  { id: 'EG-KN', countryCode: 'EGY', name: 'Qina', isoCode: 'EG-KN', center: [32.5, 25.8], weight: 1 },
  { id: 'EG-AST', countryCode: 'EGY', name: 'Asyut', isoCode: 'EG-AST', center: [31.1, 27.2], weight: 1 },
  { id: 'EG-LX', countryCode: 'EGY', name: 'Luxor', isoCode: 'EG-LX', center: [32.7, 25.7], weight: 1 },
  // AUS
  { id: 'AU-WA', countryCode: 'AUS', name: 'Western Australia', isoCode: 'AU-WA', center: [120.5, -22.8], weight: 1 },
  { id: 'AU-NT', countryCode: 'AUS', name: 'Northern Territory', isoCode: 'AU-NT', center: [134.1, -13.1], weight: 1 },
  { id: 'AU-SA', countryCode: 'AUS', name: 'South Australia', isoCode: 'AU-SA', center: [138.6, -30.0], weight: 1 },
  { id: 'AU-X02~', countryCode: 'AUS', name: 'Jervis Bay Territory', isoCode: 'AU-X02~', center: [150.7, -35.1], weight: 1 },
  { id: 'AU-TAS', countryCode: 'AUS', name: 'Tasmania', isoCode: 'AU-TAS', center: [146.8, -41.6], weight: 1 },
  { id: 'AU-X03~', countryCode: 'AUS', name: 'Macquarie Island', isoCode: 'AU-X03~', center: [158.9, -54.5], weight: 1 },
  { id: 'AU-ACT', countryCode: 'AUS', name: 'Australian Capital Territory', isoCode: 'AU-ACT', center: [149.1, -35.5], weight: 1 },
];

export const CAT_CITIES = [
  // USA
  { id: 'USA-SF', countryCode: 'USA', regionId: 'US-CA', name: 'San Francisco', coordinates: [-122.4194, 37.7749], weight: 10, spread: 0.25 },
  { id: 'USA-CHI', countryCode: 'USA', regionId: 'US-IL', name: 'Chicago', coordinates: [-87.6298, 41.8781], weight: 8, spread: 0.22 },
  { id: 'USA-NYC', countryCode: 'USA', regionId: 'US-NY', name: 'New York', coordinates: [-74.0060, 40.7128], weight: 10, spread: 0.22 },

  { id: 'USA-LA', countryCode: 'USA', regionId: 'US-CA', name: 'Los Angeles', coordinates: [-118.2437, 34.0522], weight: 9, spread: 0.25 },
  { id: 'USA-HOU', countryCode: 'USA', regionId: 'US-TX', name: 'Houston', coordinates: [-95.3698, 29.7604], weight: 7, spread: 0.22 },
  { id: 'USA-MIA', countryCode: 'USA', regionId: 'US-FL', name: 'Miami', coordinates: [-80.1918, 25.7617], weight: 6, spread: 0.20 },
  { id: 'USA-PHL', countryCode: 'USA', regionId: 'US-PA', name: 'Philadelphia', coordinates: [-75.1652, 39.9526], weight: 5, spread: 0.18 },
  { id: 'USA-CLB', countryCode: 'USA', regionId: 'US-OH', name: 'Columbus', coordinates: [-82.9988, 39.9612], weight: 4, spread: 0.18 },
  { id: 'USA-SEA', countryCode: 'USA', regionId: 'US-WA', name: 'Seattle', coordinates: [-122.3321, 47.6062], weight: 5, spread: 0.18 },

  // CAN
  { id: 'CAN-VAN', countryCode: 'CAN', regionId: 'CA-BC', name: 'Vancouver', coordinates: [-123.1207, 49.2827], weight: 6, spread: 0.20 },
  { id: 'CAN-TOR', countryCode: 'CAN', regionId: 'CA-ON', name: 'Toronto', coordinates: [-79.3832, 43.6532], weight: 7, spread: 0.18 },
  { id: 'CAN-MTL', countryCode: 'CAN', regionId: 'CA-QC', name: 'Montreal', coordinates: [-73.5673, 45.5017], weight: 5, spread: 0.18 },

  { id: 'CAN-CGY', countryCode: 'CAN', regionId: 'CA-AB', name: 'Calgary', coordinates: [-114.0719, 51.0447], weight: 4, spread: 0.18 },

  // MEX
  { id: 'MEX-MTY', countryCode: 'MEX', regionId: 'MX-NLE', name: 'Monterrey', coordinates: [-100.3161, 25.6866], weight: 5, spread: 0.20 },
  { id: 'MEX-GDL', countryCode: 'MEX', regionId: 'MX-JAL', name: 'Guadalajara', coordinates: [-103.3496, 20.6597], weight: 4, spread: 0.22 },
  { id: 'MEX-MXC', countryCode: 'MEX', regionId: 'MX-DIF', name: 'Mexico City', coordinates: [-99.1332, 19.4326], weight: 7, spread: 0.18 },

  // BRA
  { id: 'BRA-SAO', countryCode: 'BRA', regionId: 'BR-SP', name: 'Sao Paulo', coordinates: [-46.6333, -23.5505], weight: 9, spread: 0.20 },
  { id: 'BRA-RIO', countryCode: 'BRA', regionId: 'BR-RJ', name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], weight: 7, spread: 0.20 },
  { id: 'BRA-BSB', countryCode: 'BRA', regionId: 'BR-DF', name: 'Brasilia', coordinates: [-47.8825, -15.7942], weight: 4, spread: 0.22 },
  { id: 'BRA-BHZ', countryCode: 'BRA', regionId: 'BR-MG', name: 'Belo Horizonte', coordinates: [-43.9346, -19.9191], weight: 5, spread: 0.22 },

  // ARG
  { id: 'ARG-BUE', countryCode: 'ARG', regionId: 'AR-B', name: 'Buenos Aires', coordinates: [-58.3816, -34.6037], weight: 7, spread: 0.18 },
  { id: 'ARG-COR', countryCode: 'ARG', regionId: 'AR-X', name: 'Cordoba', coordinates: [-64.1888, -31.4201], weight: 4, spread: 0.22 },
  { id: 'ARG-ROS', countryCode: 'ARG', regionId: 'AR-B', name: 'Rosario', coordinates: [-60.6505, -32.9442], weight: 3, spread: 0.22 },

  // CHL
  { id: 'CHL-SCL', countryCode: 'CHL', regionId: 'CL-RM', name: 'Santiago', coordinates: [-70.6693, -33.4489], weight: 6, spread: 0.16 },
  { id: 'CHL-VAP', countryCode: 'CHL', regionId: 'CL-VS', name: 'Valparaiso', coordinates: [-71.6127, -33.0472], weight: 3, spread: 0.18 },
  { id: 'CHL-CCP', countryCode: 'CHL', regionId: 'CL-BI', name: 'Concepcion', coordinates: [-73.0498, -36.8260], weight: 3, spread: 0.20 },

  // COL
  { id: 'COL-BOG', countryCode: 'COL', regionId: 'CO-CUN', name: 'Bogota', coordinates: [-74.0721, 4.7110], weight: 6, spread: 0.20 },
  { id: 'COL-MDE', countryCode: 'COL', regionId: 'CO-ANT', name: 'Medellin', coordinates: [-75.5812, 6.2442], weight: 4, spread: 0.18 },
  { id: 'COL-CLO', countryCode: 'COL', regionId: 'CO-VAC', name: 'Cali', coordinates: [-76.5320, 3.4516], weight: 4, spread: 0.18 },

  // GBR
  { id: 'GBR-LON', countryCode: 'GBR', regionId: 'GB-LND', name: 'London', coordinates: [-0.1276, 51.5072], weight: 8, spread: 0.10 },
  { id: 'GBR-MAN', countryCode: 'GBR', regionId: 'GB-MAN', name: 'Manchester', coordinates: [-2.2426, 53.4808], weight: 4, spread: 0.12 },
  { id: 'GBR-EDI', countryCode: 'GBR', regionId: 'GB-EDH', name: 'Edinburgh', coordinates: [-3.1883, 55.9533], weight: 3, spread: 0.12 },

  // DEU
  { id: 'DEU-BER', countryCode: 'DEU', regionId: 'DE-BE', name: 'Berlin', coordinates: [13.4050, 52.5200], weight: 6, spread: 0.12 },
  { id: 'DEU-HAM', countryCode: 'DEU', regionId: 'DE-HH', name: 'Hamburg', coordinates: [9.9937, 53.5511], weight: 4, spread: 0.12 },
  { id: 'DEU-MUC', countryCode: 'DEU', regionId: 'DE-BY', name: 'Munich', coordinates: [11.5820, 48.1351], weight: 4, spread: 0.12 },

  // FRA
  { id: 'FRA-PAR', countryCode: 'FRA', regionId: 'FR-75', name: 'Paris', coordinates: [2.3522, 48.8566], weight: 7, spread: 0.10 },
  { id: 'FRA-LYO', countryCode: 'FRA', regionId: 'FR-69', name: 'Lyon', coordinates: [4.8357, 45.7640], weight: 4, spread: 0.12 },
  { id: 'FRA-MRS', countryCode: 'FRA', regionId: 'FR-13', name: 'Marseille', coordinates: [5.3698, 43.2965], weight: 4, spread: 0.12 },
  { id: 'FRA-TLS', countryCode: 'FRA', regionId: 'FR-31', name: 'Toulouse', coordinates: [1.4442, 43.6047], weight: 3, spread: 0.12 },
  { id: 'FRA-BDX', countryCode: 'FRA', regionId: 'FR-33', name: 'Bordeaux', coordinates: [-0.5792, 44.8378], weight: 3, spread: 0.12 },
  { id: 'FRA-NCE', countryCode: 'FRA', regionId: 'FR-06', name: 'Nice', coordinates: [7.2620, 43.7102], weight: 3, spread: 0.10 },
  { id: 'FRA-LIL', countryCode: 'FRA', regionId: 'FR-59', name: 'Lille', coordinates: [3.0573, 50.6292], weight: 3, spread: 0.10 },
  { id: 'FRA-NTE', countryCode: 'FRA', regionId: 'FR-44', name: 'Nantes', coordinates: [-1.5536, 47.2184], weight: 2, spread: 0.12 },

  // ESP
  { id: 'ESP-MAD', countryCode: 'ESP', regionId: 'ES-M', name: 'Madrid', coordinates: [-3.7038, 40.4168], weight: 6, spread: 0.12 },
  { id: 'ESP-BCN', countryCode: 'ESP', regionId: 'ES-B', name: 'Barcelona', coordinates: [2.1734, 41.3851], weight: 6, spread: 0.12 },
  { id: 'ESP-VLC', countryCode: 'ESP', regionId: 'ES-V', name: 'Valencia', coordinates: [-0.3763, 39.4699], weight: 4, spread: 0.12 },
  { id: 'ESP-SEV', countryCode: 'ESP', regionId: 'ES-SE', name: 'Sevilla', coordinates: [-5.9845, 37.3891], weight: 4, spread: 0.12 },
  { id: 'ESP-MAL', countryCode: 'ESP', regionId: 'ES-MA', name: 'Malaga', coordinates: [-4.4214, 36.7213], weight: 3, spread: 0.10 },
  { id: 'ESP-BIL', countryCode: 'ESP', regionId: 'ES-BI', name: 'Bilbao', coordinates: [-2.9350, 43.2630], weight: 3, spread: 0.10 },
  { id: 'ESP-ZGZ', countryCode: 'ESP', regionId: 'ES-Z', name: 'Zaragoza', coordinates: [-0.8773, 41.6488], weight: 3, spread: 0.12 },
  { id: 'ESP-ALI', countryCode: 'ESP', regionId: 'ES-A', name: 'Alicante', coordinates: [-0.4907, 38.3452], weight: 3, spread: 0.10 },
  { id: 'ESP-GIR', countryCode: 'ESP', regionId: 'ES-GI', name: 'Girona', coordinates: [2.8249, 41.9794], weight: 2, spread: 0.10 },
  { id: 'ESP-TRG', countryCode: 'ESP', regionId: 'ES-T', name: 'Tarragona', coordinates: [1.2445, 41.1189], weight: 2, spread: 0.10 },
  { id: 'ESP-MUR', countryCode: 'ESP', regionId: 'ES-MU', name: 'Murcia', coordinates: [-1.1307, 37.9922], weight: 2, spread: 0.10 },

  // ITA
  { id: 'ITA-MIL', countryCode: 'ITA', regionId: 'IT-MI', name: 'Milan', coordinates: [9.1900, 45.4642], weight: 6, spread: 0.12 },
  { id: 'ITA-ROM', countryCode: 'ITA', regionId: 'IT-RM', name: 'Rome', coordinates: [12.4964, 41.9028], weight: 6, spread: 0.12 },
  { id: 'ITA-NAP', countryCode: 'ITA', regionId: 'IT-NA', name: 'Naples', coordinates: [14.2681, 40.8518], weight: 4, spread: 0.12 },
  { id: 'ITA-TUR', countryCode: 'ITA', regionId: 'IT-TO', name: 'Turin', coordinates: [7.6869, 45.0703], weight: 4, spread: 0.12 },
  { id: 'ITA-FLR', countryCode: 'ITA', regionId: 'IT-FI', name: 'Florence', coordinates: [11.2558, 43.7696], weight: 4, spread: 0.10 },
  { id: 'ITA-BOL', countryCode: 'ITA', regionId: 'IT-BO', name: 'Bologna', coordinates: [11.3426, 44.4949], weight: 3, spread: 0.10 },
  { id: 'ITA-VEN', countryCode: 'ITA', regionId: 'IT-VE', name: 'Venice', coordinates: [12.3155, 45.4408], weight: 3, spread: 0.10 },
  { id: 'ITA-PAL', countryCode: 'ITA', regionId: 'IT-PA', name: 'Palermo', coordinates: [13.3615, 38.1157], weight: 3, spread: 0.12 },

  // RUS
  { id: 'RUS-MOW', countryCode: 'RUS', regionId: 'RU-MOW', name: 'Moscow', coordinates: [37.6173, 55.7558], weight: 8, spread: 0.14 },
  { id: 'RUS-MOS', countryCode: 'RUS', regionId: 'RU-MOS', name: 'Moskovskaya', coordinates: [38.5, 55.5], weight: 3, spread: 0.3 },
  { id: 'RUS-LED', countryCode: 'RUS', regionId: 'RU-SPE', name: 'Saint Petersburg', coordinates: [30.3351, 59.9343], weight: 6, spread: 0.14 },
  { id: 'RUS-NVS', countryCode: 'RUS', regionId: 'RU-NVS', name: 'Novosibirsk', coordinates: [82.9204, 55.0302], weight: 4, spread: 0.18 },
  { id: 'RUS-SIM', countryCode: 'RUS', regionId: 'RU-CR', name: 'Simferopol', coordinates: [34.1, 44.95], weight: 3, spread: 0.14 },
  { id: 'RUS-SEV', countryCode: 'RUS', regionId: 'RU-SEV', name: 'Sevastopol', coordinates: [33.52, 44.62], weight: 2, spread: 0.10 },

  { id: 'RUS-EKB', countryCode: 'RUS', regionId: 'RU-SVE', name: 'Yekaterinburg', coordinates: [60.6122, 56.8519], weight: 4, spread: 0.16 },
  { id: 'RUS-KZN', countryCode: 'RUS', regionId: 'RU-TA', name: 'Kazan', coordinates: [49.1221, 55.7887], weight: 4, spread: 0.14 },
  { id: 'RUS-OMS', countryCode: 'RUS', regionId: 'RU-OMS', name: 'Omsk', coordinates: [73.3686, 54.9885], weight: 3, spread: 0.16 },
  { id: 'RUS-KJA', countryCode: 'RUS', regionId: 'RU-KYA', name: 'Krasnoyarsk', coordinates: [92.8719, 56.0153], weight: 3, spread: 0.16 },
  { id: 'RUS-SAM', countryCode: 'RUS', regionId: 'RU-SAM', name: 'Samara', coordinates: [50.1500, 53.1959], weight: 3, spread: 0.14 },
  { id: 'RUS-CHE', countryCode: 'RUS', regionId: 'RU-CHE', name: 'Chelyabinsk', coordinates: [61.4025, 55.1644], weight: 3, spread: 0.16 },

  // TUR
  { id: 'TUR-IST', countryCode: 'TUR', regionId: 'TR-34', name: 'Istanbul', coordinates: [28.9784, 41.0082], weight: 7, spread: 0.14 },
  { id: 'TUR-ANK', countryCode: 'TUR', regionId: 'TR-06', name: 'Ankara', coordinates: [32.8597, 39.9334], weight: 4, spread: 0.14 },
  { id: 'TUR-IZM', countryCode: 'TUR', regionId: 'TR-35', name: 'Izmir', coordinates: [27.1428, 38.4237], weight: 4, spread: 0.14 },
  { id: 'TUR-ANT', countryCode: 'TUR', regionId: 'TR-07', name: 'Antalya', coordinates: [30.7133, 36.8969], weight: 3, spread: 0.14 },
  { id: 'TUR-BRS', countryCode: 'TUR', regionId: 'TR-16', name: 'Bursa', coordinates: [29.0610, 40.1885], weight: 3, spread: 0.12 },
  { id: 'TUR-ADN', countryCode: 'TUR', regionId: 'TR-01', name: 'Adana', coordinates: [35.3213, 36.9914], weight: 3, spread: 0.14 },
  { id: 'TUR-KON', countryCode: 'TUR', regionId: 'TR-42', name: 'Konya', coordinates: [32.4932, 37.8746], weight: 2, spread: 0.16 },
  { id: 'TUR-DIY', countryCode: 'TUR', regionId: 'TR-21', name: 'Diyarbakir', coordinates: [40.2370, 37.9144], weight: 2, spread: 0.16 },

  // IND
  { id: 'IND-DEL', countryCode: 'IND', regionId: 'IN-DL', name: 'Delhi', coordinates: [77.2090, 28.6139], weight: 8, spread: 0.18 },
  { id: 'IND-BOM', countryCode: 'IND', regionId: 'IN-MH', name: 'Mumbai', coordinates: [72.8777, 19.0760], weight: 7, spread: 0.20 },
  { id: 'IND-BLR', countryCode: 'IND', regionId: 'IN-KA', name: 'Bengaluru', coordinates: [77.5946, 12.9716], weight: 6, spread: 0.20 },

  // CHN
  { id: 'CHN-BJS', countryCode: 'CHN', regionId: 'CN-BJ', name: 'Beijing', coordinates: [116.4074, 39.9042], weight: 8, spread: 0.18 },
  { id: 'CHN-SHA', countryCode: 'CHN', regionId: 'CN-SH', name: 'Shanghai', coordinates: [121.4737, 31.2304], weight: 8, spread: 0.18 },
  { id: 'CHN-CAN', countryCode: 'CHN', regionId: 'CN-GD', name: 'Guangzhou', coordinates: [113.2644, 23.1291], weight: 6, spread: 0.18 },

  // JPN
  { id: 'JPN-TYO', countryCode: 'JPN', regionId: 'JP-13', name: 'Tokyo', coordinates: [139.6917, 35.6895], weight: 9, spread: 0.14 },
  { id: 'JPN-OSA', countryCode: 'JPN', regionId: 'JP-27', name: 'Osaka', coordinates: [135.5022, 34.6937], weight: 6, spread: 0.14 },
  { id: 'JPN-SPK', countryCode: 'JPN', regionId: 'JP-01', name: 'Sapporo', coordinates: [141.3545, 43.0621], weight: 4, spread: 0.16 },

  // KOR
  { id: 'KOR-SEL', countryCode: 'KOR', regionId: 'KR-11', name: 'Seoul', coordinates: [126.9780, 37.5665], weight: 8, spread: 0.14 },
  { id: 'KOR-INC', countryCode: 'KOR', regionId: 'KR-41', name: 'Incheon', coordinates: [126.7052, 37.4563], weight: 4, spread: 0.14 },
  { id: 'KOR-PUS', countryCode: 'KOR', regionId: 'KR-26', name: 'Busan', coordinates: [129.0756, 35.1796], weight: 5, spread: 0.14 },

  // IDN
  { id: 'IDN-JKT', countryCode: 'IDN', regionId: 'ID-JK', name: 'Jakarta', coordinates: [106.8456, -6.2088], weight: 8, spread: 0.22 },
  { id: 'IDN-BDG', countryCode: 'IDN', regionId: 'ID-JB', name: 'Bandung', coordinates: [107.6191, -6.9175], weight: 4, spread: 0.22 },
  { id: 'IDN-SBY', countryCode: 'IDN', regionId: 'ID-JI', name: 'Surabaya', coordinates: [112.7521, -7.2575], weight: 5, spread: 0.22 },

  // THA
  { id: 'THA-BKK', countryCode: 'THA', regionId: 'TH-10', name: 'Bangkok', coordinates: [100.5018, 13.7563], weight: 7, spread: 0.20 },
  { id: 'THA-CNX', countryCode: 'THA', regionId: 'TH-50', name: 'Chiang Mai', coordinates: [98.9817, 18.7061], weight: 3, spread: 0.22 },
  { id: 'THA-HKT', countryCode: 'THA', regionId: 'TH-83', name: 'Phuket', coordinates: [98.3381, 7.8804], weight: 3, spread: 0.22 },

  // PHL
  { id: 'PHL-MNL', countryCode: 'PHL', regionId: 'PH-MNL', name: 'Manila', coordinates: [120.9842, 14.5995], weight: 7, spread: 0.22 },
  { id: 'PHL-CEB', countryCode: 'PHL', regionId: 'PH-CEB', name: 'Cebu', coordinates: [123.8854, 10.3157], weight: 4, spread: 0.22 },
  { id: 'PHL-DVO', countryCode: 'PHL', regionId: 'PH-DAV', name: 'Davao', coordinates: [125.6128, 7.1907], weight: 3, spread: 0.22 },

  // NGA
  { id: 'NGA-LOS', countryCode: 'NGA', regionId: 'NG-LA', name: 'Lagos', coordinates: [3.3792, 6.5244], weight: 7, spread: 0.24 },
  { id: 'NGA-ABV', countryCode: 'NGA', regionId: 'NG-FC', name: 'Abuja', coordinates: [7.3986, 9.0765], weight: 4, spread: 0.24 },
  { id: 'NGA-KAN', countryCode: 'NGA', regionId: 'NG-KN', name: 'Kano', coordinates: [8.5167, 12.0000], weight: 4, spread: 0.24 },

  // ZAF
  { id: 'ZAF-JNB', countryCode: 'ZAF', regionId: 'ZA-GT', name: 'Johannesburg', coordinates: [28.0473, -26.2041], weight: 6, spread: 0.20 },
  { id: 'ZAF-CPT', countryCode: 'ZAF', regionId: 'ZA-WC', name: 'Cape Town', coordinates: [18.4241, -33.9249], weight: 5, spread: 0.20 },
  { id: 'ZAF-DUR', countryCode: 'ZAF', regionId: 'ZA-NL', name: 'Durban', coordinates: [31.0218, -29.8587], weight: 4, spread: 0.20 },

  // EGY
  { id: 'EGY-CAI', countryCode: 'EGY', regionId: 'EG-C', name: 'Cairo', coordinates: [31.2357, 30.0444], weight: 7, spread: 0.18 },
  { id: 'EGY-ALE', countryCode: 'EGY', regionId: 'EG-ALX', name: 'Alexandria', coordinates: [29.9187, 31.2001], weight: 4, spread: 0.18 },
  { id: 'EGY-GIZ', countryCode: 'EGY', regionId: 'EG-GZ', name: 'Giza', coordinates: [31.2109, 30.0131], weight: 4, spread: 0.18 },

  // AUS
  { id: 'AUS-SYD', countryCode: 'AUS', regionId: 'AU-NSW', name: 'Sydney', coordinates: [151.2093, -33.8688], weight: 6, spread: 0.18 },
  { id: 'AUS-MEL', countryCode: 'AUS', regionId: 'AU-VIC', name: 'Melbourne', coordinates: [144.9631, -37.8136], weight: 6, spread: 0.18 },
  { id: 'AUS-BNE', countryCode: 'AUS', regionId: 'AU-QLD', name: 'Brisbane', coordinates: [153.0251, -27.4698], weight: 4, spread: 0.20 },

  // Missing cities for manually-defined regions
  { id: 'MEX-TOL', countryCode: 'MEX', regionId: 'MX-MEX', name: 'Toluca', coordinates: [-99.6557, 19.2826], weight: 5, spread: 0.20 },
  { id: 'BRA-SSA', countryCode: 'BRA', regionId: 'BR-BA', name: 'Salvador', coordinates: [-38.5108, -12.9714], weight: 4, spread: 0.22 },
  { id: 'ARG-CABA', countryCode: 'ARG', regionId: 'AR-C', name: 'Buenos Aires City', coordinates: [-58.3816, -34.6037], weight: 6, spread: 0.12 },
  { id: 'DEU-COL', countryCode: 'DEU', regionId: 'DE-NW', name: 'Cologne', coordinates: [6.9603, 50.9375], weight: 5, spread: 0.12 },
  { id: 'RUS-KRD', countryCode: 'RUS', regionId: 'RU-KDA', name: 'Krasnodar', coordinates: [38.9769, 45.0353], weight: 4, spread: 0.16 },
  { id: 'IND-CHN', countryCode: 'IND', regionId: 'IN-TN', name: 'Chennai', coordinates: [80.2707, 13.0827], weight: 5, spread: 0.20 },
  { id: 'CHN-HZ', countryCode: 'CHN', regionId: 'CN-ZJ', name: 'Hangzhou', coordinates: [120.1551, 30.2741], weight: 5, spread: 0.18 },
  { id: 'IDN-SMG', countryCode: 'IDN', regionId: 'ID-JT', name: 'Semarang', coordinates: [110.4203, -6.9666], weight: 4, spread: 0.22 },

  // --- Auto-generated from TopoJSON admin-1 ---
  // USA
  { id: 'USA-ID', countryCode: 'USA', regionId: 'US-ID', name: 'Idaho', coordinates: [-114.7, 45.5], weight: 1, spread: 0.2 },
  { id: 'USA-MT', countryCode: 'USA', regionId: 'US-MT', name: 'Montana', coordinates: [-112.9, 46.1], weight: 1, spread: 0.2 },
  { id: 'USA-ND', countryCode: 'USA', regionId: 'US-ND', name: 'North Dakota', coordinates: [-99.1, 47.8], weight: 1, spread: 0.2 },
  { id: 'USA-MN', countryCode: 'USA', regionId: 'US-MN', name: 'Minnesota', coordinates: [-93.6, 47], weight: 1, spread: 0.2 },
  { id: 'USA-MI', countryCode: 'USA', regionId: 'US-MI', name: 'Michigan', coordinates: [-86.1, 45.2], weight: 1, spread: 0.2 },
  { id: 'USA-VT', countryCode: 'USA', regionId: 'US-VT', name: 'Vermont', coordinates: [-72.7, 44], weight: 1, spread: 0.2 },
  { id: 'USA-NH', countryCode: 'USA', regionId: 'US-NH', name: 'New Hampshire', coordinates: [-71.6, 43.9], weight: 1, spread: 0.2 },
  { id: 'USA-ME', countryCode: 'USA', regionId: 'US-ME', name: 'Maine', coordinates: [-68.8, 44.6], weight: 1, spread: 0.2 },
  { id: 'USA-AZ', countryCode: 'USA', regionId: 'US-AZ', name: 'Arizona', coordinates: [-113.9, 34.2], weight: 1, spread: 0.2 },
  { id: 'USA-NM', countryCode: 'USA', regionId: 'US-NM', name: 'New Mexico', coordinates: [-106.5, 33.3], weight: 1, spread: 0.2 },
  { id: 'USA-AK', countryCode: 'USA', regionId: 'US-AK', name: 'Alaska', coordinates: [-144.2, 59], weight: 1, spread: 0.2 },
  { id: 'USA-LOU', countryCode: 'USA', regionId: 'US-LA', name: 'Louisiana', coordinates: [-90.3, 29.8], weight: 1, spread: 0.2 },
  { id: 'USA-MS', countryCode: 'USA', regionId: 'US-MS', name: 'Mississippi', coordinates: [-89.8, 31.7], weight: 1, spread: 0.2 },
  { id: 'USA-AL', countryCode: 'USA', regionId: 'US-AL', name: 'Alabama', coordinates: [-87.1, 31.4], weight: 1, spread: 0.2 },
  { id: 'USA-GA', countryCode: 'USA', regionId: 'US-GA', name: 'Georgia', coordinates: [-82.4, 32], weight: 1, spread: 0.2 },
  { id: 'USA-SC', countryCode: 'USA', regionId: 'US-SC', name: 'South Carolina', coordinates: [-80.7, 33.5], weight: 1, spread: 0.2 },
  { id: 'USA-NC', countryCode: 'USA', regionId: 'US-NC', name: 'North Carolina', coordinates: [-77.8, 35.3], weight: 1, spread: 0.2 },
  { id: 'USA-VA', countryCode: 'USA', regionId: 'US-VA', name: 'Virginia', coordinates: [-77.4, 37.6], weight: 1, spread: 0.2 },
  { id: 'USA-DC', countryCode: 'USA', regionId: 'US-DC', name: 'District of Columbia', coordinates: [-77, 38.9], weight: 1, spread: 0.2 },
  { id: 'USA-MD', countryCode: 'USA', regionId: 'US-MD', name: 'Maryland', coordinates: [-76.5, 38.6], weight: 1, spread: 0.2 },
  { id: 'USA-DE', countryCode: 'USA', regionId: 'US-DE', name: 'Delaware', coordinates: [-75.4, 39], weight: 1, spread: 0.2 },
  { id: 'USA-NJ', countryCode: 'USA', regionId: 'US-NJ', name: 'New Jersey', coordinates: [-74.6, 40], weight: 1, spread: 0.2 },
  { id: 'USA-CT', countryCode: 'USA', regionId: 'US-CT', name: 'Connecticut', coordinates: [-73, 41.4], weight: 1, spread: 0.2 },
  { id: 'USA-RI', countryCode: 'USA', regionId: 'US-RI', name: 'Rhode Island', coordinates: [-71.4, 41.5], weight: 1, spread: 0.2 },
  { id: 'USA-MA', countryCode: 'USA', regionId: 'US-MA', name: 'Massachusetts', coordinates: [-70.8, 41.8], weight: 1, spread: 0.2 },
  { id: 'USA-OR', countryCode: 'USA', regionId: 'US-OR', name: 'Oregon', coordinates: [-121.4, 44.9], weight: 1, spread: 0.2 },
  { id: 'USA-HI', countryCode: 'USA', regionId: 'US-HI', name: 'Hawaii', coordinates: [-161.1, 22.3], weight: 1, spread: 0.2 },
  { id: 'USA-UT', countryCode: 'USA', regionId: 'US-UT', name: 'Utah', coordinates: [-111.3, 40.3], weight: 1, spread: 0.2 },
  { id: 'USA-WY', countryCode: 'USA', regionId: 'US-WY', name: 'Wyoming', coordinates: [-108.5, 42.7], weight: 1, spread: 0.2 },
  { id: 'USA-NV', countryCode: 'USA', regionId: 'US-NV', name: 'Nevada', coordinates: [-115.7, 37.9], weight: 1, spread: 0.2 },
  { id: 'USA-CO', countryCode: 'USA', regionId: 'US-CO', name: 'Colorado', coordinates: [-105, 39.4], weight: 1, spread: 0.2 },
  { id: 'USA-SD', countryCode: 'USA', regionId: 'US-SD', name: 'South Dakota', coordinates: [-98.4, 44], weight: 1, spread: 0.2 },
  { id: 'USA-NE', countryCode: 'USA', regionId: 'US-NE', name: 'Nebraska', coordinates: [-98.3, 41.7], weight: 1, spread: 0.2 },
  { id: 'USA-KS', countryCode: 'USA', regionId: 'US-KS', name: 'Kansas', coordinates: [-97, 38.8], weight: 1, spread: 0.2 },
  { id: 'USA-OK', countryCode: 'USA', regionId: 'US-OK', name: 'Oklahoma', coordinates: [-97.8, 34.7], weight: 1, spread: 0.2 },
  { id: 'USA-IA', countryCode: 'USA', regionId: 'US-IA', name: 'Iowa', coordinates: [-93.2, 42], weight: 1, spread: 0.2 },
  { id: 'USA-MO', countryCode: 'USA', regionId: 'US-MO', name: 'Missouri', coordinates: [-91.7, 38.4], weight: 1, spread: 0.2 },
  { id: 'USA-WI', countryCode: 'USA', regionId: 'US-WI', name: 'Wisconsin', coordinates: [-89.8, 44.9], weight: 1, spread: 0.2 },
  { id: 'USA-KY', countryCode: 'USA', regionId: 'US-KY', name: 'Kentucky', coordinates: [-86.1, 37.6], weight: 1, spread: 0.2 },
  { id: 'USA-AR', countryCode: 'USA', regionId: 'US-AR', name: 'Arkansas', coordinates: [-91.4, 34.7], weight: 1, spread: 0.2 },
  { id: 'USA-TN', countryCode: 'USA', regionId: 'US-TN', name: 'Tennessee', coordinates: [-86.2, 35.9], weight: 1, spread: 0.2 },
  { id: 'USA-WV', countryCode: 'USA', regionId: 'US-WV', name: 'West Virginia', coordinates: [-80.4, 38.9], weight: 1, spread: 0.2 },
  { id: 'USA-IN', countryCode: 'USA', regionId: 'US-IN', name: 'Indiana', coordinates: [-86.5, 39.1], weight: 1, spread: 0.2 },
  // CAN
  { id: 'CAN-SK', countryCode: 'CAN', regionId: 'CA-SK', name: 'Saskatchewan', coordinates: [-104.8, 53.1], weight: 1, spread: 0.22 },
  { id: 'CAN-MB', countryCode: 'CAN', regionId: 'CA-MB', name: 'Manitoba', coordinates: [-94, 56], weight: 1, spread: 0.22 },
  { id: 'CAN-NB', countryCode: 'CAN', regionId: 'CA-NB', name: 'New Brunswick', coordinates: [-66.2, 46.5], weight: 1, spread: 0.22 },
  { id: 'CAN-YT', countryCode: 'CAN', regionId: 'CA-YT', name: 'Yukon', coordinates: [-132.8, 64.5], weight: 1, spread: 0.22 },
  { id: 'CAN-NU', countryCode: 'CAN', regionId: 'CA-NU', name: 'Nunavut', coordinates: [-86.8, 71], weight: 1, spread: 0.22 },
  { id: 'CAN-NL', countryCode: 'CAN', regionId: 'CA-NL', name: 'Newfoundland and Labrador', coordinates: [-59.2, 53], weight: 1, spread: 0.22 },
  { id: 'CAN-NS', countryCode: 'CAN', regionId: 'CA-NS', name: 'Nova Scotia', coordinates: [-62.6, 45.3], weight: 1, spread: 0.22 },
  { id: 'CAN-NT', countryCode: 'CAN', regionId: 'CA-NT', name: 'Northwest Territories', coordinates: [-120.4, 71.9], weight: 1, spread: 0.22 },
  { id: 'CAN-PE', countryCode: 'CAN', regionId: 'CA-PE', name: 'Prince Edward Island', coordinates: [-63.3, 46.4], weight: 1, spread: 0.22 },
  // MEX
  { id: 'MEX-SON', countryCode: 'MEX', regionId: 'MX-SON', name: 'Sonora', coordinates: [-111, 28.8], weight: 1, spread: 0.2 },
  { id: 'MEX-BCN', countryCode: 'MEX', regionId: 'MX-BCN', name: 'Baja California', coordinates: [-114.8, 29.6], weight: 1, spread: 0.2 },
  { id: 'MEX-CHH', countryCode: 'MEX', regionId: 'MX-CHH', name: 'Chihuahua', coordinates: [-106.7, 28.3], weight: 1, spread: 0.2 },
  { id: 'MEX-COA', countryCode: 'MEX', regionId: 'MX-COA', name: 'Coahuila', coordinates: [-101.6, 27], weight: 1, spread: 0.2 },
  { id: 'MEX-TAM', countryCode: 'MEX', regionId: 'MX-TAM', name: 'Tamaulipas', coordinates: [-98.9, 24.9], weight: 1, spread: 0.2 },
  { id: 'MEX-ROO', countryCode: 'MEX', regionId: 'MX-ROO', name: 'Quintana Roo', coordinates: [-87.7, 19.7], weight: 1, spread: 0.2 },
  { id: 'MEX-CAM', countryCode: 'MEX', regionId: 'MX-CAM', name: 'Campeche', coordinates: [-90.8, 18.9], weight: 1, spread: 0.2 },
  { id: 'MEX-TAB', countryCode: 'MEX', regionId: 'MX-TAB', name: 'Tabasco', coordinates: [-92.4, 17.9], weight: 1, spread: 0.2 },
  { id: 'MEX-CHP', countryCode: 'MEX', regionId: 'MX-CHP', name: 'Chiapas', coordinates: [-92.6, 16.7], weight: 1, spread: 0.2 },
  { id: 'MEX-COL', countryCode: 'MEX', regionId: 'MX-COL', name: 'Colima', coordinates: [-103.7, 19.2], weight: 1, spread: 0.2 },
  { id: 'MEX-NAY', countryCode: 'MEX', regionId: 'MX-NAY', name: 'Nayarit', coordinates: [-105.5, 21.7], weight: 1, spread: 0.2 },
  { id: 'MEX-BCS', countryCode: 'MEX', regionId: 'MX-BCS', name: 'Baja California Sur', coordinates: [-111.9, 25.7], weight: 1, spread: 0.2 },
  { id: 'MEX-SIN', countryCode: 'MEX', regionId: 'MX-SIN', name: 'Sinaloa', coordinates: [-107.7, 25.1], weight: 1, spread: 0.2 },
  { id: 'MEX-YUC', countryCode: 'MEX', regionId: 'MX-YUC', name: 'Yucatán', coordinates: [-89, 20.7], weight: 1, spread: 0.2 },
  { id: 'MEX-VER', countryCode: 'MEX', regionId: 'MX-VER', name: 'Veracruz', coordinates: [-96.8, 19.8], weight: 1, spread: 0.2 },
  { id: 'MEX-MIC', countryCode: 'MEX', regionId: 'MX-MIC', name: 'Michoacán', coordinates: [-101.9, 19.3], weight: 1, spread: 0.2 },
  { id: 'MEX-GRO', countryCode: 'MEX', regionId: 'MX-GRO', name: 'Guerrero', coordinates: [-100, 17.9], weight: 1, spread: 0.2 },
  { id: 'MEX-OAX', countryCode: 'MEX', regionId: 'MX-OAX', name: 'Oaxaca', coordinates: [-96.2, 17], weight: 1, spread: 0.2 },
  { id: 'MEX-X01~', countryCode: 'MEX', regionId: 'MX-X01~', name: '', coordinates: [-89.7, 22.4], weight: 1, spread: 0.2 },
  { id: 'MEX-PUE', countryCode: 'MEX', regionId: 'MX-PUE', name: 'Puebla', coordinates: [-97.9, 19.1], weight: 1, spread: 0.2 },
  { id: 'MEX-MOR', countryCode: 'MEX', regionId: 'MX-MOR', name: 'Morelos', coordinates: [-99, 18.8], weight: 1, spread: 0.2 },
  { id: 'MEX-QUE', countryCode: 'MEX', regionId: 'MX-QUE', name: 'Querétaro', coordinates: [-99.8, 20.9], weight: 1, spread: 0.2 },
  { id: 'MEX-HID', countryCode: 'MEX', regionId: 'MX-HID', name: 'Hidalgo', coordinates: [-98.8, 20.5], weight: 1, spread: 0.2 },
  { id: 'MEX-GUA', countryCode: 'MEX', regionId: 'MX-GUA', name: 'Guanajuato', coordinates: [-101, 20.8], weight: 1, spread: 0.2 },
  { id: 'MEX-SLP', countryCode: 'MEX', regionId: 'MX-SLP', name: 'San Luis Potosí', coordinates: [-100.2, 22.6], weight: 1, spread: 0.2 },
  { id: 'MEX-ZAC', countryCode: 'MEX', regionId: 'MX-ZAC', name: 'Zacatecas', coordinates: [-102.8, 22.9], weight: 1, spread: 0.2 },
  { id: 'MEX-AGU', countryCode: 'MEX', regionId: 'MX-AGU', name: 'Aguascalientes', coordinates: [-102.3, 22], weight: 1, spread: 0.2 },
  { id: 'MEX-DUR', countryCode: 'MEX', regionId: 'MX-DUR', name: 'Durango', coordinates: [-104.9, 24.8], weight: 1, spread: 0.2 },
  { id: 'MEX-TLA', countryCode: 'MEX', regionId: 'MX-TLA', name: 'Tlaxcala', coordinates: [-98.1, 19.4], weight: 1, spread: 0.2 },
  // BRA
  { id: 'BRA-RS', countryCode: 'BRA', regionId: 'BR-RS', name: 'Rio Grande do Sul', coordinates: [-53.3, -30.3], weight: 1, spread: 0.22 },
  { id: 'BRA-RR', countryCode: 'BRA', regionId: 'BR-RR', name: 'Roraima', coordinates: [-61.6, 2.4], weight: 1, spread: 0.22 },
  { id: 'BRA-PA', countryCode: 'BRA', regionId: 'BR-PA', name: 'Pará', coordinates: [-51.3, -1.6], weight: 1, spread: 0.22 },
  { id: 'BRA-AC', countryCode: 'BRA', regionId: 'BR-AC', name: 'Acre', coordinates: [-70.8, -9.5], weight: 1, spread: 0.22 },
  { id: 'BRA-AP', countryCode: 'BRA', regionId: 'BR-AP', name: 'Amapá', coordinates: [-51.9, 1.5], weight: 1, spread: 0.22 },
  { id: 'BRA-MS', countryCode: 'BRA', regionId: 'BR-MS', name: 'Mato Grosso do Sul', coordinates: [-54.8, -20.3], weight: 1, spread: 0.22 },
  { id: 'BRA-PR', countryCode: 'BRA', regionId: 'BR-PR', name: 'Paraná', coordinates: [-51.2, -24.9], weight: 1, spread: 0.22 },
  { id: 'BRA-SC', countryCode: 'BRA', regionId: 'BR-SC', name: 'Santa Catarina', coordinates: [-50.6, -27.1], weight: 1, spread: 0.22 },
  { id: 'BRA-AM', countryCode: 'BRA', regionId: 'BR-AM', name: 'Amazonas', coordinates: [-65.1, -2.7], weight: 1, spread: 0.22 },
  { id: 'BRA-RO', countryCode: 'BRA', regionId: 'BR-RO', name: 'Rondônia', coordinates: [-63.4, -10.6], weight: 1, spread: 0.22 },
  { id: 'BRA-MT', countryCode: 'BRA', regionId: 'BR-MT', name: 'Mato Grosso', coordinates: [-56.2, -13.6], weight: 1, spread: 0.22 },
  { id: 'BRA-MA', countryCode: 'BRA', regionId: 'BR-MA', name: 'Maranhão', coordinates: [-44.9, -4.4], weight: 1, spread: 0.22 },
  { id: 'BRA-PI', countryCode: 'BRA', regionId: 'BR-PI', name: 'Piauí', coordinates: [-42.9, -7.1], weight: 1, spread: 0.22 },
  { id: 'BRA-CE', countryCode: 'BRA', regionId: 'BR-CE', name: 'Ceará', coordinates: [-39.5, -5.2], weight: 1, spread: 0.22 },
  { id: 'BRA-RN', countryCode: 'BRA', regionId: 'BR-RN', name: 'Rio Grande do Norte', coordinates: [-35.8, -5.2], weight: 1, spread: 0.22 },
  { id: 'BRA-PB', countryCode: 'BRA', regionId: 'BR-PB', name: 'Paraíba', coordinates: [-36.8, -7.1], weight: 1, spread: 0.22 },
  { id: 'BRA-PE', countryCode: 'BRA', regionId: 'BR-PE', name: 'Pernambuco', coordinates: [-38, -8.3], weight: 1, spread: 0.22 },
  { id: 'BRA-AL', countryCode: 'BRA', regionId: 'BR-AL', name: 'Alagoas', coordinates: [-36.6, -9.4], weight: 1, spread: 0.22 },
  { id: 'BRA-SE', countryCode: 'BRA', regionId: 'BR-SE', name: 'Sergipe', coordinates: [-37.5, -10.6], weight: 1, spread: 0.22 },
  { id: 'BRA-ES', countryCode: 'BRA', regionId: 'BR-ES', name: 'Espírito Santo', coordinates: [-40.3, -19.5], weight: 1, spread: 0.22 },
  { id: 'BRA-GO', countryCode: 'BRA', regionId: 'BR-GO', name: 'Goiás', coordinates: [-49.1, -15.5], weight: 1, spread: 0.22 },
  { id: 'BRA-DF', countryCode: 'BRA', regionId: 'BR-DF', name: 'Distrito Federal', coordinates: [-47.7, -15.8], weight: 1, spread: 0.22 },
  { id: 'BRA-TO', countryCode: 'BRA', regionId: 'BR-TO', name: 'Tocantins', coordinates: [-48.1, -9.8], weight: 1, spread: 0.22 },
  // ARG
  { id: 'ARG-E', countryCode: 'ARG', regionId: 'AR-E', name: 'Entre Ríos', coordinates: [-59, -32.1], weight: 1, spread: 0.22 },
  { id: 'ARG-A', countryCode: 'ARG', regionId: 'AR-A', name: 'Salta', coordinates: [-65.5, -24.3], weight: 1, spread: 0.22 },
  { id: 'ARG-Y', countryCode: 'ARG', regionId: 'AR-Y', name: 'Jujuy', coordinates: [-65.7, -23.4], weight: 1, spread: 0.22 },
  { id: 'ARG-P', countryCode: 'ARG', regionId: 'AR-P', name: 'Formosa', coordinates: [-59.9, -25], weight: 1, spread: 0.22 },
  { id: 'ARG-N', countryCode: 'ARG', regionId: 'AR-N', name: 'Misiones', coordinates: [-54.8, -26.8], weight: 1, spread: 0.22 },
  { id: 'ARG-H', countryCode: 'ARG', regionId: 'AR-H', name: 'Chaco', coordinates: [-60.2, -26.1], weight: 1, spread: 0.22 },
  { id: 'ARG-W', countryCode: 'ARG', regionId: 'AR-W', name: 'Corrientes', coordinates: [-57.7, -28.8], weight: 1, spread: 0.22 },
  { id: 'ARG-K', countryCode: 'ARG', regionId: 'AR-K', name: 'Catamarca', coordinates: [-66.9, -27.4], weight: 1, spread: 0.22 },
  { id: 'ARG-F', countryCode: 'ARG', regionId: 'AR-F', name: 'La Rioja', coordinates: [-67.5, -29.5], weight: 1, spread: 0.22 },
  { id: 'ARG-J', countryCode: 'ARG', regionId: 'AR-J', name: 'San Juan', coordinates: [-69, -30.9], weight: 1, spread: 0.22 },
  { id: 'ARG-M', countryCode: 'ARG', regionId: 'AR-M', name: 'Mendoza', coordinates: [-68.9, -34.3], weight: 1, spread: 0.22 },
  { id: 'ARG-Q', countryCode: 'ARG', regionId: 'AR-Q', name: 'Neuquén', coordinates: [-70.4, -38.7], weight: 1, spread: 0.22 },
  { id: 'ARG-U', countryCode: 'ARG', regionId: 'AR-U', name: 'Chubut', coordinates: [-68.2, -43.7], weight: 1, spread: 0.22 },
  { id: 'ARG-R', countryCode: 'ARG', regionId: 'AR-R', name: 'Río Negro', coordinates: [-67.3, -39.9], weight: 1, spread: 0.22 },
  { id: 'ARG-Z', countryCode: 'ARG', regionId: 'AR-Z', name: 'Santa Cruz', coordinates: [-70, -49.2], weight: 1, spread: 0.22 },
  { id: 'ARG-V', countryCode: 'ARG', regionId: 'AR-V', name: 'Tierra del Fuego', coordinates: [-66.8, -54.4], weight: 1, spread: 0.22 },
  { id: 'ARG-S', countryCode: 'ARG', regionId: 'AR-S', name: 'Santa Fe', coordinates: [-60.8, -31.4], weight: 1, spread: 0.22 },
  { id: 'ARG-T', countryCode: 'ARG', regionId: 'AR-T', name: 'Tucumán', coordinates: [-65.4, -27], weight: 1, spread: 0.22 },
  { id: 'ARG-G', countryCode: 'ARG', regionId: 'AR-G', name: 'Santiago del Estero', coordinates: [-63.9, -27.9], weight: 1, spread: 0.22 },
  { id: 'ARG-D', countryCode: 'ARG', regionId: 'AR-D', name: 'San Luis', coordinates: [-66.1, -33.5], weight: 1, spread: 0.22 },
  { id: 'ARG-L', countryCode: 'ARG', regionId: 'AR-L', name: 'La Pampa', coordinates: [-66, -37.7], weight: 1, spread: 0.22 },
  // CHL
  { id: 'CHL-AP', countryCode: 'CHL', regionId: 'CL-AP', name: 'Arica y Parinacota', coordinates: [-69.7, -18.5], weight: 1, spread: 0.18 },
  { id: 'CHL-TA', countryCode: 'CHL', regionId: 'CL-TA', name: 'Tarapacá', coordinates: [-69.2, -20.2], weight: 1, spread: 0.18 },
  { id: 'CHL-AN', countryCode: 'CHL', regionId: 'CL-AN', name: 'Antofagasta', coordinates: [-69.1, -23.6], weight: 1, spread: 0.18 },
  { id: 'CHL-AT', countryCode: 'CHL', regionId: 'CL-AT', name: 'Atacama', coordinates: [-69.9, -27.5], weight: 1, spread: 0.18 },
  { id: 'CHL-CO', countryCode: 'CHL', regionId: 'CL-CO', name: 'Coquimbo', coordinates: [-70.7, -30.4], weight: 1, spread: 0.18 },
  { id: 'CHL-ML', countryCode: 'CHL', regionId: 'CL-ML', name: 'Maule', coordinates: [-71.4, -35.6], weight: 1, spread: 0.18 },
  { id: 'CHL-LI', countryCode: 'CHL', regionId: 'CL-LI', name: 'Libertador General Bernardo O\'Higgins', coordinates: [-71, -34.4], weight: 1, spread: 0.18 },
  { id: 'CHL-NB', countryCode: 'CHL', regionId: 'CL-NB', name: 'Ñuble', coordinates: [-71.9, -36.6], weight: 1, spread: 0.18 },
  { id: 'CHL-AR', countryCode: 'CHL', regionId: 'CL-AR', name: 'La Araucanía', coordinates: [-72.4, -38.7], weight: 1, spread: 0.18 },
  { id: 'CHL-LR', countryCode: 'CHL', regionId: 'CL-LR', name: 'Los Ríos', coordinates: [-72.5, -39.9], weight: 1, spread: 0.18 },
  { id: 'CHL-LL', countryCode: 'CHL', regionId: 'CL-LL', name: 'Los Lagos', coordinates: [-72.6, -41.5], weight: 1, spread: 0.18 },
  { id: 'CHL-AI', countryCode: 'CHL', regionId: 'CL-AI', name: 'Aisén del General Carlos Ibáñez del Campo', coordinates: [-72.1, -45.6], weight: 1, spread: 0.18 },
  { id: 'CHL-MA', countryCode: 'CHL', regionId: 'CL-MA', name: 'Magallanes y Antártica Chilena', coordinates: [-72.5, -52.6], weight: 1, spread: 0.18 },
  // COL
  { id: 'COL-NAR', countryCode: 'COL', regionId: 'CO-NAR', name: 'Nariño', coordinates: [-77.8, 1.7], weight: 1, spread: 0.18 },
  { id: 'COL-PUT', countryCode: 'COL', regionId: 'CO-PUT', name: 'Putumayo', coordinates: [-75.9, 0.4], weight: 1, spread: 0.18 },
  { id: 'COL-CHO', countryCode: 'COL', regionId: 'CO-CHO', name: 'Chocó', coordinates: [-77.1, 6.1], weight: 1, spread: 0.18 },
  { id: 'COL-GUA', countryCode: 'COL', regionId: 'CO-GUA', name: 'Guainía', coordinates: [-68.7, 2.7], weight: 1, spread: 0.18 },
  { id: 'COL-VAU', countryCode: 'COL', regionId: 'CO-VAU', name: 'Vaupés', coordinates: [-70.2, 0.4], weight: 1, spread: 0.18 },
  { id: 'COL-AMA', countryCode: 'COL', regionId: 'CO-AMA', name: 'Amazonas', coordinates: [-71.7, -1.5], weight: 1, spread: 0.18 },
  { id: 'COL-LAG', countryCode: 'COL', regionId: 'CO-LAG', name: 'La Guajira', coordinates: [-72.5, 11.4], weight: 1, spread: 0.18 },
  { id: 'COL-CES', countryCode: 'COL', regionId: 'CO-CES', name: 'Cesar', coordinates: [-73.5, 9.4], weight: 1, spread: 0.18 },
  { id: 'COL-NSA', countryCode: 'COL', regionId: 'CO-NSA', name: 'Norte de Santander', coordinates: [-72.9, 7.9], weight: 1, spread: 0.18 },
  { id: 'COL-ARA', countryCode: 'COL', regionId: 'CO-ARA', name: 'Arauca', coordinates: [-71.1, 6.6], weight: 1, spread: 0.18 },
  { id: 'COL-BOY', countryCode: 'COL', regionId: 'CO-BOY', name: 'Boyacá', coordinates: [-73.2, 5.9], weight: 1, spread: 0.18 },
  { id: 'COL-VID', countryCode: 'COL', regionId: 'CO-VID', name: 'Vichada', coordinates: [-69.1, 4.6], weight: 1, spread: 0.18 },
  { id: 'COL-CAU', countryCode: 'COL', regionId: 'CO-CAU', name: 'Cauca', coordinates: [-77.1, 2.4], weight: 1, spread: 0.18 },
  { id: 'COL-COR', countryCode: 'COL', regionId: 'CO-COR', name: 'Córdoba', coordinates: [-75.7, 8.4], weight: 1, spread: 0.18 },
  { id: 'COL-SUC', countryCode: 'COL', regionId: 'CO-SUC', name: 'Sucre', coordinates: [-75.2, 9.2], weight: 1, spread: 0.18 },
  { id: 'COL-BOL', countryCode: 'COL', regionId: 'CO-BOL', name: 'Bolívar', coordinates: [-74.8, 9.2], weight: 1, spread: 0.18 },
  { id: 'COL-ATL', countryCode: 'COL', regionId: 'CO-ATL', name: 'Atlántico', coordinates: [-75.1, 10.7], weight: 1, spread: 0.18 },
  { id: 'COL-MAG', countryCode: 'COL', regionId: 'CO-MAG', name: 'Magdalena', coordinates: [-74.2, 10.3], weight: 1, spread: 0.18 },
  { id: 'COL-SAP', countryCode: 'COL', regionId: 'CO-SAP', name: 'San Andrés y Providencia', coordinates: [-81.1, 13.1], weight: 1, spread: 0.18 },
  { id: 'COL-X01~', countryCode: 'COL', regionId: 'CO-X01~', name: '', coordinates: [-81.6, 4], weight: 1, spread: 0.18 },
  { id: 'COL-CAQ', countryCode: 'COL', regionId: 'CO-CAQ', name: 'Caquetá', coordinates: [-74, 1], weight: 1, spread: 0.18 },
  { id: 'COL-HUI', countryCode: 'COL', regionId: 'CO-HUI', name: 'Huila', coordinates: [-75.6, 2.6], weight: 1, spread: 0.18 },
  { id: 'COL-GUV', countryCode: 'COL', regionId: 'CO-GUV', name: 'Guaviare', coordinates: [-71.9, 1.9], weight: 1, spread: 0.18 },
  { id: 'COL-CAL', countryCode: 'COL', regionId: 'CO-CAL', name: 'Caldas', coordinates: [-75.3, 5.4], weight: 1, spread: 0.18 },
  { id: 'COL-CAS', countryCode: 'COL', regionId: 'CO-CAS', name: 'Casanare', coordinates: [-71.8, 5.5], weight: 1, spread: 0.18 },
  { id: 'COL-MET', countryCode: 'COL', regionId: 'CO-MET', name: 'Meta', coordinates: [-73.4, 3.3], weight: 1, spread: 0.18 },
  { id: 'COL-SAN', countryCode: 'COL', regionId: 'CO-SAN', name: 'Santander', coordinates: [-73.6, 6.7], weight: 1, spread: 0.18 },
  { id: 'COL-TOL', countryCode: 'COL', regionId: 'CO-TOL', name: 'Tolima', coordinates: [-75.3, 4], weight: 1, spread: 0.18 },
  { id: 'COL-QUI', countryCode: 'COL', regionId: 'CO-QUI', name: 'Quindío', coordinates: [-75.6, 4.6], weight: 1, spread: 0.18 },
  { id: 'COL-RIS', countryCode: 'COL', regionId: 'CO-RIS', name: 'Risaralda', coordinates: [-75.8, 5.1], weight: 1, spread: 0.18 },
  // GBR
  { id: 'GBR-DRY', countryCode: 'GBR', regionId: 'GB-DRY', name: 'Derry', coordinates: [-7.2, 54.9], weight: 1, spread: 0.1 },
  { id: 'GBR-STB', countryCode: 'GBR', regionId: 'GB-STB', name: 'Strabane', coordinates: [-7.4, 54.8], weight: 1, spread: 0.1 },
  { id: 'GBR-FER', countryCode: 'GBR', regionId: 'GB-FER', name: 'Fermanagh', coordinates: [-7.6, 54.4], weight: 1, spread: 0.1 },
  { id: 'GBR-DGN', countryCode: 'GBR', regionId: 'GB-DGN', name: 'Dungannon', coordinates: [-6.9, 54.4], weight: 1, spread: 0.1 },
  { id: 'GBR-ARM', countryCode: 'GBR', regionId: 'GB-ARM', name: 'Armagh', coordinates: [-6.6, 54.3], weight: 1, spread: 0.1 },
  { id: 'GBR-NYM', countryCode: 'GBR', regionId: 'GB-NYM', name: 'Newry and Mourne', coordinates: [-6.3, 54.2], weight: 1, spread: 0.1 },
  { id: 'GBR-FLN', countryCode: 'GBR', regionId: 'GB-FLN', name: 'Flintshire', coordinates: [-3.2, 53.2], weight: 1, spread: 0.1 },
  { id: 'GBR-CHW', countryCode: 'GBR', regionId: 'GB-CHW', name: 'Cheshire West and Chester', coordinates: [-2.8, 53.2], weight: 1, spread: 0.1 },
  { id: 'GBR-WRX', countryCode: 'GBR', regionId: 'GB-WRX', name: 'Wrexham', coordinates: [-3, 53], weight: 1, spread: 0.1 },
  { id: 'GBR-SHR', countryCode: 'GBR', regionId: 'GB-SHR', name: 'Shropshire', coordinates: [-2.7, 52.7], weight: 1, spread: 0.1 },
  { id: 'GBR-POW', countryCode: 'GBR', regionId: 'GB-POW', name: 'Powys', coordinates: [-3.4, 52.3], weight: 1, spread: 0.1 },
  { id: 'GBR-HEF', countryCode: 'GBR', regionId: 'GB-HEF', name: 'Herefordshire', coordinates: [-2.8, 52.1], weight: 1, spread: 0.1 },
  { id: 'GBR-MON', countryCode: 'GBR', regionId: 'GB-MON', name: 'Monmouthshire', coordinates: [-2.9, 51.8], weight: 1, spread: 0.1 },
  { id: 'GBR-GLS', countryCode: 'GBR', regionId: 'GB-GLS', name: 'Gloucestershire', coordinates: [-2.2, 51.8], weight: 1, spread: 0.1 },
  { id: 'GBR-SCB', countryCode: 'GBR', regionId: 'GB-SCB', name: 'Scottish Borders', coordinates: [-2.8, 55.6], weight: 1, spread: 0.1 },
  { id: 'GBR-NBL', countryCode: 'GBR', regionId: 'GB-NBL', name: 'Northumberland', coordinates: [-2.2, 55.2], weight: 1, spread: 0.1 },
  { id: 'GBR-CMA', countryCode: 'GBR', regionId: 'GB-CMA', name: 'Cumbria', coordinates: [-2.8, 54.7], weight: 1, spread: 0.1 },
  { id: 'GBR-DGY', countryCode: 'GBR', regionId: 'GB-DGY', name: 'Dumfries and Galloway', coordinates: [-4, 55.1], weight: 1, spread: 0.1 },
  { id: 'GBR-LMV', countryCode: 'GBR', regionId: 'GB-LMV', name: 'Limavady', coordinates: [-7, 55], weight: 1, spread: 0.1 },
  { id: 'GBR-CLR', countryCode: 'GBR', regionId: 'GB-CLR', name: 'Coleraine', coordinates: [-6.7, 55.1], weight: 1, spread: 0.1 },
  { id: 'GBR-MYL', countryCode: 'GBR', regionId: 'GB-MYL', name: 'Moyle', coordinates: [-6.3, 55.2], weight: 1, spread: 0.1 },
  { id: 'GBR-LRN', countryCode: 'GBR', regionId: 'GB-LRN', name: 'Larne', coordinates: [-5.9, 54.9], weight: 1, spread: 0.1 },
  { id: 'GBR-CKF', countryCode: 'GBR', regionId: 'GB-CKF', name: 'Carrickfergus', coordinates: [-5.8, 54.7], weight: 1, spread: 0.1 },
  { id: 'GBR-NTA', countryCode: 'GBR', regionId: 'GB-NTA', name: 'Newtownabbey', coordinates: [-6, 54.7], weight: 1, spread: 0.1 },
  { id: 'GBR-BFS', countryCode: 'GBR', regionId: 'GB-BFS', name: 'Belfast', coordinates: [-5.9, 54.6], weight: 1, spread: 0.1 },
  { id: 'GBR-NDN', countryCode: 'GBR', regionId: 'GB-NDN', name: 'North Down', coordinates: [-5.8, 54.6], weight: 1, spread: 0.1 },
  { id: 'GBR-ARD', countryCode: 'GBR', regionId: 'GB-ARD', name: 'Ards', coordinates: [-5.6, 54.5], weight: 1, spread: 0.1 },
  { id: 'GBR-DOW', countryCode: 'GBR', regionId: 'GB-DOW', name: 'Down', coordinates: [-5.8, 54.4], weight: 1, spread: 0.1 },
  { id: 'GBR-CLK', countryCode: 'GBR', regionId: 'GB-CLK', name: 'Clackmannanshire', coordinates: [-3.8, 56.1], weight: 1, spread: 0.1 },
  { id: 'GBR-STG', countryCode: 'GBR', regionId: 'GB-STG', name: 'Stirling', coordinates: [-4.2, 56.2], weight: 1, spread: 0.1 },
  { id: 'GBR-FAL', countryCode: 'GBR', regionId: 'GB-FAL', name: 'Falkirk', coordinates: [-3.8, 56], weight: 1, spread: 0.1 },
  { id: 'GBR-WLN', countryCode: 'GBR', regionId: 'GB-WLN', name: 'West Lothian', coordinates: [-3.6, 55.9], weight: 1, spread: 0.1 },
  { id: 'GBR-MLN', countryCode: 'GBR', regionId: 'GB-MLN', name: 'Midlothian', coordinates: [-3.1, 55.9], weight: 1, spread: 0.1 },
  { id: 'GBR-ELN', countryCode: 'GBR', regionId: 'GB-ELN', name: 'East Lothian', coordinates: [-2.8, 55.9], weight: 1, spread: 0.1 },
  { id: 'GBR-NTY', countryCode: 'GBR', regionId: 'GB-NTY', name: 'North Tyneside', coordinates: [-1.5, 55], weight: 1, spread: 0.1 },
  { id: 'GBR-STY', countryCode: 'GBR', regionId: 'GB-STY', name: 'South Tyneside', coordinates: [-1.5, 55], weight: 1, spread: 0.1 },
  { id: 'GBR-SND', countryCode: 'GBR', regionId: 'GB-SND', name: 'Sunderland', coordinates: [-1.4, 54.9], weight: 1, spread: 0.1 },
  { id: 'GBR-DUR', countryCode: 'GBR', regionId: 'GB-DUR', name: 'Durham', coordinates: [-1.7, 54.7], weight: 1, spread: 0.1 },
  { id: 'GBR-HPL', countryCode: 'GBR', regionId: 'GB-HPL', name: 'Hartlepool', coordinates: [-1.3, 54.7], weight: 1, spread: 0.1 },
  { id: 'GBR-RCC', countryCode: 'GBR', regionId: 'GB-RCC', name: 'Redcar and Cleveland', coordinates: [-1.1, 54.6], weight: 1, spread: 0.1 },
  { id: 'GBR-NYK', countryCode: 'GBR', regionId: 'GB-NYK', name: 'North Yorkshire', coordinates: [-1.3, 54.1], weight: 1, spread: 0.1 },
  { id: 'GBR-ERY', countryCode: 'GBR', regionId: 'GB-ERY', name: 'East Riding of Yorkshire', coordinates: [-0.5, 53.8], weight: 1, spread: 0.1 },
  { id: 'GBR-KHL', countryCode: 'GBR', regionId: 'GB-KHL', name: 'Kingston upon Hull', coordinates: [-0.3, 53.7], weight: 1, spread: 0.1 },
  { id: 'GBR-NLN', countryCode: 'GBR', regionId: 'GB-NLN', name: 'North Lincolnshire', coordinates: [-0.6, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-NEL', countryCode: 'GBR', regionId: 'GB-NEL', name: 'North East Lincolnshire', coordinates: [-0.2, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-LIN', countryCode: 'GBR', regionId: 'GB-LIN', name: 'Lincolnshire', coordinates: [-0.2, 53.1], weight: 1, spread: 0.1 },
  { id: 'GBR-NFK', countryCode: 'GBR', regionId: 'GB-NFK', name: 'Norfolk', coordinates: [0.8, 52.7], weight: 1, spread: 0.1 },
  { id: 'GBR-SFK', countryCode: 'GBR', regionId: 'GB-SFK', name: 'Suffolk', coordinates: [1.1, 52.2], weight: 1, spread: 0.1 },
  { id: 'GBR-ESS', countryCode: 'GBR', regionId: 'GB-ESS', name: 'Essex', coordinates: [0.6, 51.8], weight: 1, spread: 0.1 },
  { id: 'GBR-SOS', countryCode: 'GBR', regionId: 'GB-SOS', name: 'Southend-on-Sea', coordinates: [0.8, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-THR', countryCode: 'GBR', regionId: 'GB-THR', name: 'Thurrock', coordinates: [0.4, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-KEN', countryCode: 'GBR', regionId: 'GB-KEN', name: 'Kent', coordinates: [0.7, 51.3], weight: 1, spread: 0.1 },
  { id: 'GBR-MDW', countryCode: 'GBR', regionId: 'GB-MDW', name: 'Medway', coordinates: [0.5, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-ESX', countryCode: 'GBR', regionId: 'GB-ESX', name: 'East Sussex', coordinates: [0.3, 51], weight: 1, spread: 0.1 },
  { id: 'GBR-BNH', countryCode: 'GBR', regionId: 'GB-BNH', name: 'Brighton and Hove', coordinates: [-0.1, 50.8], weight: 1, spread: 0.1 },
  { id: 'GBR-WSX', countryCode: 'GBR', regionId: 'GB-WSX', name: 'West Sussex', coordinates: [-0.4, 50.9], weight: 1, spread: 0.1 },
  { id: 'GBR-HAM', countryCode: 'GBR', regionId: 'GB-HAM', name: 'Hampshire', coordinates: [-1.2, 51], weight: 1, spread: 0.1 },
  { id: 'GBR-POR', countryCode: 'GBR', regionId: 'GB-POR', name: 'Portsmouth', coordinates: [-1, 50.8], weight: 1, spread: 0.1 },
  { id: 'GBR-STH', countryCode: 'GBR', regionId: 'GB-STH', name: 'Southampton', coordinates: [-1.4, 50.9], weight: 1, spread: 0.1 },
  { id: 'GBR-DOR', countryCode: 'GBR', regionId: 'GB-DOR', name: 'Dorset', coordinates: [-2.2, 50.8], weight: 1, spread: 0.1 },
  { id: 'GBR-BMH', countryCode: 'GBR', regionId: 'GB-BMH', name: 'Bournemouth', coordinates: [-1.9, 50.7], weight: 1, spread: 0.1 },
  { id: 'GBR-POL', countryCode: 'GBR', regionId: 'GB-POL', name: 'Poole', coordinates: [-1.9, 50.7], weight: 1, spread: 0.1 },
  { id: 'GBR-DEV', countryCode: 'GBR', regionId: 'GB-DEV', name: 'Devon', coordinates: [-4, 50.8], weight: 1, spread: 0.1 },
  { id: 'GBR-TOB', countryCode: 'GBR', regionId: 'GB-TOB', name: 'Torbay', coordinates: [-3.5, 50.5], weight: 1, spread: 0.1 },
  { id: 'GBR-PLY', countryCode: 'GBR', regionId: 'GB-PLY', name: 'Plymouth', coordinates: [-4.1, 50.4], weight: 1, spread: 0.1 },
  { id: 'GBR-CON', countryCode: 'GBR', regionId: 'GB-CON', name: 'Cornwall', coordinates: [-4.9, 50.4], weight: 1, spread: 0.1 },
  { id: 'GBR-SOM', countryCode: 'GBR', regionId: 'GB-SOM', name: 'Somerset', coordinates: [-3, 51.1], weight: 1, spread: 0.1 },
  { id: 'GBR-NSM', countryCode: 'GBR', regionId: 'GB-NSM', name: 'North Somerset', coordinates: [-2.8, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-BST', countryCode: 'GBR', regionId: 'GB-BST', name: 'Bristol', coordinates: [-2.7, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-SGC', countryCode: 'GBR', regionId: 'GB-SGC', name: 'South Gloucestershire', coordinates: [-2.5, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-NWP', countryCode: 'GBR', regionId: 'GB-NWP', name: 'Newport', coordinates: [-3, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-CRF', countryCode: 'GBR', regionId: 'GB-CRF', name: 'Cardiff', coordinates: [-3.2, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-VGL', countryCode: 'GBR', regionId: 'GB-VGL', name: 'Vale of Glamorgan', coordinates: [-3.3, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-BGE', countryCode: 'GBR', regionId: 'GB-BGE', name: 'Bridgend', coordinates: [-3.6, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-NTL', countryCode: 'GBR', regionId: 'GB-NTL', name: 'Neath Port Talbot', coordinates: [-3.8, 51.7], weight: 1, spread: 0.1 },
  { id: 'GBR-SWA', countryCode: 'GBR', regionId: 'GB-SWA', name: 'Swansea', coordinates: [-4, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-CMN', countryCode: 'GBR', regionId: 'GB-CMN', name: 'Carmarthenshire', coordinates: [-4.2, 51.9], weight: 1, spread: 0.1 },
  { id: 'GBR-PEM', countryCode: 'GBR', regionId: 'GB-PEM', name: 'Pembrokeshire', coordinates: [-4.8, 51.9], weight: 1, spread: 0.1 },
  { id: 'GBR-CGN', countryCode: 'GBR', regionId: 'GB-CGN', name: 'Ceredigion', coordinates: [-4.2, 52.3], weight: 1, spread: 0.1 },
  { id: 'GBR-GWN', countryCode: 'GBR', regionId: 'GB-GWN', name: 'Gwynedd', coordinates: [-4, 52.8], weight: 1, spread: 0.1 },
  { id: 'GBR-CWY', countryCode: 'GBR', regionId: 'GB-CWY', name: 'Conwy', coordinates: [-3.8, 53.1], weight: 1, spread: 0.1 },
  { id: 'GBR-DEN', countryCode: 'GBR', regionId: 'GB-DEN', name: 'Denbighshire', coordinates: [-3.4, 53.1], weight: 1, spread: 0.1 },
  { id: 'GBR-WRL', countryCode: 'GBR', regionId: 'GB-WRL', name: 'Halton', coordinates: [-3, 53.3], weight: 1, spread: 0.1 },
  { id: 'GBR-HAL', countryCode: 'GBR', regionId: 'GB-HAL', name: 'Halton', coordinates: [-2.7, 53.3], weight: 1, spread: 0.1 },
  { id: 'GBR-KWL', countryCode: 'GBR', regionId: 'GB-KWL', name: 'Knowsley', coordinates: [-2.8, 53.4], weight: 1, spread: 0.1 },
  { id: 'GBR-LIV', countryCode: 'GBR', regionId: 'GB-LIV', name: 'Liverpool', coordinates: [-2.9, 53.4], weight: 1, spread: 0.1 },
  { id: 'GBR-SFT', countryCode: 'GBR', regionId: 'GB-SFT', name: 'Sefton', coordinates: [-3, 53.5], weight: 1, spread: 0.1 },
  { id: 'GBR-LAN', countryCode: 'GBR', regionId: 'GB-LAN', name: 'Lancashire', coordinates: [-2.7, 53.8], weight: 1, spread: 0.1 },
  { id: 'GBR-BPL', countryCode: 'GBR', regionId: 'GB-BPL', name: 'Blackpool', coordinates: [-3, 53.8], weight: 1, spread: 0.1 },
  { id: 'GBR-SAY', countryCode: 'GBR', regionId: 'GB-SAY', name: 'South Ayrshire', coordinates: [-4.7, 55.3], weight: 1, spread: 0.1 },
  { id: 'GBR-NAY', countryCode: 'GBR', regionId: 'GB-NAY', name: 'North Ayshire', coordinates: [-4.7, 55.7], weight: 1, spread: 0.1 },
  { id: 'GBR-IVC', countryCode: 'GBR', regionId: 'GB-IVC', name: 'Inverclyde', coordinates: [-4.8, 55.9], weight: 1, spread: 0.1 },
  { id: 'GBR-RFW', countryCode: 'GBR', regionId: 'GB-RFW', name: 'Renfrewshire', coordinates: [-4.5, 55.9], weight: 1, spread: 0.1 },
  { id: 'GBR-WDU', countryCode: 'GBR', regionId: 'GB-WDU', name: 'West Dunbartonshire', coordinates: [-4.5, 55.9], weight: 1, spread: 0.1 },
  { id: 'GBR-AGB', countryCode: 'GBR', regionId: 'GB-AGB', name: 'Argyll and Bute', coordinates: [-5.7, 56.2], weight: 1, spread: 0.1 },
  { id: 'GBR-HLD', countryCode: 'GBR', regionId: 'GB-HLD', name: 'Highland', coordinates: [-5.4, 57.4], weight: 1, spread: 0.1 },
  { id: 'GBR-MRY', countryCode: 'GBR', regionId: 'GB-MRY', name: 'Moray', coordinates: [-3.3, 57.4], weight: 1, spread: 0.1 },
  { id: 'GBR-ABD', countryCode: 'GBR', regionId: 'GB-ABD', name: 'Aberdeenshire', coordinates: [-2.7, 57.2], weight: 1, spread: 0.1 },
  { id: 'GBR-ABE', countryCode: 'GBR', regionId: 'GB-ABE', name: 'Aberdeen', coordinates: [-2.2, 57.2], weight: 1, spread: 0.1 },
  { id: 'GBR-ANS', countryCode: 'GBR', regionId: 'GB-ANS', name: 'Angus', coordinates: [-2.9, 56.7], weight: 1, spread: 0.1 },
  { id: 'GBR-DND', countryCode: 'GBR', regionId: 'GB-DND', name: 'Dundee', coordinates: [-2.9, 56.5], weight: 1, spread: 0.1 },
  { id: 'GBR-PKN', countryCode: 'GBR', regionId: 'GB-PKN', name: 'Perthshire and Kinross', coordinates: [-3.7, 56.5], weight: 1, spread: 0.1 },
  { id: 'GBR-FIF', countryCode: 'GBR', regionId: 'GB-FIF', name: 'Fife', coordinates: [-3.2, 56.2], weight: 1, spread: 0.1 },
  { id: 'GBR-IOW', countryCode: 'GBR', regionId: 'GB-IOW', name: 'Isle of Wight', coordinates: [-1.2, 50.7], weight: 1, spread: 0.1 },
  { id: 'GBR-AGY', countryCode: 'GBR', regionId: 'GB-AGY', name: 'Anglesey', coordinates: [-4.4, 53.3], weight: 1, spread: 0.1 },
  { id: 'GBR-ELS', countryCode: 'GBR', regionId: 'GB-ELS', name: 'Eilean Siar', coordinates: [-7.7, 57.7], weight: 1, spread: 0.1 },
  { id: 'GBR-ORK', countryCode: 'GBR', regionId: 'GB-ORK', name: 'Orkney', coordinates: [-2.9, 59.1], weight: 1, spread: 0.1 },
  { id: 'GBR-ZET', countryCode: 'GBR', regionId: 'GB-ZET', name: 'Shetland Islands', coordinates: [-1.2, 60.3], weight: 1, spread: 0.1 },
  { id: 'GBR-IOS', countryCode: 'GBR', regionId: 'GB-IOS', name: 'Isles of Scilly', coordinates: [-6.3, 49.9], weight: 1, spread: 0.1 },
  { id: 'GBR-CAY', countryCode: 'GBR', regionId: 'GB-CAY', name: 'Caerphilly', coordinates: [-3.2, 51.7], weight: 1, spread: 0.1 },
  { id: 'GBR-RCT', countryCode: 'GBR', regionId: 'GB-RCT', name: 'Rhondda, Cynon, Taff', coordinates: [-3.4, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-BGW', countryCode: 'GBR', regionId: 'GB-BGW', name: 'Blaenau Gwent', coordinates: [-3.2, 51.8], weight: 1, spread: 0.1 },
  { id: 'GBR-TOF', countryCode: 'GBR', regionId: 'GB-TOF', name: 'Torfaen', coordinates: [-3.1, 51.7], weight: 1, spread: 0.1 },
  { id: 'GBR-MTY', countryCode: 'GBR', regionId: 'GB-MTY', name: 'Merthyr Tydfil', coordinates: [-3.4, 51.8], weight: 1, spread: 0.1 },
  { id: 'GBR-NLK', countryCode: 'GBR', regionId: 'GB-NLK', name: 'North Lanarkshire', coordinates: [-4, 55.9], weight: 1, spread: 0.1 },
  { id: 'GBR-EDU', countryCode: 'GBR', regionId: 'GB-EDU', name: 'East Dunbartonshire', coordinates: [-4.2, 56], weight: 1, spread: 0.1 },
  { id: 'GBR-GLG', countryCode: 'GBR', regionId: 'GB-GLG', name: 'Glasgow', coordinates: [-4.3, 55.9], weight: 1, spread: 0.1 },
  { id: 'GBR-ERW', countryCode: 'GBR', regionId: 'GB-ERW', name: 'East Renfrewshire', coordinates: [-4.4, 55.8], weight: 1, spread: 0.1 },
  { id: 'GBR-EAY', countryCode: 'GBR', regionId: 'GB-EAY', name: 'East Ayrshire', coordinates: [-4.3, 55.5], weight: 1, spread: 0.1 },
  { id: 'GBR-SLK', countryCode: 'GBR', regionId: 'GB-SLK', name: 'South Lanarkshire', coordinates: [-3.9, 55.6], weight: 1, spread: 0.1 },
  { id: 'GBR-MFT', countryCode: 'GBR', regionId: 'GB-MFT', name: 'Magherafelt', coordinates: [-6.7, 54.8], weight: 1, spread: 0.1 },
  { id: 'GBR-OMH', countryCode: 'GBR', regionId: 'GB-OMH', name: 'Omagh', coordinates: [-7.3, 54.6], weight: 1, spread: 0.1 },
  { id: 'GBR-CKT', countryCode: 'GBR', regionId: 'GB-CKT', name: 'Mid Ulster', coordinates: [-6.7, 54.6], weight: 1, spread: 0.1 },
  { id: 'GBR-CGV', countryCode: 'GBR', regionId: 'GB-CGV', name: 'Craigavon', coordinates: [-6.4, 54.5], weight: 1, spread: 0.1 },
  { id: 'GBR-BNB', countryCode: 'GBR', regionId: 'GB-BNB', name: 'Banbridge', coordinates: [-6.2, 54.3], weight: 1, spread: 0.1 },
  { id: 'GBR-ANT', countryCode: 'GBR', regionId: 'GB-ANT', name: 'Antrim', coordinates: [-6.3, 54.7], weight: 1, spread: 0.1 },
  { id: 'GBR-LSB', countryCode: 'GBR', regionId: 'GB-LSB', name: 'Lisburn', coordinates: [-6, 54.5], weight: 1, spread: 0.1 },
  { id: 'GBR-BLY', countryCode: 'GBR', regionId: 'GB-BLY', name: 'Ballymoney', coordinates: [-6.4, 55], weight: 1, spread: 0.1 },
  { id: 'GBR-BLA', countryCode: 'GBR', regionId: 'GB-BLA', name: 'Ballymena', coordinates: [-6.3, 54.9], weight: 1, spread: 0.1 },
  { id: 'GBR-CSR', countryCode: 'GBR', regionId: 'GB-CSR', name: 'Castlereagh', coordinates: [-5.8, 54.5], weight: 1, spread: 0.1 },
  { id: 'GBR-WND', countryCode: 'GBR', regionId: 'GB-WND', name: 'Wandsworth', coordinates: [-0.2, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-MRT', countryCode: 'GBR', regionId: 'GB-MRT', name: 'Merton', coordinates: [-0.2, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-WSM', countryCode: 'GBR', regionId: 'GB-WSM', name: 'Westminster', coordinates: [-0.2, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-KEC', countryCode: 'GBR', regionId: 'GB-KEC', name: 'Kensington and Chelsea', coordinates: [-0.2, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-HNS', countryCode: 'GBR', regionId: 'GB-HNS', name: 'Hounslow', coordinates: [-0.3, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-EAL', countryCode: 'GBR', regionId: 'GB-EAL', name: 'Ealing', coordinates: [-0.3, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-HMF', countryCode: 'GBR', regionId: 'GB-HMF', name: 'Hammersmith and Fulham', coordinates: [-0.2, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-STT', countryCode: 'GBR', regionId: 'GB-STT', name: 'Stockton-on-Tees', coordinates: [-1.3, 54.6], weight: 1, spread: 0.1 },
  { id: 'GBR-DAL', countryCode: 'GBR', regionId: 'GB-DAL', name: 'Darlington', coordinates: [-1.5, 54.6], weight: 1, spread: 0.1 },
  { id: 'GBR-MDB', countryCode: 'GBR', regionId: 'GB-MDB', name: 'Middlesbrough', coordinates: [-1.2, 54.5], weight: 1, spread: 0.1 },
  { id: 'GBR-RIC', countryCode: 'GBR', regionId: 'GB-RIC', name: 'Richmond upon Thames', coordinates: [-0.3, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-TWH', countryCode: 'GBR', regionId: 'GB-TWH', name: 'Tower Hamlets', coordinates: [0, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-GAT', countryCode: 'GBR', regionId: 'GB-GAT', name: 'Gateshead', coordinates: [-1.7, 54.9], weight: 1, spread: 0.1 },
  { id: 'GBR-NET', countryCode: 'GBR', regionId: 'GB-NET', name: 'Newcastle upon Tyne', coordinates: [-1.6, 55], weight: 1, spread: 0.1 },
  { id: 'GBR-YOR', countryCode: 'GBR', regionId: 'GB-YOR', name: 'York', coordinates: [-1, 53.9], weight: 1, spread: 0.1 },
  { id: 'GBR-SHN', countryCode: 'GBR', regionId: 'GB-SHN', name: 'Merseyside', coordinates: [-2.7, 53.4], weight: 1, spread: 0.1 },
  { id: 'GBR-ENF', countryCode: 'GBR', regionId: 'GB-ENF', name: 'Enfield', coordinates: [-0.1, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-HRT', countryCode: 'GBR', regionId: 'GB-HRT', name: 'Hertfordshire', coordinates: [-0.3, 51.8], weight: 1, spread: 0.1 },
  { id: 'GBR-BNE', countryCode: 'GBR', regionId: 'GB-BNE', name: 'Barnet', coordinates: [-0.2, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-WFT', countryCode: 'GBR', regionId: 'GB-WFT', name: 'Waltham Forest', coordinates: [0, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-RDB', countryCode: 'GBR', regionId: 'GB-RDB', name: 'Redbridge', coordinates: [0.1, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-HAV', countryCode: 'GBR', regionId: 'GB-HAV', name: 'Havering', coordinates: [0.2, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-CAM', countryCode: 'GBR', regionId: 'GB-CAM', name: 'Cambridgeshire', coordinates: [0, 52.3], weight: 1, spread: 0.1 },
  { id: 'GBR-BEX', countryCode: 'GBR', regionId: 'GB-BEX', name: 'Bexley', coordinates: [0.2, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-STN', countryCode: 'GBR', regionId: 'GB-STN', name: 'Sutton', coordinates: [-0.2, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-MIK', countryCode: 'GBR', regionId: 'GB-MIK', name: 'Milton Keynes', coordinates: [-0.7, 52.1], weight: 1, spread: 0.1 },
  { id: 'GBR-BKM', countryCode: 'GBR', regionId: 'GB-BKM', name: 'Buckinghamshire', coordinates: [-0.8, 51.7], weight: 1, spread: 0.1 },
  { id: 'GBR-HIL', countryCode: 'GBR', regionId: 'GB-HIL', name: 'Hillingdon', coordinates: [-0.4, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-BEN', countryCode: 'GBR', regionId: 'GB-BEN', name: 'Brent', coordinates: [-0.2, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-LUT', countryCode: 'GBR', regionId: 'GB-LUT', name: 'Luton', coordinates: [-0.4, 51.9], weight: 1, spread: 0.1 },
  { id: 'GBR-HRW', countryCode: 'GBR', regionId: 'GB-HRW', name: 'Harrow', coordinates: [-0.3, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-CBF', countryCode: 'GBR', regionId: 'GB-CBF', name: 'Central Bedfordshire', coordinates: [-0.5, 52], weight: 1, spread: 0.1 },
  { id: 'GBR-BDF', countryCode: 'GBR', regionId: 'GB-BDF', name: 'Bedford', coordinates: [-0.5, 52.2], weight: 1, spread: 0.1 },
  { id: 'GBR-RUT', countryCode: 'GBR', regionId: 'GB-RUT', name: 'Rutland', coordinates: [-0.7, 52.7], weight: 1, spread: 0.1 },
  { id: 'GBR-NTT', countryCode: 'GBR', regionId: 'GB-NTT', name: 'Nottinghamshire', coordinates: [-1, 53.1], weight: 1, spread: 0.1 },
  { id: 'GBR-NTH', countryCode: 'GBR', regionId: 'GB-NTH', name: 'Northamptonshire', coordinates: [-0.8, 52.3], weight: 1, spread: 0.1 },
  { id: 'GBR-CMD', countryCode: 'GBR', regionId: 'GB-CMD', name: 'Camden', coordinates: [-0.1, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-ISL', countryCode: 'GBR', regionId: 'GB-ISL', name: 'Islington', coordinates: [-0.1, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-PTE', countryCode: 'GBR', regionId: 'GB-PTE', name: 'Peterborough', coordinates: [-0.3, 52.6], weight: 1, spread: 0.1 },
  { id: 'GBR-LBH', countryCode: 'GBR', regionId: 'GB-LBH', name: 'Lambeth', coordinates: [-0.1, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-SWK', countryCode: 'GBR', regionId: 'GB-SWK', name: 'Southwark', coordinates: [-0.1, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-DNC', countryCode: 'GBR', regionId: 'GB-DNC', name: 'Doncaster', coordinates: [-1.1, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-CRY', countryCode: 'GBR', regionId: 'GB-CRY', name: 'Croydon', coordinates: [-0.1, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-LEW', countryCode: 'GBR', regionId: 'GB-LEW', name: 'Lewisham', coordinates: [0, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-HRY', countryCode: 'GBR', regionId: 'GB-HRY', name: 'Haringey', coordinates: [-0.1, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-KTT', countryCode: 'GBR', regionId: 'GB-KTT', name: 'Kingston upon Thames', coordinates: [-0.3, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-NWM', countryCode: 'GBR', regionId: 'GB-NWM', name: 'Newham', coordinates: [0, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-GRE', countryCode: 'GBR', regionId: 'GB-GRE', name: 'Greenwich', coordinates: [0, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-HCK', countryCode: 'GBR', regionId: 'GB-HCK', name: 'Hackney', coordinates: [-0.1, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-BDG', countryCode: 'GBR', regionId: 'GB-BDG', name: 'Barking and Dagenham', coordinates: [0.1, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-LEC', countryCode: 'GBR', regionId: 'GB-LEC', name: 'Leicestershire', coordinates: [-1.1, 52.7], weight: 1, spread: 0.1 },
  { id: 'GBR-CHE', countryCode: 'GBR', regionId: 'GB-CHE', name: 'Cheshire East', coordinates: [-2.3, 53.2], weight: 1, spread: 0.1 },
  { id: 'GBR-DBY', countryCode: 'GBR', regionId: 'GB-DBY', name: 'Derbyshire', coordinates: [-1.6, 53.1], weight: 1, spread: 0.1 },
  { id: 'GBR-ROT', countryCode: 'GBR', regionId: 'GB-ROT', name: 'Rotherham', coordinates: [-1.3, 53.4], weight: 1, spread: 0.1 },
  { id: 'GBR-SHF', countryCode: 'GBR', regionId: 'GB-SHF', name: 'Sheffield', coordinates: [-1.5, 53.4], weight: 1, spread: 0.1 },
  { id: 'GBR-STE', countryCode: 'GBR', regionId: 'GB-STE', name: 'Stoke-on-Trent', coordinates: [-2.2, 53.1], weight: 1, spread: 0.1 },
  { id: 'GBR-TFW', countryCode: 'GBR', regionId: 'GB-TFW', name: 'Telford and Wrekin', coordinates: [-2.4, 52.8], weight: 1, spread: 0.1 },
  { id: 'GBR-STS', countryCode: 'GBR', regionId: 'GB-STS', name: 'Staffordshire', coordinates: [-2, 52.8], weight: 1, spread: 0.1 },
  { id: 'GBR-BRY', countryCode: 'GBR', regionId: 'GB-BRY', name: 'Bromley', coordinates: [0, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-WOR', countryCode: 'GBR', regionId: 'GB-WOR', name: 'Worcestershire', coordinates: [-2.1, 52.2], weight: 1, spread: 0.1 },
  { id: 'GBR-WAR', countryCode: 'GBR', regionId: 'GB-WAR', name: 'Warwickshire', coordinates: [-1.7, 52.3], weight: 1, spread: 0.1 },
  { id: 'GBR-OXF', countryCode: 'GBR', regionId: 'GB-OXF', name: 'Oxfordshire', coordinates: [-1.3, 51.8], weight: 1, spread: 0.1 },
  { id: 'GBR-WGN', countryCode: 'GBR', regionId: 'GB-WGN', name: 'Wigan', coordinates: [-2.6, 53.5], weight: 1, spread: 0.1 },
  { id: 'GBR-SKP', countryCode: 'GBR', regionId: 'GB-SKP', name: 'Stockport', coordinates: [-2.1, 53.4], weight: 1, spread: 0.1 },
  { id: 'GBR-WRT', countryCode: 'GBR', regionId: 'GB-WRT', name: 'Warrington', coordinates: [-2.5, 53.4], weight: 1, spread: 0.1 },
  { id: 'GBR-WBK', countryCode: 'GBR', regionId: 'GB-WBK', name: 'West Berkshire', coordinates: [-1.3, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-WOK', countryCode: 'GBR', regionId: 'GB-WOK', name: 'Wokingham', coordinates: [-0.9, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-BRC', countryCode: 'GBR', regionId: 'GB-BRC', name: 'Bracknell Forest', coordinates: [-0.8, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-WNM', countryCode: 'GBR', regionId: 'GB-WNM', name: 'Royal Borough of Windsor and Maidenhead', coordinates: [-0.7, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-SLG', countryCode: 'GBR', regionId: 'GB-SLG', name: 'Slough', coordinates: [-0.6, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-RDG', countryCode: 'GBR', regionId: 'GB-RDG', name: 'Reading', coordinates: [-1, 51.5], weight: 1, spread: 0.1 },
  { id: 'GBR-SRY', countryCode: 'GBR', regionId: 'GB-SRY', name: 'Surrey', coordinates: [-0.3, 51.3], weight: 1, spread: 0.1 },
  { id: 'GBR-BBD', countryCode: 'GBR', regionId: 'GB-BBD', name: 'Blackburn with Darwen', coordinates: [-2.4, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-SWD', countryCode: 'GBR', regionId: 'GB-SWD', name: 'Swindon', coordinates: [-1.7, 51.6], weight: 1, spread: 0.1 },
  { id: 'GBR-BAS', countryCode: 'GBR', regionId: 'GB-BAS', name: 'Bath and North East Somerset', coordinates: [-2.5, 51.4], weight: 1, spread: 0.1 },
  { id: 'GBR-WIL', countryCode: 'GBR', regionId: 'GB-WIL', name: 'Wiltshire', coordinates: [-1.9, 51.3], weight: 1, spread: 0.1 },
  { id: 'GBR-CLD', countryCode: 'GBR', regionId: 'GB-CLD', name: 'Calderdale', coordinates: [-2, 53.7], weight: 1, spread: 0.1 },
  { id: 'GBR-KIR', countryCode: 'GBR', regionId: 'GB-KIR', name: 'Kirklees', coordinates: [-1.8, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-NGM', countryCode: 'GBR', regionId: 'GB-NGM', name: 'Nottingham', coordinates: [-1.2, 52.9], weight: 1, spread: 0.1 },
  { id: 'GBR-LCE', countryCode: 'GBR', regionId: 'GB-LCE', name: 'Leicester', coordinates: [-1.1, 52.6], weight: 1, spread: 0.1 },
  { id: 'GBR-DER', countryCode: 'GBR', regionId: 'GB-DER', name: 'Derby', coordinates: [-1.4, 52.8], weight: 1, spread: 0.1 },
  { id: 'GBR-LDS', countryCode: 'GBR', regionId: 'GB-LDS', name: 'Leeds', coordinates: [-1.5, 53.8], weight: 1, spread: 0.1 },
  { id: 'GBR-BRD', countryCode: 'GBR', regionId: 'GB-BRD', name: 'Bradford', coordinates: [-1.8, 53.8], weight: 1, spread: 0.1 },
  { id: 'GBR-WKF', countryCode: 'GBR', regionId: 'GB-WKF', name: 'Wakefield', coordinates: [-1.4, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-BNS', countryCode: 'GBR', regionId: 'GB-BNS', name: 'Barnsley', coordinates: [-1.6, 53.5], weight: 1, spread: 0.1 },
  { id: 'GBR-SLF', countryCode: 'GBR', regionId: 'GB-SLF', name: 'Salford', coordinates: [-2.4, 53.5], weight: 1, spread: 0.1 },
  { id: 'GBR-BOL', countryCode: 'GBR', regionId: 'GB-BOL', name: 'Bolton', coordinates: [-2.5, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-TRF', countryCode: 'GBR', regionId: 'GB-TRF', name: 'Trafford', coordinates: [-2.4, 53.4], weight: 1, spread: 0.1 },
  { id: 'GBR-OLD', countryCode: 'GBR', regionId: 'GB-OLD', name: 'Oldham', coordinates: [-2.1, 53.5], weight: 1, spread: 0.1 },
  { id: 'GBR-RCH', countryCode: 'GBR', regionId: 'GB-RCH', name: 'Rochdale', coordinates: [-2.1, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-TAM', countryCode: 'GBR', regionId: 'GB-TAM', name: 'Tameside', coordinates: [-2.1, 53.5], weight: 1, spread: 0.1 },
  { id: 'GBR-BUR', countryCode: 'GBR', regionId: 'GB-BUR', name: 'Bury', coordinates: [-2.3, 53.6], weight: 1, spread: 0.1 },
  { id: 'GBR-SOL', countryCode: 'GBR', regionId: 'GB-SOL', name: 'Solihull', coordinates: [-1.7, 52.4], weight: 1, spread: 0.1 },
  { id: 'GBR-COV', countryCode: 'GBR', regionId: 'GB-COV', name: 'Coventry', coordinates: [-1.6, 52.4], weight: 1, spread: 0.1 },
  { id: 'GBR-BIR', countryCode: 'GBR', regionId: 'GB-BIR', name: 'Birmingham', coordinates: [-1.9, 52.5], weight: 1, spread: 0.1 },
  { id: 'GBR-SAW', countryCode: 'GBR', regionId: 'GB-SAW', name: 'Sandwell', coordinates: [-2, 52.5], weight: 1, spread: 0.1 },
  { id: 'GBR-DUD', countryCode: 'GBR', regionId: 'GB-DUD', name: 'Dudley', coordinates: [-2.1, 52.5], weight: 1, spread: 0.1 },
  { id: 'GBR-WLL', countryCode: 'GBR', regionId: 'GB-WLL', name: 'Walsall', coordinates: [-2, 52.6], weight: 1, spread: 0.1 },
  { id: 'GBR-WLV', countryCode: 'GBR', regionId: 'GB-WLV', name: 'Wolverhampton', coordinates: [-2.1, 52.6], weight: 1, spread: 0.1 },
  // DEU
  { id: 'DEU-SN', countryCode: 'DEU', regionId: 'DE-SN', name: 'Sachsen', coordinates: [13.2, 51], weight: 1, spread: 0.12 },
  { id: 'DEU-RP', countryCode: 'DEU', regionId: 'DE-RP', name: 'Rheinland-Pfalz', coordinates: [7.3, 50], weight: 1, spread: 0.12 },
  { id: 'DEU-SL', countryCode: 'DEU', regionId: 'DE-SL', name: 'Saarland', coordinates: [6.8, 49.4], weight: 1, spread: 0.12 },
  { id: 'DEU-SH', countryCode: 'DEU', regionId: 'DE-SH', name: 'Schleswig-Holstein', coordinates: [9.3, 54.3], weight: 1, spread: 0.12 },
  { id: 'DEU-NI', countryCode: 'DEU', regionId: 'DE-NI', name: 'Niedersachsen', coordinates: [8.4, 53.1], weight: 1, spread: 0.12 },
  { id: 'DEU-BW', countryCode: 'DEU', regionId: 'DE-BW', name: 'Baden-Württemberg', coordinates: [9.1, 48.6], weight: 1, spread: 0.12 },
  { id: 'DEU-BB', countryCode: 'DEU', regionId: 'DE-BB', name: 'Brandenburg', coordinates: [13.3, 52.6], weight: 1, spread: 0.12 },
  { id: 'DEU-MV', countryCode: 'DEU', regionId: 'DE-MV', name: 'Mecklenburg-Vorpommern', coordinates: [12.7, 53.9], weight: 1, spread: 0.12 },
  { id: 'DEU-HB', countryCode: 'DEU', regionId: 'DE-HB', name: 'Bremen', coordinates: [8.6, 53.3], weight: 1, spread: 0.12 },
  { id: 'DEU-HE', countryCode: 'DEU', regionId: 'DE-HE', name: 'Hessen', coordinates: [9.1, 50.6], weight: 1, spread: 0.12 },
  { id: 'DEU-TH', countryCode: 'DEU', regionId: 'DE-TH', name: 'Thüringen', coordinates: [11.1, 50.9], weight: 1, spread: 0.12 },
  { id: 'DEU-ST', countryCode: 'DEU', regionId: 'DE-ST', name: 'Sachsen-Anhalt', coordinates: [11.7, 51.9], weight: 1, spread: 0.12 },
  // FRA
  { id: 'FRA-GF', countryCode: 'FRA', regionId: 'FR-GF', name: 'Guyane française', coordinates: [-53.3, 3.8], weight: 1, spread: 0.12 },
  { id: 'FRA-08', countryCode: 'FRA', regionId: 'FR-08', name: 'Ardennes', coordinates: [4.7, 49.6], weight: 1, spread: 0.12 },
  { id: 'FRA-02', countryCode: 'FRA', regionId: 'FR-02', name: 'Aisne', coordinates: [3.7, 49.6], weight: 1, spread: 0.12 },
  { id: 'FRA-55', countryCode: 'FRA', regionId: 'FR-55', name: 'Meuse', coordinates: [5.4, 49.1], weight: 1, spread: 0.12 },
  { id: 'FRA-54', countryCode: 'FRA', regionId: 'FR-54', name: 'Meurthe-et-Moselle', coordinates: [6.1, 48.9], weight: 1, spread: 0.12 },
  { id: 'FRA-57', countryCode: 'FRA', regionId: 'FR-57', name: 'Moselle', coordinates: [6.8, 49], weight: 1, spread: 0.12 },
  { id: 'FRA-04', countryCode: 'FRA', regionId: 'FR-04', name: 'Alpes-de-Haute-Provence', coordinates: [6.3, 44.2], weight: 1, spread: 0.12 },
  { id: 'FRA-05', countryCode: 'FRA', regionId: 'FR-05', name: 'Hautes-Alpes', coordinates: [6.4, 44.7], weight: 1, spread: 0.12 },
  { id: 'FRA-73', countryCode: 'FRA', regionId: 'FR-73', name: 'Savoie', coordinates: [6.4, 45.5], weight: 1, spread: 0.12 },
  { id: 'FRA-74', countryCode: 'FRA', regionId: 'FR-74', name: 'Haute-Savoie', coordinates: [6.5, 46], weight: 1, spread: 0.12 },
  { id: 'FRA-64', countryCode: 'FRA', regionId: 'FR-64', name: 'Pyrénées-Atlantiques', coordinates: [-0.6, 43.3], weight: 1, spread: 0.12 },
  { id: 'FRA-65', countryCode: 'FRA', regionId: 'FR-65', name: 'Hautes-Pyrénées', coordinates: [0, 43.2], weight: 1, spread: 0.12 },
  { id: 'FRA-09', countryCode: 'FRA', regionId: 'FR-09', name: 'Ariège', coordinates: [1.5, 42.8], weight: 1, spread: 0.12 },
  { id: 'FRA-66', countryCode: 'FRA', regionId: 'FR-66', name: 'Pyrénées-Orientales', coordinates: [2.3, 42.6], weight: 1, spread: 0.12 },
  { id: 'FRA-67', countryCode: 'FRA', regionId: 'FR-67', name: 'Bas-Rhin', coordinates: [7.5, 48.7], weight: 1, spread: 0.12 },
  { id: 'FRA-68', countryCode: 'FRA', regionId: 'FR-68', name: 'Haute-Rhin', coordinates: [7.3, 47.8], weight: 1, spread: 0.12 },
  { id: 'FRA-90', countryCode: 'FRA', regionId: 'FR-90', name: 'Territoire de Belfort', coordinates: [6.9, 47.6], weight: 1, spread: 0.12 },
  { id: 'FRA-25', countryCode: 'FRA', regionId: 'FR-25', name: 'Doubs', coordinates: [6.4, 47.1], weight: 1, spread: 0.12 },
  { id: 'FRA-01', countryCode: 'FRA', regionId: 'FR-01', name: 'Ain', coordinates: [5.5, 46.1], weight: 1, spread: 0.12 },
  { id: 'FRA-39', countryCode: 'FRA', regionId: 'FR-39', name: 'Jura', coordinates: [5.7, 46.7], weight: 1, spread: 0.12 },
  { id: 'FRA-83', countryCode: 'FRA', regionId: 'FR-83', name: 'Var', coordinates: [6.3, 43.4], weight: 1, spread: 0.12 },
  { id: 'FRA-30', countryCode: 'FRA', regionId: 'FR-30', name: 'Gard', coordinates: [4, 43.9], weight: 1, spread: 0.12 },
  { id: 'FRA-34', countryCode: 'FRA', regionId: 'FR-34', name: 'Hérault', coordinates: [3.4, 43.6], weight: 1, spread: 0.12 },
  { id: 'FRA-11', countryCode: 'FRA', regionId: 'FR-11', name: 'Aude', coordinates: [2.5, 43.1], weight: 1, spread: 0.12 },
  { id: 'FRA-40', countryCode: 'FRA', regionId: 'FR-40', name: 'Landes', coordinates: [-0.7, 43.9], weight: 1, spread: 0.12 },
  { id: 'FRA-17', countryCode: 'FRA', regionId: 'FR-17', name: 'Charente-Maritime', coordinates: [-0.8, 45.8], weight: 1, spread: 0.12 },
  { id: 'FRA-85', countryCode: 'FRA', regionId: 'FR-85', name: 'Vendée', coordinates: [-1.7, 46.7], weight: 1, spread: 0.12 },
  { id: 'FRA-56', countryCode: 'FRA', regionId: 'FR-56', name: 'Morbihan', coordinates: [-2.9, 47.7], weight: 1, spread: 0.12 },
  { id: 'FRA-29', countryCode: 'FRA', regionId: 'FR-29', name: 'Finistère', coordinates: [-4.2, 48.2], weight: 1, spread: 0.12 },
  { id: 'FRA-22', countryCode: 'FRA', regionId: 'FR-22', name: 'Côtes-d\'Armor', coordinates: [-2.8, 48.5], weight: 1, spread: 0.12 },
  { id: 'FRA-35', countryCode: 'FRA', regionId: 'FR-35', name: 'Ille-et-Vilaine', coordinates: [-1.7, 48.2], weight: 1, spread: 0.12 },
  { id: 'FRA-50', countryCode: 'FRA', regionId: 'FR-50', name: 'Manche', coordinates: [-1.3, 49], weight: 1, spread: 0.12 },
  { id: 'FRA-14', countryCode: 'FRA', regionId: 'FR-14', name: 'Calvados', coordinates: [-0.5, 49.1], weight: 1, spread: 0.12 },
  { id: 'FRA-27', countryCode: 'FRA', regionId: 'FR-27', name: 'Eure', coordinates: [1, 49.2], weight: 1, spread: 0.12 },
  { id: 'FRA-76', countryCode: 'FRA', regionId: 'FR-76', name: 'Seine-Maritime', coordinates: [0.9, 49.6], weight: 1, spread: 0.12 },
  { id: 'FRA-80', countryCode: 'FRA', regionId: 'FR-80', name: 'Somme', coordinates: [2.2, 50], weight: 1, spread: 0.12 },
  { id: 'FRA-62', countryCode: 'FRA', regionId: 'FR-62', name: 'Pas-de-Calais', coordinates: [2.5, 50.4], weight: 1, spread: 0.12 },
  { id: 'FRA-MQ', countryCode: 'FRA', regionId: 'FR-MQ', name: 'Martinique', coordinates: [-61, 14.6], weight: 1, spread: 0.12 },
  { id: 'FRA-GP', countryCode: 'FRA', regionId: 'FR-GP', name: 'Guadeloupe', coordinates: [-61.4, 16.1], weight: 1, spread: 0.12 },
  { id: 'FRA-RE', countryCode: 'FRA', regionId: 'FR-RE', name: 'La Réunion', coordinates: [55.5, -21.1], weight: 1, spread: 0.12 },
  { id: 'FRA-YT', countryCode: 'FRA', regionId: 'FR-YT', name: 'Mayotte', coordinates: [45.2, -12.8], weight: 1, spread: 0.12 },
  { id: 'FRA-2B', countryCode: 'FRA', regionId: 'FR-2B', name: 'Haute-Corse', coordinates: [9.2, 42.5], weight: 1, spread: 0.12 },
  { id: 'FRA-2A', countryCode: 'FRA', regionId: 'FR-2A', name: 'Corse-du-Sud', coordinates: [9, 41.9], weight: 1, spread: 0.12 },
  { id: 'FRA-32', countryCode: 'FRA', regionId: 'FR-32', name: 'Gers', coordinates: [0.4, 43.6], weight: 1, spread: 0.12 },
  { id: 'FRA-87', countryCode: 'FRA', regionId: 'FR-87', name: 'Haute-Vienne', coordinates: [1.2, 45.9], weight: 1, spread: 0.12 },
  { id: 'FRA-19', countryCode: 'FRA', regionId: 'FR-19', name: 'Corrèze', coordinates: [1.9, 45.4], weight: 1, spread: 0.12 },
  { id: 'FRA-82', countryCode: 'FRA', regionId: 'FR-82', name: 'Tarn-et-Garonne', coordinates: [1.3, 44.2], weight: 1, spread: 0.12 },
  { id: 'FRA-81', countryCode: 'FRA', regionId: 'FR-81', name: 'Tarn', coordinates: [2.2, 43.8], weight: 1, spread: 0.12 },
  { id: 'FRA-38', countryCode: 'FRA', regionId: 'FR-38', name: 'Isère', coordinates: [5.5, 45.3], weight: 1, spread: 0.12 },
  { id: 'FRA-26', countryCode: 'FRA', regionId: 'FR-26', name: 'Drôme', coordinates: [5.2, 44.6], weight: 1, spread: 0.12 },
  { id: 'FRA-12', countryCode: 'FRA', regionId: 'FR-12', name: 'Aveyron', coordinates: [2.6, 44.3], weight: 1, spread: 0.12 },
  { id: 'FRA-46', countryCode: 'FRA', regionId: 'FR-46', name: 'Lot', coordinates: [1.7, 44.6], weight: 1, spread: 0.12 },
  { id: 'FRA-37', countryCode: 'FRA', regionId: 'FR-37', name: 'Indre-et-Loire', coordinates: [0.8, 47.2], weight: 1, spread: 0.12 },
  { id: 'FRA-36', countryCode: 'FRA', regionId: 'FR-36', name: 'Indre', coordinates: [1.6, 46.8], weight: 1, spread: 0.12 },
  { id: 'FRA-41', countryCode: 'FRA', regionId: 'FR-41', name: 'Loir-et-Cher', coordinates: [1.5, 47.6], weight: 1, spread: 0.12 },
  { id: 'FRA-23', countryCode: 'FRA', regionId: 'FR-23', name: 'Creuse', coordinates: [2.1, 46], weight: 1, spread: 0.12 },
  { id: 'FRA-53', countryCode: 'FRA', regionId: 'FR-53', name: 'Mayenne', coordinates: [-0.6, 48.1], weight: 1, spread: 0.12 },
  { id: 'FRA-72', countryCode: 'FRA', regionId: 'FR-72', name: 'Sarthe', coordinates: [0.2, 48], weight: 1, spread: 0.12 },
  { id: 'FRA-84', countryCode: 'FRA', regionId: 'FR-84', name: 'Vaucluse', coordinates: [5.1, 44.1], weight: 1, spread: 0.12 },
  { id: 'FRA-52', countryCode: 'FRA', regionId: 'FR-52', name: 'Haute-Marne', coordinates: [5.2, 48.1], weight: 1, spread: 0.12 },
  { id: 'FRA-51', countryCode: 'FRA', regionId: 'FR-51', name: 'Marne', coordinates: [4.4, 48.9], weight: 1, spread: 0.12 },
  { id: 'FRA-24', countryCode: 'FRA', regionId: 'FR-24', name: 'Dordogne', coordinates: [0.6, 45.1], weight: 1, spread: 0.12 },
  { id: 'FRA-88', countryCode: 'FRA', regionId: 'FR-88', name: 'Vosges', coordinates: [6.4, 48.2], weight: 1, spread: 0.12 },
  { id: 'FRA-07', countryCode: 'FRA', regionId: 'FR-07', name: 'Ardèche', coordinates: [4.5, 44.8], weight: 1, spread: 0.12 },
  { id: 'FRA-42', countryCode: 'FRA', regionId: 'FR-42', name: 'Loire', coordinates: [4.2, 45.8], weight: 1, spread: 0.12 },
  { id: 'FRA-63', countryCode: 'FRA', regionId: 'FR-63', name: 'Puy-de-Dôme', coordinates: [3.1, 45.7], weight: 1, spread: 0.12 },
  { id: 'FRA-03', countryCode: 'FRA', regionId: 'FR-03', name: 'Allier', coordinates: [3.2, 46.4], weight: 1, spread: 0.12 },
  { id: 'FRA-45', countryCode: 'FRA', regionId: 'FR-45', name: 'Loiret', coordinates: [2.3, 47.9], weight: 1, spread: 0.12 },
  { id: 'FRA-49', countryCode: 'FRA', regionId: 'FR-49', name: 'Maine-et-Loire', coordinates: [-0.7, 47.4], weight: 1, spread: 0.12 },
  { id: 'FRA-10', countryCode: 'FRA', regionId: 'FR-10', name: 'Aube', coordinates: [4.2, 48.3], weight: 1, spread: 0.12 },
  { id: 'FRA-92', countryCode: 'FRA', regionId: 'FR-92', name: 'Hauts-de-Seine', coordinates: [2.3, 48.9], weight: 1, spread: 0.12 },
  { id: 'FRA-93', countryCode: 'FRA', regionId: 'FR-93', name: 'Seine-Saint-Denis', coordinates: [2.4, 48.9], weight: 1, spread: 0.12 },
  { id: 'FRA-95', countryCode: 'FRA', regionId: 'FR-95', name: 'Val-d\'Oise', coordinates: [2.2, 49], weight: 1, spread: 0.12 },
  { id: 'FRA-78', countryCode: 'FRA', regionId: 'FR-78', name: 'Yvelines', coordinates: [1.9, 48.8], weight: 1, spread: 0.12 },
  { id: 'FRA-16', countryCode: 'FRA', regionId: 'FR-16', name: 'Charente', coordinates: [0.1, 45.7], weight: 1, spread: 0.12 },
  { id: 'FRA-18', countryCode: 'FRA', regionId: 'FR-18', name: 'Cher', coordinates: [2.3, 47], weight: 1, spread: 0.12 },
  { id: 'FRA-28', countryCode: 'FRA', regionId: 'FR-28', name: 'Eure-et-Loir', coordinates: [1.2, 48.4], weight: 1, spread: 0.12 },
  { id: 'FRA-43', countryCode: 'FRA', regionId: 'FR-43', name: 'Haute-Loire', coordinates: [3.7, 45.2], weight: 1, spread: 0.12 },
  { id: 'FRA-15', countryCode: 'FRA', regionId: 'FR-15', name: 'Cantal', coordinates: [2.8, 45], weight: 1, spread: 0.12 },
  { id: 'FRA-47', countryCode: 'FRA', regionId: 'FR-47', name: 'Lot-et-Garonne', coordinates: [0.4, 44.4], weight: 1, spread: 0.12 },
  { id: 'FRA-48', countryCode: 'FRA', regionId: 'FR-48', name: 'Lozère', coordinates: [3.5, 44.6], weight: 1, spread: 0.12 },
  { id: 'FRA-58', countryCode: 'FRA', regionId: 'FR-58', name: 'Nièvre', coordinates: [3.6, 47.1], weight: 1, spread: 0.12 },
  { id: 'FRA-21', countryCode: 'FRA', regionId: 'FR-21', name: 'Côte-d\'Or', coordinates: [4.7, 47.5], weight: 1, spread: 0.12 },
  { id: 'FRA-60', countryCode: 'FRA', regionId: 'FR-60', name: 'Oise', coordinates: [2.5, 49.5], weight: 1, spread: 0.12 },
  { id: 'FRA-61', countryCode: 'FRA', regionId: 'FR-61', name: 'Orne', coordinates: [0, 48.6], weight: 1, spread: 0.12 },
  { id: 'FRA-70', countryCode: 'FRA', regionId: 'FR-70', name: 'Haute-Saône', coordinates: [6.1, 47.6], weight: 1, spread: 0.12 },
  { id: 'FRA-71', countryCode: 'FRA', regionId: 'FR-71', name: 'Saône-et-Loire', coordinates: [4.5, 46.6], weight: 1, spread: 0.12 },
  { id: 'FRA-79', countryCode: 'FRA', regionId: 'FR-79', name: 'Deux-Sèvres', coordinates: [-0.4, 46.5], weight: 1, spread: 0.12 },
  { id: 'FRA-86', countryCode: 'FRA', regionId: 'FR-86', name: 'Vienne', coordinates: [0.5, 46.6], weight: 1, spread: 0.12 },
  { id: 'FRA-89', countryCode: 'FRA', regionId: 'FR-89', name: 'Yonne', coordinates: [3.5, 47.8], weight: 1, spread: 0.12 },
  { id: 'FRA-91', countryCode: 'FRA', regionId: 'FR-91', name: 'Essonne', coordinates: [2.2, 48.6], weight: 1, spread: 0.12 },
  { id: 'FRA-77', countryCode: 'FRA', regionId: 'FR-77', name: 'Seien-et-Marne', coordinates: [2.8, 48.6], weight: 1, spread: 0.12 },
  { id: 'FRA-94', countryCode: 'FRA', regionId: 'FR-94', name: 'Val-de-Marne', coordinates: [2.5, 48.8], weight: 1, spread: 0.12 },
  // ESP
  { id: 'ESP-CE', countryCode: 'ESP', regionId: 'ES-CE', name: 'Ceuta', coordinates: [-5.3, 35.8], weight: 1, spread: 0.12 },
  { id: 'ESP-ML', countryCode: 'ESP', regionId: 'ES-ML', name: 'Melilla', coordinates: [-2.9, 35.3], weight: 1, spread: 0.12 },
  { id: 'ESP-NA', countryCode: 'ESP', regionId: 'ES-NA', name: 'Navarra', coordinates: [-1.5, 42.6], weight: 1, spread: 0.12 },
  { id: 'ESP-SS', countryCode: 'ESP', regionId: 'ES-SS', name: 'Gipuzkoa', coordinates: [-2.1, 43.2], weight: 1, spread: 0.12 },
  { id: 'ESP-HU', countryCode: 'ESP', regionId: 'ES-HU', name: 'Huesca', coordinates: [-0.2, 42.2], weight: 1, spread: 0.12 },
  { id: 'ESP-L', countryCode: 'ESP', regionId: 'ES-L', name: 'Lérida', coordinates: [1.1, 42.1], weight: 1, spread: 0.12 },
  { id: 'ESP-BA', countryCode: 'ESP', regionId: 'ES-BA', name: 'Badajoz', coordinates: [-6.2, 38.8], weight: 1, spread: 0.12 },
  { id: 'ESP-CA', countryCode: 'ESP', regionId: 'ES-CA', name: 'Cádiz', coordinates: [-5.7, 36.6], weight: 1, spread: 0.12 },
  { id: 'ESP-OR', countryCode: 'ESP', regionId: 'ES-OR', name: 'Orense', coordinates: [-7.6, 42.2], weight: 1, spread: 0.12 },
  { id: 'ESP-CC', countryCode: 'ESP', regionId: 'ES-CC', name: 'Cáceres', coordinates: [-6.3, 39.7], weight: 1, spread: 0.12 },
  { id: 'ESP-SA', countryCode: 'ESP', regionId: 'ES-SA', name: 'Salamanca', coordinates: [-6, 40.8], weight: 1, spread: 0.12 },
  { id: 'ESP-ZA', countryCode: 'ESP', regionId: 'ES-ZA', name: 'Zamora', coordinates: [-6, 41.7], weight: 1, spread: 0.12 },
  { id: 'ESP-PO', countryCode: 'ESP', regionId: 'ES-PO', name: 'Pontevedra', coordinates: [-8.5, 42.4], weight: 1, spread: 0.12 },
  { id: 'ESP-H', countryCode: 'ESP', regionId: 'ES-H', name: 'Huelva', coordinates: [-6.7, 37.7], weight: 1, spread: 0.12 },
  { id: 'ESP-CS', countryCode: 'ESP', regionId: 'ES-CS', name: 'Castellón', coordinates: [-0.1, 40.3], weight: 1, spread: 0.12 },
  { id: 'ESP-AL', countryCode: 'ESP', regionId: 'ES-AL', name: 'Almería', coordinates: [-2.3, 37.3], weight: 1, spread: 0.12 },
  { id: 'ESP-GR', countryCode: 'ESP', regionId: 'ES-GR', name: 'Granada', coordinates: [-3.2, 37.3], weight: 1, spread: 0.12 },
  { id: 'ESP-C', countryCode: 'ESP', regionId: 'ES-C', name: 'La Coruña', coordinates: [-8.4, 43.1], weight: 1, spread: 0.12 },
  { id: 'ESP-LU', countryCode: 'ESP', regionId: 'ES-LU', name: 'Lugo', coordinates: [-7.5, 43], weight: 1, spread: 0.12 },
  { id: 'ESP-O', countryCode: 'ESP', regionId: 'ES-O', name: 'Asturias', coordinates: [-6.1, 43.3], weight: 1, spread: 0.12 },
  { id: 'ESP-S', countryCode: 'ESP', regionId: 'ES-S', name: 'Cantabria', coordinates: [-3.9, 43.2], weight: 1, spread: 0.12 },
  { id: 'ESP-TF', countryCode: 'ESP', regionId: 'ES-TF', name: 'Santa Cruz de Tenerife', coordinates: [-17.3, 28.2], weight: 1, spread: 0.12 },
  { id: 'ESP-GC', countryCode: 'ESP', regionId: 'ES-GC', name: 'Las Palmas', coordinates: [-14.3, 28.6], weight: 1, spread: 0.12 },
  { id: 'ESP-PM', countryCode: 'ESP', regionId: 'ES-PM', name: 'Baleares', coordinates: [2.8, 39.4], weight: 1, spread: 0.12 },
  { id: 'ESP-LO', countryCode: 'ESP', regionId: 'ES-LO', name: 'La Rioja', coordinates: [-2.4, 42.3], weight: 1, spread: 0.12 },
  { id: 'ESP-VI', countryCode: 'ESP', regionId: 'ES-VI', name: 'Álava', coordinates: [-2.7, 42.8], weight: 1, spread: 0.12 },
  { id: 'ESP-AB', countryCode: 'ESP', regionId: 'ES-AB', name: 'Albacete', coordinates: [-1.9, 38.8], weight: 1, spread: 0.12 },
  { id: 'ESP-TE', countryCode: 'ESP', regionId: 'ES-TE', name: 'Teruel', coordinates: [-0.8, 40.6], weight: 1, spread: 0.12 },
  { id: 'ESP-CU', countryCode: 'ESP', regionId: 'ES-CU', name: 'Cuenca', coordinates: [-2.1, 39.9], weight: 1, spread: 0.12 },
  { id: 'ESP-TO', countryCode: 'ESP', regionId: 'ES-TO', name: 'Toledo', coordinates: [-4.3, 39.8], weight: 1, spread: 0.12 },
  { id: 'ESP-LE', countryCode: 'ESP', regionId: 'ES-LE', name: 'León', coordinates: [-5.7, 42.6], weight: 1, spread: 0.12 },
  { id: 'ESP-SO', countryCode: 'ESP', regionId: 'ES-SO', name: 'Soria', coordinates: [-2.4, 41.6], weight: 1, spread: 0.12 },
  { id: 'ESP-BU', countryCode: 'ESP', regionId: 'ES-BU', name: 'Burgos', coordinates: [-3.5, 42.4], weight: 1, spread: 0.12 },
  { id: 'ESP-AV', countryCode: 'ESP', regionId: 'ES-AV', name: 'Ávila', coordinates: [-4.8, 40.5], weight: 1, spread: 0.12 },
  { id: 'ESP-P', countryCode: 'ESP', regionId: 'ES-P', name: 'Palencia', coordinates: [-4.4, 42.3], weight: 1, spread: 0.12 },
  { id: 'ESP-CR', countryCode: 'ESP', regionId: 'ES-CR', name: 'Ciudad Real', coordinates: [-3.9, 39], weight: 1, spread: 0.12 },
  { id: 'ESP-CO', countryCode: 'ESP', regionId: 'ES-CO', name: 'Córdoba', coordinates: [-4.7, 37.8], weight: 1, spread: 0.12 },
  { id: 'ESP-GU', countryCode: 'ESP', regionId: 'ES-GU', name: 'Guadalajara', coordinates: [-2.6, 40.7], weight: 1, spread: 0.12 },
  { id: 'ESP-J', countryCode: 'ESP', regionId: 'ES-J', name: 'Jaén', coordinates: [-3.4, 38.1], weight: 1, spread: 0.12 },
  { id: 'ESP-SG', countryCode: 'ESP', regionId: 'ES-SG', name: 'Segovia', coordinates: [-4.1, 41.1], weight: 1, spread: 0.12 },
  { id: 'ESP-VA', countryCode: 'ESP', regionId: 'ES-VA', name: 'Valladolid', coordinates: [-5, 41.8], weight: 1, spread: 0.12 },
  // ITA
  { id: 'ITA-AO', countryCode: 'ITA', regionId: 'IT-AO', name: 'Aoste', coordinates: [7.4, 45.8], weight: 1, spread: 0.1 },
  { id: 'ITA-VB', countryCode: 'ITA', regionId: 'IT-VB', name: 'Verbano-Cusio-Ossola', coordinates: [8.2, 46], weight: 1, spread: 0.1 },
  { id: 'ITA-VA', countryCode: 'ITA', regionId: 'IT-VA', name: 'Varese', coordinates: [8.8, 45.8], weight: 1, spread: 0.1 },
  { id: 'ITA-CO', countryCode: 'ITA', regionId: 'IT-CO', name: 'Como', coordinates: [9.2, 45.9], weight: 1, spread: 0.1 },
  { id: 'ITA-SO', countryCode: 'ITA', regionId: 'IT-SO', name: 'Sondrio', coordinates: [9.9, 46.3], weight: 1, spread: 0.1 },
  { id: 'ITA-BZ', countryCode: 'ITA', regionId: 'IT-BZ', name: 'Bozen', coordinates: [11.3, 46.7], weight: 1, spread: 0.1 },
  { id: 'ITA-IM', countryCode: 'ITA', regionId: 'IT-IM', name: 'Imperia', coordinates: [7.8, 43.9], weight: 1, spread: 0.1 },
  { id: 'ITA-CN', countryCode: 'ITA', regionId: 'IT-CN', name: 'Cuneo', coordinates: [7.6, 44.4], weight: 1, spread: 0.1 },
  { id: 'ITA-RN', countryCode: 'ITA', regionId: 'IT-RN', name: 'Rimini', coordinates: [12.4, 43.9], weight: 1, spread: 0.1 },
  { id: 'ITA-PU', countryCode: 'ITA', regionId: 'IT-PU', name: 'Pesaro e Urbino', coordinates: [12.5, 43.7], weight: 1, spread: 0.1 },
  { id: 'ITA-BL', countryCode: 'ITA', regionId: 'IT-BL', name: 'Belluno', coordinates: [12.2, 46.3], weight: 1, spread: 0.1 },
  { id: 'ITA-UD', countryCode: 'ITA', regionId: 'IT-UD', name: 'Udine', coordinates: [13.1, 46.2], weight: 1, spread: 0.1 },
  { id: 'ITA-GO', countryCode: 'ITA', regionId: 'IT-GO', name: 'Gorizia', coordinates: [13.5, 45.9], weight: 1, spread: 0.1 },
  { id: 'ITA-TS', countryCode: 'ITA', regionId: 'IT-TS', name: 'Trieste', coordinates: [13.7, 45.7], weight: 1, spread: 0.1 },
  { id: 'ITA-PD', countryCode: 'ITA', regionId: 'IT-PD', name: 'Padova', coordinates: [11.9, 45.4], weight: 1, spread: 0.1 },
  { id: 'ITA-RO', countryCode: 'ITA', regionId: 'IT-RO', name: 'Rovigo', coordinates: [12, 45], weight: 1, spread: 0.1 },
  { id: 'ITA-FE', countryCode: 'ITA', regionId: 'IT-FE', name: 'Ferrara', coordinates: [11.8, 44.8], weight: 1, spread: 0.1 },
  { id: 'ITA-RA', countryCode: 'ITA', regionId: 'IT-RA', name: 'Ravenna', coordinates: [12, 44.4], weight: 1, spread: 0.1 },
  { id: 'ITA-FC', countryCode: 'ITA', regionId: 'IT-FC', name: 'Forlì-Cesena', coordinates: [12.2, 44.1], weight: 1, spread: 0.1 },
  { id: 'ITA-AN', countryCode: 'ITA', regionId: 'IT-AN', name: 'Ancona', coordinates: [13.2, 43.5], weight: 1, spread: 0.1 },
  { id: 'ITA-MC', countryCode: 'ITA', regionId: 'IT-MC', name: 'Macerata', coordinates: [13.3, 43.2], weight: 1, spread: 0.1 },
  { id: 'ITA-FM', countryCode: 'ITA', regionId: 'IT-FM', name: 'Fermo', coordinates: [13.6, 43.1], weight: 1, spread: 0.1 },
  { id: 'ITA-AP', countryCode: 'ITA', regionId: 'IT-AP', name: 'Ascoli Piceno', coordinates: [13.5, 42.9], weight: 1, spread: 0.1 },
  { id: 'ITA-TE', countryCode: 'ITA', regionId: 'IT-TE', name: 'Teramo', coordinates: [13.7, 42.7], weight: 1, spread: 0.1 },
  { id: 'ITA-PE', countryCode: 'ITA', regionId: 'IT-PE', name: 'Pescara', coordinates: [14, 42.4], weight: 1, spread: 0.1 },
  { id: 'ITA-CH', countryCode: 'ITA', regionId: 'IT-CH', name: 'Chieti', coordinates: [14.3, 42.1], weight: 1, spread: 0.1 },
  { id: 'ITA-CB', countryCode: 'ITA', regionId: 'IT-CB', name: 'Campobasso', coordinates: [14.8, 41.7], weight: 1, spread: 0.1 },
  { id: 'ITA-FG', countryCode: 'ITA', regionId: 'IT-FG', name: 'Foggia', coordinates: [15.5, 41.6], weight: 1, spread: 0.1 },
  { id: 'ITA-BT', countryCode: 'ITA', regionId: 'IT-BT', name: 'Barletta-Andria Trani', coordinates: [16.1, 41.2], weight: 1, spread: 0.1 },
  { id: 'ITA-BA', countryCode: 'ITA', regionId: 'IT-BA', name: 'Bari', coordinates: [16.7, 41], weight: 1, spread: 0.1 },
  { id: 'ITA-BR', countryCode: 'ITA', regionId: 'IT-BR', name: 'Brindisi', coordinates: [17.6, 40.7], weight: 1, spread: 0.1 },
  { id: 'ITA-LE', countryCode: 'ITA', regionId: 'IT-LE', name: 'Lecce', coordinates: [18.1, 40.2], weight: 1, spread: 0.1 },
  { id: 'ITA-TA', countryCode: 'ITA', regionId: 'IT-TA', name: 'Taranto', coordinates: [17.3, 40.5], weight: 1, spread: 0.1 },
  { id: 'ITA-MT', countryCode: 'ITA', regionId: 'IT-MT', name: 'Matera', coordinates: [16.3, 40.5], weight: 1, spread: 0.1 },
  { id: 'ITA-CS', countryCode: 'ITA', regionId: 'IT-CS', name: 'Cosenza', coordinates: [16.3, 39.7], weight: 1, spread: 0.1 },
  { id: 'ITA-KR', countryCode: 'ITA', regionId: 'IT-KR', name: 'Crotene', coordinates: [16.9, 39.2], weight: 1, spread: 0.1 },
  { id: 'ITA-CZ', countryCode: 'ITA', regionId: 'IT-CZ', name: 'Catanzaro', coordinates: [16.5, 38.9], weight: 1, spread: 0.1 },
  { id: 'ITA-RC', countryCode: 'ITA', regionId: 'IT-RC', name: 'Reggio Calabria', coordinates: [16.1, 38.3], weight: 1, spread: 0.1 },
  { id: 'ITA-VV', countryCode: 'ITA', regionId: 'IT-VV', name: 'Vibo Valentia', coordinates: [16.1, 38.6], weight: 1, spread: 0.1 },
  { id: 'ITA-PZ', countryCode: 'ITA', regionId: 'IT-PZ', name: 'Potenza', coordinates: [16, 40.4], weight: 1, spread: 0.1 },
  { id: 'ITA-SA', countryCode: 'ITA', regionId: 'IT-SA', name: 'Salerno', coordinates: [15.2, 40.4], weight: 1, spread: 0.1 },
  { id: 'ITA-CE', countryCode: 'ITA', regionId: 'IT-CE', name: 'Caserta', coordinates: [14.1, 41.2], weight: 1, spread: 0.1 },
  { id: 'ITA-LT', countryCode: 'ITA', regionId: 'IT-LT', name: 'Latina', coordinates: [13.3, 41.2], weight: 1, spread: 0.1 },
  { id: 'ITA-VT', countryCode: 'ITA', regionId: 'IT-VT', name: 'Viterbo', coordinates: [12, 42.5], weight: 1, spread: 0.1 },
  { id: 'ITA-GR', countryCode: 'ITA', regionId: 'IT-GR', name: 'Grosseto', coordinates: [11.1, 42.6], weight: 1, spread: 0.1 },
  { id: 'ITA-LI', countryCode: 'ITA', regionId: 'IT-LI', name: 'Livorno', coordinates: [10.3, 42.9], weight: 1, spread: 0.1 },
  { id: 'ITA-PI', countryCode: 'ITA', regionId: 'IT-PI', name: 'Pisa', coordinates: [10.6, 43.5], weight: 1, spread: 0.1 },
  { id: 'ITA-LU', countryCode: 'ITA', regionId: 'IT-LU', name: 'Lucca', coordinates: [10.5, 44], weight: 1, spread: 0.1 },
  { id: 'ITA-MS', countryCode: 'ITA', regionId: 'IT-MS', name: 'Massa-Carrara', coordinates: [10, 44.2], weight: 1, spread: 0.1 },
  { id: 'ITA-SP', countryCode: 'ITA', regionId: 'IT-SP', name: 'La Spezia', coordinates: [9.8, 44.2], weight: 1, spread: 0.1 },
  { id: 'ITA-GE', countryCode: 'ITA', regionId: 'IT-GE', name: 'Genova', coordinates: [9.1, 44.4], weight: 1, spread: 0.1 },
  { id: 'ITA-SV', countryCode: 'ITA', regionId: 'IT-SV', name: 'Savona', coordinates: [8.3, 44.3], weight: 1, spread: 0.1 },
  { id: 'ITA-TP', countryCode: 'ITA', regionId: 'IT-TP', name: 'Trapani', coordinates: [12.51, 37.88], weight: 1, spread: 0.1 },
  { id: 'ITA-ME', countryCode: 'ITA', regionId: 'IT-ME', name: 'Messina', coordinates: [15.55, 38.19], weight: 1, spread: 0.1 },
  { id: 'ITA-AG', countryCode: 'ITA', regionId: 'IT-AG', name: 'Agrigento', coordinates: [13.58, 37.31], weight: 1, spread: 0.1 },
  { id: 'ITA-CL', countryCode: 'ITA', regionId: 'IT-CL', name: 'Caltanissetta', coordinates: [14.1, 37.4], weight: 1, spread: 0.1 },
  { id: 'ITA-RG', countryCode: 'ITA', regionId: 'IT-RG', name: 'Ragusa', coordinates: [14.7, 36.9], weight: 1, spread: 0.1 },
  { id: 'ITA-SR', countryCode: 'ITA', regionId: 'IT-SR', name: 'Siracusa', coordinates: [15.1, 37.1], weight: 1, spread: 0.1 },
  { id: 'ITA-CT', countryCode: 'ITA', regionId: 'IT-CT', name: 'Catania', coordinates: [14.8, 37.5], weight: 1, spread: 0.1 },
  { id: 'ITA-CI', countryCode: 'ITA', regionId: 'IT-CI', name: 'Carbonia-Iglesias', coordinates: [8.5, 39.2], weight: 1, spread: 0.1 },
  { id: 'ITA-SS', countryCode: 'ITA', regionId: 'IT-SS', name: 'Sassari', coordinates: [8.6, 40.7], weight: 1, spread: 0.1 },
  { id: 'ITA-NU', countryCode: 'ITA', regionId: 'IT-NU', name: 'Nuoro', coordinates: [9.2, 40.3], weight: 1, spread: 0.1 },
  { id: 'ITA-OT', countryCode: 'ITA', regionId: 'IT-OT', name: 'Olbia-Tempio', coordinates: [9.3, 41], weight: 1, spread: 0.1 },
  { id: 'ITA-OR', countryCode: 'ITA', regionId: 'IT-OR', name: 'Oristrano', coordinates: [8.7, 40], weight: 1, spread: 0.1 },
  { id: 'ITA-VS', countryCode: 'ITA', regionId: 'IT-VS', name: 'Medio Campidano', coordinates: [8.6, 39.6], weight: 1, spread: 0.1 },
  { id: 'ITA-CA', countryCode: 'ITA', regionId: 'IT-CA', name: 'Cagliari', coordinates: [9.1, 39.4], weight: 1, spread: 0.1 },
  { id: 'ITA-OG', countryCode: 'ITA', regionId: 'IT-OG', name: 'Ogliastra', coordinates: [9.5, 40], weight: 1, spread: 0.1 },
  { id: 'ITA-EN', countryCode: 'ITA', regionId: 'IT-EN', name: 'Enna', coordinates: [14.5, 37.6], weight: 1, spread: 0.1 },
  { id: 'ITA-BN', countryCode: 'ITA', regionId: 'IT-BN', name: 'Benevento', coordinates: [14.7, 41.2], weight: 1, spread: 0.1 },
  { id: 'ITA-AT', countryCode: 'ITA', regionId: 'IT-AT', name: 'Asti', coordinates: [8.2, 44.8], weight: 1, spread: 0.1 },
  { id: 'ITA-BG', countryCode: 'ITA', regionId: 'IT-BG', name: 'Bergamo', coordinates: [9.8, 45.8], weight: 1, spread: 0.1 },
  { id: 'ITA-BS', countryCode: 'ITA', regionId: 'IT-BS', name: 'Brescia', coordinates: [10.3, 45.7], weight: 1, spread: 0.1 },
  { id: 'ITA-CR', countryCode: 'ITA', regionId: 'IT-CR', name: 'Cremona', coordinates: [10, 45.3], weight: 1, spread: 0.1 },
  { id: 'ITA-MN', countryCode: 'ITA', regionId: 'IT-MN', name: 'Mantova', coordinates: [10.7, 45.1], weight: 1, spread: 0.1 },
  { id: 'ITA-LC', countryCode: 'ITA', regionId: 'IT-LC', name: 'Lecco', coordinates: [9.4, 45.9], weight: 1, spread: 0.1 },
  { id: 'ITA-MB', countryCode: 'ITA', regionId: 'IT-MB', name: 'Monza e Brianza', coordinates: [9.3, 45.7], weight: 1, spread: 0.1 },
  { id: 'ITA-LO', countryCode: 'ITA', regionId: 'IT-LO', name: 'Lodi', coordinates: [9.5, 45.3], weight: 1, spread: 0.1 },
  { id: 'ITA-SI', countryCode: 'ITA', regionId: 'IT-SI', name: 'Siena', coordinates: [11.6, 43.2], weight: 1, spread: 0.1 },
  { id: 'ITA-AR', countryCode: 'ITA', regionId: 'IT-AR', name: 'Arezzo', coordinates: [12, 43.6], weight: 1, spread: 0.1 },
  { id: 'ITA-VC', countryCode: 'ITA', regionId: 'IT-VC', name: 'Vercelli', coordinates: [8.2, 45.5], weight: 1, spread: 0.1 },
  { id: 'ITA-PV', countryCode: 'ITA', regionId: 'IT-PV', name: 'Pavia', coordinates: [9, 45.1], weight: 1, spread: 0.1 },
  { id: 'ITA-RI', countryCode: 'ITA', regionId: 'IT-RI', name: 'Rieti', coordinates: [13, 42.4], weight: 1, spread: 0.1 },
  { id: 'ITA-NO', countryCode: 'ITA', regionId: 'IT-NO', name: 'Novara', coordinates: [8.5, 45.6], weight: 1, spread: 0.1 },
  { id: 'ITA-AL', countryCode: 'ITA', regionId: 'IT-AL', name: 'Alessandria', coordinates: [8.6, 44.9], weight: 1, spread: 0.1 },
  { id: 'ITA-TN', countryCode: 'ITA', regionId: 'IT-TN', name: 'Trento', coordinates: [11.2, 46.2], weight: 1, spread: 0.1 },
  { id: 'ITA-VI', countryCode: 'ITA', regionId: 'IT-VI', name: 'Vicenza', coordinates: [11.5, 45.7], weight: 1, spread: 0.1 },
  { id: 'ITA-VR', countryCode: 'ITA', regionId: 'IT-VR', name: 'Verona', coordinates: [11, 45.5], weight: 1, spread: 0.1 },
  { id: 'ITA-TV', countryCode: 'ITA', regionId: 'IT-TV', name: 'Treviso', coordinates: [12.3, 45.8], weight: 1, spread: 0.1 },
  { id: 'ITA-PC', countryCode: 'ITA', regionId: 'IT-PC', name: 'Piacenza', coordinates: [9.6, 44.9], weight: 1, spread: 0.1 },
  { id: 'ITA-PR', countryCode: 'ITA', regionId: 'IT-PR', name: 'Parma', coordinates: [10, 44.7], weight: 1, spread: 0.1 },
  { id: 'ITA-RE', countryCode: 'ITA', regionId: 'IT-RE', name: 'Reggio Emilia', coordinates: [10.5, 44.6], weight: 1, spread: 0.1 },
  { id: 'ITA-MO', countryCode: 'ITA', regionId: 'IT-MO', name: 'Modena', coordinates: [10.9, 44.5], weight: 1, spread: 0.1 },
  { id: 'ITA-PT', countryCode: 'ITA', regionId: 'IT-PT', name: 'Pistoia', coordinates: [10.8, 44], weight: 1, spread: 0.1 },
  { id: 'ITA-TR', countryCode: 'ITA', regionId: 'IT-TR', name: 'Terni', coordinates: [12.4, 42.7], weight: 1, spread: 0.1 },
  { id: 'ITA-PG', countryCode: 'ITA', regionId: 'IT-PG', name: 'Perugia', coordinates: [12.5, 43.1], weight: 1, spread: 0.1 },
  { id: 'ITA-FR', countryCode: 'ITA', regionId: 'IT-FR', name: 'Frosinone', coordinates: [13.5, 41.6], weight: 1, spread: 0.1 },
  { id: 'ITA-AV', countryCode: 'ITA', regionId: 'IT-AV', name: 'Avellino', coordinates: [14.9, 41], weight: 1, spread: 0.1 },
  { id: 'ITA-AQ', countryCode: 'ITA', regionId: 'IT-AQ', name: 'L\'Aquila', coordinates: [13.5, 42.2], weight: 1, spread: 0.1 },
  { id: 'ITA-PN', countryCode: 'ITA', regionId: 'IT-PN', name: 'Pordenone', coordinates: [12.6, 46.1], weight: 1, spread: 0.1 },
  { id: 'ITA-IS', countryCode: 'ITA', regionId: 'IT-IS', name: 'Isernia', coordinates: [14.3, 41.7], weight: 1, spread: 0.1 },
  { id: 'ITA-BI', countryCode: 'ITA', regionId: 'IT-BI', name: 'Biella', coordinates: [8, 45.6], weight: 1, spread: 0.1 },
  { id: 'ITA-PO', countryCode: 'ITA', regionId: 'IT-PO', name: 'Prato', coordinates: [11.1, 44], weight: 1, spread: 0.1 },
  // RUS
  { id: 'RUS-AL', countryCode: 'RUS', regionId: 'RU-AL', name: 'Gorno-Altay', coordinates: [87.2, 50.8], weight: 1, spread: 0.18 },
  { id: 'RUS-PSK', countryCode: 'RUS', regionId: 'RU-PSK', name: 'Pskov', coordinates: [29.5, 57.1], weight: 1, spread: 0.18 },
  { id: 'RUS-KC', countryCode: 'RUS', regionId: 'RU-KC', name: 'Karachay-Cherkess', coordinates: [41.7, 43.8], weight: 1, spread: 0.18 },
  { id: 'RUS-KB', countryCode: 'RUS', regionId: 'RU-KB', name: 'Kabardin-Balkar', coordinates: [43.4, 43.5], weight: 1, spread: 0.18 },
  { id: 'RUS-SE', countryCode: 'RUS', regionId: 'RU-SE', name: 'North Ossetia', coordinates: [44.3, 43.2], weight: 1, spread: 0.18 },
  { id: 'RUS-IN', countryCode: 'RUS', regionId: 'RU-IN', name: 'Ingush', coordinates: [44.8, 43], weight: 1, spread: 0.18 },
  { id: 'RUS-CE', countryCode: 'RUS', regionId: 'RU-CE', name: 'Chechnya', coordinates: [45.7, 43.3], weight: 1, spread: 0.18 },
  { id: 'RUS-DA', countryCode: 'RUS', regionId: 'RU-DA', name: 'Dagestan', coordinates: [46.7, 43.3], weight: 1, spread: 0.18 },
  { id: 'RUS-MUR', countryCode: 'RUS', regionId: 'RU-MUR', name: 'Murmansk', coordinates: [34, 68.5], weight: 1, spread: 0.18 },
  { id: 'RUS-KR', countryCode: 'RUS', regionId: 'RU-KR', name: 'Karelia', coordinates: [33.7, 64], weight: 1, spread: 0.18 },
  { id: 'RUS-LEN', countryCode: 'RUS', regionId: 'RU-LEN', name: 'Leningrad', coordinates: [30.8, 60], weight: 1, spread: 0.18 },
  { id: 'RUS-KGD', countryCode: 'RUS', regionId: 'RU-KGD', name: 'Kaliningrad', coordinates: [21.4, 54.9], weight: 1, spread: 0.18 },
  { id: 'RUS-SMO', countryCode: 'RUS', regionId: 'RU-SMO', name: 'Smolensk', coordinates: [32.9, 54.9], weight: 1, spread: 0.18 },
  { id: 'RUS-BRY', countryCode: 'RUS', regionId: 'RU-BRY', name: 'Bryansk', coordinates: [33.5, 52.9], weight: 1, spread: 0.18 },
  { id: 'RUS-KRS', countryCode: 'RUS', regionId: 'RU-KRS', name: 'Kursk', coordinates: [36.3, 51.7], weight: 1, spread: 0.18 },
  { id: 'RUS-BEL', countryCode: 'RUS', regionId: 'RU-BEL', name: 'Belgorod', coordinates: [37.5, 50.7], weight: 1, spread: 0.18 },
  { id: 'RUS-VOR', countryCode: 'RUS', regionId: 'RU-VOR', name: 'Voronezh', coordinates: [40, 51], weight: 1, spread: 0.18 },
  { id: 'RUS-ROS', countryCode: 'RUS', regionId: 'RU-ROS', name: 'Rostov', coordinates: [41.3, 47.7], weight: 1, spread: 0.18 },
  { id: 'RUS-BU', countryCode: 'RUS', regionId: 'RU-BU', name: 'Buryat', coordinates: [108.5, 53.4], weight: 1, spread: 0.18 },
  { id: 'RUS-TY', countryCode: 'RUS', regionId: 'RU-TY', name: 'Tuva', coordinates: [94.4, 51.7], weight: 1, spread: 0.18 },
  { id: 'RUS-ZAB', countryCode: 'RUS', regionId: 'RU-ZAB', name: 'Chita', coordinates: [116, 53.3], weight: 1, spread: 0.18 },
  { id: 'RUS-AMU', countryCode: 'RUS', regionId: 'RU-AMU', name: 'Amur', coordinates: [127.9, 53.7], weight: 1, spread: 0.18 },
  { id: 'RUS-YEV', countryCode: 'RUS', regionId: 'RU-YEV', name: 'Yevrey', coordinates: [132.5, 48.6], weight: 1, spread: 0.18 },
  { id: 'RUS-KHA', countryCode: 'RUS', regionId: 'RU-KHA', name: 'Khabarovsk', coordinates: [137.3, 54.7], weight: 1, spread: 0.18 },
  { id: 'RUS-PRI', countryCode: 'RUS', regionId: 'RU-PRI', name: 'Primor\'ye', coordinates: [134.3, 45], weight: 1, spread: 0.18 },
  { id: 'RUS-TYU', countryCode: 'RUS', regionId: 'RU-TYU', name: 'Tyumen\'', coordinates: [69.6, 57.4], weight: 1, spread: 0.18 },
  { id: 'RUS-KGN', countryCode: 'RUS', regionId: 'RU-KGN', name: 'Kurgan', coordinates: [64.9, 55.5], weight: 1, spread: 0.18 },
  { id: 'RUS-ALT', countryCode: 'RUS', regionId: 'RU-ALT', name: 'Altay', coordinates: [83.1, 52.7], weight: 1, spread: 0.18 },
  { id: 'RUS-ORE', countryCode: 'RUS', regionId: 'RU-ORE', name: 'Orenburg', coordinates: [55.8, 52], weight: 1, spread: 0.18 },
  { id: 'RUS-SAR', countryCode: 'RUS', regionId: 'RU-SAR', name: 'Saratov', coordinates: [47.1, 51.5], weight: 1, spread: 0.18 },
  { id: 'RUS-AST', countryCode: 'RUS', regionId: 'RU-AST', name: 'Astrakhan\'', coordinates: [47.3, 47], weight: 1, spread: 0.18 },
  { id: 'RUS-VGG', countryCode: 'RUS', regionId: 'RU-VGG', name: 'Volgograd', coordinates: [44.4, 49.5], weight: 1, spread: 0.18 },
  { id: 'RUS-MAG', countryCode: 'RUS', regionId: 'RU-MAG', name: 'Maga Buryatdan', coordinates: [154, 62.2], weight: 1, spread: 0.18 },
  { id: 'RUS-SAK', countryCode: 'RUS', regionId: 'RU-SAK', name: 'Sakhalin', coordinates: [143, 50.7], weight: 1, spread: 0.18 },
  { id: 'RUS-CHU', countryCode: 'RUS', regionId: 'RU-CHU', name: 'Chukchi Autonomous Okrug', coordinates: [166, 66], weight: 1, spread: 0.18 },
  { id: 'RUS-YAN', countryCode: 'RUS', regionId: 'RU-YAN', name: 'Yamal-Nenets', coordinates: [70, 66.5], weight: 1, spread: 0.18 },
  { id: 'RUS-NEN', countryCode: 'RUS', regionId: 'RU-NEN', name: 'Nenets', coordinates: [53.6, 68.4], weight: 1, spread: 0.18 },
  { id: 'RUS-SA', countryCode: 'RUS', regionId: 'RU-SA', name: 'Sakha (Yakutia)', coordinates: [134.2, 68.6], weight: 1, spread: 0.18 },
  { id: 'RUS-ARK', countryCode: 'RUS', regionId: 'RU-ARK', name: 'Arkhangel\'sk', coordinates: [42, 63], weight: 1, spread: 0.18 },
  { id: 'RUS-KL', countryCode: 'RUS', regionId: 'RU-KL', name: 'Kalmyk', coordinates: [44.8, 46.6], weight: 1, spread: 0.18 },
  { id: 'RUS-KAM', countryCode: 'RUS', regionId: 'RU-KAM', name: 'Kamchatka', coordinates: [159, 56], weight: 1, spread: 0.18 },
  { id: 'RUS-X01~', countryCode: 'RUS', regionId: 'RU-X01~', name: '', coordinates: [67.4, 68.8], weight: 1, spread: 0.18 },
  { id: 'RUS-BA', countryCode: 'RUS', regionId: 'RU-BA', name: 'Bashkortostan', coordinates: [57, 54.5], weight: 1, spread: 0.18 },
  { id: 'RUS-KHM', countryCode: 'RUS', regionId: 'RU-KHM', name: 'Khanty-Mansiy', coordinates: [70.8, 62.1], weight: 1, spread: 0.18 },
  { id: 'RUS-LIP', countryCode: 'RUS', regionId: 'RU-LIP', name: 'Lipetsk', coordinates: [39, 52.7], weight: 1, spread: 0.18 },
  { id: 'RUS-TAM', countryCode: 'RUS', regionId: 'RU-TAM', name: 'Tambov', coordinates: [41.5, 52.7], weight: 1, spread: 0.18 },
  { id: 'RUS-TOM', countryCode: 'RUS', regionId: 'RU-TOM', name: 'Tomsk', coordinates: [82.6, 58.5], weight: 1, spread: 0.18 },
  { id: 'RUS-ULY', countryCode: 'RUS', regionId: 'RU-ULY', name: 'Ul\'yanovsk', coordinates: [48.1, 53.9], weight: 1, spread: 0.18 },
  { id: 'RUS-PNZ', countryCode: 'RUS', regionId: 'RU-PNZ', name: 'Penza', coordinates: [44.5, 53.2], weight: 1, spread: 0.18 },
  { id: 'RUS-KEM', countryCode: 'RUS', regionId: 'RU-KEM', name: 'Kemerovo', coordinates: [87.3, 54.7], weight: 1, spread: 0.18 },
  { id: 'RUS-ORL', countryCode: 'RUS', regionId: 'RU-ORL', name: 'Orel', coordinates: [36.5, 52.8], weight: 1, spread: 0.18 },
  { id: 'RUS-IRK', countryCode: 'RUS', regionId: 'RU-IRK', name: 'Irkutsk', coordinates: [107.5, 58.1], weight: 1, spread: 0.18 },
  { id: 'RUS-KK', countryCode: 'RUS', regionId: 'RU-KK', name: 'Khakass', coordinates: [89.6, 53.4], weight: 1, spread: 0.18 },
  { id: 'RUS-MO', countryCode: 'RUS', regionId: 'RU-MO', name: 'Mordovia', coordinates: [44.1, 54.4], weight: 1, spread: 0.18 },
  { id: 'RUS-KLU', countryCode: 'RUS', regionId: 'RU-KLU', name: 'Kaluga', coordinates: [35.5, 54.3], weight: 1, spread: 0.18 },
  { id: 'RUS-KOS', countryCode: 'RUS', regionId: 'RU-KOS', name: 'Kostroma', coordinates: [43.8, 58.5], weight: 1, spread: 0.18 },
  { id: 'RUS-YAR', countryCode: 'RUS', regionId: 'RU-YAR', name: 'Yaroslavl\'', coordinates: [38.9, 57.8], weight: 1, spread: 0.18 },
  { id: 'RUS-VLA', countryCode: 'RUS', regionId: 'RU-VLA', name: 'Vladimir', coordinates: [40.5, 56.1], weight: 1, spread: 0.18 },
  { id: 'RUS-RYA', countryCode: 'RUS', regionId: 'RU-RYA', name: 'Ryazan\'', coordinates: [40.9, 54.3], weight: 1, spread: 0.18 },
  { id: 'RUS-IVA', countryCode: 'RUS', regionId: 'RU-IVA', name: 'Ivanovo', coordinates: [41.9, 57.1], weight: 1, spread: 0.18 },
  { id: 'RUS-NIZ', countryCode: 'RUS', regionId: 'RU-NIZ', name: 'Nizhegorod', coordinates: [44.7, 56.3], weight: 1, spread: 0.18 },
  { id: 'RUS-TUL', countryCode: 'RUS', regionId: 'RU-TUL', name: 'Tula', coordinates: [37.6, 53.9], weight: 1, spread: 0.18 },
  { id: 'RUS-CU', countryCode: 'RUS', regionId: 'RU-CU', name: 'Chuvash', coordinates: [47.2, 55.5], weight: 1, spread: 0.18 },
  { id: 'RUS-VLG', countryCode: 'RUS', regionId: 'RU-VLG', name: 'Vologda', coordinates: [40.7, 60], weight: 1, spread: 0.18 },
  { id: 'RUS-NGR', countryCode: 'RUS', regionId: 'RU-NGR', name: 'Novgorod', coordinates: [32.7, 58.3], weight: 1, spread: 0.18 },
  { id: 'RUS-TVE', countryCode: 'RUS', regionId: 'RU-TVE', name: 'Tver\'', coordinates: [34.9, 57.1], weight: 1, spread: 0.18 },
  { id: 'RUS-ME', countryCode: 'RUS', regionId: 'RU-ME', name: 'Mariy-El', coordinates: [48.1, 56.6], weight: 1, spread: 0.18 },
  { id: 'RUS-KIR', countryCode: 'RUS', regionId: 'RU-KIR', name: 'Kirov', coordinates: [49.7, 58.5], weight: 1, spread: 0.18 },
  { id: 'RUS-UD', countryCode: 'RUS', regionId: 'RU-UD', name: 'Udmurt', coordinates: [52.9, 56.9], weight: 1, spread: 0.18 },
  { id: 'RUS-KO', countryCode: 'RUS', regionId: 'RU-KO', name: 'Komi', coordinates: [55, 63.6], weight: 1, spread: 0.18 },
  { id: 'RUS-PER', countryCode: 'RUS', regionId: 'RU-PER', name: 'Perm\'', coordinates: [55.8, 58.9], weight: 1, spread: 0.18 },
  { id: 'RUS-STA', countryCode: 'RUS', regionId: 'RU-STA', name: 'Stavropol\'', coordinates: [43.3, 44.8], weight: 1, spread: 0.18 },
  { id: 'RUS-AD', countryCode: 'RUS', regionId: 'RU-AD', name: 'Adygey', coordinates: [39.9, 44.7], weight: 1, spread: 0.18 },
  // TUR
  { id: 'TUR-75', countryCode: 'TUR', regionId: 'TR-75', name: 'Ardahan', coordinates: [42.8, 41.1], weight: 1, spread: 0.14 },
  { id: 'TUR-08', countryCode: 'TUR', regionId: 'TR-08', name: 'Artvin', coordinates: [41.8, 41.1], weight: 1, spread: 0.14 },
  { id: 'TUR-73', countryCode: 'TUR', regionId: 'TR-73', name: 'Sirnak', coordinates: [42.5, 37.4], weight: 1, spread: 0.14 },
  { id: 'TUR-30', countryCode: 'TUR', regionId: 'TR-30', name: 'Hakkari', coordinates: [44.1, 37.4], weight: 1, spread: 0.14 },
  { id: 'TUR-76', countryCode: 'TUR', regionId: 'TR-76', name: 'Iğdir', coordinates: [44, 39.8], weight: 1, spread: 0.14 },
  { id: 'TUR-04', countryCode: 'TUR', regionId: 'TR-04', name: 'Agri', coordinates: [43.3, 39.5], weight: 1, spread: 0.14 },
  { id: 'TUR-65', countryCode: 'TUR', regionId: 'TR-65', name: 'Van', coordinates: [43.5, 38.7], weight: 1, spread: 0.14 },
  { id: 'TUR-39', countryCode: 'TUR', regionId: 'TR-39', name: 'Kirklareli', coordinates: [27.6, 41.7], weight: 1, spread: 0.14 },
  { id: 'TUR-22', countryCode: 'TUR', regionId: 'TR-22', name: 'Edirne', coordinates: [26.6, 41.3], weight: 1, spread: 0.14 },
  { id: 'TUR-36', countryCode: 'TUR', regionId: 'TR-36', name: 'Kars', coordinates: [43.1, 40.5], weight: 1, spread: 0.14 },
  { id: 'TUR-47', countryCode: 'TUR', regionId: 'TR-47', name: 'Mardin', coordinates: [41.1, 37.3], weight: 1, spread: 0.14 },
  { id: 'TUR-63', countryCode: 'TUR', regionId: 'TR-63', name: 'Sanliurfa', coordinates: [39, 37.3], weight: 1, spread: 0.14 },
  { id: 'TUR-79', countryCode: 'TUR', regionId: 'TR-79', name: 'Kilis', coordinates: [37.1, 36.8], weight: 1, spread: 0.14 },
  { id: 'TUR-27', countryCode: 'TUR', regionId: 'TR-27', name: 'Gaziantep', coordinates: [37.3, 37.1], weight: 1, spread: 0.14 },
  { id: 'TUR-31', countryCode: 'TUR', regionId: 'TR-31', name: 'Hatay', coordinates: [36.3, 36.5], weight: 1, spread: 0.14 },
  { id: 'TUR-59', countryCode: 'TUR', regionId: 'TR-59', name: 'Tekirdag', coordinates: [27.4, 41.1], weight: 1, spread: 0.14 },
  { id: 'TUR-17', countryCode: 'TUR', regionId: 'TR-17', name: 'Çanakkale', coordinates: [26.5, 40.1], weight: 1, spread: 0.14 },
  { id: 'TUR-53', countryCode: 'TUR', regionId: 'TR-53', name: 'Rize', coordinates: [40.8, 40.9], weight: 1, spread: 0.14 },
  { id: 'TUR-61', countryCode: 'TUR', regionId: 'TR-61', name: 'Trabzon', coordinates: [39.7, 40.8], weight: 1, spread: 0.14 },
  { id: 'TUR-28', countryCode: 'TUR', regionId: 'TR-28', name: 'Giresun', coordinates: [38.6, 40.6], weight: 1, spread: 0.14 },
  { id: 'TUR-52', countryCode: 'TUR', regionId: 'TR-52', name: 'Ordu', coordinates: [37.5, 40.8], weight: 1, spread: 0.14 },
  { id: 'TUR-55', countryCode: 'TUR', regionId: 'TR-55', name: 'Samsun', coordinates: [36, 41.2], weight: 1, spread: 0.14 },
  { id: 'TUR-57', countryCode: 'TUR', regionId: 'TR-57', name: 'Sinop', coordinates: [34.8, 41.6], weight: 1, spread: 0.14 },
  { id: 'TUR-37', countryCode: 'TUR', regionId: 'TR-37', name: 'Kastamonu', coordinates: [33.6, 41.4], weight: 1, spread: 0.14 },
  { id: 'TUR-74', countryCode: 'TUR', regionId: 'TR-74', name: 'Bartın', coordinates: [32.4, 41.6], weight: 1, spread: 0.14 },
  { id: 'TUR-67', countryCode: 'TUR', regionId: 'TR-67', name: 'Zinguldak', coordinates: [31.8, 41.2], weight: 1, spread: 0.14 },
  { id: 'TUR-81', countryCode: 'TUR', regionId: 'TR-81', name: 'Düzce', coordinates: [31.3, 40.9], weight: 1, spread: 0.14 },
  { id: 'TUR-54', countryCode: 'TUR', regionId: 'TR-54', name: 'Sakarya', coordinates: [30.4, 40.7], weight: 1, spread: 0.14 },
  { id: 'TUR-41', countryCode: 'TUR', regionId: 'TR-41', name: 'Kocaeli', coordinates: [29.8, 40.9], weight: 1, spread: 0.14 },
  { id: 'TUR-77', countryCode: 'TUR', regionId: 'TR-77', name: 'Yalova', coordinates: [29.1, 40.6], weight: 1, spread: 0.14 },
  { id: 'TUR-10', countryCode: 'TUR', regionId: 'TR-10', name: 'Balikesir', coordinates: [27.7, 40], weight: 1, spread: 0.14 },
  { id: 'TUR-09', countryCode: 'TUR', regionId: 'TR-09', name: 'Aydin', coordinates: [27.9, 37.7], weight: 1, spread: 0.14 },
  { id: 'TUR-48', countryCode: 'TUR', regionId: 'TR-48', name: 'Mugla', coordinates: [28.3, 36.9], weight: 1, spread: 0.14 },
  { id: 'TUR-33', countryCode: 'TUR', regionId: 'TR-33', name: 'Mersin', coordinates: [34, 36.7], weight: 1, spread: 0.14 },
  { id: 'TUR-14', countryCode: 'TUR', regionId: 'TR-14', name: 'Bolu', coordinates: [31.6, 40.6], weight: 1, spread: 0.14 },
  { id: 'TUR-11', countryCode: 'TUR', regionId: 'TR-11', name: 'Bilecik', coordinates: [30.2, 40.1], weight: 1, spread: 0.14 },
  { id: 'TUR-26', countryCode: 'TUR', regionId: 'TR-26', name: 'Eskisehir', coordinates: [31, 39.6], weight: 1, spread: 0.14 },
  { id: 'TUR-18', countryCode: 'TUR', regionId: 'TR-18', name: 'Çankiri', coordinates: [33.4, 40.7], weight: 1, spread: 0.14 },
  { id: 'TUR-78', countryCode: 'TUR', regionId: 'TR-78', name: 'Karabük', coordinates: [32.7, 41.2], weight: 1, spread: 0.14 },
  { id: 'TUR-60', countryCode: 'TUR', regionId: 'TR-60', name: 'Tokat', coordinates: [36.5, 40.4], weight: 1, spread: 0.14 },
  { id: 'TUR-58', countryCode: 'TUR', regionId: 'TR-58', name: 'Sivas', coordinates: [37.5, 39.7], weight: 1, spread: 0.14 },
  { id: 'TUR-19', countryCode: 'TUR', regionId: 'TR-19', name: 'Çorum', coordinates: [34.6, 40.7], weight: 1, spread: 0.14 },
  { id: 'TUR-05', countryCode: 'TUR', regionId: 'TR-05', name: 'Amasya', coordinates: [35.7, 40.7], weight: 1, spread: 0.14 },
  { id: 'TUR-43', countryCode: 'TUR', regionId: 'TR-43', name: 'Kütahya', coordinates: [29.6, 39.3], weight: 1, spread: 0.14 },
  { id: 'TUR-70', countryCode: 'TUR', regionId: 'TR-70', name: 'Karaman', coordinates: [33.3, 37], weight: 1, spread: 0.14 },
  { id: 'TUR-51', countryCode: 'TUR', regionId: 'TR-51', name: 'Nigde', coordinates: [34.7, 37.8], weight: 1, spread: 0.14 },
  { id: 'TUR-38', countryCode: 'TUR', regionId: 'TR-38', name: 'Kayseri', coordinates: [35.7, 38.5], weight: 1, spread: 0.14 },
  { id: 'TUR-32', countryCode: 'TUR', regionId: 'TR-32', name: 'Isparta', coordinates: [30.9, 37.9], weight: 1, spread: 0.14 },
  { id: 'TUR-45', countryCode: 'TUR', regionId: 'TR-45', name: 'Manisa', coordinates: [28.2, 38.7], weight: 1, spread: 0.14 },
  { id: 'TUR-20', countryCode: 'TUR', regionId: 'TR-20', name: 'Denizli', coordinates: [29.3, 37.8], weight: 1, spread: 0.14 },
  { id: 'TUR-15', countryCode: 'TUR', regionId: 'TR-15', name: 'Burdur', coordinates: [30.1, 37.5], weight: 1, spread: 0.14 },
  { id: 'TUR-68', countryCode: 'TUR', regionId: 'TR-68', name: 'Aksaray', coordinates: [34, 38.6], weight: 1, spread: 0.14 },
  { id: 'TUR-50', countryCode: 'TUR', regionId: 'TR-50', name: 'Nevsehir', coordinates: [34.6, 38.8], weight: 1, spread: 0.14 },
  { id: 'TUR-66', countryCode: 'TUR', regionId: 'TR-66', name: 'Yozgat', coordinates: [35.2, 39.8], weight: 1, spread: 0.14 },
  { id: 'TUR-40', countryCode: 'TUR', regionId: 'TR-40', name: 'Kirsehir', coordinates: [34.2, 39.3], weight: 1, spread: 0.14 },
  { id: 'TUR-64', countryCode: 'TUR', regionId: 'TR-64', name: 'Usak', coordinates: [29.5, 38.6], weight: 1, spread: 0.14 },
  { id: 'TUR-24', countryCode: 'TUR', regionId: 'TR-24', name: 'Erzincan', coordinates: [39.4, 39.7], weight: 1, spread: 0.14 },
  { id: 'TUR-62', countryCode: 'TUR', regionId: 'TR-62', name: 'Tunceli', coordinates: [39.6, 39.2], weight: 1, spread: 0.14 },
  { id: 'TUR-03', countryCode: 'TUR', regionId: 'TR-03', name: 'Afyonkarahisar', coordinates: [30.6, 38.7], weight: 1, spread: 0.14 },
  { id: 'TUR-71', countryCode: 'TUR', regionId: 'TR-71', name: 'Kinkkale', coordinates: [33.7, 39.9], weight: 1, spread: 0.14 },
  { id: 'TUR-46', countryCode: 'TUR', regionId: 'TR-46', name: 'K. Maras', coordinates: [37, 37.9], weight: 1, spread: 0.14 },
  { id: 'TUR-49', countryCode: 'TUR', regionId: 'TR-49', name: 'Mus', coordinates: [41.8, 39.1], weight: 1, spread: 0.14 },
  { id: 'TUR-25', countryCode: 'TUR', regionId: 'TR-25', name: 'Erzurum', coordinates: [41.5, 40], weight: 1, spread: 0.14 },
  { id: 'TUR-44', countryCode: 'TUR', regionId: 'TR-44', name: 'Malatya', coordinates: [38.2, 38.5], weight: 1, spread: 0.14 },
  { id: 'TUR-23', countryCode: 'TUR', regionId: 'TR-23', name: 'Elazig', coordinates: [39.5, 38.8], weight: 1, spread: 0.14 },
  { id: 'TUR-13', countryCode: 'TUR', regionId: 'TR-13', name: 'Bitlis', coordinates: [42.4, 38.6], weight: 1, spread: 0.14 },
  { id: 'TUR-12', countryCode: 'TUR', regionId: 'TR-12', name: 'Bingöl', coordinates: [40.6, 39.1], weight: 1, spread: 0.14 },
  { id: 'TUR-80', countryCode: 'TUR', regionId: 'TR-80', name: 'Osmaniye', coordinates: [36.3, 37.3], weight: 1, spread: 0.14 },
  { id: 'TUR-02', countryCode: 'TUR', regionId: 'TR-02', name: 'Adiyaman', coordinates: [38.3, 37.8], weight: 1, spread: 0.14 },
  { id: 'TUR-72', countryCode: 'TUR', regionId: 'TR-72', name: 'Batman', coordinates: [41.4, 38.1], weight: 1, spread: 0.14 },
  { id: 'TUR-56', countryCode: 'TUR', regionId: 'TR-56', name: 'Siirt', coordinates: [42.4, 37.9], weight: 1, spread: 0.14 },
  { id: 'TUR-69', countryCode: 'TUR', regionId: 'TR-69', name: 'Bayburt', coordinates: [40.3, 40.3], weight: 1, spread: 0.14 },
  { id: 'TUR-29', countryCode: 'TUR', regionId: 'TR-29', name: 'Gümüshane', coordinates: [39.3, 40.4], weight: 1, spread: 0.14 },
  // IND
  { id: 'IND-LA', countryCode: 'IND', regionId: 'IN-LA', name: 'Ladakh', coordinates: [77.8, 33.8], weight: 1, spread: 0.2 },
  { id: 'IND-AR', countryCode: 'IND', regionId: 'IN-AR', name: 'Arunachal Pradesh', coordinates: [94.7, 28], weight: 1, spread: 0.2 },
  { id: 'IND-SK', countryCode: 'IND', regionId: 'IN-SK', name: 'Sikkim', coordinates: [88.5, 27.5], weight: 1, spread: 0.2 },
  { id: 'IND-WB', countryCode: 'IND', regionId: 'IN-WB', name: 'West Bengal', coordinates: [88.2, 23.9], weight: 1, spread: 0.2 },
  { id: 'IND-AS', countryCode: 'IND', regionId: 'IN-AS', name: 'Assam', coordinates: [92.5, 26.2], weight: 1, spread: 0.2 },
  { id: 'IND-UT', countryCode: 'IND', regionId: 'IN-UT', name: 'Uttarakhand', coordinates: [79.2, 30.1], weight: 1, spread: 0.2 },
  { id: 'IND-NL', countryCode: 'IND', regionId: 'IN-NL', name: 'Nagaland', coordinates: [94.5, 26.1], weight: 1, spread: 0.2 },
  { id: 'IND-MN', countryCode: 'IND', regionId: 'IN-MN', name: 'Manipur', coordinates: [93.9, 24.9], weight: 1, spread: 0.2 },
  { id: 'IND-MZ', countryCode: 'IND', regionId: 'IN-MZ', name: 'Mizoram', coordinates: [92.8, 23.3], weight: 1, spread: 0.2 },
  { id: 'IND-TR', countryCode: 'IND', regionId: 'IN-TR', name: 'Tripura', coordinates: [91.8, 23.8], weight: 1, spread: 0.2 },
  { id: 'IND-ML', countryCode: 'IND', regionId: 'IN-ML', name: 'Meghalaya', coordinates: [91.3, 25.6], weight: 1, spread: 0.2 },
  { id: 'IND-PB', countryCode: 'IND', regionId: 'IN-PB', name: 'Punjab', coordinates: [75.5, 31], weight: 1, spread: 0.2 },
  { id: 'IND-RJ', countryCode: 'IND', regionId: 'IN-RJ', name: 'Rajasthan', coordinates: [74.6, 26.1], weight: 1, spread: 0.2 },
  { id: 'IND-GJ', countryCode: 'IND', regionId: 'IN-GJ', name: 'Gujarat', coordinates: [71.6, 22.6], weight: 1, spread: 0.2 },
  { id: 'IND-HP', countryCode: 'IND', regionId: 'IN-HP', name: 'Himachal Pradesh', coordinates: [77.5, 31.9], weight: 1, spread: 0.2 },
  { id: 'IND-JK', countryCode: 'IND', regionId: 'IN-JK', name: 'Jammu and Kashmir', coordinates: [75, 33.5], weight: 1, spread: 0.2 },
  { id: 'IND-BR', countryCode: 'IND', regionId: 'IN-BR', name: 'Bihar', coordinates: [85.7, 25.9], weight: 1, spread: 0.2 },
  { id: 'IND-UP', countryCode: 'IND', regionId: 'IN-UP', name: 'Uttar Pradesh', coordinates: [80.5, 26.7], weight: 1, spread: 0.2 },
  { id: 'IND-AP', countryCode: 'IND', regionId: 'IN-AP', name: 'Andhra Pradesh', coordinates: [80.1, 15.7], weight: 1, spread: 0.2 },
  { id: 'IND-OR', countryCode: 'IND', regionId: 'IN-OR', name: 'Odisha', coordinates: [84.2, 20.4], weight: 1, spread: 0.2 },
  { id: 'IND-DH', countryCode: 'IND', regionId: 'IN-DH', name: 'Dadra and Nagar Haveli and Daman and Diu', coordinates: [73.0, 20.3], weight: 1, spread: 0.2 },
  { id: 'IND-GA', countryCode: 'IND', regionId: 'IN-GA', name: 'Goa', coordinates: [74, 15.3], weight: 1, spread: 0.2 },
  { id: 'IND-KL', countryCode: 'IND', regionId: 'IN-KL', name: 'Kerala', coordinates: [76.4, 10.7], weight: 1, spread: 0.2 },
  { id: 'IND-PY', countryCode: 'IND', regionId: 'IN-PY', name: 'Puducherry', coordinates: [79.3, 12.9], weight: 1, spread: 0.2 },
  { id: 'IND-LD', countryCode: 'IND', regionId: 'IN-LD', name: 'Lakshadweep', coordinates: [73, 10.6], weight: 1, spread: 0.2 },
  { id: 'IND-AN', countryCode: 'IND', regionId: 'IN-AN', name: 'Andaman and Nicobar', coordinates: [93.2, 10.6], weight: 1, spread: 0.2 },
  { id: 'IND-JH', countryCode: 'IND', regionId: 'IN-JH', name: 'Jharkhand', coordinates: [85.7, 23.5], weight: 1, spread: 0.2 },
  { id: 'IND-CH', countryCode: 'IND', regionId: 'IN-CH', name: 'Chandigarh', coordinates: [76.8, 30.8], weight: 1, spread: 0.2 },
  { id: 'IND-MP', countryCode: 'IND', regionId: 'IN-MP', name: 'Madhya Pradesh', coordinates: [78.1, 23.9], weight: 1, spread: 0.2 },
  { id: 'IND-CT', countryCode: 'IND', regionId: 'IN-CT', name: 'Chhattisgarh', coordinates: [81.9, 21.2], weight: 1, spread: 0.2 },
  { id: 'IND-HR', countryCode: 'IND', regionId: 'IN-HR', name: 'Haryana', coordinates: [76.4, 29.2], weight: 1, spread: 0.2 },
  { id: 'IND-TG', countryCode: 'IND', regionId: 'IN-TG', name: 'Telangana', coordinates: [79.1, 17.8], weight: 1, spread: 0.2 },
  // CHN
  { id: 'CHN-XJ', countryCode: 'CHN', regionId: 'CN-XJ', name: 'Xinjiang', coordinates: [84.1, 41.1], weight: 1, spread: 0.18 },
  { id: 'CHN-XZ', countryCode: 'CHN', regionId: 'CN-XZ', name: 'Xizang', coordinates: [88.8, 31.3], weight: 1, spread: 0.18 },
  { id: 'CHN-NM', countryCode: 'CHN', regionId: 'CN-NM', name: 'Inner Mongol', coordinates: [114.6, 44.2], weight: 1, spread: 0.18 },
  { id: 'CHN-GS', countryCode: 'CHN', regionId: 'CN-GS', name: 'Gansu', coordinates: [102.2, 37.1], weight: 1, spread: 0.18 },
  { id: 'CHN-YN', countryCode: 'CHN', regionId: 'CN-YN', name: 'Yunnan', coordinates: [101.7, 25.5], weight: 1, spread: 0.18 },
  { id: 'CHN-HL', countryCode: 'CHN', regionId: 'CN-HL', name: 'Heilongjiang', coordinates: [127.4, 48.3], weight: 1, spread: 0.18 },
  { id: 'CHN-JL', countryCode: 'CHN', regionId: 'CN-JL', name: 'Jilin', coordinates: [126.5, 43.6], weight: 1, spread: 0.18 },
  { id: 'CHN-LN', countryCode: 'CHN', regionId: 'CN-LN', name: 'Liaoning', coordinates: [122.3, 40.7], weight: 1, spread: 0.18 },
  { id: 'CHN-GX', countryCode: 'CHN', regionId: 'CN-GX', name: 'Guangxi', coordinates: [108.6, 23.8], weight: 1, spread: 0.18 },
  { id: 'CHN-HI', countryCode: 'CHN', regionId: 'CN-HI', name: 'Hainan', coordinates: [109.9, 19.3], weight: 1, spread: 0.18 },
  { id: 'CHN-FJ', countryCode: 'CHN', regionId: 'CN-FJ', name: 'Fujian', coordinates: [118.6, 25.8], weight: 1, spread: 0.18 },
  { id: 'CHN-JS', countryCode: 'CHN', regionId: 'CN-JS', name: 'Jiangsu', coordinates: [119.3, 32.9], weight: 1, spread: 0.18 },
  { id: 'CHN-SD', countryCode: 'CHN', regionId: 'CN-SD', name: 'Shandong', coordinates: [119.1, 36.7], weight: 1, spread: 0.18 },
  { id: 'CHN-HE', countryCode: 'CHN', regionId: 'CN-HE', name: 'Hebei', coordinates: [116.4, 39.7], weight: 1, spread: 0.18 },
  { id: 'CHN-TJ', countryCode: 'CHN', regionId: 'CN-TJ', name: 'Tianjin', coordinates: [117.4, 39.5], weight: 1, spread: 0.18 },
  { id: 'CHN-X01~', countryCode: 'CHN', regionId: 'CN-X01~', name: 'Paracel Islands', coordinates: [112, 16.5], weight: 1, spread: 0.18 },
  { id: 'CHN-SC', countryCode: 'CHN', regionId: 'CN-SC', name: 'Sichuan', coordinates: [103.1, 30.6], weight: 1, spread: 0.18 },
  { id: 'CHN-CQ', countryCode: 'CHN', regionId: 'CN-CQ', name: 'Chongqing', coordinates: [107.9, 30], weight: 1, spread: 0.18 },
  { id: 'CHN-GZ', countryCode: 'CHN', regionId: 'CN-GZ', name: 'Guizhou', coordinates: [106.8, 27], weight: 1, spread: 0.18 },
  { id: 'CHN-HN', countryCode: 'CHN', regionId: 'CN-HN', name: 'Hunan', coordinates: [111.6, 27.4], weight: 1, spread: 0.18 },
  { id: 'CHN-NX', countryCode: 'CHN', regionId: 'CN-NX', name: 'Ningxia', coordinates: [106.2, 37.1], weight: 1, spread: 0.18 },
  { id: 'CHN-SN', countryCode: 'CHN', regionId: 'CN-SN', name: 'Shaanxi', coordinates: [108.8, 35.3], weight: 1, spread: 0.18 },
  { id: 'CHN-QH', countryCode: 'CHN', regionId: 'CN-QH', name: 'Qinghai', coordinates: [96.6, 35.1], weight: 1, spread: 0.18 },
  { id: 'CHN-SX', countryCode: 'CHN', regionId: 'CN-SX', name: 'Shanxi', coordinates: [112.5, 37.9], weight: 1, spread: 0.18 },
  { id: 'CHN-JX', countryCode: 'CHN', regionId: 'CN-JX', name: 'Jiangxi', coordinates: [115.7, 27.5], weight: 1, spread: 0.18 },
  { id: 'CHN-HA', countryCode: 'CHN', regionId: 'CN-HA', name: 'Henan', coordinates: [114.2, 34], weight: 1, spread: 0.18 },
  { id: 'CHN-HB', countryCode: 'CHN', regionId: 'CN-HB', name: 'Hubei', coordinates: [111.9, 30.9], weight: 1, spread: 0.18 },
  { id: 'CHN-AH', countryCode: 'CHN', regionId: 'CN-AH', name: 'Anhui', coordinates: [117.3, 32], weight: 1, spread: 0.18 },
  // JPN
  { id: 'JPN-46', countryCode: 'JPN', regionId: 'JP-46', name: 'Kagoshima', coordinates: [130.56, 31.56], weight: 1, spread: 0.14 },
  { id: 'JPN-44', countryCode: 'JPN', regionId: 'JP-44', name: 'Ōita', coordinates: [131.5, 33.2], weight: 1, spread: 0.14 },
  { id: 'JPN-40', countryCode: 'JPN', regionId: 'JP-40', name: 'Fukuoka', coordinates: [130.5, 33.5], weight: 1, spread: 0.14 },
  { id: 'JPN-41', countryCode: 'JPN', regionId: 'JP-41', name: 'Saga', coordinates: [130.1, 33.3], weight: 1, spread: 0.14 },
  { id: 'JPN-42', countryCode: 'JPN', regionId: 'JP-42', name: 'Nagasaki', coordinates: [129.87, 32.75], weight: 1, spread: 0.14 },
  { id: 'JPN-43', countryCode: 'JPN', regionId: 'JP-43', name: 'Kumamoto', coordinates: [130.4, 32.5], weight: 1, spread: 0.14 },
  { id: 'JPN-45', countryCode: 'JPN', regionId: 'JP-45', name: 'Miyazaki', coordinates: [131.4, 32.3], weight: 1, spread: 0.14 },
  { id: 'JPN-36', countryCode: 'JPN', regionId: 'JP-36', name: 'Tokushima', coordinates: [134.3, 33.9], weight: 1, spread: 0.14 },
  { id: 'JPN-37', countryCode: 'JPN', regionId: 'JP-37', name: 'Kagawa', coordinates: [134.04, 34.34], weight: 1, spread: 0.14 },
  { id: 'JPN-38', countryCode: 'JPN', regionId: 'JP-38', name: 'Ehime', coordinates: [132.9, 33.8], weight: 1, spread: 0.14 },
  { id: 'JPN-39', countryCode: 'JPN', regionId: 'JP-39', name: 'Kōchi', coordinates: [133.53, 33.56], weight: 1, spread: 0.14 },
  { id: 'JPN-32', countryCode: 'JPN', regionId: 'JP-32', name: 'Shimane', coordinates: [132.56, 35.07], weight: 1, spread: 0.14 },
  { id: 'JPN-35', countryCode: 'JPN', regionId: 'JP-35', name: 'Yamaguchi', coordinates: [131.8, 34.1], weight: 1, spread: 0.14 },
  { id: 'JPN-31', countryCode: 'JPN', regionId: 'JP-31', name: 'Tottori', coordinates: [133.8, 35.3], weight: 1, spread: 0.14 },
  { id: 'JPN-28', countryCode: 'JPN', regionId: 'JP-28', name: 'Hyōgo', coordinates: [134.8, 35], weight: 1, spread: 0.14 },
  { id: 'JPN-26', countryCode: 'JPN', regionId: 'JP-26', name: 'Kyōto', coordinates: [135.4, 35.3], weight: 1, spread: 0.14 },
  { id: 'JPN-18', countryCode: 'JPN', regionId: 'JP-18', name: 'Fukui', coordinates: [136.1, 35.8], weight: 1, spread: 0.14 },
  { id: 'JPN-17', countryCode: 'JPN', regionId: 'JP-17', name: 'Ishikawa', coordinates: [136.8, 36.8], weight: 1, spread: 0.14 },
  { id: 'JPN-16', countryCode: 'JPN', regionId: 'JP-16', name: 'Toyama', coordinates: [137.2, 36.7], weight: 1, spread: 0.14 },
  { id: 'JPN-15', countryCode: 'JPN', regionId: 'JP-15', name: 'Niigata', coordinates: [138.8, 37.5], weight: 1, spread: 0.14 },
  { id: 'JPN-06', countryCode: 'JPN', regionId: 'JP-06', name: 'Yamagata', coordinates: [140, 38.3], weight: 1, spread: 0.14 },
  { id: 'JPN-05', countryCode: 'JPN', regionId: 'JP-05', name: 'Akita', coordinates: [140.4, 39.7], weight: 1, spread: 0.14 },
  { id: 'JPN-02', countryCode: 'JPN', regionId: 'JP-02', name: 'Aomori', coordinates: [140.74, 40.82], weight: 1, spread: 0.14 },
  { id: 'JPN-03', countryCode: 'JPN', regionId: 'JP-03', name: 'Iwate', coordinates: [141.3, 39.5], weight: 1, spread: 0.14 },
  { id: 'JPN-04', countryCode: 'JPN', regionId: 'JP-04', name: 'Miyagi', coordinates: [141.1, 38.5], weight: 1, spread: 0.14 },
  { id: 'JPN-07', countryCode: 'JPN', regionId: 'JP-07', name: 'Fukushima', coordinates: [140.2, 37.4], weight: 1, spread: 0.14 },
  { id: 'JPN-08', countryCode: 'JPN', regionId: 'JP-08', name: 'Ibaraki', coordinates: [140.3, 36.4], weight: 1, spread: 0.14 },
  { id: 'JPN-12', countryCode: 'JPN', regionId: 'JP-12', name: 'Chiba', coordinates: [140.2, 35.6], weight: 1, spread: 0.14 },
  { id: 'JPN-14', countryCode: 'JPN', regionId: 'JP-14', name: 'Kanagawa', coordinates: [139.4, 35.4], weight: 1, spread: 0.14 },
  { id: 'JPN-22', countryCode: 'JPN', regionId: 'JP-22', name: 'Shizuoka', coordinates: [138.4, 35], weight: 1, spread: 0.14 },
  { id: 'JPN-23', countryCode: 'JPN', regionId: 'JP-23', name: 'Aichi', coordinates: [137.1, 34.9], weight: 1, spread: 0.14 },
  { id: 'JPN-24', countryCode: 'JPN', regionId: 'JP-24', name: 'Mie', coordinates: [136.5, 34.5], weight: 1, spread: 0.14 },
  { id: 'JPN-30', countryCode: 'JPN', regionId: 'JP-30', name: 'Wakayama', coordinates: [135.6, 33.9], weight: 1, spread: 0.14 },
  { id: 'JPN-33', countryCode: 'JPN', regionId: 'JP-33', name: 'Okayama', coordinates: [133.9, 34.9], weight: 1, spread: 0.14 },
  { id: 'JPN-34', countryCode: 'JPN', regionId: 'JP-34', name: 'Hiroshima', coordinates: [132.7, 34.4], weight: 1, spread: 0.14 },
  { id: 'JPN-47', countryCode: 'JPN', regionId: 'JP-47', name: 'Okinawa', coordinates: [127.68, 26.34], weight: 1, spread: 0.14 },
  { id: 'JPN-10', countryCode: 'JPN', regionId: 'JP-10', name: 'Gunma', coordinates: [139, 36.5], weight: 1, spread: 0.14 },
  { id: 'JPN-20', countryCode: 'JPN', regionId: 'JP-20', name: 'Nagano', coordinates: [138.1, 36.1], weight: 1, spread: 0.14 },
  { id: 'JPN-09', countryCode: 'JPN', regionId: 'JP-09', name: 'Tochigi', coordinates: [139.8, 36.7], weight: 1, spread: 0.14 },
  { id: 'JPN-21', countryCode: 'JPN', regionId: 'JP-21', name: 'Gifu', coordinates: [137, 35.8], weight: 1, spread: 0.14 },
  { id: 'JPN-25', countryCode: 'JPN', regionId: 'JP-25', name: 'Shiga', coordinates: [136.2, 35.2], weight: 1, spread: 0.14 },
  { id: 'JPN-11', countryCode: 'JPN', regionId: 'JP-11', name: 'Saitama', coordinates: [139.3, 36], weight: 1, spread: 0.14 },
  { id: 'JPN-19', countryCode: 'JPN', regionId: 'JP-19', name: 'Yamanashi', coordinates: [138.6, 35.6], weight: 1, spread: 0.14 },
  { id: 'JPN-29', countryCode: 'JPN', regionId: 'JP-29', name: 'Nara', coordinates: [135.9, 34.3], weight: 1, spread: 0.14 },
  // KOR
  { id: 'KOR-42', countryCode: 'KOR', regionId: 'KR-42', name: 'Gangwon', coordinates: [128.4, 37.5], weight: 1, spread: 0.12 },
  { id: 'KOR-44', countryCode: 'KOR', regionId: 'KR-44', name: 'South Chungcheong', coordinates: [126.9, 36.4], weight: 1, spread: 0.12 },
  { id: 'KOR-28', countryCode: 'KOR', regionId: 'KR-28', name: 'Incheon', coordinates: [126.6, 37.5], weight: 1, spread: 0.12 },
  { id: 'KOR-45', countryCode: 'KOR', regionId: 'KR-45', name: 'North Jeolla', coordinates: [126.9, 35.7], weight: 1, spread: 0.12 },
  { id: 'KOR-46', countryCode: 'KOR', regionId: 'KR-46', name: 'South Jeolla', coordinates: [126.6, 34.6], weight: 1, spread: 0.12 },
  { id: 'KOR-48', countryCode: 'KOR', regionId: 'KR-48', name: 'South Gyeongsang', coordinates: [128.4, 35], weight: 1, spread: 0.12 },
  { id: 'KOR-31', countryCode: 'KOR', regionId: 'KR-31', name: 'Ulsan', coordinates: [129.2, 35.5], weight: 1, spread: 0.12 },
  { id: 'KOR-47', countryCode: 'KOR', regionId: 'KR-47', name: 'North Gyeongsang', coordinates: [129, 36.4], weight: 1, spread: 0.12 },
  { id: 'KOR-49', countryCode: 'KOR', regionId: 'KR-49', name: 'Jeju', coordinates: [126.6, 33.4], weight: 1, spread: 0.12 },
  { id: 'KOR-30', countryCode: 'KOR', regionId: 'KR-30', name: 'Daejeon', coordinates: [127.3, 36.4], weight: 1, spread: 0.12 },
  { id: 'KOR-50', countryCode: 'KOR', regionId: 'KR-50', name: 'Sejong', coordinates: [127.2, 36.6], weight: 1, spread: 0.12 },
  { id: 'KOR-43', countryCode: 'KOR', regionId: 'KR-43', name: 'North Chungcheong', coordinates: [127.8, 36.6], weight: 1, spread: 0.12 },
  { id: 'KOR-29', countryCode: 'KOR', regionId: 'KR-29', name: 'Gwangju', coordinates: [127, 35.2], weight: 1, spread: 0.12 },
  { id: 'KOR-27', countryCode: 'KOR', regionId: 'KR-27', name: 'Daegu', coordinates: [128.6, 35.9], weight: 1, spread: 0.12 },
  // IDN
  { id: 'IDN-KI', countryCode: 'IDN', regionId: 'ID-KI', name: 'Kalimantan Timur', coordinates: [116.5, 0.5], weight: 1, spread: 0.22 },
  { id: 'IDN-NT', countryCode: 'IDN', regionId: 'ID-NT', name: 'Nusa Tenggara Timur', coordinates: [121.5, -8.7], weight: 1, spread: 0.22 },
  { id: 'IDN-KB', countryCode: 'IDN', regionId: 'ID-KB', name: 'Kalimantan Barat', coordinates: [110.6, -0.4], weight: 1, spread: 0.22 },
  { id: 'IDN-PA', countryCode: 'IDN', regionId: 'ID-PA', name: 'Papua', coordinates: [138.5, -4.3], weight: 1, spread: 0.22 },
  { id: 'IDN-MA', countryCode: 'IDN', regionId: 'ID-MA', name: 'Maluku', coordinates: [128.1, -3.2], weight: 1, spread: 0.22 },
  { id: 'IDN-NB', countryCode: 'IDN', regionId: 'ID-NB', name: 'Nusa Tenggara Barat', coordinates: [117.5, -8.7], weight: 1, spread: 0.22 },
  { id: 'IDN-SN', countryCode: 'IDN', regionId: 'ID-SN', name: 'Sulawesi Selatan', coordinates: [120.5, -4.6], weight: 1, spread: 0.22 },
  { id: 'IDN-BT', countryCode: 'IDN', regionId: 'ID-BT', name: 'Banten', coordinates: [105.9, -6.5], weight: 1, spread: 0.22 },
  { id: 'IDN-YO', countryCode: 'IDN', regionId: 'ID-YO', name: 'Yogyakarta', coordinates: [110.5, -7.9], weight: 1, spread: 0.22 },
  { id: 'IDN-SG', countryCode: 'IDN', regionId: 'ID-SG', name: 'Sulawesi Tenggara', coordinates: [122.0, -4.0], weight: 1, spread: 0.22 },
  { id: 'IDN-PB', countryCode: 'IDN', regionId: 'ID-PB', name: 'Papua Barat', coordinates: [133.8, -1.5], weight: 1, spread: 0.22 },
  { id: 'IDN-ST', countryCode: 'IDN', regionId: 'ID-ST', name: 'Sulawesi Tengah', coordinates: [121.9, -0.9], weight: 1, spread: 0.22 },
  { id: 'IDN-MU', countryCode: 'IDN', regionId: 'ID-MU', name: 'Maluku Utara', coordinates: [127.8, 1.5], weight: 1, spread: 0.22 },
  { id: 'IDN-KR', countryCode: 'IDN', regionId: 'ID-KR', name: 'Kepulauan Riau', coordinates: [104.4, 0.9], weight: 1, spread: 0.22 },
  { id: 'IDN-RI', countryCode: 'IDN', regionId: 'ID-RI', name: 'Riau', coordinates: [102.3, 0.7], weight: 1, spread: 0.22 },
  { id: 'IDN-GO', countryCode: 'IDN', regionId: 'ID-GO', name: 'Gorontalo', coordinates: [122.4, 0.5], weight: 1, spread: 0.22 },
  { id: 'IDN-SA', countryCode: 'IDN', regionId: 'ID-SA', name: 'Sulawesi Utara', coordinates: [124.8, 0.6], weight: 1, spread: 0.22 },
  { id: 'IDN-SR', countryCode: 'IDN', regionId: 'ID-SR', name: 'Sulawesi Barat', coordinates: [119.3, -2.8], weight: 1, spread: 0.22 },
  { id: 'IDN-JA', countryCode: 'IDN', regionId: 'ID-JA', name: 'Jambi', coordinates: [102.7, -1.7], weight: 1, spread: 0.22 },
  { id: 'IDN-SS', countryCode: 'IDN', regionId: 'ID-SS', name: 'Sumatera Selatan', coordinates: [104.1, -3.1], weight: 1, spread: 0.22 },
  { id: 'IDN-LA', countryCode: 'IDN', regionId: 'ID-LA', name: 'Lampung', coordinates: [104.8, -5], weight: 1, spread: 0.22 },
  { id: 'IDN-BE', countryCode: 'IDN', regionId: 'ID-BE', name: 'Bengkulu', coordinates: [102.5, -3.9], weight: 1, spread: 0.22 },
  { id: 'IDN-SB', countryCode: 'IDN', regionId: 'ID-SB', name: 'Sumatera Barat', coordinates: [100.3, -1.4], weight: 1, spread: 0.22 },
  { id: 'IDN-SU', countryCode: 'IDN', regionId: 'ID-SU', name: 'Sumatera Utara', coordinates: [98.7, 1.6], weight: 1, spread: 0.22 },
  { id: 'IDN-AC', countryCode: 'IDN', regionId: 'ID-AC', name: 'Aceh', coordinates: [96.7, 3.8], weight: 1, spread: 0.22 },
  { id: 'IDN-KT', countryCode: 'IDN', regionId: 'ID-KT', name: 'Kalimantan Tengah', coordinates: [113.4, -1.7], weight: 1, spread: 0.22 },
  { id: 'IDN-KS', countryCode: 'IDN', regionId: 'ID-KS', name: 'Kalimantan Selatan', coordinates: [115.8, -3.1], weight: 1, spread: 0.22 },
  { id: 'IDN-BA', countryCode: 'IDN', regionId: 'ID-BA', name: 'Bali', coordinates: [115.3, -8.5], weight: 1, spread: 0.22 },
  { id: 'IDN-BB', countryCode: 'IDN', regionId: 'ID-BB', name: 'Bangka-Belitung', coordinates: [106.4, -2.7], weight: 1, spread: 0.22 },
  // THA
  { id: 'THA-32', countryCode: 'THA', regionId: 'TH-32', name: 'Surin', coordinates: [103.6, 15], weight: 1, spread: 0.16 },
  { id: 'THA-33', countryCode: 'THA', regionId: 'TH-33', name: 'Si Sa Ket', coordinates: [104.4, 14.9], weight: 1, spread: 0.16 },
  { id: 'THA-34', countryCode: 'THA', regionId: 'TH-34', name: 'Ubon Ratchathani', coordinates: [105, 15.2], weight: 1, spread: 0.16 },
  { id: 'THA-27', countryCode: 'THA', regionId: 'TH-27', name: 'Sa Kaeo', coordinates: [102.3, 13.8], weight: 1, spread: 0.16 },
  { id: 'THA-31', countryCode: 'THA', regionId: 'TH-31', name: 'Buri Ram', coordinates: [103, 14.9], weight: 1, spread: 0.16 },
  { id: 'THA-23', countryCode: 'THA', regionId: 'TH-23', name: 'Trat', coordinates: [102.5, 12.2], weight: 1, spread: 0.16 },
  { id: 'THA-22', countryCode: 'THA', regionId: 'TH-22', name: 'Chanthaburi', coordinates: [102.1, 12.9], weight: 1, spread: 0.16 },
  { id: 'THA-91', countryCode: 'THA', regionId: 'TH-91', name: 'Satun', coordinates: [100.1, 6.6], weight: 1, spread: 0.16 },
  { id: 'THA-90', countryCode: 'THA', regionId: 'TH-90', name: 'Songkhla', coordinates: [100.4, 7.1], weight: 1, spread: 0.16 },
  { id: 'THA-95', countryCode: 'THA', regionId: 'TH-95', name: 'Yala', coordinates: [101.2, 6.2], weight: 1, spread: 0.16 },
  { id: 'THA-96', countryCode: 'THA', regionId: 'TH-96', name: 'Narathiwat', coordinates: [101.7, 6.2], weight: 1, spread: 0.16 },
  { id: 'THA-57', countryCode: 'THA', regionId: 'TH-57', name: 'Chiang Rai', coordinates: [99.8, 19.8], weight: 1, spread: 0.16 },
  { id: 'THA-58', countryCode: 'THA', regionId: 'TH-58', name: 'Mae Hong Son', coordinates: [98, 18.9], weight: 1, spread: 0.16 },
  { id: 'THA-63', countryCode: 'THA', regionId: 'TH-63', name: 'Tak', coordinates: [98.7, 16.8], weight: 1, spread: 0.16 },
  { id: 'THA-71', countryCode: 'THA', regionId: 'TH-71', name: 'Kanchanaburi', coordinates: [99.1, 14.8], weight: 1, spread: 0.16 },
  { id: 'THA-77', countryCode: 'THA', regionId: 'TH-77', name: 'Prachuap Khiri Khan', coordinates: [99.6, 11.9], weight: 1, spread: 0.16 },
  { id: 'THA-76', countryCode: 'THA', regionId: 'TH-76', name: 'Phetchaburi', coordinates: [99.6, 12.9], weight: 1, spread: 0.16 },
  { id: 'THA-70', countryCode: 'THA', regionId: 'TH-70', name: 'Ratchaburi', coordinates: [99.6, 13.5], weight: 1, spread: 0.16 },
  { id: 'THA-86', countryCode: 'THA', regionId: 'TH-86', name: 'Chumphon', coordinates: [99.1, 10.4], weight: 1, spread: 0.16 },
  { id: 'THA-85', countryCode: 'THA', regionId: 'TH-85', name: 'Ranong', coordinates: [98.6, 10], weight: 1, spread: 0.16 },
  { id: 'THA-56', countryCode: 'THA', regionId: 'TH-56', name: 'Phayao', coordinates: [100.3, 19.3], weight: 1, spread: 0.16 },
  { id: 'THA-55', countryCode: 'THA', regionId: 'TH-55', name: 'Nan', coordinates: [100.8, 18.9], weight: 1, spread: 0.16 },
  { id: 'THA-53', countryCode: 'THA', regionId: 'TH-53', name: 'Uttaradit', coordinates: [100.5, 17.7], weight: 1, spread: 0.16 },
  { id: 'THA-65', countryCode: 'THA', regionId: 'TH-65', name: 'Phitsanulok', coordinates: [100.6, 17], weight: 1, spread: 0.16 },
  { id: 'THA-42', countryCode: 'THA', regionId: 'TH-42', name: 'Loei', coordinates: [101.6, 17.4], weight: 1, spread: 0.16 },
  { id: 'THA-38', countryCode: 'THA', regionId: 'TH-38', name: 'Bueng Kan', coordinates: [103.7, 18.1], weight: 1, spread: 0.16 },
  { id: 'THA-43', countryCode: 'THA', regionId: 'TH-43', name: 'Nong Khai', coordinates: [102.9, 18], weight: 1, spread: 0.16 },
  { id: 'THA-48', countryCode: 'THA', regionId: 'TH-48', name: 'Nakhon Phanom', coordinates: [104.4, 17.4], weight: 1, spread: 0.16 },
  { id: 'THA-49', countryCode: 'THA', regionId: 'TH-49', name: 'Mukdahan', coordinates: [104.5, 16.5], weight: 1, spread: 0.16 },
  { id: 'THA-37', countryCode: 'THA', regionId: 'TH-37', name: 'Amnat Charoen', coordinates: [104.8, 15.9], weight: 1, spread: 0.16 },
  { id: 'THA-82', countryCode: 'THA', regionId: 'TH-82', name: 'Phangnga', coordinates: [98.3, 8.8], weight: 1, spread: 0.16 },
  { id: 'THA-81', countryCode: 'THA', regionId: 'TH-81', name: 'Krabi', coordinates: [98.9, 8.1], weight: 1, spread: 0.16 },
  { id: 'THA-92', countryCode: 'THA', regionId: 'TH-92', name: 'Trang', coordinates: [99.6, 7.4], weight: 1, spread: 0.16 },
  { id: 'THA-94', countryCode: 'THA', regionId: 'TH-94', name: 'Pattani', coordinates: [101.3, 6.7], weight: 1, spread: 0.16 },
  { id: 'THA-93', countryCode: 'THA', regionId: 'TH-93', name: 'Phatthalung', coordinates: [100.1, 7.6], weight: 1, spread: 0.16 },
  { id: 'THA-80', countryCode: 'THA', regionId: 'TH-80', name: 'Nakhon Si Thammarat', coordinates: [99.8, 8.4], weight: 1, spread: 0.16 },
  { id: 'THA-84', countryCode: 'THA', regionId: 'TH-84', name: 'Surat Thani', coordinates: [99.0, 9.1], weight: 1, spread: 0.16 },
  { id: 'THA-75', countryCode: 'THA', regionId: 'TH-75', name: 'Samut Songkhram', coordinates: [100, 13.4], weight: 1, spread: 0.16 },
  { id: 'THA-74', countryCode: 'THA', regionId: 'TH-74', name: 'Samut Sakhon', coordinates: [100.2, 13.6], weight: 1, spread: 0.16 },
  { id: 'THA-11', countryCode: 'THA', regionId: 'TH-11', name: 'Samut Prakan', coordinates: [100.7, 13.6], weight: 1, spread: 0.16 },
  { id: 'THA-24', countryCode: 'THA', regionId: 'TH-24', name: 'Chachoengsao', coordinates: [101.2, 13.6], weight: 1, spread: 0.16 },
  { id: 'THA-20', countryCode: 'THA', regionId: 'TH-20', name: 'Chon Buri', coordinates: [101.2, 13.1], weight: 1, spread: 0.16 },
  { id: 'THA-21', countryCode: 'THA', regionId: 'TH-21', name: 'Rayong', coordinates: [101.5, 12.8], weight: 1, spread: 0.16 },
  { id: 'THA-40', countryCode: 'THA', regionId: 'TH-40', name: 'Khon Kaen', coordinates: [102.5, 16.4], weight: 1, spread: 0.16 },
  { id: 'THA-47', countryCode: 'THA', regionId: 'TH-47', name: 'Sakon Nakhon', coordinates: [103.8, 17.4], weight: 1, spread: 0.16 },
  { id: 'THA-72', countryCode: 'THA', regionId: 'TH-72', name: 'Suphan Buri', coordinates: [99.9, 14.7], weight: 1, spread: 0.16 },
  { id: 'THA-17', countryCode: 'THA', regionId: 'TH-17', name: 'Sing Buri', coordinates: [100.3, 14.9], weight: 1, spread: 0.16 },
  { id: 'THA-18', countryCode: 'THA', regionId: 'TH-18', name: 'Chai Nat', coordinates: [100, 15.1], weight: 1, spread: 0.16 },
  { id: 'THA-15', countryCode: 'THA', regionId: 'TH-15', name: 'Ang Thong', coordinates: [100.4, 14.6], weight: 1, spread: 0.16 },
  { id: 'THA-19', countryCode: 'THA', regionId: 'TH-19', name: 'Saraburi', coordinates: [101, 14.6], weight: 1, spread: 0.16 },
  { id: 'THA-30', countryCode: 'THA', regionId: 'TH-30', name: 'Nakhon Ratchasima', coordinates: [102, 14.9], weight: 1, spread: 0.16 },
  { id: 'THA-26', countryCode: 'THA', regionId: 'TH-26', name: 'Nakhon Nayok', coordinates: [101.2, 14.3], weight: 1, spread: 0.16 },
  { id: 'THA-13', countryCode: 'THA', regionId: 'TH-13', name: 'Pathum Thani', coordinates: [100.7, 14.1], weight: 1, spread: 0.16 },
  { id: 'THA-61', countryCode: 'THA', regionId: 'TH-61', name: 'Uthai Thani', coordinates: [99.5, 15.3], weight: 1, spread: 0.16 },
  { id: 'THA-46', countryCode: 'THA', regionId: 'TH-46', name: 'Kalasin', coordinates: [103.5, 16.7], weight: 1, spread: 0.16 },
  { id: 'THA-45', countryCode: 'THA', regionId: 'TH-45', name: 'Roi Et', coordinates: [103.9, 15.9], weight: 1, spread: 0.16 },
  { id: 'THA-44', countryCode: 'THA', regionId: 'TH-44', name: 'Maha Sarakham', coordinates: [103.2, 16], weight: 1, spread: 0.16 },
  { id: 'THA-39', countryCode: 'THA', regionId: 'TH-39', name: 'Nong Bua Lam Phu', coordinates: [102.3, 17.2], weight: 1, spread: 0.16 },
  { id: 'THA-16', countryCode: 'THA', regionId: 'TH-16', name: 'Lop Buri', coordinates: [100.9, 15], weight: 1, spread: 0.16 },
  { id: 'THA-41', countryCode: 'THA', regionId: 'TH-41', name: 'Udon Thani', coordinates: [102.9, 17.4], weight: 1, spread: 0.16 },
  { id: 'THA-14', countryCode: 'THA', regionId: 'TH-14', name: 'Phra Nakhon Si Ayutthaya', coordinates: [100.5, 14.3], weight: 1, spread: 0.16 },
  { id: 'THA-12', countryCode: 'THA', regionId: 'TH-12', name: 'Nonthaburi', coordinates: [100.4, 14], weight: 1, spread: 0.16 },
  { id: 'THA-73', countryCode: 'THA', regionId: 'TH-73', name: 'Nakhon Pathom', coordinates: [100.1, 14], weight: 1, spread: 0.16 },
  { id: 'THA-62', countryCode: 'THA', regionId: 'TH-62', name: 'Kamphaeng Phet', coordinates: [99.6, 16.4], weight: 1, spread: 0.16 },
  { id: 'THA-52', countryCode: 'THA', regionId: 'TH-52', name: 'Lampang', coordinates: [99.5, 18.3], weight: 1, spread: 0.16 },
  { id: 'THA-64', countryCode: 'THA', regionId: 'TH-64', name: 'Sukhothai', coordinates: [99.7, 17.1], weight: 1, spread: 0.16 },
  { id: 'THA-60', countryCode: 'THA', regionId: 'TH-60', name: 'Nakhon Sawan', coordinates: [100, 15.7], weight: 1, spread: 0.16 },
  { id: 'THA-67', countryCode: 'THA', regionId: 'TH-67', name: 'Phetchabun', coordinates: [101.2, 16.3], weight: 1, spread: 0.16 },
  { id: 'THA-66', countryCode: 'THA', regionId: 'TH-66', name: 'Phichit', coordinates: [100.4, 16.2], weight: 1, spread: 0.16 },
  { id: 'THA-36', countryCode: 'THA', regionId: 'TH-36', name: 'Chaiyaphum', coordinates: [101.9, 15.9], weight: 1, spread: 0.16 },
  { id: 'THA-54', countryCode: 'THA', regionId: 'TH-54', name: 'Phrae', coordinates: [100, 18.3], weight: 1, spread: 0.16 },
  { id: 'THA-51', countryCode: 'THA', regionId: 'TH-51', name: 'Lamphun', coordinates: [99, 18.1], weight: 1, spread: 0.16 },
  { id: 'THA-25', countryCode: 'THA', regionId: 'TH-25', name: 'Prachin Buri', coordinates: [101.6, 14.1], weight: 1, spread: 0.16 },
  { id: 'THA-35', countryCode: 'THA', regionId: 'TH-35', name: 'Yasothon', coordinates: [104.4, 15.8], weight: 1, spread: 0.16 },
  // PHL
  { id: 'PHL-SLU', countryCode: 'PHL', regionId: 'PH-SLU', name: 'Sulu', coordinates: [121.0, 6.0], weight: 1, spread: 0.18 },
  { id: 'PHL-ZSI', countryCode: 'PHL', regionId: 'PH-ZSI', name: 'Zamboanga Sibugay', coordinates: [122.5, 7.6], weight: 1, spread: 0.18 },
  { id: 'PHL-PLW', countryCode: 'PHL', regionId: 'PH-PLW', name: 'Palawan', coordinates: [118.7, 9.8], weight: 1, spread: 0.18 },
  { id: 'PHL-SUN', countryCode: 'PHL', regionId: 'PH-SUN', name: 'Surigao del Norte', coordinates: [125.8, 9.8], weight: 1, spread: 0.18 },
  { id: 'PHL-SUR', countryCode: 'PHL', regionId: 'PH-SUR', name: 'Surigao del Sur', coordinates: [126.1, 8.8], weight: 1, spread: 0.18 },
  { id: 'PHL-AGN', countryCode: 'PHL', regionId: 'PH-AGN', name: 'Agusan del Norte', coordinates: [125.5, 9], weight: 1, spread: 0.18 },
  { id: 'PHL-BXU', countryCode: 'PHL', regionId: 'PH-AGN', name: 'Butuan', coordinates: [125.5, 8.9], weight: 1, spread: 0.18 },
  { id: 'PHL-MSR', countryCode: 'PHL', regionId: 'PH-MSR', name: 'Misamis Oriental', coordinates: [124.8, 8.6], weight: 1, spread: 0.18 },
  { id: 'PHL-CDO', countryCode: 'PHL', regionId: 'PH-MSR', name: 'Cagayan de Oro', coordinates: [124.6, 8.4], weight: 1, spread: 0.18 },
  { id: 'PHL-ILG', countryCode: 'PHL', regionId: 'PH-LAN', name: 'Iligan', coordinates: [124.4, 8.2], weight: 1, spread: 0.18 },
  { id: 'PHL-LAN', countryCode: 'PHL', regionId: 'PH-LAN', name: 'Lanao del Norte', coordinates: [124, 8], weight: 1, spread: 0.18 },
  { id: 'PHL-ZAS', countryCode: 'PHL', regionId: 'PH-ZAS', name: 'Zamboanga del Sur', coordinates: [123.3, 7.9], weight: 1, spread: 0.18 },
  { id: 'PHL-MSC', countryCode: 'PHL', regionId: 'PH-MSC', name: 'Misamis Occidental', coordinates: [123.7, 8.4], weight: 1, spread: 0.18 },
  { id: 'PHL-ZAN', countryCode: 'PHL', regionId: 'PH-ZAN', name: 'Zamboanga del Norte', coordinates: [123.0, 8.15], weight: 1, spread: 0.18 },
  { id: 'PHL-ZBC', countryCode: 'PHL', regionId: 'PH-ZAN', name: 'Zamboanga', coordinates: [122.1, 7.2], weight: 1, spread: 0.18 },
  { id: 'PHL-LAS', countryCode: 'PHL', regionId: 'PH-LAS', name: 'Lanao del Sur', coordinates: [124.3, 7.8], weight: 1, spread: 0.18 },
  { id: 'PHL-MAG', countryCode: 'PHL', regionId: 'PH-MAG', name: 'Maguindanao', coordinates: [124.4, 7.1], weight: 1, spread: 0.18 },
  { id: 'PHL-NCO', countryCode: 'PHL', regionId: 'PH-NCO', name: 'Cotabato', coordinates: [124.85, 7.0], weight: 1, spread: 0.18 },
  { id: 'PHL-SUK', countryCode: 'PHL', regionId: 'PH-SUK', name: 'Sultan Kudarat', coordinates: [124.25, 6.5], weight: 1, spread: 0.18 },
  { id: 'PHL-SAR', countryCode: 'PHL', regionId: 'PH-SAR', name: 'Sarangani', coordinates: [125.3, 5.9], weight: 1, spread: 0.18 },
  { id: 'PHL-GNS', countryCode: 'PHL', regionId: 'PH-SCO', name: 'General Santos', coordinates: [124.85, 6.3], weight: 1, spread: 0.18 },
  { id: 'PHL-DAS', countryCode: 'PHL', regionId: 'PH-DAS', name: 'Davao del Sur', coordinates: [125.4, 6.2], weight: 1, spread: 0.18 },
  { id: 'PHL-COM', countryCode: 'PHL', regionId: 'PH-COM', name: 'Compostela Valley', coordinates: [125.9, 7.5], weight: 1, spread: 0.18 },
  { id: 'PHL-DAO', countryCode: 'PHL', regionId: 'PH-DAO', name: 'Davao Oriental', coordinates: [126.3, 7.3], weight: 1, spread: 0.18 },
  { id: 'PHL-SLE', countryCode: 'PHL', regionId: 'PH-SLE', name: 'Southern Leyte', coordinates: [125.0, 10.0], weight: 1, spread: 0.18 },
  { id: 'PHL-LEY', countryCode: 'PHL', regionId: 'PH-LEY', name: 'Leyte', coordinates: [124.95, 10.4], weight: 1, spread: 0.18 },
  { id: 'PHL-EAS', countryCode: 'PHL', regionId: 'PH-EAS', name: 'Eastern Samar', coordinates: [125.5, 11.5], weight: 1, spread: 0.18 },
  { id: 'PHL-BIL', countryCode: 'PHL', regionId: 'PH-BIL', name: 'Biliran', coordinates: [124.47, 11.58], weight: 1, spread: 0.18 },
  { id: 'PHL-WSA', countryCode: 'PHL', regionId: 'PH-WSA', name: 'Samar', coordinates: [124.9, 11.7], weight: 1, spread: 0.18 },
  { id: 'PHL-AUR', countryCode: 'PHL', regionId: 'PH-AUR', name: 'Aurora', coordinates: [121.7, 15.8], weight: 1, spread: 0.18 },
  { id: 'PHL-QUE', countryCode: 'PHL', regionId: 'PH-QUE', name: 'Quezon', coordinates: [122, 14.3], weight: 1, spread: 0.18 },
  { id: 'PHL-CAN', countryCode: 'PHL', regionId: 'PH-CAN', name: 'Camarines Norte', coordinates: [122.7, 14.1], weight: 1, spread: 0.18 },
  { id: 'PHL-CAS', countryCode: 'PHL', regionId: 'PH-CAS', name: 'Camarines Sur', coordinates: [123.3, 13.7], weight: 1, spread: 0.18 },
  { id: 'PHL-ALB', countryCode: 'PHL', regionId: 'PH-ALB', name: 'Albay', coordinates: [123.8, 13.3], weight: 1, spread: 0.18 },
  { id: 'PHL-SOR', countryCode: 'PHL', regionId: 'PH-SOR', name: 'Sorsogon', coordinates: [123.9, 12.9], weight: 1, spread: 0.18 },
  { id: 'PHL-LCN', countryCode: 'PHL', regionId: 'PH-QUE', name: 'Lucena', coordinates: [121.6, 13.9], weight: 1, spread: 0.18 },
  { id: 'PHL-BTG', countryCode: 'PHL', regionId: 'PH-BTG', name: 'Batangas', coordinates: [121, 13.8], weight: 1, spread: 0.18 },
  { id: 'PHL-CAV', countryCode: 'PHL', regionId: 'PH-CAV', name: 'Cavite', coordinates: [120.9, 14.3], weight: 1, spread: 0.18 },
  { id: 'PHL-BUL', countryCode: 'PHL', regionId: 'PH-BUL', name: 'Bulacan', coordinates: [121, 14.9], weight: 1, spread: 0.18 },
  { id: 'PHL-PAM', countryCode: 'PHL', regionId: 'PH-PAM', name: 'Pampanga', coordinates: [120.6, 15], weight: 1, spread: 0.18 },
  { id: 'PHL-BAN', countryCode: 'PHL', regionId: 'PH-BAN', name: 'Bataan', coordinates: [120.5, 14.8], weight: 1, spread: 0.18 },
  { id: 'PHL-OLG', countryCode: 'PHL', regionId: 'PH-ZMB', name: 'Olongapo', coordinates: [120.3, 14.9], weight: 1, spread: 0.18 },
  { id: 'PHL-ZMB', countryCode: 'PHL', regionId: 'PH-ZMB', name: 'Zambales', coordinates: [120.2, 15.2], weight: 1, spread: 0.18 },
  { id: 'PHL-PAN', countryCode: 'PHL', regionId: 'PH-PAN', name: 'Pangasinan', coordinates: [120.2, 16.1], weight: 1, spread: 0.18 },
  { id: 'PHL-DGP', countryCode: 'PHL', regionId: 'PH-PAN', name: 'Dagupan', coordinates: [120.3, 16.1], weight: 1, spread: 0.18 },
  { id: 'PHL-LUN', countryCode: 'PHL', regionId: 'PH-LUN', name: 'La Union', coordinates: [120.4, 16.5], weight: 1, spread: 0.18 },
  { id: 'PHL-ILS', countryCode: 'PHL', regionId: 'PH-ILS', name: 'Ilocos Sur', coordinates: [120.5, 17.2], weight: 1, spread: 0.18 },
  { id: 'PHL-ILN', countryCode: 'PHL', regionId: 'PH-ILN', name: 'Ilocos Norte', coordinates: [120.7, 18.1], weight: 1, spread: 0.18 },
  { id: 'PHL-CAG', countryCode: 'PHL', regionId: 'PH-CAG', name: 'Cagayan', coordinates: [121.6, 18.7], weight: 1, spread: 0.18 },
  { id: 'PHL-ISA', countryCode: 'PHL', regionId: 'PH-ISA', name: 'Isabela', coordinates: [121.8, 16.9], weight: 1, spread: 0.18 },
  { id: 'PHL-TAW', countryCode: 'PHL', regionId: 'PH-TAW', name: 'Tawi-Tawi', coordinates: [119.95, 5.13], weight: 1, spread: 0.18 },
  { id: 'PHL-BAS', countryCode: 'PHL', regionId: 'PH-BAS', name: 'Basilan', coordinates: [121.97, 6.7], weight: 1, spread: 0.18 },
  { id: 'PHL-CAM', countryCode: 'PHL', regionId: 'PH-CAM', name: 'Camiguin', coordinates: [124.72, 9.17], weight: 1, spread: 0.18 },
  { id: 'PHL-SIG', countryCode: 'PHL', regionId: 'PH-SIG', name: 'Siquijor', coordinates: [123.51, 9.2], weight: 1, spread: 0.18 },
  { id: 'PHL-BOH', countryCode: 'PHL', regionId: 'PH-BOH', name: 'Bohol', coordinates: [124.0, 9.85], weight: 1, spread: 0.18 },
  { id: 'PHL-GUI', countryCode: 'PHL', regionId: 'PH-GUI', name: 'Guimaras', coordinates: [122.6, 10.6], weight: 1, spread: 0.18 },
  { id: 'PHL-BCD', countryCode: 'PHL', regionId: 'PH-BCD', name: 'Bacolod', coordinates: [122.9, 10.6], weight: 1, spread: 0.18 },
  { id: 'PHL-NEC', countryCode: 'PHL', regionId: 'PH-NEC', name: 'Negros Occidental', coordinates: [122.6, 10.0], weight: 1, spread: 0.18 },
  { id: 'PHL-NER', countryCode: 'PHL', regionId: 'PH-NER', name: 'Negros Oriental', coordinates: [123.3, 9.6], weight: 1, spread: 0.18 },
  { id: 'PHL-MDE', countryCode: 'PHL', regionId: 'PH-MDE', name: 'Mandaue', coordinates: [124, 10.4], weight: 1, spread: 0.18 },
  { id: 'PHL-PPC', countryCode: 'PHL', regionId: 'PH-PLW', name: 'Puerto Princesa', coordinates: [118.7, 9.9], weight: 1, spread: 0.18 },
  { id: 'PHL-TAC', countryCode: 'PHL', regionId: 'PH-LEY', name: 'Tacloban', coordinates: [125, 11.3], weight: 1, spread: 0.18 },
  { id: 'PHL-ORM', countryCode: 'PHL', regionId: 'PH-LEY', name: 'Ormoc', coordinates: [124.6, 11], weight: 1, spread: 0.18 },
  { id: 'PHL-AKL', countryCode: 'PHL', regionId: 'PH-AKL', name: 'Aklan', coordinates: [122.4, 11.8], weight: 1, spread: 0.18 },
  { id: 'PHL-ANT', countryCode: 'PHL', regionId: 'PH-ANT', name: 'Antique', coordinates: [121.95, 11.3], weight: 1, spread: 0.18 },
  { id: 'PHL-ILI', countryCode: 'PHL', regionId: 'PH-ILI', name: 'Iloilo', coordinates: [122.5, 11.0], weight: 1, spread: 0.18 },
  { id: 'PHL-ILO', countryCode: 'PHL', regionId: 'PH-ILI', name: 'Iloilo', coordinates: [122.5, 10.7], weight: 1, spread: 0.18 },
  { id: 'PHL-CAP', countryCode: 'PHL', regionId: 'PH-CAP', name: 'Capiz', coordinates: [122.65, 11.55], weight: 1, spread: 0.18 },
  { id: 'PHL-ROM', countryCode: 'PHL', regionId: 'PH-ROM', name: 'Romblon', coordinates: [122.27, 12.58], weight: 1, spread: 0.18 },
  { id: 'PHL-NSA', countryCode: 'PHL', regionId: 'PH-NSA', name: 'Northern Samar', coordinates: [124.4, 12.4], weight: 1, spread: 0.18 },
  { id: 'PHL-MAS', countryCode: 'PHL', regionId: 'PH-MAS', name: 'Masbate', coordinates: [123.6, 12.35], weight: 1, spread: 0.18 },
  { id: 'PHL-MDR', countryCode: 'PHL', regionId: 'PH-MDR', name: 'Mindoro Oriental', coordinates: [121.4, 12.9], weight: 1, spread: 0.18 },
  { id: 'PHL-MDC', countryCode: 'PHL', regionId: 'PH-MDC', name: 'Mindoro Occidental', coordinates: [120.9, 13.1], weight: 1, spread: 0.18 },
  { id: 'PHL-MAD', countryCode: 'PHL', regionId: 'PH-MAD', name: 'Marinduque', coordinates: [121.97, 13.47], weight: 1, spread: 0.18 },
  { id: 'PHL-CAT', countryCode: 'PHL', regionId: 'PH-CAT', name: 'Catanduanes', coordinates: [124.24, 13.71], weight: 1, spread: 0.18 },
  { id: 'PHL-BTN', countryCode: 'PHL', regionId: 'PH-BTN', name: 'Batanes', coordinates: [121.97, 20.45], weight: 1, spread: 0.18 },
  { id: 'PHL-LAP', countryCode: 'PHL', regionId: 'PH-LAP', name: 'Lapu-Lapu', coordinates: [124, 10.3], weight: 1, spread: 0.18 },
  { id: 'PHL-AGS', countryCode: 'PHL', regionId: 'PH-AGS', name: 'Agusan del Sur', coordinates: [125.9, 8.5], weight: 1, spread: 0.18 },
  { id: 'PHL-BUK', countryCode: 'PHL', regionId: 'PH-BUK', name: 'Bukidnon', coordinates: [125, 8.1], weight: 1, spread: 0.18 },
  { id: 'PHL-NCO2', countryCode: 'PHL', regionId: 'PH-NCO', name: 'Cotabato', coordinates: [124.85, 7.0], weight: 1, spread: 0.18 },
  { id: 'PHL-SCO', countryCode: 'PHL', regionId: 'PH-SCO', name: 'South Cotabato', coordinates: [124.8, 6.3], weight: 1, spread: 0.18 },
  { id: 'PHL-NUE', countryCode: 'PHL', regionId: 'PH-NUE', name: 'Nueva Ecija', coordinates: [121, 15.6], weight: 1, spread: 0.18 },
  { id: 'PHL-LAG', countryCode: 'PHL', regionId: 'PH-LAG', name: 'Laguna', coordinates: [121.3, 14.3], weight: 1, spread: 0.18 },
  { id: 'PHL-RIZ', countryCode: 'PHL', regionId: 'PH-RIZ', name: 'Rizal', coordinates: [121.2, 14.7], weight: 1, spread: 0.18 },
  { id: 'PHL-QUI', countryCode: 'PHL', regionId: 'PH-QUI', name: 'Quirino', coordinates: [121.6, 16.4], weight: 1, spread: 0.18 },
  { id: 'PHL-STG', countryCode: 'PHL', regionId: 'PH-ISA', name: 'Santiago', coordinates: [121.5, 16.7], weight: 1, spread: 0.18 },
  { id: 'PHL-NUV', countryCode: 'PHL', regionId: 'PH-NUV', name: 'Nueva Vizcaya', coordinates: [121.2, 16.3], weight: 1, spread: 0.18 },
  { id: 'PHL-BEN', countryCode: 'PHL', regionId: 'PH-BEN', name: 'Benguet', coordinates: [120.7, 16.5], weight: 1, spread: 0.18 },
  { id: 'PHL-IFU', countryCode: 'PHL', regionId: 'PH-IFU', name: 'Ifugao', coordinates: [121.3, 16.9], weight: 1, spread: 0.18 },
  { id: 'PHL-MOU', countryCode: 'PHL', regionId: 'PH-MOU', name: 'Mountain Province', coordinates: [121.2, 17.1], weight: 1, spread: 0.18 },
  { id: 'PHL-TAR', countryCode: 'PHL', regionId: 'PH-TAR', name: 'Tarlac', coordinates: [120.4, 15.4], weight: 1, spread: 0.18 },
  { id: 'PHL-APA', countryCode: 'PHL', regionId: 'PH-APA', name: 'Apayao', coordinates: [121.2, 18.1], weight: 1, spread: 0.18 },
  { id: 'PHL-KAL', countryCode: 'PHL', regionId: 'PH-KAL', name: 'Kalinga', coordinates: [121.3, 17.5], weight: 1, spread: 0.18 },
  { id: 'PHL-ABR', countryCode: 'PHL', regionId: 'PH-ABR', name: 'Abra', coordinates: [120.8, 17.6], weight: 1, spread: 0.18 },
  { id: 'PHL-NGA', countryCode: 'PHL', regionId: 'PH-CAS', name: 'Naga', coordinates: [123.2, 13.6], weight: 1, spread: 0.18 },
  { id: 'PHL-ANG', countryCode: 'PHL', regionId: 'PH-PAM', name: 'Angeles', coordinates: [120.6, 15.1], weight: 1, spread: 0.18 },
  { id: 'PHL-BAG', countryCode: 'PHL', regionId: 'PH-BEN', name: 'Baguio', coordinates: [120.7, 16.4], weight: 1, spread: 0.18 },
  // NGA
  { id: 'NGA-KE', countryCode: 'NGA', regionId: 'NG-KE', name: 'Kebbi', coordinates: [4.7, 11.6], weight: 1, spread: 0.22 },
  { id: 'NGA-NI', countryCode: 'NGA', regionId: 'NG-NI', name: 'Niger', coordinates: [5.5, 10], weight: 1, spread: 0.22 },
  { id: 'NGA-KW', countryCode: 'NGA', regionId: 'NG-KW', name: 'Kwara', coordinates: [4.5, 8.9], weight: 1, spread: 0.22 },
  { id: 'NGA-OG', countryCode: 'NGA', regionId: 'NG-OG', name: 'Ogun', coordinates: [3.6, 7], weight: 1, spread: 0.22 },
  { id: 'NGA-OY', countryCode: 'NGA', regionId: 'NG-OY', name: 'Oyo', coordinates: [3.7, 8], weight: 1, spread: 0.22 },
  { id: 'NGA-BO', countryCode: 'NGA', regionId: 'NG-BO', name: 'Borno', coordinates: [13, 11.7], weight: 1, spread: 0.22 },
  { id: 'NGA-AD', countryCode: 'NGA', regionId: 'NG-AD', name: 'Adamawa', coordinates: [12.5, 9.4], weight: 1, spread: 0.22 },
  { id: 'NGA-TA', countryCode: 'NGA', regionId: 'NG-TA', name: 'Taraba', coordinates: [10.8, 7.8], weight: 1, spread: 0.22 },
  { id: 'NGA-BE', countryCode: 'NGA', regionId: 'NG-BE', name: 'Benue', coordinates: [8.6, 7.2], weight: 1, spread: 0.22 },
  { id: 'NGA-CR', countryCode: 'NGA', regionId: 'NG-CR', name: 'Cross River', coordinates: [8.6, 5.8], weight: 1, spread: 0.22 },
  { id: 'NGA-SO', countryCode: 'NGA', regionId: 'NG-SO', name: 'Sokoto', coordinates: [5.3, 12.8], weight: 1, spread: 0.22 },
  { id: 'NGA-ZA', countryCode: 'NGA', regionId: 'NG-ZA', name: 'Zamfara', coordinates: [6.3, 12.1], weight: 1, spread: 0.22 },
  { id: 'NGA-YO', countryCode: 'NGA', regionId: 'NG-YO', name: 'Yobe', coordinates: [11.4, 12.2], weight: 1, spread: 0.22 },
  { id: 'NGA-KT', countryCode: 'NGA', regionId: 'NG-KT', name: 'Katsina', coordinates: [7.8, 12.3], weight: 1, spread: 0.22 },
  { id: 'NGA-JI', countryCode: 'NGA', regionId: 'NG-JI', name: 'Jigawa', coordinates: [9.4, 12.2], weight: 1, spread: 0.22 },
  { id: 'NGA-ON', countryCode: 'NGA', regionId: 'NG-ON', name: 'Ondo', coordinates: [5.2, 6.8], weight: 1, spread: 0.22 },
  { id: 'NGA-DE', countryCode: 'NGA', regionId: 'NG-DE', name: 'Delta', coordinates: [5.9, 5.7], weight: 1, spread: 0.22 },
  { id: 'NGA-BY', countryCode: 'NGA', regionId: 'NG-BY', name: 'Bayelsa', coordinates: [6.2, 4.9], weight: 1, spread: 0.22 },
  { id: 'NGA-RI', countryCode: 'NGA', regionId: 'NG-RI', name: 'Rivers', coordinates: [7.1, 4.8], weight: 1, spread: 0.22 },
  { id: 'NGA-AK', countryCode: 'NGA', regionId: 'NG-AK', name: 'Akwa Ibom', coordinates: [7.9, 5], weight: 1, spread: 0.22 },
  { id: 'NGA-AB', countryCode: 'NGA', regionId: 'NG-AB', name: 'Abia', coordinates: [7.5, 5.5], weight: 1, spread: 0.22 },
  { id: 'NGA-EB', countryCode: 'NGA', regionId: 'NG-EB', name: 'Ebonyi', coordinates: [8, 6.3], weight: 1, spread: 0.22 },
  { id: 'NGA-AN', countryCode: 'NGA', regionId: 'NG-AN', name: 'Anambra', coordinates: [6.9, 6.1], weight: 1, spread: 0.22 },
  { id: 'NGA-ED', countryCode: 'NGA', regionId: 'NG-ED', name: 'Edo', coordinates: [5.8, 6.6], weight: 1, spread: 0.22 },
  { id: 'NGA-BA', countryCode: 'NGA', regionId: 'NG-BA', name: 'Bauchi', coordinates: [9.9, 10.8], weight: 1, spread: 0.22 },
  { id: 'NGA-PL', countryCode: 'NGA', regionId: 'NG-PL', name: 'Plateau', coordinates: [9.4, 9.3], weight: 1, spread: 0.22 },
  { id: 'NGA-NA', countryCode: 'NGA', regionId: 'NG-NA', name: 'Nassarawa', coordinates: [8.4, 8.5], weight: 1, spread: 0.22 },
  { id: 'NGA-GO', countryCode: 'NGA', regionId: 'NG-GO', name: 'Gombe', coordinates: [11.3, 10.4], weight: 1, spread: 0.22 },
  { id: 'NGA-EN', countryCode: 'NGA', regionId: 'NG-EN', name: 'Enugu', coordinates: [7.4, 6.6], weight: 1, spread: 0.22 },
  { id: 'NGA-KO', countryCode: 'NGA', regionId: 'NG-KO', name: 'Kogi', coordinates: [6.7, 7.8], weight: 1, spread: 0.22 },
  { id: 'NGA-OS', countryCode: 'NGA', regionId: 'NG-OS', name: 'Osun', coordinates: [4.5, 7.6], weight: 1, spread: 0.22 },
  { id: 'NGA-IM', countryCode: 'NGA', regionId: 'NG-IM', name: 'Imo', coordinates: [7, 5.6], weight: 1, spread: 0.22 },
  { id: 'NGA-EK', countryCode: 'NGA', regionId: 'NG-EK', name: 'Ekiti', coordinates: [5.4, 7.8], weight: 1, spread: 0.22 },
  { id: 'NGA-KD', countryCode: 'NGA', regionId: 'NG-KD', name: 'Kaduna', coordinates: [7.6, 10.3], weight: 1, spread: 0.22 },
  // ZAF
  { id: 'ZAF-NC', countryCode: 'ZAF', regionId: 'ZA-NC', name: 'Northern Cape', coordinates: [21.5, -29.3], weight: 1, spread: 0.2 },
  { id: 'ZAF-FS', countryCode: 'ZAF', regionId: 'ZA-FS', name: 'Free State', coordinates: [27.1, -28.6], weight: 1, spread: 0.2 },
  { id: 'ZAF-EC', countryCode: 'ZAF', regionId: 'ZA-EC', name: 'Eastern Cape', coordinates: [26.2, -31.9], weight: 1, spread: 0.2 },
  { id: 'ZAF-LP', countryCode: 'ZAF', regionId: 'ZA-LP', name: 'Limpopo', coordinates: [29.2, -24.2], weight: 1, spread: 0.2 },
  { id: 'ZAF-NW', countryCode: 'ZAF', regionId: 'ZA-NW', name: 'North West', coordinates: [25.3, -26.3], weight: 1, spread: 0.2 },
  { id: 'ZAF-MP', countryCode: 'ZAF', regionId: 'ZA-MP', name: 'Mpumalanga', coordinates: [30, -25.8], weight: 1, spread: 0.2 },
  // EGY
  { id: 'EGY-SIN', countryCode: 'EGY', regionId: 'EG-SIN', name: 'Shamal Sina\'', coordinates: [33.4, 30.7], weight: 1, spread: 0.18 },
  { id: 'EGY-ASN', countryCode: 'EGY', regionId: 'EG-ASN', name: 'Aswan', coordinates: [32.5, 23.4], weight: 1, spread: 0.18 },
  { id: 'EGY-BA', countryCode: 'EGY', regionId: 'EG-BA', name: 'Al Bahr al Ahmar', coordinates: [33.2, 25.6], weight: 1, spread: 0.18 },
  { id: 'EGY-MT', countryCode: 'EGY', regionId: 'EG-MT', name: 'Matruh', coordinates: [27.2, 30.3], weight: 1, spread: 0.18 },
  { id: 'EGY-WAD', countryCode: 'EGY', regionId: 'EG-WAD', name: 'Al Wadi at Jadid', coordinates: [31.2, 24.9], weight: 1, spread: 0.18 },
  { id: 'EGY-SUZ', countryCode: 'EGY', regionId: 'EG-SUZ', name: 'As Suways', coordinates: [32.4, 29.7], weight: 1, spread: 0.18 },
  { id: 'EGY-JS', countryCode: 'EGY', regionId: 'EG-JS', name: 'Janub Sina\'', coordinates: [34.1, 28.7], weight: 1, spread: 0.18 },
  { id: 'EGY-PTS', countryCode: 'EGY', regionId: 'EG-PTS', name: 'Bur Sa`id', coordinates: [32.4, 31.2], weight: 1, spread: 0.18 },
  { id: 'EGY-DK', countryCode: 'EGY', regionId: 'EG-DK', name: 'Ad Daqahliyah', coordinates: [31.8, 31.2], weight: 1, spread: 0.18 },
  { id: 'EGY-SHR', countryCode: 'EGY', regionId: 'EG-SHR', name: 'Ash Sharqiyah', coordinates: [31.9, 30.8], weight: 1, spread: 0.18 },
  { id: 'EGY-IS', countryCode: 'EGY', regionId: 'EG-IS', name: 'Al Isma`iliyah', coordinates: [32.2, 30.7], weight: 1, spread: 0.18 },
  { id: 'EGY-DT', countryCode: 'EGY', regionId: 'EG-DT', name: 'Dumyat', coordinates: [31.81, 31.42], weight: 1, spread: 0.18 },
  { id: 'EGY-KFS', countryCode: 'EGY', regionId: 'EG-KFS', name: 'Kafr ash Shaykh', coordinates: [30.9, 31.4], weight: 1, spread: 0.18 },
  { id: 'EGY-BH', countryCode: 'EGY', regionId: 'EG-BH', name: 'Al Buhayrah', coordinates: [30.2, 30.8], weight: 1, spread: 0.18 },
  { id: 'EGY-MN', countryCode: 'EGY', regionId: 'EG-MN', name: 'Al Minya', coordinates: [30, 28.1], weight: 1, spread: 0.18 },
  { id: 'EGY-FYM', countryCode: 'EGY', regionId: 'EG-FYM', name: 'Al Fayyum', coordinates: [30.7, 29.4], weight: 1, spread: 0.18 },
  { id: 'EGY-BNS', countryCode: 'EGY', regionId: 'EG-BNS', name: 'Bani Suwayf', coordinates: [30.7, 29.1], weight: 1, spread: 0.18 },
  { id: 'EGY-MNF', countryCode: 'EGY', regionId: 'EG-MNF', name: 'Al Minufiyah', coordinates: [31, 30.5], weight: 1, spread: 0.18 },
  { id: 'EGY-KB', countryCode: 'EGY', regionId: 'EG-KB', name: 'Al Qalyubiyah', coordinates: [31.3, 30.4], weight: 1, spread: 0.18 },
  { id: 'EGY-GH', countryCode: 'EGY', regionId: 'EG-GH', name: 'Al Gharbiyah', coordinates: [31, 30.8], weight: 1, spread: 0.18 },
  { id: 'EGY-SHG', countryCode: 'EGY', regionId: 'EG-SHG', name: 'Suhaj', coordinates: [31.8, 26.5], weight: 1, spread: 0.18 },
  { id: 'EGY-KN', countryCode: 'EGY', regionId: 'EG-KN', name: 'Qina', coordinates: [32.5, 25.8], weight: 1, spread: 0.18 },
  { id: 'EGY-AST', countryCode: 'EGY', regionId: 'EG-AST', name: 'Asyut', coordinates: [31.1, 27.2], weight: 1, spread: 0.18 },
  { id: 'EGY-LX', countryCode: 'EGY', regionId: 'EG-LX', name: 'Luxor', coordinates: [32.7, 25.7], weight: 1, spread: 0.18 },
  // AUS
  { id: 'AUS-WA', countryCode: 'AUS', regionId: 'AU-WA', name: 'Western Australia', coordinates: [120.5, -22.8], weight: 1, spread: 0.22 },
  { id: 'AUS-NT', countryCode: 'AUS', regionId: 'AU-NT', name: 'Northern Territory', coordinates: [134.1, -13.1], weight: 1, spread: 0.22 },
  { id: 'AUS-SA', countryCode: 'AUS', regionId: 'AU-SA', name: 'South Australia', coordinates: [138.6, -30.0], weight: 1, spread: 0.22 },
  { id: 'AUS-X02~', countryCode: 'AUS', regionId: 'AU-X02~', name: 'Jervis Bay Territory', coordinates: [150.7, -35.1], weight: 1, spread: 0.22 },
  { id: 'AUS-TAS', countryCode: 'AUS', regionId: 'AU-TAS', name: 'Tasmania', coordinates: [146.8, -41.6], weight: 1, spread: 0.22 },
  { id: 'AUS-X03~', countryCode: 'AUS', regionId: 'AU-X03~', name: 'Macquarie Island', coordinates: [158.9, -54.5], weight: 1, spread: 0.22 },
  { id: 'AUS-ACT', countryCode: 'AUS', regionId: 'AU-ACT', name: 'Australian Capital Territory', coordinates: [149.1, -35.5], weight: 1, spread: 0.22 },
];


// --- Generate daily data (365 days, ending on Feb 10, 2026) ---
const TOTAL_DAYS = 365;
const today = new Date(2026, 1, 10); // Feb 10, 2026

function buildDates() {
  const out = [];
  for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    out.push(date.toISOString().slice(0, 10));
  }
  return out;
}

const DATES = buildDates();

function generateGlobalCurve() {
  const users = [];
  const dauMau = [];

  // Pre-generate dip events: 6-8 dips spread across the year, each 4-12 days
  const dips = [];
  const numDips = 6 + Math.floor(rand() * 3);
  for (let d = 0; d < numDips; d++) {
    const center = 30 + Math.floor(rand() * (TOTAL_DAYS - 60));
    const halfWidth = 2 + Math.floor(rand() * 5);
    const depth = 0.60 + rand() * 0.25;
    dips.push({ center, halfWidth, depth });
  }

  for (let dayIndex = 0; dayIndex < TOTAL_DAYS; dayIndex++) {
    const dateStr = DATES[dayIndex];
    const date = new Date(`${dateStr}T00:00:00Z`);
    const month = date.getUTCMonth(); // 0-11
    const dow = date.getUTCDay(); // 0=Sun

    const progress = dayIndex / TOTAL_DAYS;

    // Growth curve: starts at ~30, ends ~220
    const growthBase = 30 + 190 * Math.pow(progress, 1.25);

    const seasonalFactor = 1.0
      + 0.12 * Math.sin((month - 3) * Math.PI / 6)
      + 0.06 * Math.sin((month - 11) * Math.PI / 3);

    const weekendFactor = (dow === 0 || dow === 6) ? 1.10 + rand() * 0.08 : 1.0;
    const spikeFactor = rand() < 0.02 ? 1.25 + rand() * 0.6 : 1.0;

    let dipFactor = 1.0;
    for (const dip of dips) {
      const dist = Math.abs(dayIndex - dip.center);
      if (dist <= dip.halfWidth * 2) {
        const t = dist / dip.halfWidth;
        const dipAmount = (1.0 - dip.depth) * Math.exp(-t * t);
        dipFactor -= dipAmount;
      }
    }
    dipFactor = Math.max(dipFactor, 0.55);

    const noise = 0.88 + rand() * 0.28;

    const u = Math.max(15, Math.round(
      growthBase * seasonalFactor * weekendFactor * spikeFactor * dipFactor * noise,
    ));
    users.push(u);

    const dm = clamp(
      0.12 + progress * 0.14 + randNormal(0, 0.015),
      0.06,
      0.42,
    );
    dauMau.push(dm);
  }

  return { users, dauMau };
}

const GLOBAL_CURVE = generateGlobalCurve();
const totalUserWeight = COUNTRIES.reduce((s, c) => s + c.userWeight, 0);

function generateCountryDailyData() {
  const out = {};
  COUNTRIES.forEach((c) => { out[c.code] = []; });

  for (let dayIndex = 0; dayIndex < TOTAL_DAYS; dayIndex++) {
    const date = DATES[dayIndex];
    const globalUsers = GLOBAL_CURVE.users[dayIndex];

    // Country weights shift slightly day-to-day.
    const weights = COUNTRIES.map((c) => {
      const w = (c.userWeight / totalUserWeight) * clamp(randNormal(1.0, 0.18), 0.65, 1.55);
      return w;
    });
    const usersByCountry = distributeInt(globalUsers, weights);

    COUNTRIES.forEach((c, idx) => {
      const users = Math.max(0, usersByCountry[idx]);

      const catsPerU = clamp(randNormal(c.catsPerUser, 0.35), 0.3, 4.0);
      const cats = Math.max(0, Math.round(users * catsPerU));

      const shotsPerC = clamp(randNormal(c.shotsPerCat, 0.8), 1.0, 8.0);
      const progress = dayIndex / TOTAL_DAYS;
      const existingUserBoost = 1 + progress * 1.5;
      const shots = Math.max(0, Math.round(cats * shotsPerC * existingUserBoost));

      const iosR = clamp(randNormal(c.iosShare, 0.08), 0.02, 0.95);
      const usersIos = Math.round(users * iosR);
      const usersAndroid = Math.max(0, users - usersIos);

      const strayR = clamp(randNormal(c.strayShare ?? 0.62, 0.06), 0.05, 0.95);
      const catsStray = Math.round(cats * strayR);
      const catsHome = Math.max(0, cats - catsStray);

      // Keep randNormal call to preserve RNG state; dauMau overwritten below
      randNormal(1.0, 0.06);

      out[c.code].push({
        date,
        newUsers: users,
        newUsersIos: usersIos,
        newUsersAndroid: usersAndroid,
        newCats: cats,
        newCatsStray: catsStray,
        newCatsHome: catsHome,
        catsShot: 0,
        shots,
        dauMau: 0,
        dau: 0,
        mau: 0,
      });
    });
  }

  // Post-process: compute DAU/MAU
  //   DAU  = active users today (shots / avgShotsPerActiveUser)
  //   MAU  = unique active users over trailing 30 days
  //   DAU/MAU = DAU_today / MAU_30d
  //
  // "reachable" = exponentially-decaying sum of newUsers (installed base)
  // decay exp(-0.04): D7 ~75%, D30 ~30%, D90 ~3%
  // daily active probability p = DAU / reachable
  // MAU = reachable × P(active ≥1 time in 30 days) = reachable × (1 - (1-p)^30)
  const DAILY_DECAY = Math.exp(-0.04);
  const P_SMOOTH = 0.12; // EMA smoothing for daily active rate

  COUNTRIES.forEach((c) => {
    const days = out[c.code];
    const avgShotsPerActiveUser = Math.max(1, c.shotsPerCat * c.catsPerUser * 0.5);

    let reachable = 0;
    let pSmoothed = 0;

    for (let i = 0; i < days.length; i++) {
      reachable = reachable * DAILY_DECAY + days[i].newUsers;

      const dau = Math.min(days[i].shots / avgShotsPerActiveUser, reachable);
      const p = reachable > 0 ? dau / reachable : 0;
      pSmoothed = pSmoothed * (1 - P_SMOOTH) + p * P_SMOOTH;

      const pClamped = Math.min(pSmoothed, 0.99);
      const mau = reachable * (1 - Math.pow(1 - pClamped, 30));

      days[i].dauMau = mau > 0 ? clamp(dau / mau, 0.02, 0.55) : 0;
      days[i].dau = Math.round(dau);
      days[i].mau = Math.round(mau);
    }
  });

  // Post-process: compute catsShot = newCats + returning cats from known pool
  const DAILY_REENCOUNTER = 0.006; // ~0.6% of known cats are re-seen each day

  COUNTRIES.forEach((c) => {
    const days = out[c.code];
    let knownCats = 0;

    for (let i = 0; i < days.length; i++) {
      const returning = Math.round(knownCats * DAILY_REENCOUNTER * clamp(randNormal(1.0, 0.2), 0.5, 1.5));
      days[i].catsShot = days[i].newCats + returning;
      knownCats += days[i].newCats;
    }
  });

  return out;
}

export const countryDailyData = generateCountryDailyData();

function generateDailyFromCountries() {
  return DATES.map((date, dayIndex) => {
    const days = COUNTRIES.map((c) => countryDailyData[c.code][dayIndex]).filter(Boolean);

    const newUsers = sumBy(days, (d) => d.newUsers);
    const newUsersIos = sumBy(days, (d) => d.newUsersIos);
    const newUsersAndroid = sumBy(days, (d) => d.newUsersAndroid);
    const newCats = sumBy(days, (d) => d.newCats);
    const newCatsStray = sumBy(days, (d) => d.newCatsStray);
    const newCatsHome = sumBy(days, (d) => d.newCatsHome);
    const catsShot = sumBy(days, (d) => d.catsShot);
    const shots = sumBy(days, (d) => d.shots);
    const dauMau = averageBy(days, (d) => d.dauMau, (d) => d.newUsers);
    const dau = sumBy(days, (d) => d.dau);
    const mau = sumBy(days, (d) => d.mau);

    return {
      date,
      newUsers,
      newUsersIos,
      newUsersAndroid,
      newCats,
      newCatsStray,
      newCatsHome,
      catsShot,
      shots,
      dauMau,
      dau,
      mau,
    };
  });
}

export const dailyData = generateDailyFromCountries();

function generateCountryData() {
  return COUNTRIES.map((c) => {
    const days = countryDailyData[c.code] || [];
    return {
      code: c.code,
      name: c.name,
      users: sumBy(days, (d) => d.newUsers),
      cats: sumBy(days, (d) => d.newCats),
      shots: sumBy(days, (d) => d.shots),
    };
  });
}

export const countryData = generateCountryData();

// --- Generate cat dots on-the-fly for country drill-down ---
function hashCode(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generateCountryCatDots(countryCode, catType = 'ALL', maxDots = 500, regionId = null) {
  let cities = CAT_CITIES.filter((c) => c.countryCode === countryCode);
  if (regionId) cities = cities.filter((c) => c.regionId === regionId);
  if (cities.length === 0) return [];

  const country = COUNTRIES.find((c) => c.code === countryCode);
  const strayShare = country?.strayShare ?? 0.62;

  const rng = seededRandom(hashCode(countryCode + (regionId || '')) + 7777);

  const totalWeight = cities.reduce((s, c) => s + c.weight, 0);
  const dots = [];

  cities.forEach((city) => {
    const share = city.weight / totalWeight;
    const cityDotCount = Math.max(1, Math.round(maxDots * share));
    const spread = city.spread ?? 0.2;

    for (let i = 0; i < cityDotCount; i++) {
      const u1 = rng() + 0.0001;
      const u2 = rng();
      const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

      // 15% of dots use 1.8x spread for suburban/rural scatter
      const isRural = rng() < 0.15;
      const s = isRural ? spread * 1.8 : spread;

      const lng = city.coordinates[0] + z1 * s;
      const lat = clamp(city.coordinates[1] + z2 * s * 0.7, -85, 85);

      const isStray = rng() < strayShare;

      if (catType === 'Stray' && !isStray) continue;
      if (catType === 'Home' && isStray) continue;

      dots.push({
        id: `${city.id}-${i}`,
        coordinates: [lng, lat],
        isStray,
        cityName: city.name,
        regionId: city.regionId,
      });
    }
  });

  return dots;
}

// --- Age/Sex distribution ---
export const AGE_GROUPS = [
  '13-17', '18-21', '22-25', '26-30', '31-35',
  '36-40', '41-49', '50-59', '60-69', '70+',
];

function generateAgeSexData() {
  // Bell curve peaking at 22-30 age range
  return AGE_GROUPS.map((group, idx) => {
    const peak = 4;
    const dist = Math.abs(idx - peak);
    const base = Math.round(4500 * Math.exp(-0.12 * dist * dist));
    return {
      ageGroup: group,
      male: Math.max(50, Math.round(base * clamp(randNormal(1.0, 0.2), 0.5, 1.6))),
      female: Math.max(50, Math.round(base * clamp(randNormal(0.90, 0.2), 0.4, 1.5))),
    };
  });
}

export const ageSexData = generateAgeSexData();

function generateCountryAgeSexData() {
  const result = {};
  COUNTRIES.forEach((c) => {
    const scale = c.userWeight / 100;
    result[c.code] = AGE_GROUPS.map((group, idx) => {
      const peak = 3 + randInt(0, 3);
      const dist = Math.abs(idx - peak);
      const base = Math.round(900 * scale * Math.exp(-0.10 * dist * dist));
      return {
        ageGroup: group,
        male: Math.max(5, Math.round(base * clamp(randNormal(1.0, 0.3), 0.3, 2.0))),
        female: Math.max(5, Math.round(base * clamp(randNormal(0.90, 0.3), 0.3, 1.8))),
      };
    });
  });
  return result;
}

export const countryAgeSexData = generateCountryAgeSexData();

// --- Retention curve (kept for now, even if UI no longer shows it) ---
const RETENTION_DAYS = [0, 1, 2, 3, 5, 7, 10, 14, 21, 30];

function generateRetentionCurve(d1Base, decayRate) {
  return RETENTION_DAYS.map((day) => {
    if (day === 0) return { day, rate: 100 };
    const base = 100 * Math.exp(-decayRate * day);
    const noisy = clamp(base + randNormal(0, 2.5), 1, 99);
    return { day, rate: Math.round(noisy * 10) / 10 };
  });
}

export const retentionData = generateRetentionCurve(42, 0.075);

export const retentionByPlatform = {
  ALL: retentionData,
  iOS: generateRetentionCurve(46, 0.065),
  Android: generateRetentionCurve(38, 0.085),
};

export const retentionByCountry = {};
COUNTRIES.forEach((c) => {
  const d1 = clamp(randNormal(42, 8), 25, 60);
  const decay = clamp(randNormal(0.075, 0.02), 0.03, 0.13);
  retentionByCountry[c.code] = {
    ALL: generateRetentionCurve(d1, decay),
    iOS: generateRetentionCurve(d1 + randNormal(4, 2), decay * 0.85),
    Android: generateRetentionCurve(d1 - randNormal(3, 2), decay * 1.15),
  };
});

// --- Aggregate KPIs ---
export function computeKpis(data, prevData) {
  const safe = (v) => (Number.isFinite(v) ? v : 0);

  const totalUsers = data.reduce((s, d) => s + safe(d.newUsers), 0);
  const totalCats = data.reduce((s, d) => s + safe(d.catsShot || d.newCats), 0);
  const totalShots = data.reduce((s, d) => s + safe(d.shots), 0);
  const lastDauMau = data.length > 0 ? safe(data[data.length - 1].dauMau) : 0;
  const lastDate = data.length > 0 ? data[data.length - 1].date : null;

  const prevUsers = prevData ? prevData.reduce((s, d) => s + safe(d.newUsers), 0) : null;
  const prevCats = prevData ? prevData.reduce((s, d) => s + safe(d.catsShot || d.newCats), 0) : null;
  const prevShots = prevData ? prevData.reduce((s, d) => s + safe(d.shots), 0) : null;
  const prevDauMau = prevData && prevData.length > 0
    ? safe(prevData[prevData.length - 1].dauMau)
    : null;

  const pctChange = (curr, prev) =>
    prev && prev > 0 ? ((curr - prev) / prev) * 100 : null;

  return {
    users: { value: totalUsers, change: pctChange(totalUsers, prevUsers) },
    cats: { value: totalCats, change: pctChange(totalCats, prevCats) },
    shots: { value: totalShots, change: pctChange(totalShots, prevShots) },
    dauMau: { value: lastDauMau, change: pctChange(lastDauMau, prevDauMau), lastDate },
  };
}

// --- Filter & aggregate helpers ---
function resolveSource(data, { continent, country }) {
  if (country !== 'ALL') return countryDailyData[country] || [];
  if (continent !== 'ALL') return aggregateContinentData(continent);
  return data;
}

function aggregateContinentData(continent) {
  const codes = COUNTRIES.filter((c) => c.continent === continent).map((c) => c.code);
  if (codes.length === 0) return [];

  const len = dailyData.length;
  return Array.from({ length: len }, (_, i) => {
    const base = {
      date: dailyData[i].date,
      newUsers: 0,
      newUsersIos: 0,
      newUsersAndroid: 0,
      newCats: 0,
      newCatsStray: 0,
      newCatsHome: 0,
      catsShot: 0,
      shots: 0,
      dauMau: 0,
      dau: 0,
      mau: 0,
    };

    let dauWeightedUsers = 0;
    let dauWeightedSum = 0;

    codes.forEach((code) => {
      const d = countryDailyData[code]?.[i];
      if (!d) return;
      base.newUsers += d.newUsers;
      base.newUsersIos += d.newUsersIos;
      base.newUsersAndroid += d.newUsersAndroid;
      base.newCats += d.newCats;
      base.newCatsStray += d.newCatsStray;
      base.newCatsHome += d.newCatsHome;
      base.catsShot += d.catsShot || 0;
      base.shots += d.shots;
      base.dau += d.dau || 0;
      base.mau += d.mau || 0;

      dauWeightedUsers += d.newUsers;
      dauWeightedSum += d.dauMau * d.newUsers;
    });

    base.dauMau = dauWeightedUsers > 0 ? dauWeightedSum / dauWeightedUsers : 0;
    return base;
  });
}

function normalizeUsersSplit(d) {
  const total = d.newUsersIos + d.newUsersAndroid;
  if (total === d.newUsers) return d;

  // Fix rounding drift by adjusting the larger bucket.
  const diff = d.newUsers - total;
  if (diff === 0) return d;
  if (d.newUsersIos >= d.newUsersAndroid) return { ...d, newUsersIos: Math.max(0, d.newUsersIos + diff) };
  return { ...d, newUsersAndroid: Math.max(0, d.newUsersAndroid + diff) };
}

// iOS users tend to engage more (higher-end devices); Android less.
// These multipliers shift the shots share relative to user share.
const PLATFORM_ENGAGEMENT = { iOS: 1.25, Android: 0.82 };

// Scale all metrics proportionally by the platform's user share.
function applyPlatform(d, platform) {
  const total = d.newUsersIos + d.newUsersAndroid;
  if (total === 0) {
    return {
      ...d,
      newUsers: 0,
      newUsersIos: 0,
      newUsersAndroid: 0,
      newCats: 0,
      newCatsStray: 0,
      newCatsHome: 0,
      catsShot: 0,
      shots: 0,
      dauMau: 0,
      dau: 0,
      mau: 0,
    };
  }

  const platformUsers = platform === 'iOS' ? d.newUsersIos : d.newUsersAndroid;
  const userRatio = platformUsers / total;

  // Shots share accounts for engagement difference between platforms
  const iosW = d.newUsersIos * PLATFORM_ENGAGEMENT.iOS;
  const andW = d.newUsersAndroid * PLATFORM_ENGAGEMENT.Android;
  const shotsRatio = (platform === 'iOS' ? iosW : andW) / (iosW + andW || 1);

  let newCats = Math.round(d.newCats * userRatio);
  let newCatsStray = Math.round(d.newCatsStray * userRatio);
  let newCatsHome = Math.round(d.newCatsHome * userRatio);

  // Keep sums consistent.
  let drift = newCats - (newCatsStray + newCatsHome);
  if (drift !== 0) {
    if (newCatsStray >= newCatsHome) newCatsStray += drift;
    else newCatsHome += drift;
  }

  const scaledShots = Math.round(d.shots * shotsRatio);
  // DAU/MAU: shots share differs from user share → engagement changes
  const dauMau = d.dauMau * (userRatio > 0 ? shotsRatio / userRatio : 1);

  const out = {
    ...d,
    newUsers: platformUsers,
    newUsersIos: platform === 'iOS' ? d.newUsersIos : 0,
    newUsersAndroid: platform === 'Android' ? d.newUsersAndroid : 0,
    newCats,
    newCatsStray: Math.max(0, newCatsStray),
    newCatsHome: Math.max(0, newCatsHome),
    catsShot: Math.round((d.catsShot || 0) * userRatio),
    shots: scaledShots,
    dauMau: clamp(dauMau, 0.01, 0.60),
    dau: Math.round((d.dau || 0) * userRatio),
    mau: Math.round((d.mau || 0) * userRatio),
  };

  return normalizeUsersSplit(out);
}

// Stray hunters go outside specifically → higher engagement; home is casual
const CATTYPE_ENGAGEMENT = { Stray: 1.30, Home: 0.70 };

function applyCatType(d, catType) {
  if (catType === 'ALL') return d;

  const totalCats = d.newCats;
  if (totalCats <= 0) {
    return {
      ...d,
      newUsers: 0,
      newUsersIos: 0,
      newUsersAndroid: 0,
      newCats: 0,
      newCatsStray: 0,
      newCatsHome: 0,
      catsShot: 0,
      shots: 0,
      dauMau: 0,
      dau: 0,
      mau: 0,
    };
  }

  const selectedCats = catType === 'Stray' ? d.newCatsStray : d.newCatsHome;
  const ratio = selectedCats / totalCats;

  // Shots share weighted by engagement: stray hunters take more photos per cat
  const strayW = d.newCatsStray * CATTYPE_ENGAGEMENT.Stray;
  const homeW = d.newCatsHome * CATTYPE_ENGAGEMENT.Home;
  const shotsRatio = (catType === 'Stray' ? strayW : homeW) / (strayW + homeW || 1);

  let newUsers = Math.round(d.newUsers * ratio);
  let newUsersIos = Math.round(d.newUsersIos * ratio);
  let newUsersAndroid = Math.round(d.newUsersAndroid * ratio);

  // Enforce cats >= users after rounding; also ensure users >= 1 when cats > 0.
  if (selectedCats > 0 && newUsers <= 0) {
    newUsers = 1;
    newUsersIos = d.newUsersIos >= d.newUsersAndroid ? 1 : 0;
    newUsersAndroid = 1 - newUsersIos;
  }
  if (newUsers > selectedCats) {
    newUsers = selectedCats;
    const totalUsersSplit = d.newUsersIos + d.newUsersAndroid;
    if (totalUsersSplit > 0) {
      newUsersIos = Math.round((d.newUsersIos / totalUsersSplit) * newUsers);
      newUsersAndroid = newUsers - newUsersIos;
    } else {
      newUsersIos = 0;
      newUsersAndroid = 0;
    }
  } else {
    // Fix rounding drift between split and total.
    const diff = newUsers - (newUsersIos + newUsersAndroid);
    if (diff !== 0) {
      if (newUsersIos >= newUsersAndroid) newUsersIos += diff;
      else newUsersAndroid += diff;
    }
  }

  const scaledShots = Math.round(d.shots * shotsRatio);
  const userRatio = d.newUsers > 0 ? newUsers / d.newUsers : 0;
  const dauMau = d.dauMau * (userRatio > 0 ? shotsRatio / userRatio : 1);

  const out = {
    ...d,
    newUsers,
    newUsersIos: Math.max(0, newUsersIos),
    newUsersAndroid: Math.max(0, newUsersAndroid),
    newCats: selectedCats,
    newCatsStray: catType === 'Stray' ? selectedCats : 0,
    newCatsHome: catType === 'Home' ? selectedCats : 0,
    catsShot: Math.round((d.catsShot || 0) * ratio),
    shots: scaledShots,
    dauMau: clamp(dauMau, 0.01, 0.60),
    dau: Math.round((d.dau || 0) * ratio),
    mau: Math.round((d.mau || 0) * ratio),
  };

  return normalizeUsersSplit(out);
}

export function filterData(
  data,
  {
    period,
    country,
    platform,
    catType = 'ALL',
    continent = 'ALL',
  },
) {
  let filtered = resolveSource(data, { continent, country });

  const periodDays = { D: 1, W: 7, M: 30, Y: 365, ALL: filtered.length };
  const days = periodDays[period] || 30;
  filtered = filtered.slice(-days);

  if (platform !== 'ALL') {
    filtered = filtered.map((d) => applyPlatform(d, platform));
  }
  if (catType !== 'ALL') {
    filtered = filtered.map((d) => applyCatType(d, catType));
  }

  return filtered;
}

export function getPreviousPeriodData(
  data,
  {
    period,
    country,
    platform,
    catType = 'ALL',
    continent = 'ALL',
  },
) {
  let source = resolveSource(data, { continent, country });
  const periodDays = { D: 1, W: 7, M: 30, Y: 365, ALL: source.length };
  const days = periodDays[period] || 30;

  const end = source.length - days;
  if (end <= 0) return null;
  const start = Math.max(0, end - days);
  let prev = source.slice(start, end);

  if (platform !== 'ALL') {
    prev = prev.map((d) => applyPlatform(d, platform));
  }
  if (catType !== 'ALL') {
    prev = prev.map((d) => applyCatType(d, catType));
  }

  return prev;
}

// --- Aggregate for charts ---
export function aggregateForChart(data, period) {
  if (period === 'D') {
    const day = data[data.length - 1] || data[0];
    if (!day) return [];
    return Array.from({ length: 24 }, (_, h) => ({
      label: `${h}:00`,
      ...spreadValues(day, 24, h),
    }));
  }
  if (period === 'W') {
    return data.slice(-7).map((d) => ({
      label: d.date.slice(5),
      ...d,
    }));
  }
  if (period === 'M') {
    return data.slice(-30).map((d) => ({
      label: d.date.slice(5),
      ...d,
    }));
  }
  if (period === 'Y') {
    return aggregateMonths(data).slice(-12);
  }
  return aggregateMonths(data);
}

function aggregateMonths(data) {
  const months = {};
  const counts = {};
  data.forEach((d) => {
    const m = d.date.slice(0, 7);
    if (!months[m]) {
      months[m] = { ...d, label: m.slice(2) };
      counts[m] = 1;
    } else {
      months[m].newUsers += d.newUsers;
      months[m].newUsersIos += d.newUsersIos;
      months[m].newUsersAndroid += d.newUsersAndroid;
      months[m].newCats += d.newCats;
      months[m].newCatsStray += d.newCatsStray;
      months[m].newCatsHome += d.newCatsHome;
      months[m].shots += d.shots;
      months[m].dauMau += d.dauMau;
      counts[m]++;
    }
  });
  Object.keys(months).forEach((m) => {
    months[m].dauMau /= counts[m];
  });
  return Object.values(months);
}

function spreadValues(day, n, hour) {
  // Hourly curve: peak at 12-20, low at 2-6
  const hourFactor = 0.3 + 0.7 * Math.exp(-0.03 * Math.pow(hour - 16, 2));
  const total = Array.from({ length: 24 }, (_, h) =>
    0.3 + 0.7 * Math.exp(-0.03 * Math.pow(h - 16, 2)),
  ).reduce((a, b) => a + b, 0);
  const share = hourFactor / total;

  return {
    newUsers: Math.round(day.newUsers * share),
    newUsersIos: Math.round(day.newUsersIos * share),
    newUsersAndroid: Math.round(day.newUsersAndroid * share),
    newCats: Math.round(day.newCats * share),
    newCatsStray: Math.round(day.newCatsStray * share),
    newCatsHome: Math.round(day.newCatsHome * share),
    shots: Math.round(day.shots * share),
    dauMau: day.dauMau,
  };
}
