import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiPlus, FiEdit2, FiEyeOff, FiEye, FiSearch } from 'react-icons/fi'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function Products() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const page = parseInt(searchParams.get('page') || '1')

  const fetchProducts = () => {
    setLoading(true)
    const params = { page, page_size: 20 }
    if (search) params.search = search
    api.get('/products', { params }).then((res) => {
      setProducts(res.data.items)
      setTotal(res.data.total)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [page, searchParams.get('search')])

  const handleSearch = (e) => {
    e.preventDefault()
    const next = new URLSearchParams()
    if (search) next.set('search', search)
    setSearchParams(next)
  }

  const toggleActive = async (product) => {
    try {
      await api.put(`/products/${product.id}`, { is_active: !product.is_active })
      toast.success(`Product ${product.is_active ? 'deactivated' : 'activated'}`)
      fetchProducts()
    } catch {
      toast.error('Failed to update product')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/products/new" className="btn-primary flex items-center gap-2">
          <FiPlus size={14} /> New Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Search products..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <button type="submit" className="btn-outline">Search</button>
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Product', 'Category', 'Price', 'Stock', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-forest-50 shrink-0 flex items-center justify-center text-lg overflow-hidden">
                      {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : '🍄'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-900">RM {Number(p.effective_price).toFixed(2)}</span>
                  {p.sale_price && <span className="text-xs text-gray-400 line-through ml-1">RM {Number(p.price).toFixed(2)}</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${p.stock <= 10 ? 'text-red-600' : p.stock <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {p.is_featured && <span className="badge bg-yellow-100 text-yellow-700 ml-1">Featured</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/products/${p.id}/edit`} className="p-1.5 rounded text-gray-400 hover:text-forest-700 hover:bg-forest-50">
                      <FiEdit2 size={14} />
                    </Link>
                    <button onClick={() => toggleActive(p)} className={`p-1.5 rounded ${p.is_active ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}>
                      {p.is_active ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            <p>No products found</p>
            <Link to="/products/new" className="btn-primary mt-3 inline-flex items-center gap-1">
              <FiPlus size={14} /> Add Product
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
