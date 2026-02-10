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
const randFloat = (min, max) => rand() * (max - min) + min;

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

// --- Countries with unique behavioral profiles ---
export const COUNTRIES = [
  { code: 'USA', name: 'United States',  userWeight: 100, catsPerUser: 2.5, shotsPerCat: 5.0, iosShare: 0.58 },
  { code: 'BRA', name: 'Brazil',         userWeight: 45,  catsPerUser: 3.2, shotsPerCat: 7.0, iosShare: 0.20 },
  { code: 'GBR', name: 'United Kingdom', userWeight: 30,  catsPerUser: 1.8, shotsPerCat: 4.0, iosShare: 0.52 },
  { code: 'DEU', name: 'Germany',        userWeight: 25,  catsPerUser: 1.5, shotsPerCat: 3.5, iosShare: 0.35 },
  { code: 'FRA', name: 'France',         userWeight: 22,  catsPerUser: 2.0, shotsPerCat: 4.5, iosShare: 0.40 },
  { code: 'IND', name: 'India',          userWeight: 80,  catsPerUser: 4.0, shotsPerCat: 8.0, iosShare: 0.08 },
  { code: 'CHN', name: 'China',          userWeight: 60,  catsPerUser: 1.2, shotsPerCat: 3.0, iosShare: 0.25 },
  { code: 'JPN', name: 'Japan',          userWeight: 35,  catsPerUser: 3.8, shotsPerCat: 9.0, iosShare: 0.70 },
  { code: 'KOR', name: 'South Korea',    userWeight: 18,  catsPerUser: 2.8, shotsPerCat: 6.5, iosShare: 0.30 },
  { code: 'AUS', name: 'Australia',      userWeight: 12,  catsPerUser: 2.2, shotsPerCat: 5.5, iosShare: 0.55 },
  { code: 'CAN', name: 'Canada',         userWeight: 15,  catsPerUser: 2.0, shotsPerCat: 4.0, iosShare: 0.56 },
  { code: 'MEX', name: 'Mexico',         userWeight: 20,  catsPerUser: 3.5, shotsPerCat: 7.5, iosShare: 0.18 },
  { code: 'ARG', name: 'Argentina',      userWeight: 8,   catsPerUser: 2.8, shotsPerCat: 6.0, iosShare: 0.15 },
  { code: 'CHL', name: 'Chile',          userWeight: 4,   catsPerUser: 2.0, shotsPerCat: 4.5, iosShare: 0.22 },
  { code: 'RUS', name: 'Russia',         userWeight: 28,  catsPerUser: 3.0, shotsPerCat: 6.0, iosShare: 0.30 },
  { code: 'TUR', name: 'Turkey',         userWeight: 16,  catsPerUser: 4.5, shotsPerCat: 9.5, iosShare: 0.22 },
  { code: 'IDN', name: 'Indonesia',      userWeight: 40,  catsPerUser: 3.8, shotsPerCat: 8.5, iosShare: 0.10 },
  { code: 'THA', name: 'Thailand',       userWeight: 14,  catsPerUser: 3.5, shotsPerCat: 7.0, iosShare: 0.25 },
  { code: 'ESP', name: 'Spain',          userWeight: 15,  catsPerUser: 1.8, shotsPerCat: 4.0, iosShare: 0.38 },
  { code: 'ITA', name: 'Italy',          userWeight: 17,  catsPerUser: 1.6, shotsPerCat: 3.8, iosShare: 0.32 },
  { code: 'NGA', name: 'Nigeria',        userWeight: 10,  catsPerUser: 4.2, shotsPerCat: 9.0, iosShare: 0.06 },
  { code: 'ZAF', name: 'South Africa',   userWeight: 6,   catsPerUser: 2.5, shotsPerCat: 5.5, iosShare: 0.20 },
  { code: 'EGY', name: 'Egypt',          userWeight: 9,   catsPerUser: 3.8, shotsPerCat: 8.0, iosShare: 0.12 },
  { code: 'COL', name: 'Colombia',       userWeight: 7,   catsPerUser: 2.6, shotsPerCat: 5.0, iosShare: 0.16 },
  { code: 'PHL', name: 'Philippines',    userWeight: 13,  catsPerUser: 3.0, shotsPerCat: 7.0, iosShare: 0.12 },
];

const totalUserWeight = COUNTRIES.reduce((s, c) => s + c.userWeight, 0);

// --- Generate daily data for 365 days ---
const TOTAL_DAYS = 365;
const today = new Date(2026, 1, 10); // Feb 10, 2026

