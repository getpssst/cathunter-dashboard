import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

function toNum(v) {
  return Number.isFinite(v) ? v : 0;
}

export default function EngagementChart({ data }) {
  const chartData = (data || []).map((d, idx) => {
    const label = d?.label ?? d?.date ?? String(idx);
    const users = toNum(d.newUsers);
    const cats = toNum(d.newCats);
    const shots = toNum(d.shots);

    return {
      label,
      catsPerUser: users > 0 ? Math.round((cats / users) * 100) / 100 : 0,
      shotsPerCat: cats > 0 ? Math.round((shots / cats) * 100) / 100 : 0,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Engagement Ratios
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="main"
            tick={{ fontSize: 10 }}
            width={36}
            domain={[0, 'dataMax + 1']}
          />
          <Tooltip
            formatter={(v, name) => [Number(v).toFixed(2), name]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            yAxisId="main"
            type="monotone"
            dataKey="catsPerUser"
            name="Cats/User"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="main"
            type="monotone"
            dataKey="shotsPerCat"
            name="Shots/Cat"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
