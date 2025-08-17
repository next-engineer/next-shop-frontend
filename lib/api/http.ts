"use client";

import axios, { AxiosInstance } from "axios";

function baseURL(service: "base" | "user" | "purchase"): string {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const user = process.env.NEXT_PUBLIC_USER_API_BASE_URL || "";
    const purchase = process.env.NEXT_PUBLIC_PURCHASE_API_BASE_URL || "";
    if (service === "user") return user || base;
    if (service === "purchase") return purchase || base;
    return base;
}

export function createHttp(service: "base" | "user" | "purchase"): AxiosInstance {
    const http = axios.create({
        baseURL: baseURL(service) || "",
        withCredentials: false,
        headers: {
            "Content-Type": "application/json",
        },
    });

    http.interceptors.request.use((config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    http.interceptors.response.use(
        (res) => res,
        (err) => {
            if (err?.response?.status === 401 && typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
            }
            return Promise.reject(err);
        }
    );

    return http;
}
