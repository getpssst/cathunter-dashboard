import { formatNumber, formatDauMau, formatChange } from '../utils/formatNumber';

const cards = [
  { key: 'users', label: 'New Users', isDauMau: false },
  { key: 'cats', label: 'Cats', isDauMau: false },
  { key: 'shots', label: 'Shots', isDauMau: false },
  { key: 'dauMau', label: 'DAU/MAU', isDauMau: true },
];

export default function KpiCards({ kpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ key, label, isDauMau }) => {
        const data = kpis[key];
        if (!data) return null;
        const formatted = isDauMau
          ? formatDauMau(data.value)
          : formatNumber(data.value);
        const change = data.change;
        const isPositive = change != null && change >= 0;

        return (
          <div
            key={key}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            <div className="text-sm text-gray-500 mb-1">{label}</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatted}
              </span>
              {change != null && (
                <span
                  className={`text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {isPositive ? '▲' : '▼'} {formatChange(change)}
                </span>
              )}
            </div>
            {isDauMau && data.lastDate && (
              <div className="text-[11px] text-gray-400 mt-1">
                As of {data.lastDate} (trailing 30d)
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
