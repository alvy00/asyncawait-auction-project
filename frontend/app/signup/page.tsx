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
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-orange-500 via-purple-600 to-blue-500 rounded-full filter blur-[120px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-orange-400 to-purple-500 rounded-full filter blur-[100px] opacity-30 animate-float" />
      </div>

      {/* Centered Signup Card */}
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-xl bg-[#10182A]/90 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center"
        >
          <Link href="/" className="mb-8 block">
            <Image src="/logo-white.png" alt="AuctaSync Logo" width={180} height={45} priority />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-serif text-center">Create your account</h1>
          <p className="text-gray-400 mb-8 text-center">Join AuctaSync and start bidding on exclusive items.</p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <div className="flex items-center bg-[#181F2F] border border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 transition">
                  <FaUser className="text-orange-400 mr-3" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  />
                </div>
                {formErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <div className="flex items-center bg-[#181F2F] border border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 transition">
                  <FaUser className="text-orange-400 mr-3" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                  />
                </div>
                {formErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <div className="flex items-center bg-[#181F2F] border border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 transition">
                <FaUser className="text-orange-400 mr-3" />
                <Input
                  id="username"
                  name="username"
                  placeholder="user001"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                />
              </div>
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="flex items-center bg-[#181F2F] border border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 transition">
                <FaEnvelope className="text-orange-400 mr-3" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="flex items-center bg-[#181F2F] border border-gray-700 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 transition">
                <FaLock className="text-orange-400 mr-3" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-3 text-gray-500 hover:text-orange-400 focus:outline-none"
                  aria-label="Toggle password visibility"
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
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-3 rounded-xl shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </div>
              ) : "Create Account"}
            </Button>
            <div className="text-center">
              <span className="text-gray-400">Already have an account?</span>{' '}
              <Link href="/login" className="text-orange-400 font-medium hover:text-orange-300">
                Sign in
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
              <Button variant="outline" className="w-full border-gray-700 bg-[#181F2F] text-white hover:bg-[#232B3E] transition" type="button">
                <FaGoogle className="mr-2 h-5 w-5 text-orange-400" />
                Google
              </Button>
              <Button variant="outline" className="w-full border-gray-700 bg-[#181F2F] text-white hover:bg-[#232B3E] transition" type="button">
                <FaFacebookF className="mr-2 h-5 w-5 text-orange-400" />
                Facebook
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
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