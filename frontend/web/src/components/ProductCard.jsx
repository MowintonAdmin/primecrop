import { Link } from 'react-router-dom'
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi'
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
    <Link to={`/products/${product.slug}`} className="group block overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-400">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-50 to-forest-100">
            <span className="text-5xl">🍄</span>
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-lg shadow-red-500/30">
              -{discount}%
            </span>
          )}
          {product.is_featured && !discount && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-gold-500 to-gold-400 text-white shadow-lg shadow-gold-500/30">
              Premium
            </span>
          )}
          {product.stock === 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-800/80 text-white">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist button */}
        {product.stock > 0 && (
          <div className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-300 shadow-lg">
            <FiHeart size={15} className="text-gray-400 hover:text-red-500 transition-colors" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {product.category && (
          <p className="text-[10px] text-forest-600 font-semibold uppercase tracking-[1.5px] mb-1.5">
            {product.category.name}
          </p>
        )}
        <h3 className="font-serif font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>

        {product.weight && (
          <p className="text-xs text-gray-400 mb-2.5">{product.weight}</p>
        )}

        {/* Rating */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1 mb-2.5">
            <FiStar size={11} className="text-gold-500 fill-gold-500" />
            <span className="text-xs text-gray-600 font-medium">{product.average_rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.review_count})</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-forest-800">
              RM {Number(effectivePrice).toFixed(2)}
            </span>
            {product.sale_price && (
              <span className="text-xs text-gray-400 line-through">
                RM {Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-9 h-9 rounded-xl bg-forest-800 text-white hover:bg-gold-500 hover:rotate-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-lg hover:shadow-gold-500/20"
            title="Add to cart"
          >
            <FiShoppingCart size={15} />
          </button>
        </div>
      </div>
    </Link>
  )
}