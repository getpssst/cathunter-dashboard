/**
 * Format a number with k/m/b suffix.
 * Max 4 chars including suffix letter.
 * If decimal is .0, show integer only.
 */
export function formatNumber(value) {
  if (value == null || !Number.isFinite(value)) return '—';
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return fmt(value / 1_000_000_000, 'b');
  }
  if (abs >= 1_000_000) {
    return fmt(value / 1_000_000, 'm');
  }
  if (abs >= 1_000) {
    return fmt(value / 1_000, 'k');
  }
  return String(Math.round(value));
}

function fmt(n, suffix) {
  // We want max 4 chars total including suffix, e.g. "1.2k", "20m", "335k", "1.1b"
  const abs = Math.abs(n);
  let s;
  if (abs >= 100) {
    // e.g. 335k, 202m — no room for decimal
    s = Math.round(n).toString();
  } else if (abs >= 10) {
    // e.g. 20.4m, 12.5m — 1 decimal
    const rounded = Math.round(n * 10) / 10;
    s = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
  } else {
    // e.g. 1.23k, 1.12b — up to 2 decimals but max 4 chars
    const rounded = Math.round(n * 100) / 100;
    if (rounded % 1 === 0) {
      s = rounded.toFixed(0);
    } else {
      // Try 2 decimals, if too long use 1
      const s2 = rounded.toFixed(2);
      s = (s2.length + 1 <= 5) ? s2 : rounded.toFixed(1);
      // Remove trailing .0
      if (s.endsWith('0') && s.includes('.')) {
        s = s.replace(/0+$/, '').replace(/\.$/, '');
      }
    }
  }
  return s + suffix;
}

/**
 * Format DAU/MAU ratio (0-1 range shown as ratio, or just the number).
 * Rounded to 2 decimal places.
 */
export function formatDauMau(value) {
  if (value == null || !Number.isFinite(value)) return '—';
  return value.toFixed(2);
}

/**
 * Format percentage change with sign
 */
export function formatChange(value) {
  if (value == null || !Number.isFinite(value)) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
