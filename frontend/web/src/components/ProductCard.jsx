import { Link } from 'react-router-dom'
import { FiShoppingCart, FiStar } from 'react-icons/fi'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const effectivePrice = product.sale_price || product.price
  const discount = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.error('Please sign in to add items to cart')
      navigate('/login')
      return
    }
    try {
      await addToCart(product.id, 1)
      toast.success(`${product.name} added to cart`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add to cart')
    }
  }

  const mainImage = product.images?.[0] || null

  return (
    <Link to={`/products/${product.slug}`} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-forest-50">
            <span className="text-5xl">🍄</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount && (
            <span className="badge bg-red-500 text-white font-bold">
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="badge bg-gold-500 text-white font-semibold">
              Featured
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-500 text-white">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-forest-600 font-medium uppercase tracking-wide mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="font-semibold text-charcoal text-sm leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>

        {product.weight && (
          <p className="text-xs text-gray-500 mb-2">{product.weight}</p>
        )}

        {/* Rating */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <FiStar size={11} className="text-gold-500 fill-gold-500" />
            <span className="text-xs text-gray-600 font-medium">{product.average_rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.review_count})</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-base font-bold text-forest-800">
              RM {Number(effectivePrice).toFixed(2)}
            </span>
            {product.sale_price && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                RM {Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2 rounded-lg bg-forest-800 text-white hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Add to cart"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  )
}
