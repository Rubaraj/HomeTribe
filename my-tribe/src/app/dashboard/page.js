"use client";
import React from "react";
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ 
        background: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Welcome to HomeTribe, {user.displayName?.split(' ')[0] || 'Friend'}! 🎉
            </h1>
            <p className="text-lg" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
              Your community dashboard
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border rounded-lg font-medium transition-all duration-200 hover:bg-gray-50"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)',
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Welcome Card */}
        <div 
          className="p-8 rounded-xl shadow-lg border mb-8"
          style={{ 
            background: 'var(--card-bg)',
            borderColor: 'var(--color-accent)',
            borderWidth: '1px'
          }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--card-text)' }}>
            🏠 Welcome to Your Tribe!
          </h2>
          <p className="text-lg mb-6" style={{ color: 'var(--card-text)', opacity: 0.8 }}>
            Thanks for joining HomeTribe! Your profile has been successfully set up. 
            Here's what you can do next:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                🔍 Explore Communities
              </h3>
              <p className="text-sm" style={{ color: 'var(--card-text)', opacity: 0.7 }}>
                Discover and join communities based on your interests
              </p>
            </div>
            
            <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                👥 Connect with Others
              </h3>
              <p className="text-sm" style={{ color: 'var(--card-text)', opacity: 0.7 }}>
                Find and connect with like-minded tribe members
              </p>
            </div>
            
            <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                📝 Share Your Story
              </h3>
              <p className="text-sm" style={{ color: 'var(--card-text)', opacity: 0.7 }}>
                Create posts and share your experiences with the community
              </p>
            </div>
            
            <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--card-text)' }}>
                ⚙️ Customize Profile
              </h3>
              <p className="text-sm" style={{ color: 'var(--card-text)', opacity: 0.7 }}>
                Update your profile and preferences anytime
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div 
          className="p-6 rounded-xl shadow-lg border"
          style={{ 
            background: 'var(--card-bg)',
            borderColor: 'var(--color-accent)',
            borderWidth: '1px'
          }}
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--card-text)' }}>
            Your Profile
          </h2>
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-medium" style={{ color: 'var(--card-text)' }}>
                {user.displayName || 'User'}
              </h3>
              <p className="text-sm" style={{ color: 'var(--card-text)', opacity: 0.7 }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
