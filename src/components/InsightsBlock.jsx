import { useMemo } from 'react';
import { formatNumber } from '../utils/formatNumber';
import { COUNTRIES, countryDailyData } from '../data/fakeData';

function safe(v) {
  return Number.isFinite(v) ? v : 0;
}

function avg(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function sum(arr) {
  return arr.reduce((s, v) => s + v, 0);
}

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00Z');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function fmtDateRange(from, to) {
  if (!from || !to) return '';
  return `${fmtDate(from)} – ${fmtDate(to)}`;
}

// Scan per-country data for the biggest anomalies in last 30 days
function detectCountryAnomalies() {
  const spikes = [];
  const dips = [];

  for (const c of COUNTRIES) {
    const series = countryDailyData[c.code];
    if (!series || series.length < 14) continue;

    const last30 = series.slice(-30);
    const n = last30.length;
    if (n < 10) continue;

    const users = last30.map((d) => safe(d.newUsers));
    const totalAvg = avg(users);
    if (totalAvg < 5) continue; // Skip tiny countries

    const w = Math.min(5, Math.floor(n / 4));

    // Track best spike and worst dip per country
    let bestSpike = null;
    let worstDip = null;

    for (let i = w; i <= n - w; i++) {
      const before = avg(users.slice(Math.max(0, i - w), i));
      const after = avg(users.slice(i, i + w));
      if (before < 3) continue;

      const change = ((after - before) / before) * 100;
      const magnitude = Math.abs(change) * Math.log2(totalAvg + 1);

      if (change > 50 && (!bestSpike || change > bestSpike.change)) {
        bestSpike = {
          country: c.name, code: c.code, change,
          beforeAvg: Math.round(before), afterAvg: Math.round(after),
          fromDate: last30[i]?.date, toDate: last30[Math.min(i + w - 1, n - 1)]?.date,
          magnitude,
        };
      }
      if (change < -30 && (!worstDip || change < worstDip.change)) {
        worstDip = {
          country: c.name, code: c.code, change,
          beforeAvg: Math.round(before), afterAvg: Math.round(after),
          fromDate: last30[i]?.date, toDate: last30[Math.min(i + w - 1, n - 1)]?.date,
          magnitude,
        };
      }
    }

    if (bestSpike) spikes.push(bestSpike);
    if (worstDip) dips.push(worstDip);
  }

  spikes.sort((a, b) => b.magnitude - a.magnitude);
  dips.sort((a, b) => b.magnitude - a.magnitude);

  return { spikes, dips };
}

