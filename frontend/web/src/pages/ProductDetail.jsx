import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiStar, FiShoppingCart, FiArrowLeft, FiMinus, FiPlus, FiTruck, FiShield } from 'react-icons/fi'
import api from '../api/client'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart } = useCartStore()
  const { token } = useAuthStore()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/products/${slug}`),
      api.get(`/products/${slug}/reviews`),
    ]).then(([prodRes, revRes]) => {
      setProduct(prodRes.data)
      setReviews(revRes.data)
    }).catch(() => navigate('/products'))
    .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please sign in first')
      navigate('/login')
      return
    }
    setAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
      toast.success(`Added ${quantity}x ${product.name} to cart`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const effectivePrice = product.sale_price || product.price
  const images = product.images?.length > 0 ? product.images : null

  return (
    <div className="pt-16 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/products" className="flex items-center gap-1 hover:text-forest-700">
            <FiArrowLeft size={14} /> Products
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-forest-700">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-charcoal font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-3">
              {images ? (
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-forest-50">
                  <span className="text-[120px]">🍄</span>
                </div>
              )}
            </div>
            {images && images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-forest-700' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Link to={`/products?category=${product.category.slug}`} className="text-forest-600 text-sm font-medium uppercase tracking-wide hover:underline">
                {product.category.name}
              </Link>
            )}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-1 mb-3">
              {product.name}
            </h1>

            {product.weight && (
              <p className="text-gray-500 text-sm mb-3">{product.weight}</p>
            )}

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <FiStar key={s} size={14} className={s <= Math.round(product.average_rating) ? 'text-gold-500 fill-gold-500' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{product.average_rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-forest-800">
                RM {Number(effectivePrice).toFixed(2)}
              </span>
              {product.sale_price && (
                <span className="text-lg text-gray-400 line-through">
                  RM {Number(product.price).toFixed(2)}
                </span>
              )}
              {product.sale_price && (
                <span className="badge bg-red-100 text-red-700 font-bold text-sm">
                  Save RM {(Number(product.price) - Number(product.sale_price)).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.short_description && (
              <p className="text-gray-600 leading-relaxed mb-5">{product.short_description}</p>
            )}

            {/* Health Benefits */}
            {product.health_benefits?.length > 0 && (
              <div className="bg-forest-50 rounded-xl p-4 mb-5">
                <p className="text-sm font-semibold text-forest-800 mb-2">Health Benefits</p>
                <ul className="space-y-1">
                  {product.health_benefits.map((b, i) => (
                    <li key={i} className="text-sm text-forest-700 flex items-center gap-2">
                      <span className="text-forest-500">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {product.tags.map((tag) => (
                  <span key={tag} className="badge badge-green">{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-forest-800"
                >
                  <FiMinus size={14} />
                </button>
                <span className="px-4 py-2 font-semibold text-charcoal min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-forest-800"
                  disabled={quantity >= product.stock}
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <FiShoppingCart size={16} />
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-5">
              {product.stock > 0 ? `${product.stock} items in stock` : 'Currently out of stock'}
            </p>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiTruck className="text-forest-600 shrink-0" />
                <span>Free shipping above RM200</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FiShield className="text-forest-600 shrink-0" />
                <span>100% quality guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-4">Product Description</h2>
            <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="font-serif text-2xl font-bold mb-6">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-charcoal text-sm">
                        {review.user?.full_name || 'Customer'}
                      </p>
                      <div className="flex mt-1">
                        {[1,2,3,4,5].map((s) => (
                          <FiStar key={s} size={12} className={s <= review.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-MY')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  )
}
