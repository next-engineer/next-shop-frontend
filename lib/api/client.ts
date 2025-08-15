"use client";

import axios, { AxiosInstance } from "axios";

const baseURL =
    process.env.NEXT_PUBLIC_TEST_API_BASE ||
    (typeof window !== "undefined" && (window as any).__API_BASE_URL__) ||
    "";

export const api: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
        }
        return Promise.reject(err);
    }
);

export async function loginApi(email: string, password: string) {
    const res = await api.post("/api/auth/login", { email, password });
    const header = res.headers?.authorization as string | undefined;
    const token =
        header?.startsWith("Bearer ") ? header.slice(7) : res.data?.accessToken;
    if (!token) throw new Error("토큰 없음");
    localStorage.setItem("accessToken", token);
    return res.data?.user;
}
