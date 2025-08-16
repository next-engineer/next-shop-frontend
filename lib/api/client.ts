"use client";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
}

export function setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", token);
}

export function clearToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
}

export function logout() {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
}
