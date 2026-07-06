import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/client'
import { useAuthStore } from './authStore'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      shipping_fee: 0,
      total: 0,
      item_count: 0,
      loading: false,

      fetchCart: async () => {
        if (!useAuthStore.getState().token) return
        set({ loading: true })
        try {
          const { data } = await api.get('/cart')
          set({ ...data, loading: false })
        } catch {
          set({ loading: false })
        }
      },

      addToCart: async (productId, quantity = 1) => {
        const { data } = await api.post('/cart/items', { product_id: productId, quantity })
        set({ ...data })
        return data
      },

      updateItem: async (itemId, quantity) => {
        const { data } = await api.put(`/cart/items/${itemId}`, { quantity })
        set({ ...data })
      },

      removeItem: async (itemId) => {
        const { data } = await api.delete(`/cart/items/${itemId}`)
        set({ ...data })
      },

      clearCart: async () => {
        await api.delete('/cart')
        set({ items: [], subtotal: 0, shipping_fee: 0, total: 0, item_count: 0 })
      },

      reset: () => set({ items: [], subtotal: 0, shipping_fee: 0, total: 0, item_count: 0 }),
    }),
    {
      name: 'primecrop-cart',
      partialize: (state) => ({ item_count: state.item_count }),
    }
  )
)
