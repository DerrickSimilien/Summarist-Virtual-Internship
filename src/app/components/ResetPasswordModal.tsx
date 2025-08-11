"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose, onGoToLogin }: ResetPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      setEmail("");
      setError("");
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    await new Promise(res => setTimeout(res, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleGoToLogin = () => {
    onGoToLogin();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-[420px] rounded-lg bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Main Content */}
        <div className="p-8">
          {/* Centered Content */}
          <div className="flex flex-col items-center pt-8 space-y-6">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>

            {!isSuccess ? (
              <>
                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isLoading}
                    placeholder="Email address"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-600 text-blue-900 py-3 rounded-md font-medium transition disabled:opacity-60"
                  >
                    {isLoading ? "Sending..." : "Send reset password link"}
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center space-y-4">
                  <div className="text-green-600 text-lg font-medium">
                    Reset link sent!
                  </div>
                  <p className="text-gray-600 text-sm">
                    Check your email for a link to reset your password.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Green Banner Footer */}
        <div className="bg-green-100 px-8 py-6">
          <div className="text-center">
            <button
              onClick={handleGoToLogin}
              className="text-blue-500 hover:underline text-sm"
            >
              Go to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}