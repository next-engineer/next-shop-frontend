"use client"

import { createHttp } from "./http"
const http = createHttp("purchase")

function getCartId(): number | null {
    if (typeof window === "undefined") return null
    const v = localStorage.getItem("cartId")
    return v ? Number(v) : null
}
function setCartId(id?: number) {
    if (typeof window === "undefined") return
    if (id) localStorage.setItem("cartId", String(id))
}

/* Cart */
export async function getCart() {
    const res = await http.get("/api/carts")
    if (res?.data?.id) setCartId(res.data.id)
    return res.data
}
export async function addCartItem(productId: number, quantity = 1) {
    const res = await http.post(`/api/carts/${productId}/items`, { quantity })
    if (res?.data?.id) setCartId(res.data.id)
    return res.data
}
export async function changeCartQuantity(productId: number, quantity: number) {
    const res = await http.put(`/api/carts/${productId}`, { quantity })
    return res.data
}
export async function removeCartItem(cartItemId: number) {
    const res = await http.delete(`/api/carts/items/${cartItemId}`)
    return res.data
}
export async function clearCart() {
    const res = await http.delete("/api/carts")
    return res.data
}
export async function ensureCart() { await getCart(); return true }
export async function createCart() { return ensureCart() }

/* Orders */
type OrderItemInput = { productId: number; quantity: number }
type OrderCreateInput = {
    items: OrderItemInput[]
    deliveryAddress: string
    receiverName?: string
    receiverPhone?: string
    memo?: string
}
export async function getMyOrders() {
    const res = await http.get("/api/orders")
    return res.data
}
export async function getOrder(orderId: number) {
    const res = await http.get(`/api/orders/${orderId}`)
    return res.data
}
export async function createOrder(payload: OrderCreateInput) {
    const res = await http.post("/api/orders", payload)
    return res.data
}
export async function checkoutOrder(payload: {
    deliveryAddress: string
    receiverName?: string
    receiverPhone?: string
    memo?: string
}) {
    const res = await http.post("/api/orders/checkout", payload)
    return res.data
}
export async function updateOrderStatus(orderId: number, status: "CREATED" | "PAID" | "CANCELLED" | "FAILED") {
    const res = await http.patch(`/api/orders/${orderId}/status`, { status })
    return res.data
}
export async function deleteOrder(orderId: number) {
    const res = await http.delete(`/api/orders/${orderId}`)
    return res.data
}

/* Payments
   백엔드 스펙: { orderId, paymentMethod, paymentInfo }
   하위호환: { orderId, amount?, method?, maskedCardNumber?|cardNumber?|paymentInfo? }도 허용 → 변환
*/
type RequestPaymentCompat = {
    orderId: number
    paymentMethod?: string
    paymentInfo?: string
    amount?: number
    method?: string
    maskedCardNumber?: string
    cardNumber?: string
    accountNumber?: string
}
export async function requestPayment(payload: RequestPaymentCompat) {
    const orderId = Number(payload.orderId)
    const method =
        (payload.paymentMethod ?? payload.method ?? "").toString().toUpperCase() || "CARD"
    const rawInfo =
        payload.paymentInfo ??
        payload.cardNumber ??
        payload.accountNumber ??
        payload.maskedCardNumber ??
        ""
    const paymentInfo = String(rawInfo).replace(/\D/g, "")
    const body = { orderId, paymentMethod: method, paymentInfo }
    const res = await http.post("/api/payments", body)
    return res.data
}
export async function cancelPayment(paymentId: number) {
    const res = await http.post(`/api/payments/${paymentId}/cancel`)
    return res.data
}
export async function getPayment(paymentId: number) {
    const res = await http.get(`/api/payments/${paymentId}`)
    return res.data
}
export async function getPaymentsByOrder(orderId: number) {
    const res = await http.get(`/api/payments`, { params: { orderId } })
    return res.data
}

export const cartStorage = { getCartId, setCartId }
