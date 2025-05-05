"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaEnvelope, FaFacebookF, FaGoogle, FaLock, FaUser } from 'react-icons/fa';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    // Basic password strength check
    let strength = 0;
    
    if (password.length > 6) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try{
      const formData = new FormData(e.currentTarget);
      const body = {
        name: formData.get('firstName') + ' ' + formData.get('lastName'),
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
      }

      // https://asyncawait-auction-project.onrender.com/api/signup
      // http://localhost:8000/api/signup
      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
      })

      const r = await res.json();
      //console.log(r);
      if (res.ok) {
        toast.success("Account created successfully");
        router.push('/');
      } else {
        toast.error(r.message);
      }
      //console.log("SignUp successful", res);

    }catch(e){
      toast.error("Account creation failed");
      console.error("Error signing up", e);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      // Redirect would happen here after successful registration
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-800 opacity-90"></div>
        <Image
          src="https://images.unsplash.com/photo-1600367163359-d51d40bcb5f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Auction Items"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white">
          <div className="max-w-md text-center backdrop-blur-sm bg-black/20 p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-6 font-serif">Join Our Global Auction Community</h2>
            <p className="text-lg mb-8">Create an account today to discover unique items and place bids on exclusive auctions from around the world.</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-left">
                <div className="text-orange-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L2 9.5l5 5a8.001 8.001 0 0014 0l5-5-.382-1.516z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Bidding</h3>
                <p className="text-sm opacity-80">Our platform ensures your transactions are protected and secure.</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-left">
                <div className="text-orange-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                <p className="text-sm opacity-80">Get instant notifications when you&apos;re outbid or win an auction.</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-left">
                <div className="text-orange-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Payments</h3>
                <p className="text-sm opacity-80">Multiple payment options available for your convenience.</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-left">
                <div className="text-orange-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm opacity-80">Our team is always ready to assist you with any questions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="AuctaSync Logo" width={180} height={45} />
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 font-serif">Create an account</h1>
        <p className="text-gray-600 mb-8">Join AuctaSync and start bidding on exclusive items</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="flex items-center border-gray-300 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="flex items-center border-gray-300 py-2 rounded-md">
                <FaUser className="text-gray-500 mr-3" />
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center border-gray-300 py-2 rounded-md">
              <FaUser className="text-gray-500 mr-3" />
              <Input
                id="username"
                name="username"
                placeholder="user001"
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center border-gray-300 py-2 rounded-md">
              <FaEnvelope className="text-gray-500 mr-3" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center border-gray-300 py-2 rounded-md">
              <FaLock className="text-gray-500 mr-3" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full"
                onChange={handlePasswordChange}
              />
            </div>

            {/* Password strength meter */}
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  passwordStrength === 0
                    ? 'w-0'
                    : passwordStrength === 1
                    ? 'w-1/4 bg-red-500'
                    : passwordStrength === 2
                    ? 'w-2/4 bg-yellow-500'
                    : passwordStrength === 3
                    ? 'w-3/4 bg-blue-500'
                    : 'w-full bg-green-500'
                } transition-all duration-300`}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Use 8+ characters with a mix of letters, numbers & symbols</p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="terms" required />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <Link href="/terms" className="text-orange-600 hover:text-orange-500">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
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
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Already have an account?</span>{' '}
            <Link href="/login" className="text-orange-600 font-medium hover:text-orange-500">
              Sign in
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
            <Button variant="outline" className="w-full flex items-center justify-center">
              <FaGoogle className="mr-2 h-5 w-5 text-blue-500" />
              Google
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center">
              <FaFacebookF className="mr-2 h-5 w-5 text-blue-600" />
              Facebook
            </Button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}