import { useEffect, useState } from 'react'
import { FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetch = (q = '') => {
    setLoading(true)
    api.get('/admin/users', { params: { search: q || undefined } })
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleSearch = (e) => { e.preventDefault(); fetch(search) }

  const toggle = async (user) => {
    await api.put(`/admin/users/${user.id}/toggle-status`)
    toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`)
    fetch(search)
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative max-w-xs flex-1">
          <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-8 text-sm" placeholder="Search by name or email..." />
        </div>
        <button type="submit" className="btn-outline text-sm">Search</button>
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Customer', 'Phone', 'City', 'Joined', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded" /></td>)}
                </tr>
              ))
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{u.full_name || '—'}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{u.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{u.city || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(u.created_at).toLocaleDateString('en-MY')}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggle(u)}
                    className={`p-1.5 rounded ${u.is_active ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                    title={u.is_active ? 'Suspend user' : 'Activate user'}
                  >
                    {u.is_active ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && <p className="text-center py-8 text-gray-400 text-sm">No customers found</p>}
      </div>
    </div>
  )
}
