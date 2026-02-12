import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export default function UsersAndCatsChart({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">New Users &amp; Cats</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 10 }} width={40} />
          <Tooltip itemSorter={(item) => (item.dataKey === 'newUsers' ? 0 : 1)} />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            payload={[
              { value: 'New Users', type: 'rect', color: '#3b82f6' },
              { value: 'New Cats', type: 'rect', color: '#f97316' },
            ]}
          />
          <Bar dataKey="newUsers" name="New Users" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          <Bar dataKey="newCats" name="New Cats" fill="#f97316" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
