"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  ensureCart as apiEnsureCart,
  createCart as apiCreateCart,
  addCartItem as apiAddCartItem,
  getCart as apiGetCart,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from "@/lib/api/purchase"

export type CartItem = {
  id: number
  name: string
  price: number
  imageUrl?: string
  quantity: number
  serverItemId?: number
  size?: string
  color?: string
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity" | "serverItemId">, quantityDelta: number) => Promise<void>
  removeFromCart: (productId: number, size?: string, color?: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("accessToken")
}

function loadGuestCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("cart")
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
function saveGuestCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("cart", JSON.stringify(items))
}

function mapServerCart(data: any): CartItem[] {
  const items = Array.isArray(data?.items) ? data.items : Array.isArray(data?.content) ? data.content : []
  return items.map((it: any) => {
    const product = it?.product ?? {}
    return {
      serverItemId: Number(it?.id ?? it?.itemId ?? it?.cartItemId),
      id: Number(it?.productId ?? product?.id),
      name: String(it?.name ?? product?.name ?? ""),
      price: Number(it?.price ?? product?.price ?? 0),
      imageUrl: it?.imageUrl ?? product?.imageUrl ?? "/placeholder.svg",
      quantity: Number(it?.quantity ?? 0),
      size: it?.size,
      color: it?.color,
    } as CartItem
  })
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [authed, setAuthed] = useState<boolean>(!!getToken())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "accessToken") setAuthed(!!getToken())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    const init = async () => {
      if (!authed) {
        const local = loadGuestCart()
        setItems(local)
        return
      }
      try {
        await apiEnsureCart()
        const server = await apiGetCart()
        const mapped = mapServerCart(server)
        setItems(mapped)
        saveGuestCart(mapped)
      } catch (e) {
        console.warn("[Cart] init failed, fallback to local:", e)
        const local = loadGuestCart()
        setItems(local)
      }
    }
    init()
  }, [authed])

  const addToCart = async (
      product: Omit<CartItem, "quantity" | "serverItemId">,
      quantityDelta: number
  ) => {
    if (quantityDelta <= 0) return

    // 낙관적 반영
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id && i.size === product.size && i.color === product.color)
      if (idx === -1) {
        const next = [...prev, { ...product, quantity: quantityDelta }]
        if (!authed) saveGuestCart(next) // 게스트 즉시 저장
        return next
      }
      const copy = [...prev]
      copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantityDelta }
      if (!authed) saveGuestCart(copy) // 게스트 즉시 저장
      return copy
    })

    if (!authed) return

    try {
      await apiEnsureCart()
      await apiAddCartItem(product.id, quantityDelta)
      const server = await apiGetCart()
      const mapped = mapServerCart(server)
      setItems(mapped)
      saveGuestCart(mapped)
    } catch (e: any) {
      console.error("[Cart] addToCart failed:", e?.response?.data || e?.message || e)
      alert("장바구니 반영에 실패했습니다.\n" + (e?.response?.data?.message || e?.message || "서버 오류"))
      try {
        const server = await apiGetCart()
        setItems(mapServerCart(server))
      } catch {}
    }
  }

  const removeFromCart = async (productId: number, size?: string, color?: string) => {
    // 낙관적 제거
    setItems(prev => {
      const next = prev.filter(i => !(i.id === productId && i.size === size && i.color === color))
      if (!authed) saveGuestCart(next) // 게스트 즉시 저장
      return next
    })

    if (!authed) return
    try {
      const currentServer = await apiGetCart()
      const mapped = mapServerCart(currentServer)
      const target = mapped.find(i => i.id === productId && i.size === size && i.color === color)
      if (target?.serverItemId) await apiRemoveCartItem(target.serverItemId)

      const serverAfter = await apiGetCart()
      const mappedAfter = mapServerCart(serverAfter)
      setItems(mappedAfter)
      saveGuestCart(mappedAfter)
    } catch (e) {
      console.error("[Cart] removeFromCart failed:", e)
      try {
        const server = await apiGetCart()
        setItems(mapServerCart(server))
      } catch {}
    }
  }

  const clearCart = async () => {
    setItems([])
    if (!authed) {
      saveGuestCart([])
      return
    }
    try {
      await apiClearCart()
      const serverAfter = await apiGetCart()
      const mappedAfter = mapServerCart(serverAfter)
      setItems(mappedAfter)
      saveGuestCart(mappedAfter)
    } catch (e) {
      console.error("[Cart] clearCart failed:", e)
      try {
        const server = await apiGetCart()
        setItems(mapServerCart(server))
      } catch {}
    }
  }

  const value = useMemo<CartContextType>(
      () => ({ cartItems: items, addToCart, removeFromCart, clearCart }),
      [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
