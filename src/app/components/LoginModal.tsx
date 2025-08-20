"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, User } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import ResetPasswordModal from './ResetPasswordModal'; // Adjust path as needed
import SignUpModal from './SignUpModal'; // Adjust path as needed

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
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

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
      setShowResetModal(false);
      setShowSignUpModal(false);
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
    setError("");

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Call the onLogin callback if provided
      onLogin?.({ email: user.email || formData.email, loginType: "email" });
      
      // Close modal
      onClose();
      
      // Redirect to for-you page
      router.push("/for-you");
      
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError("No account found with this email address.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address.");
          break;
        case 'auth/user-disabled':
          setError("This account has been disabled.");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Failed to sign in. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Use the dummy guest credentials from the requirements
      const guestEmail = "guest@gmail.com";
      const guestPassword = "guest123";
      
      // Sign in with the dummy guest account
      const userCredential = await signInWithEmailAndPassword(auth, guestEmail, guestPassword);
      const user = userCredential.user;
      
      // Call the onLogin callback if provided
      onLogin?.({ email: user.email || guestEmail, loginType: "guest" });
      
      // Close modal
      onClose();
      
      // Redirect to for-you page
      router.push("/for-you");
      
    } catch (error: any) {
      console.error("Error with guest login:", error);
      
      // If guest account doesn't exist, provide a helpful error
      if (error.code === 'auth/user-not-found') {
        setError("Guest account not found. Please contact support.");
      } else {
        setError("Failed to login as guest. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Call the onLogin callback if provided
      onLogin?.({ email: user.email || "", loginType: "google" });
      
      // Close modal
      onClose();
      
      // Redirect to for-you page
      router.push("/for-you");
      
    } catch (error: any) {
      console.error("Error with Google login:", error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError("Login was cancelled.");
          break;
        case 'auth/popup-blocked':
          setError("Popup was blocked. Please allow popups and try again.");
          break;
        case 'auth/account-exists-with-different-credential':
          setError("An account already exists with this email but different sign-in method.");
          break;
        default:
          setError("Failed to login with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Only show the login modal if reset modal and signup modal are not open */}
      {!showResetModal && !showSignUpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div
            className="login-modal-content relative w-full max-w-[420px] rounded-lg bg-white shadow-2xl overflow-hidden"
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
                <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '16px' }}>Log in to Summarist</h2>

                {/* Body */}
                <div className="modal-form-section w-full" style={{ maxWidth: '320px' }}>
                  {/* Login as Guest Button */}
                  <button 
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="w-full relative flex items-center justify-center bg-blue-800 py-3 px-5 text-base font-medium text-white hover:bg-blue-900 disabled:opacity-60 transition"
                    style={{ borderRadius: '4px', marginBottom: '16px' }}
                  >
                    <div className="absolute left-4 w-10 h-10 bg-white flex items-center justify-center"
                         style={{ borderRadius: '2px' }}>
                      <User size={22} className="text-blue-800" />
                    </div>
                    Login as a Guest
                  </button>

                  {/* Separator */}
                  <div className="modal-separator flex items-center py-2" style={{ marginBottom: '16px' }}>
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Login with Google Button */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full relative flex items-center justify-center bg-blue-500 py-3 text-base font-medium text-white hover:bg-blue-600 disabled:opacity-60 transition"
                    style={{ borderRadius: '4px', marginBottom: '16px' }}
                  >
                    <svg width="34" height="34" viewBox="0 0 24 24" className="absolute left-4 bg-white p-0.5" style={{ borderRadius: '2px' }}>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Login with Google
                  </button>

                  {/* Separator */}
                  <div className="modal-separator flex items-center py-2" style={{ marginBottom: '16px' }}>
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Email/Password Form */}
                  <form onSubmit={handleSubmit} className="form-group">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="Email Address"
                      className="w-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
                      style={{ borderRadius: '4px', marginBottom: '16px' }}
                    />
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="Password"
                      className="w-full border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
                      style={{ borderRadius: '4px', marginBottom: '16px' }}
                    />
                    {error && <p className="text-red-600 text-sm" style={{ marginBottom: '16px' }}>{error}</p>}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green-500 hover:bg-green-600 text-blue-900 py-3 font-medium transition disabled:opacity-60"
                      style={{ borderRadius: '4px' }}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </button>
                  </form>

                  {/* Forgot Password Link */}
                  <div className="modal-footer-link text-center" style={{ marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setShowResetModal(true)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Green Banner Footer */}
            <div className="bg-green-100 px-8 py-6">
              <div className="text-center text-sm">
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setShowSignUpModal(true)}
                >
                  Don't have an account?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => {
          setShowResetModal(false);
          onClose(); // Close the entire modal system
        }}
        onGoToLogin={() => {
          setShowResetModal(false);
          // The login modal will show again automatically since showResetModal is now false
        }}
      />
      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => {
          setShowSignUpModal(false);
          onClose(); // Close the entire modal system
        }}
        onSignUp={onLogin} // Use the same handler as login
        onGoToLogin={() => {
          setShowSignUpModal(false);
          // The login modal will show again automatically since showSignUpModal is now false
        }}
      />
    </>
  );
}