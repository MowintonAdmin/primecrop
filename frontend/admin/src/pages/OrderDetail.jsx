import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import api from '../api/client'
import toast from 'react-hot-toast'

const ORDER_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']

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
  const [form, setForm] = useState({ status: '', payment_status: '', payment_reference: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get(`/admin/orders/${id}`).then((res) => {
      setOrder(res.data)
      setForm({ status: res.data.status, payment_status: res.data.payment_status, payment_reference: res.data.payment_reference || '' })
    }).finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put(`/admin/orders/${id}/status`, form)
      setOrder(data)
      toast.success('Order updated!')
    } catch {
      toast.error('Failed to update order')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse card p-10 h-96" />

  return (
    <div className="max-w-3xl space-y-5">
      <Link to="/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-forest-700">
        <FiArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{order.order_number}</h1>
          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString('en-MY')}</p>
        </div>
        <span className={`badge text-sm px-3 py-1 ${STATUS_COLORS[order.status]}`}>{order.status}</span>
      </div>

      {/* Update Status */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Update Order Status</h2>
        <form onSubmit={handleUpdate} className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Order Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input capitalize">
              {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Status</label>
            <select value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })} className="input">
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Reference</label>
            <input value={form.payment_reference} onChange={(e) => setForm({ ...form, payment_reference: e.target.value })} className="input" placeholder="Transaction ID" />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Update Order'}
            </button>
          </div>
        </form>
      </div>

      {/* Order Items */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="w-12 h-12 bg-forest-50 rounded-lg shrink-0 flex items-center justify-center text-xl overflow-hidden">
                {item.product_image ? <img src={item.product_image} alt="" className="w-full h-full object-cover" /> : '🍄'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} × RM {Number(item.unit_price).toFixed(2)}</p>
              </div>
              <span className="font-semibold text-sm">RM {(item.quantity * Number(item.unit_price)).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>RM {(Number(order.total_amount) - Number(order.shipping_fee)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span><span>{Number(order.shipping_fee) === 0 ? 'Free' : `RM ${Number(order.shipping_fee).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Total</span><span>RM {Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer & Shipping */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Customer</h3>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p className="font-medium text-gray-900">{order.full_name}</p>
            <p>{order.phone}</p>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Shipping Address</h3>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p>{order.address}</p>
            <p>{order.city}, {order.state} {order.postal_code}</p>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm">Notes</h3>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
