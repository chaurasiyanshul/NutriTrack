import { useState, useEffect } from 'react'
import { nutritionAPI } from '../api/index.js'
import NutrientChart from '../components/NutrientChart.jsx'
import { jsPDF } from 'jspdf'

export default function History() {
  const [range, setRange] = useState('weekly') // 'weekly' or 'monthly'
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    loadTrends()
  }, [range])

  const loadTrends = async () => {
    setLoading(true)
    try {
      const res = range === 'weekly'
        ? await nutritionAPI.weekly()
        : await nutritionAPI.monthly()
      setTrends(res.data)
    } catch (err) {
      console.error('Trends load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = () => {
    const doc = new jsPDF()
    const title = `NutriTrack - ${range === 'weekly' ? '7-Day' : '30-Day'} Nutrition Report`

    doc.setFontSize(18)
    doc.setTextColor(99, 102, 241)
    doc.text(title, 20, 25)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`, 20, 35)

    let y = 50
    doc.setFontSize(12)
    doc.setTextColor(30)

    trends.forEach((day, i) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      doc.setFont(undefined, 'bold')
      doc.text(`${day.date} — ${Math.round(day.total_calories)} kcal`, 20, y)
      y += 8

      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)

      if (day.deficiencies && day.deficiencies.length > 0) {
        const deficient = day.deficiencies.filter(d => d.status === 'deficient')
        if (deficient.length > 0) {
          doc.setTextColor(220, 50, 50)
          doc.text(`  Deficiencies: ${deficient.map(d => d.nutrient).join(', ')}`, 20, y)
          y += 6
        }

        const normal = day.deficiencies.filter(d => d.status === 'normal')
        if (normal.length > 0) {
          doc.setTextColor(34, 197, 94)
          doc.text(`  On Track: ${normal.map(d => d.nutrient).join(', ')}`, 20, y)
          y += 6
        }
      }

      doc.setTextColor(30)
      doc.setFontSize(12)
      y += 6
    })

    doc.save(`nutritrack-${range}-report.pdf`)
  }

  return (
    <div className="page-container pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold animate-fade-in" style={{ color: '#f1f5f9', opacity: 0 }}>
              📈 Nutrition History
            </h1>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
              Track your progress over time
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              {['weekly', 'monthly'].map((r) => (
                <button
                  key={r}
                  id={`range-${r}`}
                  onClick={() => setRange(r)}
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: range === r ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: range === r ? '#818cf8' : '#64748b',
                  }}
                >
                  {r === 'weekly' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
            <button id="download-report" onClick={downloadReport} className="btn-primary text-sm">
              📄 PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Chart */}
            <div className="mb-6">
              <NutrientChart data={trends} title={`${range === 'weekly' ? '7-Day' : '30-Day'} Calorie Trend`} />
            </div>

            {/* Daily Breakdown Table */}
            <div className="glass-card overflow-hidden animate-fade-in" style={{ opacity: 0, animationDelay: '0.2s' }}>
              <div className="p-4" style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                <h3 className="font-bold" style={{ color: '#f1f5f9' }}>Daily Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Date</th>
                      <th className="text-right px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Calories</th>
                      <th className="text-center px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Status</th>
                      <th className="text-right px-4 py-3 font-medium" style={{ color: '#94a3b8' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trends.map((day, i) => {
                      const deficient = day.deficiencies?.filter(d => d.status === 'deficient') || []
                      const hasData = day.total_calories > 0
                      return (
                        <tr key={day.date}
                          className="transition-colors cursor-pointer"
                          style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.2)' }}
                          onClick={() => setSelectedDay(selectedDay === i ? null : i)}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td className="px-4 py-3" style={{ color: '#f1f5f9' }}>
                            {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </td>
                          <td className="px-4 py-3 text-right font-mono" style={{ color: hasData ? '#f1f5f9' : '#64748b' }}>
                            {Math.round(day.total_calories)} kcal
                          </td>
                          <td className="px-4 py-3 text-center">
                            {!hasData ? (
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(100,116,139,0.15)', color: '#64748b' }}>No data</span>
                            ) : deficient.length > 0 ? (
                              <span className="badge-deficient text-xs px-2 py-0.5 rounded-full">
                                {deficient.length} deficient
                              </span>
                            ) : (
                              <span className="badge-normal text-xs px-2 py-0.5 rounded-full">On Track</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-xs" style={{ color: '#64748b' }}>
                              {selectedDay === i ? '▲' : '▼'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Expanded Detail */}
              {selectedDay !== null && trends[selectedDay] && (
                <div className="p-4 animate-slide-in" style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderTop: '1px solid rgba(99, 102, 241, 0.15)'
                }}>
                  <h4 className="font-semibold text-sm mb-3" style={{ color: '#f1f5f9' }}>
                    Nutrient Details — {trends[selectedDay].date}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(trends[selectedDay].deficiencies || []).map((d) => (
                      <div key={d.nutrient} className="flex items-center justify-between p-2 rounded-lg"
                        style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                        <span className="text-xs font-medium" style={{ color: '#f1f5f9' }}>{d.nutrient}</span>
                        <span className={`badge-${d.status} text-xs px-1.5 py-0.5 rounded-full`}>
                          {d.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
