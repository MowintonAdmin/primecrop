import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPackage, FiUser, FiEdit2, FiChevronRight, FiMail, FiPhone, FiMapPin, FiHeart, FiSettings, FiLogOut, FiShoppingCart, FiStar, FiTrash2, FiCamera, FiChevronDown } from 'react-icons/fi'
import api from '../api/client'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  paid:       'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-orange-50 text-orange-700 border-orange-200',
  shipped:    'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
}

const SIDEBAR_ITEMS = [
  { id: 'profile', label: 'Profile', icon: FiUser },
  { id: 'orders', label: 'Orders', icon: FiPackage },
  { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
  { id: 'settings', label: 'Settings', icon: FiSettings },
]

export default function Dashboard() {
  const { user, updateUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', city: '', state: '', postal_code: '' })
  const [saving, setSaving] = useState(false)
  const [orderFilter, setOrderFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/auth/me').then(r => r.data),
      api.get('/orders').then(r => r.data.items || []),
      api.get('/wishlist').then(r => r.data || []),
      api.get('/auth/me/stats').then(r => r.data),
    ])
    .then(([profileData, ordersData, wishlistData, statsData]) => {
      setProfile(profileData)
      setOrders(ordersData)
      setWishlist(wishlistData)
      setStats(statsData)
      setForm({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        postal_code: profileData.postal_code || '',
      })
    })
    .finally(() => setLoading(false))
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { data } = await api.put('/auth/me', form)
      updateUser({ ...user, ...data })
      setProfile(data)
      setEditMode(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const payload = {
      current_password: fd.get('current_password'),
      new_password: fd.get('new_password'),
    }
    if (payload.new_password.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    setSaving(true)
    try {
      await api.put('/auth/me/password', payload)
      toast.success('Password changed!')
      e.target.reset()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      setWishlist(prev => prev.filter(w => w.product_id !== productId))
      toast.success('Removed from wishlist')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const p = profile || user || {}
  const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter)

  const statCards = [
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: FiPackage, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', iconBg: 'text-emerald-600', change: '+2', changeType: 'up' },
    { label: 'Total Spent', value: `RM ${(stats?.total_spent || 0).toFixed(0)}`, icon: FiShoppingCart, color: 'from-amber-500 to-gold-600', bg: 'bg-amber-50', iconBg: 'text-amber-600', change: `+RM ${Math.min((stats?.total_spent || 0) * 0.15, 240).toFixed(0)}`, changeType: 'up' },
    { label: 'Wishlist', value: stats?.total_wishlist || 0, icon: FiHeart, color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', iconBg: 'text-rose-600', change: '+1', changeType: 'new' },
    { label: 'Points', value: Math.floor((stats?.total_spent || 0) / 10), icon: FiStar, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', iconBg: 'text-blue-600', change: 'Gold', changeType: 'tier' },
  ]

  const statusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <div className="pt-16 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex items-center gap-2 text-sm font-medium text-forest-800 bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm mb-4 w-full"
        >
          <FiUser size={16} />
          {SIDEBAR_ITEMS.find(t => t.id === activeTab)?.label || 'Menu'}
          <FiChevronDown size={14} className={`ml-auto transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex gap-6 lg:gap-8">
          {/* ═══ SIDEBAR ═══ */}
          <aside className={`
            lg:w-56 lg:block shrink-0
            ${sidebarOpen ? 'block' : 'hidden'}
            w-full lg:static
          `}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5 lg:sticky lg:top-24">
              {/* User mini profile */}
              <div className="text-center pb-5 border-b border-gray-100 mb-4">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-700 to-forest-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">{p.full_name?.charAt(0) || p.email?.charAt(0) || '?'}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-gold-500 border-2 border-white rounded-full flex items-center justify-center">
                    <FiCamera size={10} className="text-white" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm truncate">{p.full_name || 'User'}</h4>
                <p className="text-xs text-gray-400 truncate">{p.email}</p>
              </div>

              {/* Nav items */}
              <nav className="space-y-1">
                {SIDEBAR_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-forest-800 text-white shadow-md shadow-forest-800/20'
                        : 'text-gray-500 hover:bg-forest-50 hover:text-forest-800'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                    {item.id === 'orders' && orders.length > 0 && (
                      <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                        activeTab === item.id ? 'bg-white/20 text-white' : 'bg-forest-100 text-forest-800'
                      }`}>
                        {orders.length}
                      </span>
                    )}
                    {item.id === 'wishlist' && wishlist.length > 0 && (
                      <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                        activeTab === item.id ? 'bg-white/20 text-white' : 'bg-forest-100 text-forest-800'
                      }`}>
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="border-t border-gray-100 mt-4 pt-4">
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* ═══ MAIN CONTENT ═══ */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-5 animate-pulse">
                {/* Skeleton cover */}
                <div className="h-40 bg-gray-200 rounded-2xl" />
                {/* Skeleton stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-xl" />)}
                </div>
                <div className="h-48 bg-gray-200 rounded-2xl" />
              </div>
            ) : activeTab === 'profile' ? (
              /* ═══ PROFILE TAB ═══ */
              <div>
                {/* Cover */}
                <div className="relative bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 rounded-2xl p-6 sm:p-8 overflow-hidden mb-6">
                  <div className="absolute right-0 bottom-0 text-[160px] leading-none opacity-[0.06] pointer-events-none select-none">
                    🍄
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-1.5 mb-3">
                      <span className="text-gold-400 text-xs">🏆</span>
                      <span className="text-gold-300 text-xs font-medium">PrimeCrop Loyalty · {Math.floor((stats?.total_spent || 0) / 10)} Points</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">Welcome back, {p.full_name?.split(' ')[0] || 'there'}! 👋</h2>
                    <p className="text-white/60 text-sm mt-1">
                      {p.city ? `${p.city}, Malaysia` : 'Member'} 
                      {p.created_at ? ` · Member since ${new Date(p.created_at).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}` : ''}
                    </p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {statCards.map((stat, idx) => (
                    <div key={stat.label} className="group bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                      {/* Decorative ring */}
                      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full border-8 border-gray-50/50 group-hover:border-forest-50/80 transition-colors" />
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                          <stat.icon size={18} className={stat.iconBg} />
                        </div>
                        {stat.change && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            stat.changeType === 'up' ? 'bg-emerald-50 text-emerald-600' :
                            stat.changeType === 'new' ? 'bg-amber-50 text-amber-600' :
                            'bg-gold-100 text-gold-700'
                          }`}>
                            {stat.change}
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-gray-900 font-serif">{stat.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Profile details */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900">Profile Details</h3>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className={`text-sm flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                        editMode ? 'bg-gray-100 text-gray-600' : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
                      }`}
                    >
                      <FiEdit2 size={13} />
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'full_name', label: 'Full Name' },
                        { name: 'phone', label: 'Phone' },
                        { name: 'address', label: 'Address' },
                        { name: 'city', label: 'City' },
                        { name: 'state', label: 'State' },
                        { name: 'postal_code', label: 'Postal Code' },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="text-xs text-gray-500 block mb-1 font-medium">{field.label}</label>
                          <input
                            value={form[field.name]}
                            onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        </div>
                      ))}
                      <div className="md:col-span-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="w-full bg-forest-800 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { icon: FiMail, label: 'Email', value: p.email },
                        { icon: FiPhone, label: 'Phone', value: p.phone || '—' },
                        { icon: FiMapPin, label: 'Address', value: p.address ? [p.address, p.city, p.state, p.postal_code].filter(Boolean).join(', ') : '—' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl group hover:bg-forest-50 transition-colors">
                          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                            <item.icon size={15} className="text-gray-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                            <p className="text-sm text-gray-800 truncate">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'orders' ? (
              /* ═══ ORDERS TAB ═══ */
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FiPackage size={16} className="text-forest-600" />
                      My Orders
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Filter pills */}
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pending', label: 'Pending' },
                      { id: 'processing', label: 'Processing' },
                      { id: 'shipped', label: 'Shipped' },
                      { id: 'delivered', label: 'Delivered' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setOrderFilter(f.id)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all border ${
                          orderFilter === f.id
                            ? 'bg-forest-800 text-white border-forest-800 shadow-sm shadow-forest-800/20'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-forest-400 hover:text-forest-700'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FiPackage size={28} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium mb-1">No orders yet</p>
                      <p className="text-xs text-gray-400 mb-5">Start shopping to see your orders here</p>
                      <Link to="/products" className="inline-flex items-center gap-1.5 bg-forest-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-forest-700 transition-colors">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((order) => (
                        <Link
                          key={order.id}
                          to={`/orders/${order.id}`}
                          className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-forest-300 hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center shrink-0 group-hover:bg-forest-100 transition-colors">
                            <FiPackage size={18} className="text-forest-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{order.order_number}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(order.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {' · '}{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-forest-800 text-sm">RM {Number(order.total_amount).toFixed(2)}</p>
                            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border mt-1 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                              {statusLabel(order.status)}
                            </span>
                          </div>
                          <FiChevronRight size={15} className="text-gray-300 group-hover:text-forest-600 transition-colors shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'wishlist' ? (
              /* ═══ WISHLIST TAB ═══ */
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-6">
                    <FiHeart size={16} className="text-rose-500" />
                    My Wishlist
                    {wishlist.length > 0 && (
                      <span className="text-xs font-medium text-gray-400 ml-1">({wishlist.length})</span>
                    )}
                  </h3>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FiHeart size={28} className="text-rose-300" />
                      </div>
                      <p className="text-gray-500 font-medium mb-1">Your wishlist is empty</p>
                      <p className="text-xs text-gray-400 mb-5">Save your favorite products here</p>
                      <Link to="/products" className="inline-flex items-center gap-1.5 bg-forest-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-forest-700 transition-colors">
                        Browse Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-xl bg-forest-50 overflow-hidden shrink-0">
                              {item.product?.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">🍄</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/products/${item.product?.slug}`} className="font-medium text-gray-900 text-sm hover:text-forest-700 line-clamp-2">
                                {item.product?.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-forest-800 font-bold text-sm">
                                  RM {Number(item.product?.effective_price || item.product?.price || 0).toFixed(2)}
                                </span>
                                {item.product?.sale_price && (
                                  <span className="text-xs text-gray-400 line-through">RM {Number(item.product.price).toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveWishlist(item.product_id)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1 h-fit shrink-0"
                              title="Remove"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Link
                              to={`/products/${item.product?.slug}`}
                              className="flex-1 text-center text-xs font-medium py-2 border border-gray-200 rounded-lg text-gray-700 hover:border-forest-400 hover:text-forest-700 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ═══ SETTINGS TAB ═══ */
              <div className="max-w-xl">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                    <FiSettings size={16} className="text-gray-400" />
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1 font-medium">Current Password</label>
                      <input
                        type="password"
                        name="current_password"
                        required
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1 font-medium">New Password</label>
                      <input
                        type="password"
                        name="new_password"
                        required
                        minLength={8}
                        className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white"
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <button type="submit" disabled={saving} className="bg-forest-800 text-white rounded-lg py-2.5 px-5 text-sm font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50">
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}