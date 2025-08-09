"use client";

import { useState, useEffect } from "react";
import { X, User } from "lucide-react";

interface User {
  email: string;
  loginType: "email" | "google" | "guest";
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (user: User) => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: "", password: "" });
      setError("");
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 1000));
    onLogin?.({ email: formData.email, loginType: "email" });
    setIsLoading(false);
    onClose();
  };

  const handleGuestLogin = () => {
    onLogin?.({ email: "guest@example.com", loginType: "guest" });
    onClose();
  };

  const handleGoogleLogin = () => {
    onLogin?.({ email: "user@gmail.com", loginType: "google" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md md:max-w-lg rounded-lg bg-white shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Log in to Summarist</h2>
        </div>

        {/* Body */}
        <div className="space-y-4">
          {/* Login as Guest Button */}
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-indigo-700 py-3 text-base font-medium text-white hover:bg-indigo-800 disabled:opacity-60 transition"
          >
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
              <User size={12} className="text-indigo-700" />
            </div>
            Login as a Guest
          </button>

          {/* Separator */}
          <div className="text-center text-gray-500 text-sm py-2">
            or
          </div>

          {/* Login with Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-white">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77C17.45 2.09 14.97 1 12 1s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Login with Google
          </button>

          {/* Another Separator */}
          <div className="text-center text-gray-500 text-sm py-2">
            or
          </div>

          {/* Email/Password Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 transition"
                placeholder="Email Address"
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 transition"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-green-500 py-3 text-base font-medium text-white hover:bg-green-600 disabled:opacity-60 transition mt-4"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Forgot your password link */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => alert("Forgot password flow not implemented")}
              className="text-sm text-green-500 hover:underline focus:outline-none"
            >
              Forgot your password?
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-green-500 hover:underline focus:outline-none"
              onClick={() => alert("Sign up flow not implemented")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}