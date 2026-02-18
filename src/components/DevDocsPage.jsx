import { useState } from 'react';

const sections = [
  {
    id: 'overview',
    title: 'Architecture Overview',
    content: `
**CatHunter Dashboard** — single-page React application (Vite + Tailwind CSS) for visualizing cat-hunting activity worldwide.

### Tech Stack
- **React 18** + Vite
- **Recharts** — all charts (BarChart, LineChart)
- **react-simple-maps** — interactive world map
- **Tailwind CSS** — styling
- **Deployed** to Vercel

### Data Layer
All data is **generated client-side** from a deterministic seeded PRNG (\`seededRandom(42)\`). There are **zero API calls** for metrics data. The only external fetches are map TopoJSON files.

### File Structure
\`\`\`
src/
├── App.jsx                    — root: state, data derivation, layout
├── data/
│   └── fakeData.js            — ~3700 lines: data generation + filter/aggregate
├── components/
│   ├── Filters.jsx            — sticky filter bar (5 controls)
│   ├── KpiCards.jsx           — 4 KPI summary cards
│   ├── UsersAndCatsChart.jsx  — grouped bar chart
│   ├── DauMauChart.jsx        — line chart
│   ├── AgeSexChart.jsx        — horizontal population pyramid
│   ├── EngagementChart.jsx    — dual-line chart
│   ├── InsightsBlock.jsx      — AI-style insight cards
│   ├── WorldHeatmap.jsx       — interactive choropleth map
│   └── DevDocsPage.jsx        — this page
├── utils/
│   └── formatNumber.js        — formatNumber, formatDauMau, formatChange
public/
└── admin1.json                — TopoJSON for admin-1 regions
\`\`\`
`,
  },
  {
    id: 'endpoints',
    title: 'Data Endpoints (for real backend)',
    content: `
Currently all data is fake and generated in \`fakeData.js\`. When connecting a real backend, replace the following exports:

### Required API Endpoints

| Endpoint | Replaces | Returns |
|---|---|---|
| \`GET /api/metrics/daily?country=&continent=&from=&to=\` | \`countryDailyData\`, \`dailyData\` | Array of daily metric objects |
| \`GET /api/metrics/kpis?period=&country=&continent=&platform=&catType=\` | \`computeKpis()\` | \`{ users, cats, shots, dauMau }\` with \`.value\` and \`.change\` |
| \`GET /api/demographics/age-sex?country=&continent=\` | \`ageSexData\`, \`countryAgeSexData\` | Array of \`{ ageGroup, male, female }\` |
| \`GET /api/geo/countries\` | \`COUNTRIES\` | List of countries with \`code\`, \`name\`, \`continent\`, \`center\`, behavioural profiles |
| \`GET /api/geo/regions?country=\` | \`ADMIN_REGIONS\` | List of admin-1 regions with \`isoCode\`, \`name\`, \`center\`, \`weight\` |
| \`GET /api/geo/cities?country=&region=\` | \`CAT_CITIES\` | List of cities with \`coordinates\`, \`weight\`, \`spread\` |
| \`GET /api/insights?days=30\` | \`InsightsBlock.detectInsights()\` | Array of \`{ type, text, priority }\` |

### Daily Metric Object Shape
\`\`\`js
{
  date: "2026-01-15",       // ISO date string
  newUsers: 142,            // new signups that day
  newUsersIos: 83,          // iOS portion
  newUsersAndroid: 59,      // Android portion
  newCats: 199,             // unique cats photographed
  newCatsStray: 89,         // stray cats
  newCatsHome: 110,         // home cats
  catsShot: 199,            // same as newCats (alias)
  shots: 597,               // total photos taken
  dauMau: 0.24,             // DAU/MAU ratio (0–1)
  dau: 1200,                // daily active users
  mau: 5000,                // monthly active users
}
\`\`\`

### External Resources (map)
| URL | Purpose |
|---|---|
| \`https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json\` | Base world map (TopoJSON, 110m resolution) |
| \`/admin1.json\` (local) | Admin-1 regions (built from Natural Earth via \`scripts/build-admin1.mjs\`) |
`,
  },
  {
    id: 'filters',
    title: 'Filter System',
    content: `
### Filter State
\`\`\`js
{ period: 'Y', continent: 'ALL', country: 'ALL', platform: 'ALL', catType: 'ALL' }
\`\`\`

### Filter Controls

| Filter | Type | Values | Default |
|---|---|---|---|
| **Period** | Button group | D (1 day), W (7 days), M (30 days), Y (365 days), ALL (548 days) | Y |
| **Continent** | Select dropdown | ALL, North America, South America, Europe, Asia, Africa, Oceania | ALL |
| **Country** | Select dropdown | ALL + 25 countries (filtered by continent) | ALL |
| **Platform** | Button group | ALL, iOS, Android | ALL |
| **Cat Type** | Button group | ALL, Stray, Home | ALL |

### Filter Pipeline (\`filterData()\`)
1. **\`resolveSource()\`** — picks data source:
   - Country selected → \`countryDailyData[country]\`
   - Continent selected → aggregate all countries in continent
   - Otherwise → global \`dailyData\`
2. **\`.slice(-days)\`** — takes the last N days for selected period
3. **\`applyPlatform()\`** — if platform ≠ ALL, scales metrics by platform's user share:
   - \`userRatio = platformUsers / totalUsers\`
   - Shots adjusted by \`PLATFORM_ENGAGEMENT = { iOS: 1.25, Android: 0.82 }\`
   - iOS users take 25% more photos per cat; Android 18% fewer
4. **\`applyCatType()\`** — if catType ≠ ALL, scales metrics by cat type share:
   - \`ratio = selectedCats / totalCats\`
   - Shots adjusted by \`CATTYPE_ENGAGEMENT = { Stray: 1.30, Home: 0.70 }\`
   - Stray hunters take 30% more photos; home cat owners 30% fewer

### Continent → Country Dependency
Selecting a continent resets \`country\` to ALL. Country dropdown only shows countries from the selected continent.
`,
  },
  {
    id: 'kpi-cards',
    title: 'KPI Cards',
    content: `
### Component: \`KpiCards.jsx\`

4 summary cards displayed above charts.

| Card | Metric | Formula |
|---|---|---|
| **New Users** | Total new signups in period | \`sum(filtered.newUsers)\` |
| **Cats Shot** | Total unique cats photographed | \`sum(filtered.catsShot \\|\\| newCats)\` |
| **Shots** | Total photos taken | \`sum(filtered.shots)\` |
| **DAU/MAU** | Daily/Monthly active user ratio | Last day's \`dauMau\` value (0–1 range, displayed as e.g. 0.24) |

### Trend Arrows
Each card shows a **% change** vs the previous period of equal length.

- \`getPreviousPeriodData()\` takes the same-length window immediately before the current one
- Formula: \`change = ((current - previous) / previous) * 100\`
- Green ▲ for positive, Red ▼ for negative
- DAU/MAU additionally shows "As of {date} (trailing 30d)"

### Filter Dependencies
All 5 filters affect KPI values. The data goes through the full \`filterData()\` pipeline.
`,
  },
  {
    id: 'users-cats-chart',
    title: 'Chart: New Users & Cats',
    content: `
### Component: \`UsersAndCatsChart.jsx\`

**Type:** Grouped vertical BarChart (Recharts)

**Data source:** \`aggregateForChart(filtered, period)\`

**Bars:**
- 🔵 **New Users** (\`newUsers\`) — blue \`#3b82f6\`
- 🟠 **New Cats** (\`newCats\`) — orange \`#f97316\`

### Aggregation Logic (\`aggregateForChart\`)

| Period | X-axis labels | Aggregation |
|---|---|---|
| **D** (1 day) | 24 hourly buckets: \`0:00\`–\`23:00\` | Gaussian distribution peaking at 16:00 |
| **W** (week) | 7 daily labels: \`MM-DD\` | Raw daily values |
| **M** (month) | 30 daily labels: \`MM-DD\` | Raw daily values |
| **Y** (year) | 12 monthly labels: \`Jan\`–\`Dec\` | Sum users/cats/shots per month, avg DAU/MAU |
| **ALL** | All months | Same as Y but without 12-month cutoff |

### Filter Dependencies
All 5 filters affect this chart through the \`filterData()\` pipeline.
`,
  },
  {
    id: 'daumau-chart',
    title: 'Chart: DAU/MAU',
    content: `
### Component: \`DauMauChart.jsx\`

**Type:** LineChart (Recharts)

**Data source:** \`aggregateForChart(filtered, period)\` → maps each point to \`dauMau\` rounded to 2 decimals.

**Line:**
- 🟣 \`dauMau\` — indigo \`#6366f1\`, Y-axis domain \`[0, 0.4]\`

### What DAU/MAU Means
- **DAU** = Daily Active Users (users who opened the app today)
- **MAU** = Monthly Active Users (users who opened the app in the last 30 days)
- Ratio shows "stickiness": a high value (e.g. 0.30) means 30% of monthly users come back every day

### How DAU/MAU Is Generated (fake data)
- Base: \`0.12 + progress * 0.14 + noise\` — grows from ~12% to ~26% over 548 days
- Clamped to \`[0.06, 0.42]\`
- Per-country: exponential decay model of cumulative install base

### Filter Dependencies
All 5 filters. Platform filter additionally adjusts DAU/MAU by engagement factor (iOS users are stickier).
`,
  },
  {
    id: 'age-sex-chart',
    title: 'Chart: Age/Sex Pyramid',
    content: `
### Component: \`AgeSexChart.jsx\`

**Type:** Horizontal population pyramid (vertical BarChart with \`layout="vertical"\`)

**Data source:** Computed in \`App.jsx\` from \`ageSexData\` / \`countryAgeSexData\`

**Bars:**
- 🔵 **Male** — blue \`#3b82f6\` (right side, positive values)
- 🩷 **Female** — pink \`#ec4899\` (left side, negative values for visual symmetry)

### Age Groups
\`['13-17', '18-21', '22-25', '26-30', '31-35', '36-40', '41-49', '50-59', '60-69', '70+']\`

### Data Logic
1. **Base distribution** selected by geo filter:
   - Country selected → \`countryAgeSexData[country]\` (per-country variant with shifted peak)
   - Continent selected → sum all countries in that continent
   - Otherwise → global \`ageSexData\` (bell curve peaking at 26-30)
2. **Scaling**: The base is treated as relative weights. The filtered \`totalUsers\` (from period/platform/catType) is distributed across age groups using \`distributeInt()\`, then split male/female proportionally.

### Filter Dependencies
- **Country/Continent** → changes the age distribution shape (different countries have different age peaks)
- **Period/Platform/CatType** → changes the total user count that gets distributed, but the shape stays the same
`,
  },
  {
    id: 'engagement-chart',
    title: 'Chart: Engagement Ratios',
    content: `
### Component: \`EngagementChart.jsx\`

**Type:** Dual-line LineChart (Recharts)

**Data source:** \`aggregateForChart(filtered, period)\` → computes ratios per data point

**Lines:**
- 🔵 **Cats/User** (\`newCats / newUsers\`) — sky blue \`#0ea5e9\`
- 🟠 **Shots/Cat** (\`shots / newCats\`) — orange \`#f97316\`

### What These Ratios Mean
- **Cats/User**: How many unique cats each user photographs on average. Higher = users are more active.
- **Shots/Cat**: How many photos are taken per cat. Higher = users are more thorough (or cats are more photogenic).

### Typical Values (by country profile)
- Turkey: Cats/User ~2.0, Shots/Cat ~4.5 (highest engagement, many stray cats)
- UK: Cats/User ~0.9, Shots/Cat ~3.0 (fewer cats per user, mostly home cats)
- Japan: Cats/User ~1.1, Shots/Cat ~5.0 (fewer cats but many photos per cat)

### Filter Dependencies
All 5 filters. Platform/CatType filters shift the engagement multipliers (iOS users and stray hunters have higher shots/cat).
`,
  },
  {
    id: 'insights',
    title: 'AI Insights Panel',
    content: `
### Component: \`InsightsBlock.jsx\`

**Position:** Top of dashboard, above filters.

**Data source:** \`dailyData.slice(-30)\` — **ALWAYS last 30 days of global data, ignoring all filters.**

### Three Insight Slots

Each slot picks the single best candidate across all 25 countries:

#### Slot 1: Peak / Record (★ amber)
Finds the most impressive stat. Candidates:
- **Record day**: Single-day user count ≥ 1.8× the 30-day average and ≥ 10 users. Priority weighted by ratio × log₂(avg).
- **Volume leader**: Country with highest total users in 30 days. Priority = log₂(total) × 8.
- **Engagement leader**: Country with highest shots/cat (minimum 50 cats). Priority = spc × log₂(cats) × 2.

Only the #1 volume leader and #1 engagement leader are kept; all record-day candidates compete.

#### Slot 2: Growth (▲ green)
Best upward signal. Candidates:
- **Week-over-week growth**: This week vs last week, ≥ 15% increase with ≥ 15 users last week.
- **Growth streak**: Longest consecutive days of increasing 3-day moving average (≥ 4 days, MA must be >1.01× previous).
- **Rolling spike**: Best 5-day window where after-average > before-average by ≥ 40%.

#### Slot 3: Decline (▼ red)
Worst downward signal. Candidates:
- **Week-over-week decline**: This week vs last week, ≥ 15% decrease.
- **Decline streak**: Longest consecutive days of decreasing 3-day MA (≥ 4 days, MA must be <0.99× previous).
- **Rolling dip**: Worst 5-day window where after-average < before-average by ≥ 25%.

### Priority Scoring
Each candidate gets a \`priority\` score combining magnitude and market size (using log₂ weighting). The top-1 from each slot wins.

### Important: No Filter Dependency
InsightsBlock data is fixed at \`dailyData.slice(-30)\` and does NOT react to any filter changes. This is intentional — insights provide a stable global overview.
`,
  },
  {
    id: 'world-map',
    title: 'World Heatmap (Cats Map)',
    content: `
### Component: \`WorldHeatmap.jsx\` (~660 lines)

**Library:** \`react-simple-maps\` with Mercator projection.

### Three Drill-Down Levels

#### Level 1: World View
- Choropleth map colored by **cats** metric per country
- Color scale: square-root intensity \`Math.pow(value / maxVal, 0.5)\` mapped to blue gradient
- Tooltip on hover: country name, users, cats, shots
- **Click** a country → sets \`filters.country\`, zooms in

#### Level 2: Country / Admin-1 View
- Shows admin-1 regions (states, provinces, oblasts) for the selected country
- Regions colored by their share of the country's total cats
- Region data is distributed using weight system: \`regionWeight + sum(cityWeights)\`
- **Click** a region → zooms into region

#### Level 3: Region Zoom View
- Shows individual cat dot markers scattered around cities
- Dot count = region's cat metric, capped at **500** for performance
- Dots are Gaussian-scattered around city coordinates using \`spread\` parameter
- Dots filtered by region polygon using ray-casting point-in-polygon test
- 🟠 Orange dots = Stray cats, 🔵 Blue dots = Home cats
- City name labels shown for cities in the zoomed region
- Breadcrumb navigation: World › Country › Region

### Map Data Sources
- **World polygons**: CDN \`world-atlas@2/countries-110m.json\` (Natural Earth 110m)
- **Admin-1 polygons**: \`/admin1.json\` (built from Natural Earth via \`scripts/build-admin1.mjs\`)
- **Crimea**: Custom polygon overlay, always rendered with Russia's color (ID 643)

### Filter Dependencies
- **Period** → changes time window for aggregating cats per country/region
- **Platform** → scales metrics by platform user share
- **CatType** → scales metrics by cat type share; also controls dot colors in region zoom
- **Continent** → controls which countries are highlighted/clickable (cosmetic only)
- **Country** → triggers drill-down view
`,
  },
  {
    id: 'geo-data',
    title: 'Geographic Data: Countries, Regions, Cities',
    content: `
### Countries (\`COUNTRIES\` — 25 total)

Each country has a **behavioral profile** that controls data generation:

| Field | Description | Example (Turkey) |
|---|---|---|
| \`code\` | ISO 3166-1 alpha-3 | \`TUR\` |
| \`name\` | Display name | \`Turkey\` |
| \`continent\` | One of 6 continents | \`Europe\` |
| \`userWeight\` | Relative user volume (USA=100 is highest) | \`16\` |
| \`catsPerUser\` | Avg cats photographed per user | \`2.0\` |
| \`shotsPerCat\` | Avg photos per cat | \`4.5\` |
| \`iosShare\` | Fraction of users on iOS | \`0.22\` |
| \`strayShare\` | Fraction of cats that are stray | \`0.85\` |
| \`center\` | Map center coordinates \`[lon, lat]\` | \`[35, 39]\` |

**Full Country List by Continent:**

**North America:** USA (100), Canada (15), Mexico (20)
**South America:** Brazil (45), Argentina (8), Chile (4), Colombia (7)
**Europe:** UK (30), Germany (25), France (22), Spain (15), Italy (17), Russia (28), Turkey (16)
**Asia:** India (80), China (60), Japan (35), South Korea (18), Indonesia (40), Thailand (14), Philippines (13)
**Africa:** Nigeria (10), South Africa (6), Egypt (9)
**Oceania:** Australia (12)

*(Numbers in parentheses = userWeight)*

### Admin-1 Regions (\`ADMIN_REGIONS\`)

Regions are admin-1 divisions (states, provinces, oblasts etc). Each has:
- \`id\` / \`isoCode\` — ISO 3166-2 code (e.g. \`US-CA\`, \`RU-MOW\`)
- \`countryCode\` — parent country alpha-3
- \`name\` — display name
- \`center\` — \`[lon, lat]\` for map centering
- \`weight\` — relative importance for metric distribution (0-12 scale)

Regions split into two tiers:
1. **Manually curated** (weight 3-12): major states/provinces with explicit weights
2. **Auto-generated from TopoJSON** (weight 1): all remaining regions for map coverage

The admin-1 polygon geometry comes from \`/admin1.json\`, built from Natural Earth data via \`scripts/build-admin1.mjs\`.

### Cities (\`CAT_CITIES\`)

Cities exist within regions and serve two purposes:
1. **Weight distribution** — cities add their weight to the parent region's share of country metrics
2. **Dot placement** — in region zoom view, cat dots are Gaussian-scattered around city coordinates

Each city has:
- \`countryCode\` + \`regionId\` — links to parent region
- \`name\` — displayed as label in region zoom
- \`coordinates\` — \`[lon, lat]\`
- \`weight\` — relative importance (adds to region weight)
- \`spread\` — Gaussian scatter radius for dot placement (0.15–0.30)

### How to Get These Lists for Filters
- **Countries dropdown**: Import \`COUNTRIES\` from \`fakeData.js\`, filter by selected continent
- **Regions**: Import \`ADMIN_REGIONS\`, filter by \`countryCode\`
- **Cities**: Import \`CAT_CITIES\`, filter by \`countryCode\` and optionally \`regionId\`

### Adding a New Country
1. Add entry to \`COUNTRIES\` array with all behavioral fields
2. Add to \`NUMERIC_TO_ALPHA3\` map in \`WorldHeatmap.jsx\`
3. Add to \`COUNTRY_FLAGS\` in \`Filters.jsx\`
4. Add to \`COUNTRY_SCALE\` in \`WorldHeatmap.jsx\`
5. Add admin-1 regions to \`ADMIN_REGIONS\`
6. Add cities to \`CAT_CITIES\`
7. Rebuild \`admin1.json\` if needed
`,
  },
  {
    id: 'data-generation',
    title: 'Fake Data Generation',
    content: `
### Seed & Reproducibility
All random values use \`seededRandom(42)\` — deterministic PRNG. Same seed = same data every time.

### Generation Pipeline

#### Step 1: \`generateGlobalCurve()\`
Generates 548 days (2024-08-11 → 2026-02-10) of global user counts:

\`\`\`
base = 30 + 190 × progress^1.25              // logistic-ish growth: ~30 → ~220 users/day
× seasonalFactor                                // summer peak, winter dip (±12%)
× weekendFactor                                 // weekends: +10-18%
× spikeFactor                                   // 2% chance of 1.25–1.85× spike
× dipFactor                                     // 6-8 random dips (4-12 days each, 60-85% depth)
× noise                                         // uniform noise 0.88–1.16
\`\`\`

Also generates global DAU/MAU: \`0.12 + progress × 0.14 + normal(0, 0.015)\`, clamped to [0.06, 0.42].

#### Step 2: \`generateCountryDailyData()\`
Distributes global daily users across 25 countries:

1. Per-country weight = \`userWeight / totalWeight × normalNoise(1.0, 0.18)\`
2. \`distributeInt(globalUsers, weights)\` — integer distribution via largest-remainder method
3. Per country per day:
   - \`newUsers\` = distributed share
   - \`newUsersIos\` = \`round(newUsers × iosShare × noise)\`
   - \`newCats\` = \`round(newUsers × catsPerUser × noise)\`
   - \`newCatsStray\` = \`round(newCats × strayShare × noise)\`
   - \`shots\` = \`round(newCats × shotsPerCat × noise)\`
   - \`dauMau\` = exponential decay model of cumulative install base

#### Step 3: \`generateDailyFromCountries()\`
Sums all country daily data back into the global \`dailyData\` array.

### Age/Sex Distribution
- Global: bell curve peaking at age group index 4 (26-30), Box-Muller noise for male/female split
- Per-country: random peak shift ±0–3 positions, scaled by \`userWeight / 100\`
`,
  },
];

