import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { foodAPI, mealAPI } from '../api/index.js'

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅', color: '#f59e0b' },
  { value: 'lunch', label: 'Lunch', icon: '☀️', color: '#22c55e' },
  { value: 'dinner', label: 'Dinner', icon: '🌙', color: '#6366f1' },
  { value: 'snack', label: 'Snack', icon: '🍿', color: '#ec4899' },
]

export default function AddMeal() {
  const navigate = useNavigate()
  const [mealType, setMealType] = useState('breakfast')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [foods, setFoods] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchFoods()
    } else {
      setFoods([])
      setShowDropdown(false)
    }
  }, [searchQuery])

  const searchFoods = async () => {
    setLoading(true)
    try {
      const res = await foodAPI.list({ search: searchQuery })
      setFoods(res.data.results || res.data)
      setShowDropdown(true)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addFoodItem = (food) => {
    setSelectedItems([...selectedItems, {
      food_item: food.id,
      food_name: food.name,
      calories_per_100g: food.calories_per_100g,
      category: food.category_display || food.category,
      quantity_g: food.default_serving_g || 100,
    }])
    setSearchQuery('')
    setShowDropdown(false)
  }

  const updateQuantity = (index, quantity) => {
    const updated = [...selectedItems]
    updated[index].quantity_g = parseFloat(quantity) || 0
    setSelectedItems(updated)
  }

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const totalCalories = selectedItems.reduce((sum, item) => {
    return sum + (item.calories_per_100g * item.quantity_g) / 100
  }, 0)

  const handleSave = async () => {
    if (selectedItems.length === 0) return
    setSaving(true)
    try {
      // Create or get meal
      const mealRes = await mealAPI.create({ date, meal_type: mealType })
      const mealId = mealRes.data.id

      // Add each item
      for (const item of selectedItems) {
        await mealAPI.addItem(mealId, {
          food_item: item.food_item,
          quantity_g: item.quantity_g,
        })
      }

      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save meal. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-fade-in" style={{ opacity: 0 }}>
          <span className="text-6xl block mb-4">✅</span>
          <h2 className="text-2xl font-bold" style={{ color: '#4ade80' }}>Meal Logged!</h2>
          <p className="mt-2" style={{ color: '#94a3b8' }}>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container pb-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 animate-fade-in" style={{ color: '#f1f5f9', opacity: 0 }}>
          🍽️ Log a Meal
        </h1>

        {/* Date & Meal Type */}
        <div className="glass-card p-5 mb-6 animate-fade-in" style={{ opacity: 0, animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Date</label>
              <input id="meal-date" type="date" className="input-field" value={date}
                onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Meal Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MEAL_TYPES.map((mt) => (
              <button
                key={mt.value}
                id={`meal-type-${mt.value}`}
                onClick={() => setMealType(mt.value)}
                className="p-3 rounded-xl text-center transition-all duration-200"
                style={{
                  background: mealType === mt.value ? `${mt.color}20` : 'rgba(30, 41, 59, 0.5)',
                  border: `2px solid ${mealType === mt.value ? mt.color : 'transparent'}`,
                  color: mealType === mt.value ? mt.color : '#94a3b8',
                }}
              >
                <span className="text-2xl block mb-1">{mt.icon}</span>
                <span className="text-sm font-medium">{mt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Search */}
        <div className="glass-card p-5 mb-6 animate-fade-in" style={{ opacity: 0, animationDelay: '0.2s' }}>
          <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
            Search Food Items
          </label>
          <div className="relative">
            <input
              ref={searchRef}
              id="food-search"
              type="text"
              className="input-field"
              placeholder="🔍 Type to search (e.g., Rice, Spinach, Chicken)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
              </div>
            )}

            {/* Dropdown */}
            {showDropdown && foods.length > 0 && (
              <div ref={dropdownRef}
                className="absolute z-40 w-full mt-2 rounded-xl overflow-hidden shadow-2xl"
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  backdropFilter: 'blur(20px)',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                {foods.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => addFoodItem(food)}
                    className="w-full flex items-center justify-between px-4 py-3 transition-colors text-left"
                    style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}
                    onMouseEnter={e => e.target.style.background = 'rgba(99, 102, 241, 0.1)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{food.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                        {food.category_display || food.category} • {food.is_vegetarian ? '🟢 Veg' : '🔴 Non-Veg'}
                      </p>
                    </div>
                    <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>
                      {food.calories_per_100g} kcal
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="glass-card p-5 mb-6 animate-fade-in" style={{ opacity: 0, animationDelay: '0.3s' }}>
            <h3 className="text-sm font-bold mb-3 flex items-center justify-between" style={{ color: '#f1f5f9' }}>
              <span>Selected Items ({selectedItems.length})</span>
              <span className="text-xs font-mono px-2 py-1 rounded-lg"
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                🔥 {Math.round(totalCalories)} kcal total
              </span>
            </h3>
            <div className="space-y-3">
              {selectedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(51, 65, 85, 0.3)',
                }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#f1f5f9' }}>{item.food_name}</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      {Math.round((item.calories_per_100g * item.quantity_g) / 100)} kcal
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="input-field w-20 text-center text-sm py-1.5"
                      value={item.quantity_g}
                      onChange={e => updateQuantity(i, e.target.value)}
                      min="1"
                    />
                    <span className="text-xs" style={{ color: '#64748b' }}>g</span>
                    <button onClick={() => removeItem(i)} className="btn-danger p-1.5 text-xs">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            id="save-meal"
            onClick={handleSave}
            className="btn-primary flex-1"
            disabled={selectedItems.length === 0 || saving}
          >
            {saving ? 'Saving...' : `Save Meal (${Math.round(totalCalories)} kcal)`}
          </button>
        </div>
      </div>
    </div>
  )
}
