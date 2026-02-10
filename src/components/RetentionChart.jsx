import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

export default function RetentionChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Retention Curve
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10 }}
            label={{ value: 'Day', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#94a3b8' }}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            width={36}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(v) => [`${v}%`, 'Retention']}
            labelFormatter={(day) => `Day ${day}`}
          />
          <ReferenceLine y={50} stroke="#e2e8f0" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#8b5cf6' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
