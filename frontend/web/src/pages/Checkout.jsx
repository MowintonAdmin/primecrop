import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import api from '../api/client'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { value: 'online_banking', label: 'Online Banking (FPX)', icon: '🏦' },
  { value: 'ewallet', label: 'E-Wallet (Touch \'n Go / GrabPay)', icon: '📱' },
  { value: 'credit_card', label: 'Credit / Debit Card', icon: '💳' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏧' },
]

const MALAYSIA_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka',
  'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya',
  'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
]

export default function Checkout() {
  const { items, subtotal, shipping_fee, total, fetchCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postal_code: user?.postal_code || '',
    payment_method: 'online_banking',
    notes: '',
  })

  useEffect(() => {
    fetchCart()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await api.post('/orders', form)
      await fetchCart()
      toast.success('Order placed successfully!')
      navigate(`/orders/${data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg text-charcoal mb-5">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input name="full_name" required value={form.full_name} onChange={handleChange} className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input name="phone" required value={form.phone} onChange={handleChange} className="input-field" placeholder="+60 11-XXXX XXXX" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input name="address" required value={form.address} onChange={handleChange} className="input-field" placeholder="Street address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input name="city" required value={form.city} onChange={handleChange} className="input-field" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select name="state" required value={form.state} onChange={handleChange} className="input-field">
                    <option value="">Select state</option>
                    {MALAYSIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                  <input name="postal_code" required value={form.postal_code} onChange={handleChange} className="input-field" placeholder="50000" maxLength={5} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className="input-field" placeholder="Any special instructions..." />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg text-charcoal mb-5">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.value} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    form.payment_method === method.value ? 'border-forest-700 bg-forest-50' : 'border-gray-200 hover:border-forest-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      checked={form.payment_method === method.value}
                      onChange={handleChange}
                      className="accent-forest-700"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="text-sm font-medium text-charcoal">{method.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                * Payment instructions will be sent to your email after order confirmation.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-semibold text-charcoal text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-10 h-10 rounded-lg bg-forest-50 shrink-0 flex items-center justify-center text-lg overflow-hidden">
                      {item.product.images?.[0]
                        ? <img src={item.product.images[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                        : '🍄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium shrink-0">
                      RM {(Number(item.product.effective_price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>RM {Number(subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={Number(shipping_fee) === 0 ? 'text-forest-600 font-medium' : ''}>
                    {Number(shipping_fee) === 0 ? 'FREE' : `RM ${Number(shipping_fee).toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-forest-800">RM {Number(total).toFixed(2)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full btn-primary mt-5"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
