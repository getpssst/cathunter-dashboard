import { useState, useMemo } from 'react';
import KpiCards from './components/KpiCards';
import Filters from './components/Filters';
import UsersAndCatsChart from './components/UsersAndCatsChart';
import AgeSexChart from './components/AgeSexChart';
import DauMauChart from './components/DauMauChart';
import WorldHeatmap from './components/WorldHeatmap';
import EngagementChart from './components/EngagementChart';
import InsightsBlock from './components/InsightsBlock';
import DevDocsPage from './components/DevDocsPage';
import {
  dailyData,
  filterData,
  getPreviousPeriodData,
  computeKpis,
  aggregateForChart,
  ageSexData,
  countryAgeSexData,
  COUNTRIES,
  AGE_GROUPS,
  distributeInt,
} from './data/fakeData';

function App() {
  const [showDocs, setShowDocs] = useState(false);
  const [filters, setFilters] = useState({
    period: 'Y',
    continent: 'ALL',
    country: 'ALL',
    platform: 'ALL',
    catType: 'ALL',
  });

  const filtered = useMemo(
    () => filterData(dailyData, filters),
    [filters]
  );

  const prevPeriod = useMemo(
    () => getPreviousPeriodData(dailyData, filters),
    [filters]
  );

  const kpis = useMemo(
    () => computeKpis(filtered, prevPeriod),
    [filtered, prevPeriod]
  );

  const chartData = useMemo(
    () => aggregateForChart(filtered, filters.period),
    [filtered, filters.period]
  );

  const last30 = useMemo(() => dailyData.slice(-30), []);

  const ageData = useMemo(() => {
    const safe = (v) => (Number.isFinite(v) ? v : 0);

    let base;
    if (filters.country !== 'ALL') {
      base = countryAgeSexData[filters.country] || ageSexData;
    } else if (filters.continent !== 'ALL') {
      const codes = COUNTRIES.filter((c) => c.continent === filters.continent).map((c) => c.code);
      base = AGE_GROUPS.map((group, idx) => {
        let male = 0, female = 0;
        codes.forEach((code) => {
          const cd = countryAgeSexData[code];
          if (cd && cd[idx]) { male += cd[idx].male; female += cd[idx].female; }
        });
        return { ageGroup: group, male, female };
      });
    } else {
      base = ageSexData;
    }

    const totalUsers = filtered.reduce((s, d) => s + safe(d.newUsers), 0);
    if (totalUsers <= 0) {
      return base.map((d) => ({ ageGroup: d.ageGroup, male: 0, female: 0 }));
    }

    // Treat the base age/sex data as weights and distribute the filtered period users
    // so the chart always matches the selected filters (period/platform/type/geo).
    const ageWeights = base.map((d) => Math.max(0, safe(d.male)) + Math.max(0, safe(d.female)));
    const totalsByAge = distributeInt(totalUsers, ageWeights);

    function splitSex(total, maleW, femaleW) {
      if (total <= 0) return [0, 0];
      if (maleW <= 0 && femaleW <= 0) {
        const male = Math.floor(total / 2);
        return [male, total - male];
      }
      return distributeInt(total, [maleW, femaleW]);
    }

    return base.map((d, idx) => {
      const total = totalsByAge[idx] || 0;
      const maleW = Math.max(0, safe(d.male));
      const femaleW = Math.max(0, safe(d.female));
      const [male, female] = splitSex(total, maleW, femaleW);
      return { ageGroup: d.ageGroup, male, female };
    });
  }, [filters, filtered]);

  if (showDocs) {
    return <DevDocsPage onClose={() => setShowDocs(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              CatHunter Dashboard
            </h1>
          </div>
          <button
            onClick={() => setShowDocs(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Dev Docs
          </button>
        </div>

        {/* Key Insights */}
        <InsightsBlock data={last30} />

        {/* Filters */}
        <Filters filters={filters} onChange={setFilters} />

        {/* KPI Cards */}
        <KpiCards kpis={kpis} />

        {/* Charts 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <UsersAndCatsChart data={chartData} />
          <DauMauChart data={chartData} />
          <AgeSexChart data={ageData} />
          <EngagementChart data={chartData} />
        </div>

        {/* World Heatmap */}
        <WorldHeatmap filters={filters} onChange={setFilters} />
      </div>
    </div>
  );
}

export default App;
