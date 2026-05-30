import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { nutritionAPI, mealAPI } from '../api/index.js'
import { useAuth } from '../context/AuthContext.jsx'
import NutrientBar from '../components/NutrientBar.jsx'
import DeficiencyAlert from '../components/DeficiencyAlert.jsx'
import NutrientChart from '../components/NutrientChart.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [daily, setDaily] = useState(null)
  const [weekly, setWeekly] = useState([])
  const [meals, setMeals] = useState([])
  const [recommendations, setRecommendations] = useState({})
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [dailyRes, weeklyRes, mealsRes, recsRes] = await Promise.all([
        nutritionAPI.daily(today),
        nutritionAPI.weekly(),
        mealAPI.list(today),
        nutritionAPI.recommendations(today),
      ])
      setDaily(dailyRes.data)
      setWeekly(weeklyRes.data)
      setMeals(mealsRes.data)
      setRecommendations(recsRes.data)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p style={{ color: '#94a3b8' }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const mealTypeIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍿' }
  const deficiencies = daily?.deficiencies || []
  const deficientCount = deficiencies.filter(d => d.status === 'deficient').length

  return (
    <div className="page-container pb-12">
      {/* Header */}
      <div className="mb-8 animate-fade-in" style={{ opacity: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#f1f5f9' }}>
          Welcome back, <span className="gradient-text">{user?.first_name || user?.username}</span> 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#94a3b8' }}>
          Here's your nutrition summary for today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Calories', value: `${Math.round(daily?.total_calories || 0)}`, unit: 'kcal', icon: '🔥', color: '#f59e0b' },
          { label: 'Meals Logged', value: meals.length, unit: 'today', icon: '🍽️', color: '#6366f1' },
          { label: 'Nutrients OK', value: deficiencies.filter(d => d.status === 'normal').length, unit: `of ${deficiencies.length}`, icon: '✅', color: '#22c55e' },
          { label: 'Deficiencies', value: deficientCount, unit: 'found', icon: deficientCount > 0 ? '⚠️' : '🎯', color: deficientCount > 0 ? '#ef4444' : '#22c55e' },
        ].map((stat, i) => (
          <div key={stat.label} className={`glass-card p-4 animate-fade-in stagger-${i + 1}`} style={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.unit}
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: '#64748b' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Nutrient Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Nutrient Bars */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
              <span>📊</span> Nutrient Intake
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deficiencies.map((d, i) => (
                <div key={d.nutrient} className={`stagger-${i + 1}`}>
                  <NutrientBar {...d} />
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
              <span>📈</span> Weekly Calorie Trend
            </h2>
            <NutrientChart data={weekly} title="Past 7 Days" />
          </div>
        </div>

        {/* Right Column: Alerts & Recommendations */}
        <div className="space-y-6">
          {/* Deficiency Alerts */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
              <span>🔔</span> Alerts
            </h2>
            <DeficiencyAlert deficiencies={deficiencies} />
          </div>

          {/* Today's Meals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: '#f1f5f9' }}>
                <span>🍽️</span> Today's Meals
              </h2>
              <Link to="/add-meal" className="text-xs font-medium px-3 py-1.5 rounded-lg no-underline"
                style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                + Add
              </Link>
            </div>
            {meals.length === 0 ? (
              <div className="glass-card p-5 text-center">
                <span className="text-3xl block mb-2">🍳</span>
                <p className="text-sm" style={{ color: '#94a3b8' }}>No meals logged today</p>
                <Link to="/add-meal" className="btn-primary mt-3 text-sm inline-block no-underline">
                  Log Your First Meal
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {meals.map((meal) => (
                  <div key={meal.id} className={`glass-card p-3 meal-${meal.meal_type}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{mealTypeIcons[meal.meal_type]}</span>
                        <span className="text-sm font-medium" style={{ color: '#f1f5f9' }}>
                          {meal.meal_type_display}
                        </span>
                      </div>
                      <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                        {meal.total_calories} kcal
                      </span>
                    </div>
                    {meal.items.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {meal.items.map((item) => (
                          <p key={item.id} className="text-xs flex justify-between" style={{ color: '#64748b' }}>
                            <span>{item.food_name}</span>
                            <span>{item.quantity_g}g</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Food Recommendations */}
          {Object.keys(recommendations).length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9' }}>
                <span>💡</span> Recommendations
              </h2>
              {Object.entries(recommendations).map(([nutrient, data]) => (
                <div key={nutrient} className="glass-card p-4 mb-3">
                  <h4 className="text-sm font-semibold mb-2" style={{ color: '#f87171' }}>
                    Boost your {nutrient}
                  </h4>
                  <div className="space-y-1.5">
                    {data.suggested_foods.slice(0, 3).map((food) => (
                      <div key={food.food_id} className="flex items-center justify-between text-xs">
                        <span style={{ color: '#f1f5f9' }}>{food.food_name}</span>
                        <span style={{ color: '#94a3b8' }}>
                          {food.amount_per_100g}{data.unit}/100g
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
