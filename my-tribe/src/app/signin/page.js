"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

// Google Icon Component (reused from signup)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function SignIn() {
  const { signInWithGoogle, signInWithEmail, loading, error } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setFormError('');
      const result = await signInWithGoogle();
      // For now, always redirect to dashboard for existing Google users
      // We'll add profile completion check later
      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign in failed:', error);
      setFormError('Google sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signInWithEmail(formData.email, formData.password);
      // For now, always redirect to dashboard for email sign-in
      // We'll add profile completion check later
      router.push('/dashboard');
    } catch (error) {
      console.error('Email sign in failed:', error);
      setFormError('Sign in failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        background: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Welcome Back
          </h1>
          <p className="text-lg sm:text-xl" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Sign in to your HomeTribe account
          </p>
        </div>

        {/* Sign In Card */}
        <div 
          className="p-6 sm:p-8 rounded-xl shadow-lg border"
          style={{ 
            background: 'var(--card-bg)',
            borderColor: 'var(--color-accent)',
            borderWidth: '1px'
          }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center" style={{ color: 'var(--card-text)' }}>
            Sign In
          </h2>
          
          {/* Error Display */}
          {(error || formError) && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300">
              <p className="text-red-700 text-sm">{error || formError}</p>
            </div>
          )}
          
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            style={{
              borderColor: '#4285F4',
              color: 'var(--card-text)',
              background: 'var(--card-bg)',
            }}
          >
            <div className="social-login-icon">
              <GoogleIcon />
            </div>
            {isSubmitting ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t" style={{ borderColor: 'var(--color-accent)' }}></div>
            <span className="px-3 text-sm" style={{ color: 'var(--card-text)' }}>or</span>
            <div className="flex-1 border-t" style={{ borderColor: 'var(--color-accent)' }}></div>
          </div>

          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full py-3 px-4 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--color-accent)',
                  background: 'var(--card-bg)',
                  color: 'var(--card-text)',
                  focusRingColor: 'var(--color-accent)'
                }}
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isSubmitting}
                className="w-full py-3 px-4 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--color-accent)',
                  background: 'var(--card-bg)',
                  color: 'var(--card-text)',
                  focusRingColor: 'var(--color-accent)'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'white',
              }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <a href="#" className="text-sm underline hover:opacity-80" style={{ color: 'var(--color-accent)' }}>
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>
            Don't have an account?{' '}
            <a href="/signup" className="font-semibold underline hover:opacity-80" style={{ color: 'var(--color-accent)' }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
