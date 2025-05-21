"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import { ThemeProvider } from "@/components/theme-provider";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isChecking, setIsChecking] = useState(true); // 👈 To avoid flicker
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        const role = localStorage.getItem("role");

        if (token && role) {
            // ✅ Token & role exist, redirect
            router.push(`/${role}`);
        } else {
            // 🚫 No token, allow rendering
            setIsChecking(false);
        }
    }, [router]);

    // 🔒 While checking, render nothing
    if (isChecking) {
        return null; // 👈 Prevent flicker until check is done
    }

    return (
        <ThemeProvider>
            <div className="h-screen flex">
                {/* left */}
                <div className="w-[13%] md:w-[8%] lg:w-[16%] xl:w-[13%] p-4">
                    <Link rel="" href="/" className="flex items-center justify-center gap-2 lg:justify-start">
                        <img src="/logo.png" alt="logo" width={32} height={32} />
                        <span className="hidden lg:block">Del.School</span>
                    </Link>
                    <Menu />
                </div>
                {/* right */}
                <div className="w-[100%] md:w-[92%] lg:w-[100%] xl:w-[100%] bg-slate-100 overflow-scroll flex flex-col">
                    <Navbar />
                    {children}
                </div>
            </div>
        </ThemeProvider>
    );
}
