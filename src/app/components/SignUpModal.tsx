"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";

interface User {
  email: string;
  loginType: "email" | "google" | "guest";
}

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: (user: User) => void;
  onGoToLogin: () => void;
}

export default function SignUpModal({ isOpen, onClose, onSignUp, onGoToLogin }: SignUpModalProps) {
  const router = useRouter();
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
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Call the onSignUp callback if provided
      onSignUp?.({ email: user.email || formData.email, loginType: "email" });
      
      // Close modal
      onClose();
      
      // Redirect to for-you page
      router.push("/for-you");
      
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError("This email is already registered. Please try logging in instead.");
          break;
        case 'auth/weak-password':
          setError("Password is too weak. Please choose a stronger password.");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address.");
          break;
        default:
          setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Sign up with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Call the onSignUp callback if provided
      onSignUp?.({ email: user.email || "", loginType: "google" });
      
      // Close modal
      onClose();
      
      // Redirect to for-you page
      router.push("/for-you");
      
    } catch (error: any) {
      console.error("Error with Google sign up:", error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError("Sign up was cancelled.");
          break;
        case 'auth/popup-blocked':
          setError("Popup was blocked. Please allow popups and try again.");
          break;
        default:
          setError("Failed to sign up with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
        className="signup-modal-content relative w-full bg-white shadow-2xl overflow-hidden"
        style={{ 
          borderRadius: '8px',
          maxWidth: '420px',
          fontFamily: 'Roboto, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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
            {/* Header with extra padding */}
            <h2 style={{ 
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '32px',
              textAlign: 'center',
              margin: '0 0 32px 0'
            }}>
              Sign up to Summarist
            </h2>

            {/* Form Container */}
            <div style={{ width: '100%', maxWidth: '320px' }}>
              
              {/* Sign up with Google Button */}
              <button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                style={{
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#3B82F6',
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
                  margin: '0 0 20px 0',
                  opacity: isLoading ? '0.6' : '1'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = '#3B82F6';
                }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  style={{ 
                    position: 'absolute',
                    left: '16px',
                    backgroundColor: 'white',
                    borderRadius: '2px',
                    padding: '2px'
                  }}
                >
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              {/* Separator */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                margin: '16px 0'
              }}>
                <div style={{ 
                  flex: '1', 
                  borderTop: '1px solid #D1D5DB' 
                }}></div>
                <span style={{ 
                  padding: '0 16px', 
                  color: '#6B7280', 
                  fontSize: '14px'
                }}>or</span>
                <div style={{ 
                  flex: '1', 
                  borderTop: '1px solid #D1D5DB' 
                }}></div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} style={{ margin: '0' }}>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Email Address"
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
                      margin: '0'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Password"
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
                      margin: '0'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                </div>

                {error && (
                  <p style={{ 
                    color: '#DC2626',
                    fontSize: '14px',
                    margin: '0 0 16px 0'
                  }}>{error}</p>
                )}

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
                    margin: '16px 0 0 0'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.backgroundColor = '#16A34A';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) e.currentTarget.style.backgroundColor = '#22C55E';
                  }}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </button>
              </form>
            </div>
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
            onClick={onGoToLogin}
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
            Already have an account?
          </button>
        </div>
      </div>
    </div>
  );
}