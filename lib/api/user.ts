"use client";

import { createHttp } from "./http";

const http = createHttp("user");

/** 로그인 */
export async function login(email: string, password: string) {
    const res = await http.post("/api/auth/login", { email, password });
    const header = res.headers?.authorization as string | undefined;
    const token =
        header?.startsWith("Bearer ") ? header.slice(7) : res.data?.accessToken;
    if (!token) throw new Error("토큰 없음");
    localStorage.setItem("accessToken", token);
    return res.data?.user;
}

/** 내 정보 */
export async function getMyProfile() {
    const res = await http.get("/api/users/me");
    return res.data;
}

/** 회원가입 */
export async function register(payload: {
    email: string;
    password: string;
    name: string;
    delivery_address: string;
    phone_number: string;
}) {
    return (await http.post("/api/users/register", payload)).data;
}
