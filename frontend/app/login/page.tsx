"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth-context';
import { getSessionToken, clearSessionToken, isSessionExpired } from '../../lib/utils';
import { FaEnvelope, FaFacebookF, FaGoogle, FaLock } from 'react-icons/fa';
import BackButton from '../components/BackButton';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = getSessionToken();
    const expired = isSessionExpired();
  
    if (!token || expired) {
      clearSessionToken();
      router.replace('/login');
    } else {
      router.replace('/');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData(e.currentTarget);
      const body = {
        email: data.get('email'),
        password: data.get('password')
      };

      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Login failed:', result);
        toast.error(result?.message || 'Login failed. Please check your credentials.');
        return;
      }

      if (result.token) {
        login(result.token, rememberMe);
        window.dispatchEvent(new Event("authChange"));
      }

      toast.success('Login successful!');
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Something went wrong. Please try again.');
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackButton />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row ">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <Image src="/logo.png" alt="AuctaSync Logo" width={180} height={45} />
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-gray-900 font-serif">Welcome back</h1>
            <p className="text-gray-600 mb-8">Please enter your details to sign in</p>
            
            <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center border-gray-300 py-2">
                  <FaEnvelope className="text-gray-500 mr-3" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="w-full border-gray-300 focus:ring-0"
                    aria-describedby="email-error"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="flex items-center border-gray-300 py-2">
                  <FaLock className="text-gray-500 mr-3" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full border-gray-300 focus:ring-0"
                    aria-describedby="password-error"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  aria-describedby="remember-error"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : 'Sign In'}
              </Button>

              <div className="text-center">
                <span className="text-gray-600">Don&apos;t have an account?</span>{' '}
                <Link href="/signup" className="text-orange-600 font-medium hover:text-orange-500">
                  Sign up
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <FaGoogle className="mr-2 h-5 w-5" />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <FaFacebookF className="mr-2 h-5 w-5" />
                  Facebook
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-90"></div>
          <Image
            src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Auction Gavel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white">
            <div className="max-w-md text-center backdrop-blur-sm bg-black/20 p-8 rounded-xl">
              <h2 className="text-3xl font-bold mb-6 font-serif">Unlock Exclusive Auctions</h2>
              <p className="text-lg mb-8">Sign in to access your personal dashboard, place bids, and track your favorite auctions in real-time.</p>
              <div className="flex justify-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold mb-2">10K+</div>
                  <div className="text-sm">Active Auctions</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold mb-2">50K+</div>
                  <div className="text-sm">Happy Users</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold mb-2">99%</div>
                  <div className="text-sm">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
