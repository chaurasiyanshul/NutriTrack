import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3" style={{ border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: '#f1f5f9' }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value} kcal
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function NutrientChart({ data, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p style={{ color: '#64748b' }}>No data available yet. Start logging meals!</p>
      </div>
    )
  }

  const chartData = data.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
    Calories: Math.round(day.total_calories || 0),
  }))

  return (
    <div className="glass-card p-5 animate-fade-in" style={{ opacity: 0 }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: '#f1f5f9' }}>
        {title || 'Calorie Trend'}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.5)" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          <Bar dataKey="Calories" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
