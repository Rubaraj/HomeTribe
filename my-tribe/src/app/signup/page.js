"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

// Google Icon Component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Apple Icon Component
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor"/>
  </svg>
);

// Eye Icon Component for password visibility
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Eye Off Icon Component for password visibility
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function SignUp() {
  const { signInWithGoogle, signUpWithEmail, loading, error } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.push('/'); // Redirect to home page after successful signup
    } catch (error) {
      console.error('Google sign up failed:', error);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName || !formData.email || !formData.password) {
      setFormError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUpWithEmail(formData.email, formData.password, formData.fullName);
      router.push('/'); // Redirect to home page after successful signup
    } catch (error) {
      console.error('Email sign up failed:', error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Join HomeTribe
          </h1>
          <p className="text-xs sm:text-sm opacity-80 px-2" style={{ color: 'var(--foreground)' }}>
            Connect all your social platforms in one place
          </p>
        </div>

        {/* Sign Up Card */}
        <div 
          className="p-6 sm:p-8 rounded-xl shadow-lg border"
          style={{ 
            background: 'var(--card-bg)',
            borderColor: 'var(--color-accent)',
            borderWidth: '1px'
          }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center" style={{ color: 'var(--card-text)' }}>
            Get Started
          </h2>
          
          {/* Error Display */}
          {(error || formError) && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300">
              <p className="text-red-700 text-sm">{error || formError}</p>
            </div>
          )}
          
          {/* Social Sign Up Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="signup-btn-google w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: '#4285F4',
                color: 'var(--card-text)',
                background: 'var(--card-bg)',
              }}
            >
              <div className="social-login-icon">
                <GoogleIcon />
              </div>
              {loading ? 'Signing up...' : 'Continue with Google'}
            </button>
            
            <button
              className="signup-btn-apple w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-lg font-medium transition-all duration-200 hover:shadow-md opacity-50 cursor-not-allowed"
              style={{
                borderColor: '#000000',
                color: 'var(--card-text)',
                background: 'var(--card-bg)',
              }}
              disabled
              title="Apple Sign-in coming soon"
            >
              <div className="social-login-icon">
                <AppleIcon />
              </div>
              Continue with Apple (Coming Soon)
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t" style={{ borderColor: 'var(--color-accent)' }}></div>
            <span className="px-3 text-sm" style={{ color: 'var(--card-text)' }}>or</span>
            <div className="flex-1 border-t" style={{ borderColor: 'var(--color-accent)' }}></div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={loading}
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
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
                className="w-full py-3 px-4 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--color-accent)',
                  background: 'var(--card-bg)',
                  color: 'var(--card-text)',
                  focusRingColor: 'var(--color-accent)'
                }}
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                className="w-full py-3 px-4 pr-12 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--color-accent)',
                  background: 'var(--card-bg)',
                  color: 'var(--card-text)',
                  focusRingColor: 'var(--color-accent)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 disabled:opacity-50"
                style={{ color: 'var(--card-text)' }}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'white',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-center mt-4 opacity-70" style={{ color: 'var(--card-text)' }}>
            By signing up, you agree to our{' '}
            <a href="#" className="underline hover:opacity-100">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:opacity-100">Privacy Policy</a>
          </p>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>
            Already have an account?{' '}
            <a href="/signin" className="font-semibold underline hover:opacity-80" style={{ color: 'var(--color-accent)' }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
