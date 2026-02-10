import { useState, useMemo } from 'react';
import KpiCards from './components/KpiCards';
import Filters from './components/Filters';
import NewUsersChart from './components/NewUsersChart';
import NewCatsChart from './components/NewCatsChart';
import AgeSexChart from './components/AgeSexChart';
import DauMauChart from './components/DauMauChart';
import WorldHeatmap from './components/WorldHeatmap';
import RetentionChart from './components/RetentionChart';
import {
  dailyData,
  filterData,
  getPreviousPeriodData,
  computeKpis,
  aggregateForChart,
  ageSexData,
  countryAgeSexData,
  retentionByPlatform,
  retentionByCountry,
} from './data/fakeData';

function App() {
  const [filters, setFilters] = useState({
    period: 'M',
    country: 'ALL',
    platform: 'ALL',
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
    const base = filters.country === 'ALL'
      ? ageSexData
      : countryAgeSexData[filters.country] || ageSexData;
    if (filters.platform === 'ALL') return base;

    // Compute platform ratio from filtered daily data
    const totIos = filtered.reduce((s, d) => s + d.newUsersIos, 0);
    const totAnd = filtered.reduce((s, d) => s + d.newUsersAndroid, 0);
    const total = totIos + totAnd;
    if (total === 0) return base;
    const ratio = filters.platform === 'iOS' ? totIos / total : totAnd / total;

    return base.map((d) => ({
      ageGroup: d.ageGroup,
      male: Math.round(d.male * ratio),
      female: Math.round(d.female * ratio),
    }));
  }, [filters.country, filters.platform, filtered]);

  const retentionData = useMemo(() => {
    const platform = filters.platform;
    if (filters.country === 'ALL') return retentionByPlatform[platform] || retentionByPlatform.ALL;
    const countryRet = retentionByCountry[filters.country];
    if (!countryRet) return retentionByPlatform[platform] || retentionByPlatform.ALL;
    return countryRet[platform] || countryRet.ALL;
  }, [filters.country, filters.platform]);

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
          <NewUsersChart data={chartData} />
          <NewCatsChart data={chartData} />
          <AgeSexChart data={ageData} />
          <RetentionChart data={retentionData} />
        </div>

        {/* DAU/MAU Line Chart */}
        <div className="grid grid-cols-1 mb-4">
          <DauMauChart data={dailyData} />
        </div>

        {/* World Heatmap */}
        <WorldHeatmap />
      </div>
    </div>
  );
}

export default App;