function generateDailyData() {
  const days = [];
  for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    const month = date.getMonth(); // 0-11
    const dow = date.getDay(); // 0=Sun

    // Growth curve with seasonal variation and noise
    const progress = (TOTAL_DAYS - i) / TOTAL_DAYS;
    const seasonalFactor = 1.0
      + 0.25 * Math.sin((month - 3) * Math.PI / 6)   // summer peak
      + 0.10 * Math.sin((month - 11) * Math.PI / 3);  // holiday bump
    const weekendFactor = (dow === 0 || dow === 6) ? 1.15 + rand() * 0.1 : 1.0;
    const spikeFactor = rand() < 0.03 ? 1.5 + rand() * 1.0 : 1.0; // random viral spikes
    const noise = 0.7 + rand() * 0.6; // +-30% day noise

    const baseUsers = Math.round(
      (80 + progress * 300) * seasonalFactor * weekendFactor * spikeFactor * noise
    );

    // Cats derived from users: normal dist, mean ~2.2, capped at 5
    const catsPerUserToday = clamp(randNormal(2.2, 0.8), 0.5, 5.0);
    const baseCats = Math.round(baseUsers * catsPerUserToday);

    // Shots derived from cats: normal dist, mean ~4.5, capped at 10
    const shotsPerCatToday = clamp(randNormal(4.5, 2.0), 1.0, 10.0);
    const baseShots = Math.round(baseCats * shotsPerCatToday);

    // Platform split: varies wildly by day (global average ~38% iOS)
    const iosRatio = clamp(randNormal(0.38, 0.12), 0.10, 0.75);
    const usersIos = Math.round(baseUsers * iosRatio);
    const usersAndroid = baseUsers - usersIos;

    // Cat type split: stray dominates but varies a lot
    const strayRatio = clamp(randNormal(0.62, 0.15), 0.25, 0.90);
    const catsStray = Math.round(baseCats * strayRatio);
    const catsHome = baseCats - catsStray;

    // DAU/MAU grows over time with noise
    const dauMau = clamp(
      0.12 + progress * 0.12 + randNormal(0, 0.03),
      0.05, 0.40
    );

    days.push({
      date: dateStr,
      newUsers: baseUsers,
      newUsersIos: usersIos,
      newUsersAndroid: usersAndroid,
      newCats: baseCats,
      newCatsStray: catsStray,
      newCatsHome: catsHome,
      shots: baseShots,
      dauMau,
    });
  }
  return days;
}

export const dailyData = generateDailyData();

// --- Country-level aggregation with distinct profiles ---
function generateCountryData() {
  return COUNTRIES.map((c) => {
    const userShare = c.userWeight / totalUserWeight;
    const totalUsers = dailyData.reduce((s, d) => s + d.newUsers, 0);
    const users = Math.round(totalUsers * userShare * clamp(randNormal(1.0, 0.15), 0.6, 1.5));
    const cats = Math.round(users * clamp(randNormal(c.catsPerUser, 0.5), 0.5, 5.0));
    const shots = Math.round(cats * clamp(randNormal(c.shotsPerCat, 1.5), 1.0, 10.0));
    return { code: c.code, name: c.name, users, cats, shots };
  });
}

export const countryData = generateCountryData();

// Per-country daily data with country-specific profiles
function generateCountryDailyData() {
  const result = {};
  COUNTRIES.forEach((c) => {
    const userShare = c.userWeight / totalUserWeight;
    result[c.code] = dailyData.map((d) => {
      const dayNoise = clamp(randNormal(1.0, 0.25), 0.4, 2.0);
      const users = Math.max(1, Math.round(d.newUsers * userShare * dayNoise));

      const catsPerU = clamp(randNormal(c.catsPerUser, 0.6), 0.5, 5.0);
      const cats = Math.round(users * catsPerU);

      const shotsPerC = clamp(randNormal(c.shotsPerCat, 1.5), 1.0, 10.0);
      const shots = Math.round(cats * shotsPerC);

      const iosR = clamp(randNormal(c.iosShare, 0.08), 0.02, 0.95);
      const usersIos = Math.round(users * iosR);
      const usersAndroid = users - usersIos;

      const strayR = clamp(randNormal(0.62, 0.15), 0.25, 0.90);
      const catsStray = Math.round(cats * strayR);
      const catsHome = cats - catsStray;

      return {
        date: d.date,
        newUsers: users,
        newUsersIos: usersIos,
        newUsersAndroid: usersAndroid,
        newCats: cats,
        newCatsStray: catsStray,
        newCatsHome: catsHome,
        shots,
        dauMau: clamp(d.dauMau * randNormal(1.0, 0.1), 0.03, 0.45),
      };
    });
  });
  return result;
}

export const countryDailyData = generateCountryDailyData();

// --- Age/Sex distribution ---
export const AGE_GROUPS = [
  '13-17', '18-21', '22-25', '26-30', '31-35',
  '36-40', '41-49', '50-59', '60-69', '70+',
];

