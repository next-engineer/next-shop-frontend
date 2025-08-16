"use client";
import { useEffect, useState } from "react";
import { getToken, logout } from "@/lib/api/client";

export function useAuth() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(getToken());
        const onStorage = (e: StorageEvent) => {
            if (e.key === "accessToken") setToken(getToken());
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return { token, isAuthed: !!token, logout };
}
