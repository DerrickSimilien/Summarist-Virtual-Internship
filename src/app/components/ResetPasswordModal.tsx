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
        className="reset-modal-content relative w-full max-w-[420px] rounded-lg bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - positioned in top right corner of modal */}
        <button
          onClick={onClose}
          className="absolute text-gray-400 hover:text-gray-600 transition-colors z-10"
          style={{ right: '24px', top: '24px' }}
        >
          <X size={24} />
        </button>

        {/* Main Content */}
        <div className="px-8 pb-8" style={{ paddingTop: '80px' }}>
          {/* Centered Content */}
          <div className="flex flex-col items-center" style={{ gap: '24px' }}>
            {/* Header with more spacing */}
            <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '16px' }}>
              Reset your password
            </h2>

            {!isSuccess ? (
              <>
                {/* Form */}
                <div className="modal-form-section w-full" style={{ maxWidth: '320px' }}>
                  <div className="form-group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isLoading}
                      placeholder="Email address"
                      className="w-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
                      style={{ 
                        borderRadius: '4px', 
                        marginBottom: '24px' // Increased spacing between input and button
                      }}
                    />
                    
                    {error && <p className="text-red-600 text-sm" style={{ marginBottom: '16px' }}>{error}</p>}
                    
                    {/* Reset button with reduced width */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-green-500 hover:bg-green-600 text-blue-900 py-3 px-8 font-medium transition disabled:opacity-60"
                        style={{ 
                          borderRadius: '4px',
                          minWidth: '240px' // Reduced width to match original
                        }}
                      >
                        {isLoading ? "Sending..." : "Send reset password link"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="modal-form-section w-full text-center" style={{ maxWidth: '320px' }}>
                  <div className="text-green-600 text-lg font-medium" style={{ marginBottom: '16px' }}>
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
          <div className="text-center text-sm">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={handleGoToLogin}
            >
              Go to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}