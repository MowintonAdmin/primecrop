import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, subtotal, shipping_fee, total, item_count, fetchCart, updateItem, removeItem, loading } = useCartStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) fetchCart()
  }, [token])

  const handleUpdateQty = async (item, delta) => {
    const newQty = item.quantity + delta
    if (newQty <= 0) {
      await removeItem(item.id)
      toast.success('Item removed')
    } else {
      try {
        await updateItem(item.id, newQty)
      } catch (err) {
        toast.error(err.response?.data?.detail || 'Failed to update')
      }
    }
  }

  const handleRemove = async (item) => {
    await removeItem(item.id)
    toast.success('Item removed from cart')
  }

  if (!token) {
    return (
      <div className="pt-16 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag size={60} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-charcoal mb-2">Sign in to view your cart</h2>
          <p className="text-gray-500 mb-5">Your cart items are saved when you sign in</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-forest-700 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <FiShoppingBag size={60} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-charcoal mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-5">Discover our premium mushroom collection</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4 shadow-sm">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-forest-50 shrink-0">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍄</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product.slug}`} className="font-semibold text-charcoal hover:text-forest-700 text-sm sm:text-base line-clamp-2">
                      {item.product.name}
                    </Link>
                    {item.product.weight && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.product.weight}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => handleUpdateQty(item, -1)} className="px-2 py-1 text-gray-500 hover:text-forest-700">
                          <FiMinus size={12} />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold min-w-[28px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-1 text-gray-500 hover:text-forest-700 disabled:opacity-30"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-forest-800 text-sm sm:text-base">
                          RM {(Number(item.product.effective_price) * item.quantity).toFixed(2)}
                        </span>
                        <button onClick={() => handleRemove(item)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-semibold text-charcoal text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({item_count} items)</span>
                    <span className="font-medium">RM {Number(subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shipping_fee == 0 ? 'text-forest-600 font-medium' : 'font-medium'}>
                      {Number(shipping_fee) === 0 ? 'FREE' : `RM ${Number(shipping_fee).toFixed(2)}`}
                    </span>
                  </div>
                  {Number(shipping_fee) > 0 && (
                    <p className="text-xs text-gray-400">
                      Add RM {(200 - Number(subtotal)).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-forest-800">RM {Number(total).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-primary mt-5 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <FiArrowRight />
                </button>
                <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-forest-700 mt-3">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
