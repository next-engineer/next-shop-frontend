// app/cart/CartContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export type CartItem = {
  id: number
  name: string
  price: number | string
  imageUrl?: string
  quantity: number
  size?: string
  color?: string
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: number, size?: string, color?: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCartItems((prev) => {
      const existIndex = prev.findIndex(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.color === item.color
      )

      if (existIndex > -1) {
        // 이미 같은 옵션의 상품이 있으면 수량만 증가
        const updated = [...prev]
        updated[existIndex] = {
          ...updated[existIndex],
          quantity: updated[existIndex].quantity + quantity,
        }
        return updated
      }

      // 새로운 옵션 조합이면 새로 추가
      return [...prev, { ...item, quantity }]
    })
  }

  const removeFromCart = (id: number, size?: string, color?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (i) =>
          !(i.id === id && i.size === size && i.color === color)
      )
    )
  }

  const clearCart = () => setCartItems([])

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
