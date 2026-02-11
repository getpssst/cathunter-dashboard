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
  const z = Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);
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

  // ESP — provinces (Natural Earth uses provinces)
  { id: 'ES-M', countryCode: 'ESP', name: 'Madrid', isoCode: 'ES-M', center: [-3.7, 40.4], weight: 8 },
  { id: 'ES-B', countryCode: 'ESP', name: 'Barcelona', isoCode: 'ES-B', center: [2.2, 41.4], weight: 7 },
  { id: 'ES-SE', countryCode: 'ESP', name: 'Sevilla', isoCode: 'ES-SE', center: [-5.9, 37.4], weight: 5 },

  // ITA — provinces (Natural Earth uses provinces)
  { id: 'IT-MI', countryCode: 'ITA', name: 'Milano', isoCode: 'IT-MI', center: [9.2, 45.5], weight: 8 },
  { id: 'IT-RM', countryCode: 'ITA', name: 'Roma', isoCode: 'IT-RM', center: [12.5, 41.9], weight: 6 },
  { id: 'IT-NA', countryCode: 'ITA', name: 'Napoli', isoCode: 'IT-NA', center: [14.3, 40.9], weight: 5 },

  // RUS — federal subjects
  { id: 'RU-MOW', countryCode: 'RUS', name: 'Moscow', isoCode: 'RU-MOW', center: [37.6, 55.8], weight: 10 },
  { id: 'RU-SPE', countryCode: 'RUS', name: 'Saint Petersburg', isoCode: 'RU-SPE', center: [30.3, 59.9], weight: 6 },
  { id: 'RU-KDA', countryCode: 'RUS', name: 'Krasnodar Krai', isoCode: 'RU-KDA', center: [39.7, 45.3], weight: 4 },
  { id: 'RU-NVS', countryCode: 'RUS', name: 'Novosibirsk Oblast', isoCode: 'RU-NVS', center: [78.0, 55.0], weight: 3 },

  // RUS — Crimea & Sevastopol
  { id: 'RU-CR', countryCode: 'RUS', name: 'Crimea', isoCode: 'UA-43', center: [34.1, 44.9], weight: 3 },
  { id: 'RU-SEV', countryCode: 'RUS', name: 'Sevastopol', isoCode: 'UA-40', center: [33.5, 44.6], weight: 2 },

  // TUR — provinces (iller)
  { id: 'TR-34', countryCode: 'TUR', name: 'Istanbul', isoCode: 'TR-34', center: [29.0, 41.0], weight: 10 },
  { id: 'TR-06', countryCode: 'TUR', name: 'Ankara', isoCode: 'TR-06', center: [32.9, 39.9], weight: 6 },
  { id: 'TR-35', countryCode: 'TUR', name: 'Izmir', isoCode: 'TR-35', center: [27.1, 38.4], weight: 5 },
  { id: 'TR-07', countryCode: 'TUR', name: 'Antalya', isoCode: 'TR-07', center: [30.7, 36.9], weight: 4 },

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
];

