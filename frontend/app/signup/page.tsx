/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaEnvelope, FaFacebookF, FaGoogle, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });

  // Animated background elements
  const bubbleVariants = {
    initial: { opacity: 0.2 },
    animate: { 
      opacity: [0.2, 0.3, 0.2], 
      scale: [1, 1.1, 1],
      transition: { 
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse" 
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Password strength check
    if (name === 'password') {
      let strength = 0;
      
      if (value.length > 6) strength += 1;
      if (value.match(/[A-Z]/)) strength += 1;
      if (value.match(/[0-9]/)) strength += 1;
      if (value.match(/[^A-Za-z0-9]/)) strength += 1;
      
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    };
    let isValid = true;

    // First name validation
    if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
      isValid = false;
    }

    // Last name validation
    if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
      isValid = false;
    }

    // Username validation
    if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers and underscores';
      isValid = false;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (passwordStrength < 3) {
      errors.password = 'Password is too weak';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsLoading(true);

    try {
      const body = {
        name: formData.firstName + ' ' + formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const res = await fetch('https://asyncawait-auction-project.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success("Account created successfully!");
        
        // Show success animation before redirecting
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        // Handle specific error messages from backend
        if (data.message.includes('email')) {
          setFormErrors(prev => ({ ...prev, email: data.message }));
        } else if (data.message.includes('username')) {
          setFormErrors(prev => ({ ...prev, username: data.message }));
        } else {
          toast.error(data.message || "Account creation failed");
        }
      }
    } catch (e) {
      toast.error("Network error. Please try again later.");
      console.error("Error signing up", e);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "text-red-500";
    if (passwordStrength === 2) return "text-yellow-500";
    if (passwordStrength === 3) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <>
      <div className="min-h-screen bg-[#0A111B] flex flex-col lg:flex-row">
        {/* Left side - Image with animated gradient overlay */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1929] via-[#162a3d] to-[#0a1929] z-0"></div>
          
          {/* Animated gradient bubbles */}
          <motion.div 
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600 rounded-full filter blur-[80px] opacity-30 z-0"
          />
          <motion.div 
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-gray-800 rounded-full filter blur-[70px] opacity-50 z-0"
          />
          
          {/* Image with overlay */}
          <div className="absolute inset-0 opacity-40 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600367163359-d51d40bcb5f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Auction Items"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-md text-center backdrop-blur-sm bg-black/20 p-8 rounded-xl border border-white/10"
            >
              <h2 className="text-3xl font-bold mb-6 font-serif">Join Our Global Auction Community</h2>
              <p className="text-lg mb-8">Create an account today to discover unique items and place bids on exclusive auctions from around the world.</p>
              
              <div className="grid grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left border border-white/5"
                >
                  <div className="text-orange-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L2 9.5l5 5a8.001 8.001 0 0014 0l5-5-.382-1.516z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure Bidding</h3>
                  <p className="text-sm opacity-80">Our platform ensures your transactions are protected and secure.</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left border border-white/5"
                >
                  <div className="text-orange-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
                  <p className="text-sm opacity-80">Get instant notifications when you&apos;re outbid or win an auction.</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left border border-white/5"
                >
                  <div className="text-orange-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Payments</h3>
                  <p className="text-sm opacity-80">Multiple payment options available for your convenience.</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left border border-white/5"
                >
                  <div className="text-orange-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm opacity-80">Our team is always ready to assist you with any questions.</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Right side - Signup Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative z-10">
          <div className="absolute top-4 left-4">
            <BackButton />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <Image src="/logo-white.png" alt="AuctaSync Logo" width={180} height={45} />
              </Link>
            </div>

            <h1 className="text-3xl font-bold mb-2 text-white font-serif">Create an account</h1>
            <p className="text-gray-400 mb-8">Join AuctaSync and start bidding on exclusive items</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <div className="flex items-center bg-[#1a1f2a] border border-[#2a3548] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                    <div className="pl-3 pr-2">
                      <FaUser className="text-gray-400" />
                    </div>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                    />
                  </div>
                  {formErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <div className="flex items-center bg-[#1a1f2a] border border-[#2a3548] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                    <div className="pl-3 pr-2">
                      <FaUser className="text-gray-400" />
                    </div>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                    />
                  </div>
                  {formErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <div className="flex items-center bg-[#1a1f2a] border border-[#2a3548] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                  <div className="pl-3 pr-2">
                    <FaUser className="text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    placeholder="user001"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  />
                </div>
                {formErrors.username && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="flex items-center bg-[#1a1f2a] border border-[#2a3548] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                  <div className="pl-3 pr-2">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="flex items-center bg-[#1a1f2a] border border-[#2a3548] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                  <div className="pl-3 pr-2">
                    <FaLock className="text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-0 bg-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-3 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password strength meter */}
                <div className="flex items-center">
                  <div className="h-1.5 flex-grow bg-gray-700 rounded-full overflow-hidden">
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
                  {passwordStrength > 0 && (
                    <span className={`ml-2 text-xs ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Use 8+ characters with a mix of letters, numbers & symbols</p>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  required 
                  className="border-gray-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <Link href="/terms" className="text-orange-500 hover:text-orange-400 underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-orange-500 hover:text-orange-400 underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C"></path>
                    </svg>
                    Loading...
                    </div>
                  ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center">
                <span className="text-gray-400">Already have an account?</span>{' '}
                <Link href="/login" className="text-orange-500 font-medium hover:text-orange-400 transition-colors">
                  Sign in
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0A111B] text-gray-400">
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
          </motion.div>
        </div>
        </div>
    </>
    
  );
}