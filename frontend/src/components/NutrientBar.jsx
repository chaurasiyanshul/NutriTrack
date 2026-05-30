export default function NutrientBar({ nutrient, intake, rda, percentage, status, unit }) {
  const getBarColor = () => {
    if (status === 'deficient') return 'linear-gradient(90deg, #ef4444, #f87171)'
    if (status === 'excess') return 'linear-gradient(90deg, #f59e0b, #fbbf24)'
    return 'linear-gradient(90deg, #22c55e, #4ade80)'
  }

  const getStatusEmoji = () => {
    if (status === 'deficient') return '⚠️'
    if (status === 'excess') return '📈'
    return '✅'
  }

  const clampedPercentage = Math.min(percentage, 150)

  return (
    <div className="glass-card p-4 animate-fade-in" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{getStatusEmoji()}</span>
          <span className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>{nutrient}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: '#94a3b8' }}>
            {intake.toFixed(1)}/{rda}{unit}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium badge-${status}`}
          >
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(51, 65, 85, 0.5)' }}>
        <div
          className="h-full rounded-full progress-bar-fill"
          style={{
            width: `${Math.min((clampedPercentage / 150) * 100, 100)}%`,
            background: getBarColor(),
          }}
        />
      </div>
    </div>
  )
}
