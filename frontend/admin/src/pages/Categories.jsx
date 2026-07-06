import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiEyeOff, FiEye } from 'react-icons/fi'
import api from '../api/client'
import toast from 'react-hot-toast'

const defaultForm = { name: '', slug: '', description: '', image_url: '', sort_order: 0, is_active: true }

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)

  const fetch = () => api.get('/categories').then((r) => setCategories(r.data))

  useEffect(() => { fetch() }, [])

  const openNew = () => { setEditing(null); setForm(defaultForm); setShowForm(true) }
  const openEdit = (cat) => { setEditing(cat); setForm({ ...cat, image_url: cat.image_url || '', description: cat.description || '' }); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, sort_order: parseInt(form.sort_order) || 0 }
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, payload)
        toast.success('Category updated!')
      } else {
        await api.post('/categories', payload)
        toast.success('Category created!')
      }
      setShowForm(false)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const toggle = async (cat) => {
    await api.put(`/categories/${cat.id}`, { is_active: !cat.is_active })
    fetch()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <FiPlus size={14} /> New Category
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) }) }} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Category', 'Slug', 'Products', 'Status', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-600">{cat.product_count}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded text-gray-400 hover:text-forest-700 hover:bg-forest-50">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => toggle(cat)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50">
                      {cat.is_active ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">No categories yet</p>
        )}
      </div>
    </div>
  )
}