function generateAgeSexData() {
  // Bell curve peaking at 22-30 age range
  return AGE_GROUPS.map((group, idx) => {
    const peak = 4; // index of 25-27
    const dist = Math.abs(idx - peak);
    const base = Math.round(5000 * Math.exp(-0.12 * dist * dist));
    return {
      ageGroup: group,
      male: Math.max(50, Math.round(base * clamp(randNormal(1.0, 0.2), 0.5, 1.6))),
      female: Math.max(50, Math.round(base * clamp(randNormal(0.85, 0.2), 0.4, 1.5))),
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
      const base = Math.round(1000 * scale * Math.exp(-0.10 * dist * dist));
      return {
        ageGroup: group,
        male: Math.max(5, Math.round(base * clamp(randNormal(1.0, 0.3), 0.3, 2.0))),
        female: Math.max(5, Math.round(base * clamp(randNormal(0.85, 0.3), 0.3, 1.8))),
      };
    });
  });
  return result;
}

export const countryAgeSexData = generateCountryAgeSexData();

// --- Retention curve ---
const RETENTION_DAYS = [0, 1, 2, 3, 5, 7, 10, 14, 21, 30];

function generateRetentionCurve(d1Base, decayRate) {
  return RETENTION_DAYS.map((day) => {
    if (day === 0) return { day, rate: 100 };
    // Exponential decay + noise
    const base = 100 * Math.exp(-decayRate * day);
    const noisy = clamp(base + randNormal(0, 2.5), 1, 99);
    return { day, rate: Math.round(noisy * 10) / 10 };
  });
}

// Global: D1 ~42%, D7 ~22%, D30 ~10%
export const retentionData = generateRetentionCurve(42, 0.075);

// Per-platform: iOS retains slightly better
export const retentionByPlatform = {
  ALL: retentionData,
  iOS: generateRetentionCurve(46, 0.065),
  Android: generateRetentionCurve(38, 0.085),
};

// Per-country
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
  const totalUsers = data.reduce((s, d) => s + d.newUsers, 0);
  const totalCats = data.reduce((s, d) => s + d.newCats, 0);
  const totalShots = data.reduce((s, d) => s + d.shots, 0);
  const avgDauMau = data.length > 0
    ? data.reduce((s, d) => s + d.dauMau, 0) / data.length
    : 0;

  const prevUsers = prevData ? prevData.reduce((s, d) => s + d.newUsers, 0) : null;
  const prevCats = prevData ? prevData.reduce((s, d) => s + d.newCats, 0) : null;
  const prevShots = prevData ? prevData.reduce((s, d) => s + d.shots, 0) : null;
  const prevDauMau = prevData && prevData.length > 0
    ? prevData.reduce((s, d) => s + d.dauMau, 0) / prevData.length
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
export function filterData(data, { period, country, platform }) {
  let filtered = country === 'ALL' ? data : (countryDailyData[country] || []);

  const periodDays = { D: 1, W: 7, M: 30, Y: 365, ALL: filtered.length };
  const days = periodDays[period] || 30;
  filtered = filtered.slice(-days);

  if (platform !== 'ALL') {
    filtered = filtered.map((d) => applyPlatform(d, platform));
  }

  return filtered;
}

export function getPreviousPeriodData(data, { period, country, platform }) {
  let source = country === 'ALL' ? data : (countryDailyData[country] || []);
  const periodDays = { D: 1, W: 7, M: 30, Y: 365, ALL: source.length };
  const days = periodDays[period] || 30;

  const end = source.length - days;
  if (end <= 0) return null;
  const start = Math.max(0, end - days);
  let prev = source.slice(start, end);

  if (platform !== 'ALL') {
    prev = prev.map((d) => applyPlatform(d, platform));
  }

  return prev;
}

// Scale all metrics proportionally by the platform's user share
function applyPlatform(d, platform) {
  const total = d.newUsersIos + d.newUsersAndroid;
  if (total === 0) return { ...d, newUsers: 0, newCats: 0, newCatsStray: 0, newCatsHome: 0, shots: 0 };

  const platformUsers = platform === 'iOS' ? d.newUsersIos : d.newUsersAndroid;
  const ratio = platformUsers / total;

  return {
    ...d,
    newUsers: platformUsers,
    newUsersIos: platform === 'iOS' ? d.newUsersIos : 0,
    newUsersAndroid: platform === 'Android' ? d.newUsersAndroid : 0,
    newCats: Math.round(d.newCats * ratio),
    newCatsStray: Math.round(d.newCatsStray * ratio),
    newCatsHome: Math.round(d.newCatsHome * ratio),
    shots: Math.round(d.shots * ratio),
  };
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
      label: d.date.slice(8),
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
  // Average DAU/MAU per month
  Object.keys(months).forEach((m) => {
    months[m].dauMau /= counts[m];
  });
  return Object.values(months);
}

function spreadValues(day, n, hour) {
  // Hourly curve: peak at 12-20, low at 2-6
  const hourFactor = 0.3 + 0.7 * Math.exp(-0.03 * Math.pow(hour - 16, 2));
  const total = Array.from({ length: 24 }, (_, h) =>
    0.3 + 0.7 * Math.exp(-0.03 * Math.pow(h - 16, 2))
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
