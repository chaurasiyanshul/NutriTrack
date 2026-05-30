import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Account, 2: Profile
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: '',
    age: '', gender: 'male', weight_kg: '',
    activity_level: 'sedentary', dietary_preference: 'vegetarian'
  })

  const updateForm = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = { ...form }
      if (data.age) data.age = parseInt(data.age)
      if (data.weight_kg) data.weight_kg = parseFloat(data.weight_kg)
      await register(data)
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        const firstError = Object.values(errors)[0]
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError))
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <div className="w-full max-w-lg animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🥗</span>
          <h1 className="text-3xl font-bold gradient-text">Join NutriTrack</h1>
          <p className="mt-2 text-sm" style={{ color: '#94a3b8' }}>
            Create your account and start tracking your nutrition
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: step >= s ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(51, 65, 85, 0.5)',
                  color: step >= s ? '#fff' : '#64748b',
                }}>
                {s}
              </div>
              <span className="text-sm hidden sm:inline" style={{ color: step >= s ? '#f1f5f9' : '#64748b' }}>
                {s === 1 ? 'Account' : 'Profile'}
              </span>
              {s < 2 && <div className="w-12 h-0.5 mx-2" style={{
                background: step > 1 ? '#6366f1' : 'rgba(51, 65, 85, 0.5)'
              }} />}
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="space-y-4 animate-slide-in">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#f1f5f9' }}>Account Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>First Name</label>
                    <input id="reg-firstname" type="text" className="input-field" placeholder="John"
                      value={form.first_name} onChange={e => updateForm('first_name', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Last Name</label>
                    <input id="reg-lastname" type="text" className="input-field" placeholder="Doe"
                      value={form.last_name} onChange={e => updateForm('last_name', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Username *</label>
                  <input id="reg-username" type="text" className="input-field" placeholder="johndoe" required
                    value={form.username} onChange={e => updateForm('username', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Email *</label>
                  <input id="reg-email" type="email" className="input-field" placeholder="john@example.com" required
                    value={form.email} onChange={e => updateForm('email', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Password *</label>
                    <input id="reg-password" type="password" className="input-field" placeholder="••••••" required
                      value={form.password} onChange={e => updateForm('password', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Confirm *</label>
                    <input id="reg-password2" type="password" className="input-field" placeholder="••••••" required
                      value={form.password2} onChange={e => updateForm('password2', e.target.value)} />
                  </div>
                </div>
                <button type="button" className="btn-primary w-full mt-2" onClick={() => {
                  if (!form.username || !form.email || !form.password || !form.password2) {
                    setError('Please fill in all required fields')
                    return
                  }
                  if (form.password !== form.password2) {
                    setError('Passwords do not match')
                    return
                  }
                  setError('')
                  setStep(2)
                }}>
                  Continue →
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-slide-in">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#f1f5f9' }}>Your Profile</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Age</label>
                    <input id="reg-age" type="number" className="input-field" placeholder="25" min="1" max="120"
                      value={form.age} onChange={e => updateForm('age', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Weight (kg)</label>
                    <input id="reg-weight" type="number" className="input-field" placeholder="70" min="1" max="300" step="0.1"
                      value={form.weight_kg} onChange={e => updateForm('weight_kg', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Gender</label>
                  <select id="reg-gender" className="input-field" value={form.gender}
                    onChange={e => updateForm('gender', e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Activity Level</label>
                  <select id="reg-activity" className="input-field" value={form.activity_level}
                    onChange={e => updateForm('activity_level', e.target.value)}>
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                    <option value="extra">Extra Active (very hard exercise)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Dietary Preference</label>
                  <select id="reg-diet" className="input-field" value={form.dietary_preference}
                    onChange={e => updateForm('dietary_preference', e.target.value)}>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="eggetarian">Eggetarian</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" className="btn-secondary flex-1" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button id="reg-submit" type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: '#818cf8' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
