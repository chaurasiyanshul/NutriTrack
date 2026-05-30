import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddMeal from './pages/AddMeal.jsx'
import History from './pages/History.jsx'
import Profile from './pages/Profile.jsx'

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner"></div></div>
  return token ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { token } = useAuth()

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-meal" element={<ProtectedRoute><AddMeal /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
