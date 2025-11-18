import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterFormData } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password confirmation
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Register card */}
      <div className="glass-container max-w-md w-full animate-slide-up relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mb-4 shadow-lg">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join us to start protecting your plants</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-xl text-red-700 text-sm animate-scale-in">
            {error}
          </div>
        )}

        {/* Register form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="glass-input w-full"
              placeholder="John Doe"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="glass-input w-full"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              className="glass-input w-full"
              placeholder="At least 8 characters"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
              minLength={8}
              value={formData.password_confirmation}
              onChange={handleChange}
              className="glass-input w-full"
              placeholder="Re-enter your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="glass-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6 flex items-center">
          <div className="flex-1 border-t border-gray-300/50"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300/50"></div>
        </div>

        {/* Login link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
