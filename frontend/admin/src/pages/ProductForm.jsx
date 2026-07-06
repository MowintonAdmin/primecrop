import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import toast from 'react-hot-toast'

const defaultForm = {
  name: '', slug: '', description: '', short_description: '',
  price: '', sale_price: '', stock: '', weight: '',
  category_id: '', images: '', tags: '', health_benefits: '',
  is_featured: false, is_active: true,
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(defaultForm)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data))
    if (isEdit) {
      setFetching(true)
      api.get('/products', { params: { page: 1, page_size: 1000 } }).then((res) => {
        const p = res.data.items.find((x) => x.id === id)
        if (p) setForm({
          name: p.name, slug: p.slug, description: p.description || '',
          short_description: p.short_description || '',
          price: p.price, sale_price: p.sale_price || '', stock: p.stock,
          weight: p.weight || '', category_id: p.category_id || '',
          images: (p.images || []).join('\n'),
          tags: (p.tags || []).join(', '),
          health_benefits: (p.health_benefits || []).join('\n'),
          is_featured: p.is_featured, is_active: p.is_active,
        })
      }).finally(() => setFetching(false))
    }
  }, [id])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleNameChange = (e) => {
    set('name', e.target.value)
    if (!isEdit) set('slug', slugify(e.target.value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      name: form.name, slug: form.slug,
      description: form.description || null,
      short_description: form.short_description || null,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      stock: parseInt(form.stock) || 0,
      weight: form.weight || null,
      category_id: form.category_id || null,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      health_benefits: form.health_benefits.split('\n').map((s) => s.trim()).filter(Boolean),
      is_featured: form.is_featured,
      is_active: form.is_active,
    }
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload)
        toast.success('Product updated!')
      } else {
        await api.post('/products', payload)
        toast.success('Product created!')
      }
      navigate('/products')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="animate-pulse card p-10 h-96" />

  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
              <input required value={form.name} onChange={handleNameChange} className="input" placeholder="e.g. Lion's Mane Fresh" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
              <input required value={form.slug} onChange={(e) => set('slug', e.target.value)} className="input" placeholder="lions-mane-fresh" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={form.category_id} onChange={(e) => set('category_id', e.target.value)} className="input">
                <option value="">Uncategorized</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Weight</label>
              <input value={form.weight} onChange={(e) => set('weight', e.target.value)} className="input" placeholder="e.g. 100g, 250g" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Short Description</label>
            <input value={form.short_description} onChange={(e) => set('short_description', e.target.value)} className="input" placeholder="Brief product summary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className="input" placeholder="Detailed product description..." />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price (RM) *</label>
              <input required type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className="input" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sale Price (RM)</label>
              <input type="number" step="0.01" min="0" value={form.sale_price} onChange={(e) => set('sale_price', e.target.value)} className="input" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
              <input required type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} className="input" placeholder="0" />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Media & Tags</h2>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Image URLs (one per line)</label>
            <textarea rows={3} value={form.images} onChange={(e) => set('images', e.target.value)} className="input font-mono text-xs" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className="input" placeholder="organic, premium, lion's mane" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Health Benefits (one per line)</label>
            <textarea rows={3} value={form.health_benefits} onChange={(e) => set('health_benefits', e.target.value)} className="input" placeholder="Boosts cognitive function&#10;Supports immune system&#10;Rich in antioxidants" />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Settings</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="w-4 h-4 accent-forest-700" />
              <span className="text-sm font-medium text-gray-700">Active (visible in store)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="w-4 h-4 accent-gold-600" />
              <span className="text-sm font-medium text-gray-700">Featured on homepage</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/products')} className="btn-outline px-6 py-2.5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
