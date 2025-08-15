"use client";

import { createHttp } from "./http";
const http = createHttp("purchase");

// Cart
export async function createCart() {
    const res = await http.post("/api/carts");
    return res.data;
}
export async function addCartItem(productId: number, quantity: number) {
    const res = await http.post("/api/carts/items", { productId, quantity });
    return res.data;
}
export async function getCart() {
    const res = await http.get("/api/carts");
    return res.data;
}
export async function clearCart() {
    const res = await http.delete("/api/carts");
    return res.data;
}

// Order
export async function createOrder(payload: any) {
    const res = await http.post("/api/orders", payload);
    return res.data;
}
export async function getMyOrders() {
    const res = await http.get("/api/orders");
    return res.data;
}

// Payment
export async function requestPayment(payload: any) {
    const res = await http.post("/api/payments", payload);
    return res.data;
}
export async function cancelPayment(paymentId: number) {
    const res = await http.post(`/api/payments/${paymentId}/cancel`);
    return res.data;
}
