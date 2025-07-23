/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "../../lib/auth-context";
import { getSessionToken, clearSessionToken, isSessionExpired, setSessionToken } from "../../lib/utils";
import { FaEnvelope, FaFacebookF, FaGoogle, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { supabase } from "../../config/supabaseClient";

export default function LoginPage() {
  const { login, loggedIn, user } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectOrigin = typeof window !== "undefined" ? window.location.origin : "";
  
  const facebookLoginUrl = `https://asyncawait-auction-project.onrender.com/api/login/facebook?redirect_origin=${encodeURIComponent(redirectOrigin)}`;

  const handleLogin = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("OAuth login error:", error.message);
      toast.error("Failed to start login: " + error.message);
    }
  };

  const handleSessionExpiry = () => {
    clearSessionToken();
    setShowLogoutModal(true);
    toast.error("Session expired. Please log in again.");
  };

  // session verification
  useEffect(() => {
    async function verifySession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;

        if (error || !session) {
          clearSessionToken();
          setCheckingAuth(false);
          return;
        }

        const expiresAtMs = session.expires_at ? session.expires_at * 1000 : 0;
        const expired = Date.now() >= expiresAtMs;

        if (expired) {
          clearSessionToken();
          setCheckingAuth(false);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Error verifying session:", err);
        clearSessionToken();
        setCheckingAuth(false);
      }
    }

    verifySession();
  }, [router]);

  // prefetch auction pages
  useEffect(() => {
    router.prefetch("/auctions/all");
    router.prefetch("/auctions/upcoming");
    router.prefetch("/auctions/past");
  }, [router]);

  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      try {
        const token = getSessionToken();
        const expired = isSessionExpired();
        if (token && expired) handleSessionExpiry();
      } catch (e) {
        console.error("Storage error", e);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sessionToken" && e.oldValue && !e.newValue) {
        handleSessionExpiry();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (showLogoutModal) {
      const timeout = setTimeout(() => setShowLogoutModal(false), 8000);
      return () => clearTimeout(timeout);
    }
  }, [showLogoutModal]);

  if (checkingAuth) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email")?.toString().trim() || "";
      const password = formData.get("password")?.toString() || "";

      if (!email || !password) {
        toast.error("Please fill in all required fields.");
        return;
      }

      await login(email, password, rememberMe);
      toast.success("Logged In!");
      if (loggedIn && user) {
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-orange-500 via-purple-600 to-blue-500 rounded-full filter blur-[120px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-orange-400 to-purple-500 rounded-full filter blur-[100px] opacity-30 animate-float" />
      </div>

      {/* Centered Login Card */}
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md bg-[#10182A]/90 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center"
        >
          <Link href="/" className="mb-8 block">
            <Image src="/logo-white.png" alt="AuctaSync Logo" width={180} height={45} priority />
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-serif text-center">
            Sign in to your account
          </h1>

          <p className="text-gray-400 mb-8 text-center">
            Access exclusive auctions, track your bids, and more.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="flex items-center bg-[#181F2F] border border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 transition">
                <FaEnvelope className="text-orange-400 mr-3" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  autoFocus
                  className="w-full bg-transparent border-0 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300">
                  Forgot password?
                </Link>
              </div>

              <div className="flex items-center bg-[#181F2F] border border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 transition">
                <FaLock className="text-orange-400 mr-3" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-0 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-3 text-gray-500 hover:text-orange-400 focus:outline-none"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <label htmlFor="remember" className="text-sm font-medium text-gray-300">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-3 rounded-xl shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center">
              <span className="text-gray-400">Don&apos;t have an account?</span>{" "}
              <Link href="/signup" className="text-orange-400 font-medium hover:text-orange-300">
                Sign up
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#10182A] text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 bg-[#181F2F] text-white hover:bg-[#232B3E] transition"
                  type="button"
                  disabled={isLoading}
                  onClick={handleLogin}
                >
                  <FaGoogle className="mr-2 h-5 w-5 text-orange-400" />
                  Google
                </Button>

              <a href={facebookLoginUrl} className="block w-full">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 bg-[#181F2F] text-white hover:bg-[#232B3E] transition"
                  onClick={() => toast("Facebook login coming soon!")}
                  type="button"
                  disabled={isLoading}
                >
                  <FaFacebookF className="mr-2 h-5 w-5 text-orange-400" />
                  Facebook
                </Button>
              </a>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Session Expiry Modal */}
      {showLogoutModal && (
        <div className="fixed z-50 inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#181F2F] p-6 rounded-2xl shadow-2xl max-w-sm text-center border border-white/10">
            <h2 className="text-lg font-bold text-white mb-2">You were logged out</h2>
            <p className="text-gray-300 mb-4">
              Due to inactivity, your session expired. Please log in again to continue.
            </p>
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 w-full text-white font-bold rounded-xl"
              onClick={() => setShowLogoutModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-slow {
          0% { opacity: 0.5; }
          50% { opacity: 0.7; }
          100% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
