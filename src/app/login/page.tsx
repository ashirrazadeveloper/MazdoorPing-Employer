'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    // Simulate login with mock data
    setTimeout(() => {
      const mockUser = {
        id: 'emp-1',
        email: email,
        name: 'Ahmed Khan',
        phone: '+92 300 1234567',
        city: 'Lahore',
        company_name: 'Khan Builders',
        role: 'employer',
      };
      localStorage.setItem('mazdoorping_user', JSON.stringify(mockUser));
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-primary px-6 pt-12 pb-16 rounded-b-[32px]">
        <div className="max-w-md mx-auto">
          <div className="text-white mb-8">
            <h1 className="text-3xl font-bold mb-2">MazdoorPing</h1>
            <p className="text-blue-100 text-sm">Employer Portal</p>
          </div>
          <h2 className="text-white text-xl font-semibold">Welcome Back!</h2>
          <p className="text-blue-100 text-sm mt-1">Sign in to manage your workforce</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email or Phone
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-primary text-sm font-medium hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-primary font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="max-w-md mx-auto mt-6 text-center">
          <p className="text-xs text-gray-400">
            Demo: Enter any email and password to sign in
          </p>
        </div>
      </div>
    </div>
  );
}
