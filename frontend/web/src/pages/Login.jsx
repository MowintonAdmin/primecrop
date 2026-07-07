import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const { fetchCart } = useCartStore()
  const navigate = useNavigate()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.access_token, {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        is_admin: data.is_admin,
      })
      await fetchCart()
      toast.success(`Welcome back, ${data.full_name || data.email}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = useCallback(async (idToken) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/google', { id_token: idToken })
      setAuth(data.access_token, {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        is_admin: data.is_admin,
      })
      await fetchCart()
      toast.success(`Welcome, ${data.full_name || data.email}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }, [setAuth, fetchCart, navigate])

  return (
    <div className="pt-16 min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="PrimeCrop" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold text-charcoal">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your PrimeCrop account</p>
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

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => toast('Contact us at hello@theprimecrop.com to reset your password')}
                className="text-xs text-forest-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-forest-700 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
