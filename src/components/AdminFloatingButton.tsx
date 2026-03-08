"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default function AdminFloatingButton() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // If you use a context or local storage for auth, check that.
                // Otherwise, you might check the API or token
                const isAuth = localStorage.getItem("isAuthenticated");
                if (!isAuth) {
                    setIsAdmin(false);
                    return;
                }

                console.log("AdminFloatingButton: Checking auth status...");
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                console.log("AdminFloatingButton Auth Response:", res.status, data);

                if (res.ok && data.success) {
                    if (data.user?.role === "admin") {
                        console.log("AdminFloatingButton: User is admin, setting visible.");
                        setIsAdmin(true);
                    } else {
                        console.log("AdminFloatingButton: User is NOT admin.", data.user);
                        setIsAdmin(false);
                    }
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("AdminFloatingButton Error:", err);
            } finally {
                setIsVisible(true);
            }
        };
        checkAuth();
    }, [pathname]);

    if (!isVisible || !isAdmin || pathname.startsWith("/admin")) return null;

    return (
        <Link
            href="/admin"
            className="fixed top-24 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 group flex items-center justify-center"
            title="Admin Dashboard"
        >
            <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 whitespace-nowrap transition-all duration-300 font-semibold text-sm">
                Admin Dashboard
            </span>
        </Link>
    );
}
