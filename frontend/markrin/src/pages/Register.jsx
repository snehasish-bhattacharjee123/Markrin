import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error for this field when user starts typing again
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      toast.success("Account created successfully! Welcome to Markrin.");
      navigate('/');
    } else {
      toast.error(result.error || "Registration failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-brand-cream font-inter">
      {/* 1. Left Section: Decorative Image */}
      <div className="hidden md:block w-1/2 relative bg-brand-dark-brown">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
          alt="Luxury Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark-brown/60 to-transparent flex items-center justify-center p-20">
          <div className="text-brand-white border-l-4 border-brand-gold pl-8">
            <h3 className="text-5xl font-bold mb-4 tracking-tighter">
              Join the <br />
              Movement.
            </h3>
            <p className="text-brand-cream/90 text-lg max-w-sm">
              Create an account today and enjoy early access to collections and
              personalized style recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Right Section: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md bg-brand-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter text-brand-dark-brown uppercase">
              Markrin<span className="text-brand-gold">.</span>
            </h2>
          </div>

          <h2 className="text-2xl font-bold text-brand-text mb-2 text-center">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Enter your details to become a member.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark-brown mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border rounded-lg text-brand-text focus:outline-none transition-all ${errors.name ? "border-red-500" : "border-gray-200"}`}
                required
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark-brown mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 bg-transparent border rounded-lg text-brand-text focus:outline-none transition-all ${errors.email ? "border-red-500" : "border-gray-200"}`}
                required
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark-brown mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 pr-10 bg-transparent border rounded-lg text-brand-text focus:outline-none transition-all ${errors.password ? "border-red-500" : "border-gray-200"}`}
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="accent-brand-gold"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-500">
                I agree to the{" "}
                <span className="text-brand-dark-brown font-bold underline">
                  Terms & Conditions
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-dark-brown text-brand-cream font-bold py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-brand-dark-brown transition-all duration-300 shadow-lg shadow-brand-dark-brown/10 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-dark-brown font-bold border-b-2 border-brand-gold hover:text-brand-gold transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
