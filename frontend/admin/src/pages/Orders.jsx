import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiSearch, FiChevronRight } from 'react-icons/fi'
import api from '../api/client'

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  paid:       'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}

const STATUSES = ['', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  const page = parseInt(searchParams.get('page') || '1')
  const status = searchParams.get('status') || ''

  useEffect(() => {
    setLoading(true)
    const params = { page, page_size: 20 }
    if (status) params.status = status
    if (search) params.search = search
    api.get('/admin/orders', { params }).then((res) => {
      setOrders(res.data.items)
      setTotal(res.data.total)
    }).finally(() => setLoading(false))
  }, [page, status])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (status) params.status = status
    if (search) params.search = search
    setSearchParams(params)
  }

  const updateStatus = (next) => {
    const p = new URLSearchParams(searchParams)
    if (next) p.set('status', next); else p.delete('status')
    p.delete('page')
    setSearchParams(p)
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Orders <span className="text-sm font-normal text-gray-500">({total})</span></h1>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s || 'all'}
              onClick={() => updateStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                status === s ? 'bg-forest-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-forest-400'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
          <div className="relative">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-8 w-48 text-xs" placeholder="Order # or name..." />
          </div>
          <button type="submit" className="btn-outline text-xs">Search</button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded" /></td>)}
                </tr>
              ))
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-forest-700">{o.order_number}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 text-xs">{o.full_name}</p>
                  <p className="text-gray-400 text-xs">{o.phone}</p>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">RM {Number(o.total_amount).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {o.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-800'}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(o.created_at).toLocaleDateString('en-MY')}
                </td>
                <td className="px-4 py-3">
                  <Link to={`/orders/${o.id}`} className="p-1.5 rounded text-gray-400 hover:text-forest-700 hover:bg-forest-50 inline-block">
                    <FiChevronRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && (
          <p className="text-center py-10 text-gray-400 text-sm">No orders found</p>
        )}
      </div>
    </div>
  )
}
