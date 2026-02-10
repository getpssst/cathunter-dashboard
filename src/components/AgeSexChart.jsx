import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

// Round up to the nearest "nice" number (10, 20, 50, 100, 200, 500, 1000...)
function niceRound(val) {
  if (val <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(val)));
  const residual = val / magnitude;
  let nice;
  if (residual <= 1) nice = 1;
  else if (residual <= 2) nice = 2;
  else if (residual <= 5) nice = 5;
  else nice = 10;
  return nice * magnitude;
}

export default function AgeSexChart({ data }) {
  const chartData = data.map((d) => ({
    ageGroup: d.ageGroup,
    Female: -d.female,
    Male: d.male,
  }));

  const rawMax = Math.max(
    ...data.map((d) => Math.max(d.male, d.female))
  );

  // Round up to a nice number for axis domain
  const niceMax = niceRound(rawMax * 1.1);

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
            domain={[-niceMax, niceMax]}
            tickFormatter={(v) => Math.abs(Math.round(v))}
            allowDecimals={false}
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
