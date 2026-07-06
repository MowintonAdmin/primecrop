import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import api from '../api/client'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ total: 0, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const page = parseInt(searchParams.get('page') || '1')
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const featured = searchParams.get('featured') || ''
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page, page_size: 12, sort }
    if (category) params.category = category
    if (search) params.search = search
    if (featured) params.featured = featured
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice

    api.get('/products', { params })
      .then((res) => {
        setProducts(res.data.items)
        setPagination({ total: res.data.total, total_pages: res.data.total_pages })
      })
      .finally(() => setLoading(false))
  }, [page, category, search, featured, sort, minPrice, maxPrice])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  const clearFilters = () => setSearchParams({})

  const hasFilters = category || search || featured || minPrice || maxPrice

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-forest-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            {search ? `Search: "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : featured ? 'Featured Products' : 'All Products'}
          </h1>
          <p className="text-gray-300 mt-1 text-sm">{pagination.total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:border-forest-500 bg-white"
          >
            <FiFilter size={14} /> Filters
            {hasFilters && <span className="bg-forest-800 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>}
          </button>

          {/* Category pills */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', category === cat.slug ? '' : cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === cat.slug
                  ? 'bg-forest-800 text-white border-forest-800'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-forest-400'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium">Sort:</label>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price filter */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Price (RM)</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => updateParam('min_price', e.target.value)}
                className="input-field !py-2 w-28 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Price (RM)</label>
              <input
                type="number"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => updateParam('max_price', e.target.value)}
                className="input-field !py-2 w-28 text-sm"
              />
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-600 hover:underline pb-0.5">
                <FiX size={14} /> Clear all
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : hasFilters ? (
          <div className="text-center py-20">
            <span className="text-6xl">🍄</span>
            <p className="text-xl font-semibold text-gray-700 mt-4">No products found</p>
            <p className="text-gray-500 mt-1">Try adjusting your filters</p>
            <button onClick={clearFilters} className="btn-primary mt-5">Clear Filters</button>
          </div>
        ) : (
          /* Coming Soon — no products yet */
          <div className="relative overflow-hidden rounded-3xl bg-forest-950 px-6 py-20 text-center">
            {/* Background mushroom watermarks */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex items-center justify-center gap-6 flex-wrap overflow-hidden">
              {['🍄','🌿','🍄','🌱','🍄','🌿','🍄','🌱','🍄','🌿','🍄','🌱'].map((e, i) => (
                <span key={i} className="text-7xl">{e}</span>
              ))}
            </div>

            <div className="relative z-10 max-w-lg mx-auto">
              <span className="inline-block bg-gold-500/20 text-gold-300 text-xs font-bold px-4 py-1.5 rounded-full border border-gold-500/30 uppercase tracking-widest mb-6">
                Coming Soon
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Our Collection Is<br />
                <span className="text-gold-400">Being Cultivated</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-10">
                Premium mushrooms take time to grow to perfection.
                We're preparing Malaysia's finest selection — check back soon for an extraordinary harvest.
              </p>

              {/* Teaser product placeholders */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {[
                  { name: "Lion's Mane", icon: '🧠', benefit: 'Cognitive Health' },
                  { name: 'Reishi', icon: '🛡️', benefit: 'Immune Support' },
                  { name: 'Cordyceps', icon: '⚡', benefit: 'Energy & Stamina' },
                  { name: 'Shiitake', icon: '🌿', benefit: 'Culinary Premium' },
                ].map((item) => (
                  <div key={item.name} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/8 transition-colors">
                    <div className="w-11 h-11 bg-gold-500/10 rounded-xl flex items-center justify-center mx-auto mb-2 border border-gold-500/20">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <p className="text-white text-xs font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.benefit}</p>
                    <span className="inline-block mt-2 text-gold-400 text-xs font-medium border border-gold-500/30 rounded-full px-2 py-0.5">
                      Coming Soon
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-xs">
                Follow us at <span className="text-gold-400 font-medium">@theprimecrop</span> for launch updates
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(pagination.total_pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  next.set('page', i + 1)
                  setSearchParams(next)
                  window.scrollTo(0, 0)
                }}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${
                  page === i + 1
                    ? 'bg-forest-800 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-forest-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
