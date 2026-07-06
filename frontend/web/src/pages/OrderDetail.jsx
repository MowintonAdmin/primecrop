import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiPackage } from 'react-icons/fi'
import api from '../api/client'

const STATUS_STEPS = ['pending', 'paid', 'processing', 'shipped', 'delivered']
const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  paid:       'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped:    'bg-purple-100 text-purple-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-forest-700 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="pt-20 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-charcoal">Order not found</p>
          <Link to="/dashboard" className="btn-primary mt-4">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="pt-16 min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-500 hover:text-forest-700 mb-6">
          <FiArrowLeft size={14} /> Back to My Account
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal">{order.order_number}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`badge text-sm py-1 px-3 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Progress */}
        {order.status !== 'cancelled' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i <= currentStep ? 'bg-forest-700 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 ${i < currentStep ? 'bg-forest-700' : 'bg-gray-100'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {STATUS_STEPS.map((step) => (
                <span key={step} className="text-xs text-gray-500 capitalize text-center flex-1">{step}</span>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
            <FiPackage size={15} /> Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-xl bg-forest-50 shrink-0 flex items-center justify-center text-xl overflow-hidden">
                  {item.product_image
                    ? <img src={item.product_image} alt="" className="w-full h-full object-cover rounded-xl" />
                    : '🍄'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-charcoal text-sm">{item.product_name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × RM {Number(item.unit_price).toFixed(2)}</p>
                </div>
                <span className="font-semibold text-charcoal text-sm">
                  RM {(item.quantity * Number(item.unit_price)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>RM {(Number(order.total_amount) - Number(order.shipping_fee)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{Number(order.shipping_fee) === 0 ? 'FREE' : `RM ${Number(order.shipping_fee).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t">
              <span>Total</span>
              <span className="text-forest-800">RM {Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-charcoal mb-3 text-sm">Shipping Address</h3>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-charcoal">{order.full_name}</p>
              <p>{order.phone}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.postal_code}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-charcoal mb-3 text-sm">Payment</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Method: <span className="capitalize font-medium text-charcoal">{order.payment_method?.replace('_', ' ')}</span></p>
              <p>Status: <span className={`badge ${order.payment_status === 'paid' ? 'badge-green' : 'badge-gold'}`}>{order.payment_status}</span></p>
              {order.payment_reference && <p>Reference: <span className="font-medium text-charcoal">{order.payment_reference}</span></p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
