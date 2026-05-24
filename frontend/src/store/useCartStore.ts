import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: string
  priceValue: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  subtotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (newItem) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      )

      if (existingIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingIndex].quantity += 1
        return { items: updatedItems }
      }

      return { items: [...state.items, { ...newItem, quantity: 1 }] }
    })
  },
  removeItem: (id, size, color) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.id === id &&
          item.size === size &&
          item.color === color
      )

      if (existingIndex > -1) {
        const item = state.items[existingIndex]
        if (item.quantity > 1) {
          const updatedItems = [...state.items]
          updatedItems[existingIndex].quantity -= 1
          return { items: updatedItems }
        } else {
          return {
            items: state.items.filter(
              (item) =>
                !(item.id === id && item.size === size && item.color === color)
            ),
          }
        }
      }
      return {}
    })
  },
  updateQuantity: (id, size, color, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    }))
  },
  clearCart: () => set({ items: [] }),
  subtotal: () => {
    return get().items.reduce((acc, item) => acc + item.priceValue * item.quantity, 0)
  },
}))
