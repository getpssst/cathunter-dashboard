import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

export default function AgeSexChart({ data }) {
  const chartData = data.map((d) => ({
    ageGroup: d.ageGroup,
    Male: -d.male,
    Female: d.female,
  }));

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.male, d.female))
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        New Users&apos; Age/Sex
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          layout="vertical"
          barSize={14}
          barGap={-14}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 10 }}
            domain={[-maxVal * 1.1, maxVal * 1.1]}
            tickFormatter={(v) => Math.abs(v)}
          />
          <YAxis
            type="category"
            dataKey="ageGroup"
            tick={{ fontSize: 9 }}
            width={36}
          />
          <Tooltip formatter={(value, name) => [Math.abs(value), name]} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine x={0} stroke="#94a3b8" />
          <Bar dataKey="Male" fill="#3b82f6" />
          <Bar dataKey="Female" fill="#ec4899" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
