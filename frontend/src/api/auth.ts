import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

// ✅ Interceptor: add token if exists
api.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ Login function
export const login = async (email: string, password: string, role: string) => {
    try {
        const response = await api.post("/auth/login", { email, password, role });

        const { access_token, user } = response.data;

        // ✅ Store token in cookie + user in localStorage
        if (access_token) {
            Cookies.set("token", access_token, { expires: 1 }); // 1 day expiry
            localStorage.setItem("user", JSON.stringify(user));
        }

        return { access_token, user };
    } catch (error: any) {
        console.error("Login error:", error);
        // Pass the error up to the caller
        throw error;
    }
};
// ✅ Register function
export const register = async (
    email: string,
    password: string,
    name?: string
) => {
    try {
        const response = await api.post("/auth/register", { email, password, name });
        return response.data;
    } catch (error: any) {
        console.error("Register error:", error);
        throw error;
    }
};

// ✅ Logout function
export const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    // Optional: redirect to login page
    window.location.href = "/login";
};

// ✅ Get current user
export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

// ✅ Check authentication
export const isAuthenticated = () => {
    return !!Cookies.get("token");
};
