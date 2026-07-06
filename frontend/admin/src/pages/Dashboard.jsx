import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingBag, FiDollarSign, FiUsers, FiPackage, FiAlertCircle, FiClock } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api/client'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  paid:       'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard/stats').then((res) => setStats(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card p-5 h-24" />)}
        </div>
      </div>
    )
  }

  const statCards = [
    { icon: FiShoppingBag, label: 'Total Orders',   value: stats?.total_orders,       color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: FiDollarSign,  label: 'Revenue (Paid)',  value: `RM ${Number(stats?.total_revenue || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, color: 'text-forest-700', bg: 'bg-forest-50' },
    { icon: FiUsers,       label: 'Customers',       value: stats?.total_users,        color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: FiPackage,     label: 'Active Products', value: stats?.total_products,     color: 'text-gold-600', bg: 'bg-yellow-50' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
            <FiClock size={18} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.pending_orders}</p>
            <p className="text-sm text-gray-500">Pending Orders</p>
          </div>
          <Link to="/orders?status=pending" className="ml-auto text-xs text-forest-700 hover:underline">View →</Link>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <FiAlertCircle size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats?.low_stock_products}</p>
            <p className="text-sm text-gray-500">Low Stock Products (≤10)</p>
          </div>
          <Link to="/products" className="ml-auto text-xs text-forest-700 hover:underline">View →</Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/orders" className="text-xs text-forest-700 hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {stats?.recent_orders?.length > 0 ? (
            stats.recent_orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div>
                  <Link to={`/orders/${order.id}`} className="font-medium text-sm text-gray-900 hover:text-forest-700">
                    {order.order_number}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{order.full_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-gray-900">
                    RM {Number(order.total_amount).toFixed(2)}
                  </span>
                  <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="p-8 text-center text-gray-400 text-sm">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
