import { useState, useMemo } from 'react';
import KpiCards from './components/KpiCards';
import Filters from './components/Filters';
import UsersAndCatsChart from './components/UsersAndCatsChart';
import AgeSexChart from './components/AgeSexChart';
import DauMauChart from './components/DauMauChart';
import WorldHeatmap from './components/WorldHeatmap';
import EngagementChart from './components/EngagementChart';
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
  const [filters, setFilters] = useState({
    period: 'ALL',
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

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            CatHunter Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Analytics overview
          </p>
        </div>

        {/* Filters */}
        <Filters filters={filters} onChange={setFilters} />

        {/* KPI Cards */}
        <KpiCards kpis={kpis} />

        {/* Charts 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <UsersAndCatsChart data={chartData} />
          <DauMauChart data={dailyData} />
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
