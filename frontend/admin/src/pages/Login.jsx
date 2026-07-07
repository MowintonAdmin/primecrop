import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || ''

  const handleGoogleSignIn = useCallback(async (idToken) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/google', { id_token: idToken })
      if (!data.is_admin) {
        toast.error('Admin access required')
        return
      }
      setAuth(data.access_token, {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        is_admin: data.is_admin,
      })
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }, [setAuth, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      if (!data.is_admin) {
        toast.error('Admin access required')
        return
      }
      setAuth(data.access_token, {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        is_admin: data.is_admin,
      })
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forest-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="PrimeCrop" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-white text-2xl font-bold">PrimeCrop Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your store</p>
        </div>

        {clientId && (
          <>
            <div className="mb-5">
              <GoogleSignInButton onCredential={handleGoogleSignIn} disabled={loading} />
            </div>
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide text-gray-400">
                <span className="bg-white px-3">Or sign in with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              placeholder="admin@theprimecrop.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">Password</label>
            <input
              type="password" required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary py-2.5">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
