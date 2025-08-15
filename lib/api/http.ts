"use client";

import axios, { AxiosInstance } from "axios";

function baseURL(service: "test" | "user" | "purchase"): string {
    const test = process.env.NEXT_PUBLIC_TEST_API_BASE || "";
    const user = process.env.NEXT_PUBLIC_USER_API_BASE_URL || "";
    const purchase = process.env.NEXT_PUBLIC_PURCHASE_API_BASE_URL || "";
    if (service === "user") return user || test;
    if (service === "purchase") return purchase || test;
    return test;
}

export function createHttp(service: "test" | "user" | "purchase"): AxiosInstance {
    const http = axios.create({
        baseURL: baseURL("test"),
        withCredentials: true,
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
