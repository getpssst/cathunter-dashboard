import { useMemo } from 'react';
import { formatNumber } from '../utils/formatNumber';

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

function detectInsights(data) {
  if (!data || data.length < 2) return [];

  const candidates = [];
  const n = data.length;
  const ctx = 'globally';
  const period = 'last 30 days';

  const users = data.map((d) => safe(d.newUsers));
  const cats = data.map((d) => safe(d.newCats));
  const shots = data.map((d) => safe(d.shots));
  const dauMau = data.map((d) => safe(d.dauMau));
  const firstDate = data[0]?.date;
  const lastDate = data[n - 1]?.date;

  const totalUsers = sum(users);
  const totalCats = sum(cats);
  const totalShots = sum(shots);

  // --- 1. Biggest growth spike (rolling window) ---
  if (n >= 10) {
    const w = Math.min(7, Math.floor(n / 3));
    let best = { score: 0 };

    for (let i = w; i <= n - w; i++) {
      const before = avg(users.slice(i - w, i));
      const after = avg(users.slice(i, i + w));
      if (before > 0) {
        const change = ((after - before) / before) * 100;
        if (change > best.score) {
          best = {
            score: change,
            beforeAvg: Math.round(before),
            afterAvg: Math.round(after),
            fromDate: data[i - w]?.date,
            toDate: data[i + w - 1]?.date,
          };
        }
      }
    }

    if (best.score > 15) {
      candidates.push({
        type: 'positive',
        priority: best.score,
        text: `Growth spike ${fmtDateRange(best.fromDate, best.toDate)} ${ctx}: ${formatNumber(best.beforeAvg)} → ${formatNumber(best.afterAvg)} users/day (+${best.score.toFixed(0)}%)`,
      });
    }
  }

  // --- 2. Worst dip ---
  if (n >= 10) {
    const w = Math.min(7, Math.floor(n / 3));
    let worst = { score: 0 };

    for (let i = w; i <= n - w; i++) {
      const before = avg(users.slice(i - w, i));
      const after = avg(users.slice(i, i + w));
      if (before > 0) {
        const change = ((after - before) / before) * 100;
        if (change < worst.score) {
          worst = {
            score: change,
            beforeAvg: Math.round(before),
            afterAvg: Math.round(after),
            fromDate: data[i - w]?.date,
            toDate: data[i + w - 1]?.date,
          };
        }
      }
    }

    if (worst.score < -15) {
      candidates.push({
        type: 'negative',
        priority: Math.abs(worst.score),
        text: `Dip ${fmtDateRange(worst.fromDate, worst.toDate)} ${ctx}: ${formatNumber(worst.beforeAvg)} → ${formatNumber(worst.afterAvg)} users/day (${worst.score.toFixed(0)}%)`,
      });
    }
  }

  // --- 3. DAU/MAU movement ---
  if (n >= 7) {
    const q = Math.max(1, Math.floor(n / 4));
    const early = avg(dauMau.slice(0, q));
    const late = avg(dauMau.slice(-q));

    if (early > 0.01) {
      const change = ((late - early) / early) * 100;
      if (Math.abs(change) > 8) {
        const dir = change > 0 ? 'up' : 'down';
        candidates.push({
          type: change > 0 ? 'positive' : 'warning',
          priority: Math.abs(change) * 0.8,
          text: `DAU/MAU ${dir} ${ctx} (${period}): ${early.toFixed(2)} → ${late.toFixed(2)} (${change > 0 ? '+' : ''}${change.toFixed(0)}%)`,
        });
      }
    }
  }

  // --- 4. Record day ---
  if (n >= 3) {
    const maxIdx = users.indexOf(Math.max(...users));
    if (users[maxIdx] > 0) {
      candidates.push({
        type: 'info',
        priority: 30,
        text: `Peak ${fmtDate(data[maxIdx]?.date)} ${ctx}: ${formatNumber(users[maxIdx])} users, ${formatNumber(cats[maxIdx])} cats, ${formatNumber(shots[maxIdx])} shots`,
      });
    }
  }

  // --- 5. Stray/Home ratio ---
  if (totalCats > 0) {
    const totalStray = data.reduce((s, d) => s + safe(d.newCatsStray), 0);
    const strayPct = (totalStray / totalCats) * 100;
    if (strayPct > 70 || strayPct < 25) {
      const label = strayPct > 70
        ? `${strayPct.toFixed(0)}% strays ${ctx} — high street cat population`
        : `Only ${strayPct.toFixed(0)}% strays ${ctx} — mostly home cats`;
      candidates.push({
        type: 'info',
        priority: 20,
        text: label,
      });
    }
  }

  // --- 6. Shots volume trend ---
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
          text: `Photos ${ctx} (${period}): ${formatNumber(Math.round(earlyShots))}/day → ${formatNumber(Math.round(lateShots))}/day (+${change.toFixed(0)}%)`,
        });
      }
    }
  }

  // Pick top 3 by priority, ensuring type diversity
  candidates.sort((a, b) => b.priority - a.priority);
  const picked = [];
  const usedTypes = new Set();

  for (const c of candidates) {
    if (picked.length >= 3) break;
    // Allow max 2 of same type
    if (usedTypes.has(c.type) && picked.filter((p) => p.type === c.type).length >= 2) continue;
    picked.push(c);
    usedTypes.add(c.type);
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
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Key Insights for last 30 days</h3>
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
