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
  COUNTRIES,
  AGE_GROUPS,
} from './data/fakeData';

function App() {
  const [filters, setFilters] = useState({
    period: 'M',
    continent: 'ALL',
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

  // Full-year data for the same geo scope (to compute period ratio)
  const fullYearFiltered = useMemo(
    () => filterData(dailyData, { ...filters, period: 'ALL', platform: 'ALL' }),
    [filters.continent, filters.country]
  );

  const ageData = useMemo(() => {
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

    // Scale by period: ratio of users in selected period vs full year
    const fullUsers = fullYearFiltered.reduce((s, d) => s + d.newUsers, 0);
    const periodUsers = filtered.reduce((s, d) => s + d.newUsers, 0);
    let periodRatio = fullUsers > 0 ? periodUsers / fullUsers : 1;

    // Scale by platform
    let platformRatio = 1;
    if (filters.platform !== 'ALL') {
      const totIos = filtered.reduce((s, d) => s + d.newUsersIos, 0);
      const totAnd = filtered.reduce((s, d) => s + d.newUsersAndroid, 0);
      const total = totIos + totAnd;
      if (total > 0) {
        platformRatio = filters.platform === 'iOS' ? totIos / total : totAnd / total;
      }
    }

    const scale = periodRatio * platformRatio;
    if (scale === 1) return base;

    return base.map((d) => ({
      ageGroup: d.ageGroup,
      male: Math.max(1, Math.round(d.male * scale)),
      female: Math.max(1, Math.round(d.female * scale)),
    }));
  }, [filters, filtered, fullYearFiltered]);

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
