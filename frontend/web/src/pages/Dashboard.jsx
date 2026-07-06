import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiUser, FiEdit2, FiChevronRight } from 'react-icons/fi'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  paid:       'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}

export default function Dashboard() {
  const { user, updateUser } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postal_code: user?.postal_code || '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data.items)).finally(() => setLoadingOrders(false))
  }, [])

  useEffect(() => {
    setForm({
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      postal_code: user?.postal_code || '',
    })
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await api.put('/auth/me', form)
      updateUser({ ...user, ...data })
      setEditMode(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">My Account</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-charcoal flex items-center gap-2">
                  <FiUser size={16} /> Profile
                </h2>
                <button onClick={() => setEditMode(!editMode)} className="text-forest-700 hover:underline text-sm flex items-center gap-1">
                  <FiEdit2 size={13} /> {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-3">
                  {[
                    { name: 'full_name', label: 'Full Name', type: 'text' },
                    { name: 'phone', label: 'Phone', type: 'tel' },
                    { name: 'address', label: 'Address', type: 'text' },
                    { name: 'city', label: 'City', type: 'text' },
                    { name: 'state', label: 'State', type: 'text' },
                    { name: 'postal_code', label: 'Postal Code', type: 'text' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="text-xs text-gray-500 block mb-0.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={form[field.name]}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                        className="input-field !py-2 text-sm"
                      />
                    </div>
                  ))}
                  <button onClick={handleSave} disabled={saving} className="w-full btn-primary !py-2 text-sm mt-2">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
                    <p className="text-charcoal font-medium">{user?.full_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                    <p className="text-charcoal">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Phone</p>
                    <p className="text-charcoal">{user?.phone || '—'}</p>
                  </div>
                  {user?.address && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Address</p>
                      <p className="text-charcoal">{[user.address, user.city, user.state, user.postal_code].filter(Boolean).join(', ')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-charcoal flex items-center gap-2 mb-5">
                <FiPackage size={16} /> My Orders
              </h2>

              {loadingOrders ? (
                <div className="space-y-3">
                  {[1,2,3].map((i) => (
                    <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10">
                  <FiPackage size={36} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No orders yet</p>
                  <Link to="/products" className="btn-primary text-sm">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-forest-300 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-charcoal text-sm">{order.order_number}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{order.items?.length || 0} items
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-forest-800 text-sm">RM {Number(order.total_amount).toFixed(2)}</p>
                          <span className={`badge text-xs ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <FiChevronRight size={16} className="text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
