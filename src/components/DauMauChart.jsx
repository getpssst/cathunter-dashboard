import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function DauMauChart({ data }) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5), // MM-DD
    dauMau: Math.round(d.dauMau * 100) / 100,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 col-span-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        DAU/MAU
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10 }}
            width={40}
            domain={[0, 0.4]}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip formatter={(v) => [v.toFixed(2), 'DAU/MAU']} />
          <Line
            type="monotone"
            dataKey="dauMau"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