export const CAT_CITIES = [
  // USA
  { id: 'USA-SF', countryCode: 'USA', regionId: 'US-CA', name: 'San Francisco', coordinates: [-122.4194, 37.7749], weight: 10, spread: 0.25 },
  { id: 'USA-CHI', countryCode: 'USA', regionId: 'US-IL', name: 'Chicago', coordinates: [-87.6298, 41.8781], weight: 8, spread: 0.22 },
  { id: 'USA-NYC', countryCode: 'USA', regionId: 'US-NY', name: 'New York', coordinates: [-74.0060, 40.7128], weight: 10, spread: 0.22 },

  // CAN
  { id: 'CAN-VAN', countryCode: 'CAN', regionId: 'CA-BC', name: 'Vancouver', coordinates: [-123.1207, 49.2827], weight: 6, spread: 0.20 },
  { id: 'CAN-TOR', countryCode: 'CAN', regionId: 'CA-ON', name: 'Toronto', coordinates: [-79.3832, 43.6532], weight: 7, spread: 0.18 },
  { id: 'CAN-MTL', countryCode: 'CAN', regionId: 'CA-QC', name: 'Montreal', coordinates: [-73.5673, 45.5017], weight: 5, spread: 0.18 },

  // MEX
  { id: 'MEX-MTY', countryCode: 'MEX', regionId: 'MX-NLE', name: 'Monterrey', coordinates: [-100.3161, 25.6866], weight: 5, spread: 0.20 },
  { id: 'MEX-GDL', countryCode: 'MEX', regionId: 'MX-JAL', name: 'Guadalajara', coordinates: [-103.3496, 20.6597], weight: 4, spread: 0.22 },
  { id: 'MEX-MXC', countryCode: 'MEX', regionId: 'MX-DIF', name: 'Mexico City', coordinates: [-99.1332, 19.4326], weight: 7, spread: 0.18 },

  // BRA
  { id: 'BRA-SAO', countryCode: 'BRA', regionId: 'BR-SP', name: 'Sao Paulo', coordinates: [-46.6333, -23.5505], weight: 9, spread: 0.20 },
  { id: 'BRA-RIO', countryCode: 'BRA', regionId: 'BR-RJ', name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], weight: 7, spread: 0.20 },
  { id: 'BRA-BSB', countryCode: 'BRA', regionId: 'BR-MG', name: 'Brasilia', coordinates: [-47.8825, -15.7942], weight: 4, spread: 0.22 },

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

  // ESP
  { id: 'ESP-MAD', countryCode: 'ESP', regionId: 'ES-M', name: 'Madrid', coordinates: [-3.7038, 40.4168], weight: 6, spread: 0.12 },
  { id: 'ESP-BCN', countryCode: 'ESP', regionId: 'ES-B', name: 'Barcelona', coordinates: [2.1734, 41.3851], weight: 6, spread: 0.12 },
  { id: 'ESP-VLC', countryCode: 'ESP', regionId: 'ES-SE', name: 'Valencia', coordinates: [-0.3763, 39.4699], weight: 4, spread: 0.12 },

  // ITA
  { id: 'ITA-MIL', countryCode: 'ITA', regionId: 'IT-MI', name: 'Milan', coordinates: [9.1900, 45.4642], weight: 6, spread: 0.12 },
  { id: 'ITA-ROM', countryCode: 'ITA', regionId: 'IT-RM', name: 'Rome', coordinates: [12.4964, 41.9028], weight: 6, spread: 0.12 },
  { id: 'ITA-NAP', countryCode: 'ITA', regionId: 'IT-NA', name: 'Naples', coordinates: [14.2681, 40.8518], weight: 4, spread: 0.12 },

  // RUS
  { id: 'RUS-MOW', countryCode: 'RUS', regionId: 'RU-MOW', name: 'Moscow', coordinates: [37.6173, 55.7558], weight: 8, spread: 0.14 },
  { id: 'RUS-LED', countryCode: 'RUS', regionId: 'RU-SPE', name: 'Saint Petersburg', coordinates: [30.3351, 59.9343], weight: 6, spread: 0.14 },
  { id: 'RUS-NVS', countryCode: 'RUS', regionId: 'RU-NVS', name: 'Novosibirsk', coordinates: [82.9204, 55.0302], weight: 4, spread: 0.18 },
  { id: 'RUS-SIM', countryCode: 'RUS', regionId: 'RU-CR', name: 'Simferopol', coordinates: [34.1, 44.95], weight: 3, spread: 0.14 },
  { id: 'RUS-SEV', countryCode: 'RUS', regionId: 'RU-SEV', name: 'Sevastopol', coordinates: [33.52, 44.62], weight: 2, spread: 0.10 },

  // TUR
  { id: 'TUR-IST', countryCode: 'TUR', regionId: 'TR-34', name: 'Istanbul', coordinates: [28.9784, 41.0082], weight: 7, spread: 0.14 },
  { id: 'TUR-ANK', countryCode: 'TUR', regionId: 'TR-06', name: 'Ankara', coordinates: [32.8597, 39.9334], weight: 4, spread: 0.14 },
  { id: 'TUR-IZM', countryCode: 'TUR', regionId: 'TR-35', name: 'Izmir', coordinates: [27.1428, 38.4237], weight: 4, spread: 0.14 },

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

      const dauMau = clamp(GLOBAL_CURVE.dauMau[dayIndex] * randNormal(1.0, 0.06), 0.03, 0.45);

      out[c.code].push({
        date,
        newUsers: users,
        newUsersIos: usersIos,
        newUsersAndroid: usersAndroid,
        newCats: cats,
        newCatsStray: catsStray,
        newCatsHome: catsHome,
        shots,
        dauMau,
      });
    });
  }

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
    const shots = sumBy(days, (d) => d.shots);
    const dauMau = averageBy(days, (d) => d.dauMau, (d) => d.newUsers);

    return {
      date,
      newUsers,
      newUsersIos,
      newUsersAndroid,
      newCats,
      newCatsStray,
      newCatsHome,
      shots,
      dauMau,
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

export function generateCountryCatDots(countryCode, catType = 'ALL', maxDots = 500) {
  const cities = CAT_CITIES.filter((c) => c.countryCode === countryCode);
  if (cities.length === 0) return [];

  const country = COUNTRIES.find((c) => c.code === countryCode);
  const strayShare = country?.strayShare ?? 0.62;

  const rng = seededRandom(hashCode(countryCode) + 7777);

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

      const lng = city.coordinates[0] + z1 * spread;
      const lat = clamp(city.coordinates[1] + z2 * spread * 0.7, -85, 85);

      const isStray = rng() < strayShare;

      if (catType === 'Stray' && !isStray) continue;
      if (catType === 'Home' && isStray) continue;

      dots.push({
        id: `${city.id}-${i}`,
        coordinates: [lng, lat],
        isStray,
        cityName: city.name,
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
  const totalCats = data.reduce((s, d) => s + safe(d.newCats), 0);
  const totalShots = data.reduce((s, d) => s + safe(d.shots), 0);
  const avgDauMau = data.length > 0
    ? data.reduce((s, d) => s + safe(d.dauMau), 0) / data.length
    : 0;

  const prevUsers = prevData ? prevData.reduce((s, d) => s + safe(d.newUsers), 0) : null;
  const prevCats = prevData ? prevData.reduce((s, d) => s + safe(d.newCats), 0) : null;
  const prevShots = prevData ? prevData.reduce((s, d) => s + safe(d.shots), 0) : null;
  const prevDauMau = prevData && prevData.length > 0
    ? prevData.reduce((s, d) => s + safe(d.dauMau), 0) / prevData.length
    : null;

  const pctChange = (curr, prev) =>
    prev && prev > 0 ? ((curr - prev) / prev) * 100 : null;

  return {
    users: { value: totalUsers, change: pctChange(totalUsers, prevUsers) },
    cats: { value: totalCats, change: pctChange(totalCats, prevCats) },
    shots: { value: totalShots, change: pctChange(totalShots, prevShots) },
    dauMau: { value: avgDauMau, change: pctChange(avgDauMau, prevDauMau) },
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
      shots: 0,
      dauMau: 0,
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
      base.shots += d.shots;

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
      shots: 0,
    };
  }

  const platformUsers = platform === 'iOS' ? d.newUsersIos : d.newUsersAndroid;
  const ratio = platformUsers / total;

  let newCats = Math.round(d.newCats * ratio);
  let newCatsStray = Math.round(d.newCatsStray * ratio);
  let newCatsHome = Math.round(d.newCatsHome * ratio);

  // Keep sums consistent.
  let drift = newCats - (newCatsStray + newCatsHome);
  if (drift !== 0) {
    if (newCatsStray >= newCatsHome) newCatsStray += drift;
    else newCatsHome += drift;
  }

  const out = {
    ...d,
    newUsers: platformUsers,
    newUsersIos: platform === 'iOS' ? d.newUsersIos : 0,
    newUsersAndroid: platform === 'Android' ? d.newUsersAndroid : 0,
    newCats,
    newCatsStray: Math.max(0, newCatsStray),
    newCatsHome: Math.max(0, newCatsHome),
    shots: Math.round(d.shots * ratio),
  };

  return normalizeUsersSplit(out);
}

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
      shots: 0,
    };
  }

  const selectedCats = catType === 'Stray' ? d.newCatsStray : d.newCatsHome;
  const ratio = selectedCats / totalCats;

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

  const out = {
    ...d,
    newUsers,
    newUsersIos: Math.max(0, newUsersIos),
    newUsersAndroid: Math.max(0, newUsersAndroid),
    newCats: selectedCats,
    newCatsStray: catType === 'Stray' ? selectedCats : 0,
    newCatsHome: catType === 'Home' ? selectedCats : 0,
    shots: Math.round(d.shots * ratio),
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
