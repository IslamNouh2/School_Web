// frontend/src/components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/api/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check if the user is authenticated
        const authCheck = () => {
            if (!isAuthenticated()) {
                router.push("/login");
            } else {
                setAuthorized(true);
            }
        };

        authCheck();
    }, [router]);

    return authorized ? <>{children}</> : null;
}