import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useSignIn } from "@clerk/clerk-react";
import { useAuth } from "../../contexts/AuthContext";

// Loading Screen Component remains the same
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-purple-100 animate-pulse flex items-center justify-center">
          <div className="text-3xl font-bold text-purple-500">P</div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-[spin_1s_linear_infinite]"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-40 h-40 rounded-full border-4 border-t-purple-100 border-r-purple-100 border-b-transparent border-l-transparent animate-[spin_1.5s_linear_infinite]"></div>
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <p className="text-purple-500 font-medium">Logging in...</p>
        </div>
      </div>
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const { isLoaded: isClerkLoaded, signIn: clerkSignIn } = useSignIn();
  const { login, isLoading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await login({
        username: formData.username,
        password: formData.password,
      });
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isClerkLoaded) {
      toast.error("Authentication system is loading");
      return;
    }

    try {
      await clerkSignIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard"
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  if (!isClerkLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <Toaster position="top-right" richColors />

      {isLoading && <LoadingScreen />}

      <div className="w-[90vw] h-[90vh] flex bg-transparent lg:bg-white lg:shadow-[0_0_10px_10px_rgba(0,0,0,0.322)] overflow-hidden">
        {/* Left Section */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-b from-purple-500 via-[#190217] to-[#190217] text-white">
          <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3">
            <h1 className="text-4xl font-bold">LOGIN</h1>
            <p className="text-white">The Best Experience You Will Get</p>
          </div>
          <div className="absolute bottom-0 left-[-8em] translate-y-[10em] w-[350px] h-[350px] border border-white rounded-full"></div>
          <div className="absolute bottom-0 left-[-6em] translate-y-[12em] w-[350px] h-[350px] border border-white rounded-full"></div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center overflow-y-auto py-8">
          <div className="w-full max-w-[320px] flex flex-col justify-center gap-6 px-4">
            {/* Mobile Icon */}
            <div className="flex flex-col items-center lg:hidden">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                <LogIn className="w-10 h-10 text-purple-500" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="text-gray-600">Please login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 border text-black rounded focus:outline-none focus:border-purple-500 bg-gray-50"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-2.5 border text-black rounded focus:outline-none focus:border-purple-500 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors bg-transparent p-0 border-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Login
              </button>
            </form>

            <div className="space-y-3">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Or login with</p>
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="mt-2 p-2 bg-transparent border-none transition-colors hover:text-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    preserveAspectRatio="xMidYMid"
                    viewBox="0 0 256 262"
                  >
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    ></path>
                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