function SectionNav({ activeId, onSelect }) {
  return (
    <nav className="flex flex-wrap gap-1.5 mb-6">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeId === s.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {s.title}
        </button>
      ))}
    </nav>
  );
}

function MarkdownContent({ content }) {
  // Simple markdown-to-JSX renderer for our docs
  const lines = content.trim().split('\n');
  const elements = [];
  let i = 0;
  let tableLines = [];
  let inCodeBlock = false;
  let codeLines = [];
  let listItems = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-sm text-gray-700">
          {listItems.map((li, idx) => <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(li) }} />)}
        </ul>
      );
      listItems = [];
    }
  }

  function flushTable() {
    if (tableLines.length < 2) { tableLines = []; return; }
    const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
    const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
    elements.push(
      <div key={`table-${elements.length}`} className="overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((h, idx) => (
                <th key={idx} className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200" dangerouslySetInnerHTML={{ __html: formatInline(h) }} />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 text-gray-600 border-b border-gray-100" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableLines = [];
  }

  function formatInline(text) {
    return text
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-mono">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      flushList();
      flushTable();
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${elements.length}`} className="bg-gray-900 text-green-300 rounded-lg p-4 text-xs font-mono overflow-x-auto mb-4 leading-relaxed">
            {codeLines.join('\n')}
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      i++;
      continue;
    }

    if (line.startsWith('|')) {
      flushList();
      tableLines.push(line);
      i++;
      if (i < lines.length && !lines[i].startsWith('|')) {
        flushTable();
      }
      continue;
    }
    flushTable();

    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={`h3-${i}`} className="text-base font-bold text-gray-800 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('#### ')) {
      flushList();
      elements.push(<h4 key={`h4-${i}`} className="text-sm font-bold text-gray-700 mt-4 mb-2">{line.slice(5)}</h4>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2));
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={`p-${i}`} className="text-sm text-gray-700 mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }
    i++;
  }
  flushList();
  flushTable();

  return <div>{elements}</div>;
}

export default function DevDocsPage({ onClose }) {
  const [activeSection, setActiveSection] = useState('overview');
  const section = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developer Documentation</h1>
            <p className="text-sm text-gray-500 mt-1">CatHunter Dashboard — internal reference</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Section Navigation */}
        <SectionNav activeId={activeSection} onSelect={setActiveSection} />

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
          <MarkdownContent content={section.content} />
        </div>

        {/* Prev / Next navigation */}
        <div className="flex justify-between mt-4">
          {(() => {
            const idx = sections.findIndex((s) => s.id === activeSection);
            return (
              <>
                {idx > 0 ? (
                  <button
                    onClick={() => setActiveSection(sections[idx - 1].id)}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    ← {sections[idx - 1].title}
                  </button>
                ) : <div />}
                {idx < sections.length - 1 ? (
                  <button
                    onClick={() => setActiveSection(sections[idx + 1].id)}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {sections[idx + 1].title} →
                  </button>
                ) : <div />}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