function detectInsights(data) {
  if (!data || data.length < 2) return [];

  const candidates = [];
  const n = data.length;

  const users = data.map((d) => safe(d.newUsers));
  const cats = data.map((d) => safe(d.newCats));
  const shots = data.map((d) => safe(d.shots));
  const dauMau = data.map((d) => safe(d.dauMau));

  // --- 1. Country-level spikes & dips ---
  const { spikes, dips } = detectCountryAnomalies();
  const usedCountries = new Set();

  if (spikes.length > 0) {
    const s = spikes[0];
    usedCountries.add(s.code);
    const multiplier = (s.afterAvg / s.beforeAvg).toFixed(1);
    candidates.push({
      type: 'positive',
      priority: 80 + s.magnitude * 0.1,
      text: `${s.country}: ${multiplier}x user spike ${fmtDateRange(s.fromDate, s.toDate)} (${formatNumber(s.beforeAvg)} → ${formatNumber(s.afterAvg)}/day)`,
    });
  }

  // Pick dip from a different country than the top spike
  const topDip = dips.find((d) => !usedCountries.has(d.code));
  if (topDip) {
    usedCountries.add(topDip.code);
    candidates.push({
      type: 'negative',
      priority: 70 + topDip.magnitude * 0.1,
      text: `${topDip.country}: ${topDip.change.toFixed(0)}% users ${fmtDateRange(topDip.fromDate, topDip.toDate)} (${formatNumber(topDip.beforeAvg)} → ${formatNumber(topDip.afterAvg)}/day)`,
    });
  }

  // Second spike from yet another country
  const spike2 = spikes.find((s) => !usedCountries.has(s.code));
  if (spike2) {
    usedCountries.add(spike2.code);
    candidates.push({
      type: 'positive',
      priority: 50 + spike2.magnitude * 0.1,
      text: `${spike2.country}: +${spike2.change.toFixed(0)}% users ${fmtDateRange(spike2.fromDate, spike2.toDate)} (${formatNumber(spike2.beforeAvg)} → ${formatNumber(spike2.afterAvg)}/day)`,
    });
  }

  // --- 2. DAU/MAU movement (global) ---
  if (n >= 7) {
    const q = Math.max(1, Math.floor(n / 4));
    const early = avg(dauMau.slice(0, q));
    const latest = dauMau[n - 1];

    if (early > 0.01) {
      const change = ((latest - early) / early) * 100;
      if (Math.abs(change) > 8) {
        const dir = change > 0 ? 'up' : 'down';
        candidates.push({
          type: change > 0 ? 'positive' : 'warning',
          priority: Math.abs(change) * 0.8,
          text: `DAU/MAU ${dir} globally: ${early.toFixed(2)} → ${latest.toFixed(2)} (${change > 0 ? '+' : ''}${change.toFixed(0)}%)`,
        });
      }
    }
  }

  // --- 3. Global peak day ---
  if (n >= 3) {
    const maxIdx = users.indexOf(Math.max(...users));
    if (users[maxIdx] > 0) {
      candidates.push({
        type: 'info',
        priority: 30,
        text: `Peak day ${fmtDate(data[maxIdx]?.date)}: ${formatNumber(users[maxIdx])} users, ${formatNumber(cats[maxIdx])} cats, ${formatNumber(shots[maxIdx])} shots`,
      });
    }
  }

  // --- 4. Stray/Home ratio ---
  const totalCats = sum(cats);
  if (totalCats > 0) {
    const totalStray = data.reduce((s, d) => s + safe(d.newCatsStray), 0);
    const strayPct = (totalStray / totalCats) * 100;
    if (strayPct > 70 || strayPct < 25) {
      const label = strayPct > 70
        ? `${strayPct.toFixed(0)}% strays globally — high street cat population`
        : `Only ${strayPct.toFixed(0)}% strays globally — mostly home cats`;
      candidates.push({
        type: 'info',
        priority: 20,
        text: label,
      });
    }
  }

  // --- 5. Photos volume trend ---
  if (n >= 14) {
    const q = Math.max(1, Math.floor(n / 4));
    const earlyShots = avg(shots.slice(0, q));
    const lateShots = avg(shots.slice(-q));
    if (earlyShots > 0) {
      const change = ((lateShots - earlyShots) / earlyShots) * 100;
      if (change > 40) {
        candidates.push({
          type: 'positive',
          priority: change * 0.5,
          text: `Photos globally: ${formatNumber(Math.round(earlyShots))}/day → ${formatNumber(Math.round(lateShots))}/day (+${change.toFixed(0)}%)`,
        });
      }
    }
  }

  // Pick top 3, max 2 of same type
  candidates.sort((a, b) => b.priority - a.priority);
  const picked = [];

  for (const c of candidates) {
    if (picked.length >= 3) break;
    if (picked.filter((p) => p.type === c.type).length >= 2) continue;
    picked.push(c);
  }

  return picked;
}

const TYPE_STYLES = {
  positive: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '▲', iconColor: 'text-emerald-600' },
  negative: { bg: 'bg-red-50', border: 'border-red-200', icon: '▼', iconColor: 'text-red-500' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '●', iconColor: 'text-amber-500' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '◆', iconColor: 'text-blue-500' },
};

export default function InsightsBlock({ data }) {
  const insights = useMemo(() => detectInsights(data), [data]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">AI Insights — last 30 days</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {insights.map((insight, i) => {
          const style = TYPE_STYLES[insight.type] || TYPE_STYLES.info;
          return (
            <div
              key={i}
              className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border text-sm leading-snug ${style.bg} ${style.border}`}
            >
              <span className={`${style.iconColor} text-xs mt-0.5 flex-shrink-0`}>{style.icon}</span>
              <span className="text-gray-700">{insight.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
