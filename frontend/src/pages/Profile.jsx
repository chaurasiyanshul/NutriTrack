import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { authAPI } from '../api/index.js'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    age: '', gender: 'male', weight_kg: '',
    activity_level: 'sedentary', dietary_preference: 'vegetarian'
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        age: user.profile?.age || '',
        gender: user.profile?.gender || 'male',
        weight_kg: user.profile?.weight_kg || '',
        activity_level: user.profile?.activity_level || 'sedentary',
        dietary_preference: user.profile?.dietary_preference || 'vegetarian',
      })
    }
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)
    try {
      const data = { ...form }
      if (data.age) data.age = parseInt(data.age)
      if (data.weight_kg) data.weight_kg = parseFloat(data.weight_kg)
      await authAPI.updateProfile(data)
      await updateUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const activityLabels = {
    sedentary: 'Sedentary',
    light: 'Lightly Active',
    moderate: 'Moderately Active',
    active: 'Very Active',
    extra: 'Extra Active',
  }

  const dietLabels = {
    vegetarian: 'Vegetarian',
    non_vegetarian: 'Non-Vegetarian',
    vegan: 'Vegan',
    eggetarian: 'Eggetarian',
  }

  return (
    <div className="page-container pb-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 animate-fade-in" style={{ color: '#f1f5f9', opacity: 0 }}>
          👤 Your Profile
        </h1>

        {/* User Card */}
        <div className="glass-card p-6 mb-6 animate-fade-in" style={{ opacity: 0, animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
              {(user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#f1f5f9' }}>
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-sm" style={{ color: '#94a3b8' }}>@{user?.username}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8'
                }}>
                  {activityLabels[user?.profile?.activity_level] || 'Sedentary'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                  background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80'
                }}>
                  {dietLabels[user?.profile?.dietary_preference] || 'Vegetarian'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="glass-card p-6 animate-fade-in" style={{ opacity: 0, animationDelay: '0.2s' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#f1f5f9' }}>Edit Profile</h3>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171'
            }}>{error}</div>
          )}

          {saved && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{
              background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80'
            }}>✅ Profile updated successfully!</div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>First Name</label>
                <input id="profile-firstname" type="text" className="input-field"
                  value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Last Name</label>
                <input id="profile-lastname" type="text" className="input-field"
                  value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Email</label>
              <input id="profile-email" type="email" className="input-field"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Age</label>
                <input id="profile-age" type="number" className="input-field" min="1" max="120"
                  value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Gender</label>
                <select id="profile-gender" className="input-field"
                  value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Weight (kg)</label>
                <input id="profile-weight" type="number" className="input-field" min="1" max="300" step="0.1"
                  value={form.weight_kg} onChange={e => setForm({ ...form, weight_kg: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Activity Level</label>
              <select id="profile-activity" className="input-field"
                value={form.activity_level} onChange={e => setForm({ ...form, activity_level: e.target.value })}>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Very Active (6-7 days/week)</option>
                <option value="extra">Extra Active (very hard exercise)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Dietary Preference</label>
              <select id="profile-diet" className="input-field"
                value={form.dietary_preference} onChange={e => setForm({ ...form, dietary_preference: e.target.value })}>
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="eggetarian">Eggetarian</option>
              </select>
            </div>

            <button id="profile-save" type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
