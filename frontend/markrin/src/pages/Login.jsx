import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Login successful! Welcome back.");
      // Redirect based on role
      if (result.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.error || "Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* Left Section: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md bg-brand-white p-10 rounded-2xl shadow-xl border border-gray-100">
          {/* Logo / Branding */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter text-brand-dark-brown uppercase">
              Markrin<span className="text-brand-gold">.</span>
            </h2>
          </div>

          <h2 className="text-2xl font-bold text-brand-text mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-transparent border border-gray-200 rounded-lg text-brand-text focus:outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold uppercase tracking-wider text-brand-dark-brown mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 bg-transparent border border-gray-200 rounded-lg text-brand-text focus:outline-none transition-all"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark-brown focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-gold hover:text-brand-dark-brown transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-dark-brown text-brand-cream font-bold py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 shadow-lg shadow-brand-dark-brown/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand-dark-brown font-bold border-b-2 border-brand-gold hover:text-brand-gold transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="hidden md:block w-1/2 relative bg-brand-dark-brown">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800"
          alt="Login Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-brown/80 via-transparent to-transparent flex items-end p-20">
          <div className="text-brand-white">
            <h3 className="text-4xl font-bold mb-4">Elevate Your Lifestyle.</h3>
            <p className="text-brand-cream/80 max-w-sm">
              Join our community of style enthusiasts and get exclusive access
              to new arrivals and seasonal sales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
