"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { login } from "@/api/auth";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Check for token and role on page load and redirect if authenticated
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role')?.toLowerCase();

        if (token && role) {
            router.push(`/${role}`);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!selectedRole) {
            setError("Please select a role before logging in.");
            setIsLoading(false);
            return;
        }

        try {
            const { access_token, user } = await login(email, password, selectedRole);

            if (access_token && user) {
                localStorage.setItem("token", access_token);
                localStorage.setItem("role", user.role);
                localStorage.setItem("user", JSON.stringify(user));

                router.push(`/${user.role.toLowerCase()}`) ;
            } else {
                setError("Invalid response from server.");
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            const message =
                err.response?.data?.message || "Login failed. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Welcome to DelSchool
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-400 dark:text-neutral-500">
                If you don't have an account, please contact the administrator.
            </p>

            {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="mb-8 space-x-6 flex justify-center items-center">
                    {["ADMIN", "TEACHER", "STUDENT"].map((role) => (
                        <div
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`h-20 w-20 rounded-full border-2 flex flex-col justify-center items-center cursor-pointer transition ${selectedRole === role ? "border-blue-500 bg-blue-100" : "border-gray-200"
                                }`}
                        >
                            <img
                                src={`/images/${role.toLowerCase()}.png`}
                                alt={role}
                                className="h-10 w-10 mb-1"
                            />
                            <span className="text-xs font-medium">{role}</span>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="username@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : "Sign in →"}
                </button>
            </form>
        </div>
    );
}
