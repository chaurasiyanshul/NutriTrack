export default function DeficiencyAlert({ deficiencies }) {
  const deficient = deficiencies.filter(d => d.status === 'deficient')
  const excess = deficiencies.filter(d => d.status === 'excess')

  if (deficient.length === 0 && excess.length === 0) {
    return (
      <div className="glass-card p-5 animate-fade-in" style={{
        borderColor: 'rgba(34, 197, 94, 0.3)',
        opacity: 0,
      }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <h3 className="font-bold text-lg" style={{ color: '#4ade80' }}>All Nutrients on Track!</h3>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
              Your nutrient intake is within the recommended range. Keep it up!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {deficient.map((d, i) => (
        <div
          key={d.nutrient}
          className="glass-card p-4 animate-fade-in"
          style={{
            borderColor: 'rgba(239, 68, 68, 0.3)',
            opacity: 0,
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🔴</span>
            <div className="flex-1">
              <h4 className="font-semibold" style={{ color: '#f87171' }}>
                {d.message}
              </h4>
              <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
                You're only getting <strong style={{ color: '#f1f5f9' }}>{d.intake.toFixed(1)}{d.unit}</strong> out of{' '}
                <strong style={{ color: '#f1f5f9' }}>{d.rda}{d.unit}</strong> recommended daily ({d.percentage.toFixed(0)}%)
              </p>
            </div>
          </div>
        </div>
      ))}

      {excess.map((d, i) => (
        <div
          key={d.nutrient}
          className="glass-card p-4 animate-fade-in"
          style={{
            borderColor: 'rgba(245, 158, 11, 0.3)',
            opacity: 0,
            animationDelay: `${(deficient.length + i) * 0.1}s`,
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🟡</span>
            <div className="flex-1">
              <h4 className="font-semibold" style={{ color: '#fbbf24' }}>
                {d.message}
              </h4>
              <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
                You're getting <strong style={{ color: '#f1f5f9' }}>{d.intake.toFixed(1)}{d.unit}</strong> which exceeds the{' '}
                <strong style={{ color: '#f1f5f9' }}>{d.rda}{d.unit}</strong> recommended daily ({d.percentage.toFixed(0)}%)
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
