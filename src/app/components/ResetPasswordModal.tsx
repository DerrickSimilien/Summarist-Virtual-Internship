"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

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
    
    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      setIsLoading(false);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError("No account found with this email address.");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address.");
          break;
        case 'auth/too-many-requests':
          setError("Too many requests. Please try again later.");
          break;
        default:
          setError("Failed to send reset email. Please try again.");
      }
    }
  };

  const handleGoToLogin = () => {
    onGoToLogin();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontFamily: 'Roboto, sans-serif'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="reset-modal-content relative w-full bg-white shadow-2xl overflow-hidden"
        style={{ 
          borderRadius: '8px',
          maxWidth: '420px',
          fontFamily: 'Roboto, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - positioned in top right corner */}
        <button
          onClick={onClose}
          className="absolute z-10"
          style={{ 
            right: '20px', 
            top: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#9CA3AF',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
        >
          <X size={20} />
        </button>

        {/* Main Content */}
        <div style={{ padding: '60px 32px 32px 32px' }}>
          {/* Centered Content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Header */}
            <h2 style={{ 
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '32px',
              textAlign: 'center',
              margin: '0 0 32px 0'
            }}>
              Reset your password
            </h2>

            {!isSuccess ? (
              <>
                {/* Form */}
                <div style={{ width: '100%', maxWidth: '280px' }}>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isLoading}
                      placeholder="Email address"
                      style={{ 
                        width: '100%',
                        border: '1px solid #D1D5DB',
                        padding: '12px 16px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        height: '48px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: isLoading ? '#F9FAFB' : 'white',
                        color: isLoading ? '#9CA3AF' : '#111827',
                        fontFamily: 'Roboto, sans-serif',
                        boxSizing: 'border-box',
                        margin: '0 0 24px 0'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                      onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    />
                    
                    {error && (
                      <p style={{ 
                        color: '#DC2626',
                        fontSize: '14px',
                        margin: '-16px 0 16px 0'
                      }}>{error}</p>
                    )}
                    
                    {/* Reset button matching input width */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{ 
                        width: '100%',
                        backgroundColor: isLoading ? 'rgba(34, 197, 94, 0.6)' : '#22C55E',
                        color: 'white',
                        padding: '12px 16px',
                        fontSize: '16px',
                        fontWeight: '500',
                        borderRadius: '4px',
                        height: '48px',
                        border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        fontFamily: 'Roboto, sans-serif',
                        boxSizing: 'border-box',
                        margin: '0'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) e.currentTarget.style.backgroundColor = '#16A34A';
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) e.currentTarget.style.backgroundColor = '#22C55E';
                      }}
                    >
                      {isLoading ? "Sending..." : "Send reset password link"}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
                  <div style={{ 
                    color: '#059669',
                    fontSize: '18px',
                    fontWeight: '500',
                    marginBottom: '16px'
                  }}>
                    Reset link sent!
                  </div>
                  <p style={{ 
                    color: '#6B7280',
                    fontSize: '14px',
                    margin: '0'
                  }}>
                    Check your email for a link to reset your password.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Green Banner Footer with increased height */}
        <div style={{ 
          backgroundColor: '#DCFCE7',
          padding: '20px 32px',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={handleGoToLogin}
            style={{
              color: '#3B82F6',
              fontSize: '14px',
              fontWeight: '500',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'Roboto, sans-serif'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Go to login
          </button>
        </div>
      </div>
    </div>
  );
}