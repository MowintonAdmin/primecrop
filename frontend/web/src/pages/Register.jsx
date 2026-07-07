import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const { fetchCart } = useCartStore()
  const navigate = useNavigate()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      setAuth(data.access_token, {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        is_admin: data.is_admin,
      })
      await fetchCart()
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
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
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }, [setAuth, fetchCart, navigate])

  return (
    <div className="pt-16 min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="PrimeCrop" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold text-charcoal">Join PrimeCrop</h1>
          <p className="text-gray-500 mt-1">Create your account to start shopping</p>
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
                <span className="bg-white px-3">Or register with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="input-field"
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
              placeholder="+60 11-XXXX XXXX"
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-forest-700 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
