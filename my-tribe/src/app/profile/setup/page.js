"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { updateUserProfile } from '../../../lib/userService';

// Camera Icon for profile picture upload
const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// User Icon for default avatar
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Check Icon for completion steps
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
    <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ProfileSetup() {
  // Field-level validation for onBlur
  const validateField = (field) => {
    const value = formData[field];
    const alphaRegex = /^[A-Za-z]+$/;
    const alphaNumRegex = /^[A-Za-z0-9]+$/;
    const phoneRegex = /^\d{10}$/;
    const today = new Date();
    let error = '';
    switch (field) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        else if (!alphaRegex.test(value)) error = 'First name can only contain alphabets';
        else if (value.length > 15) error = 'First name cannot exceed 15 characters';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        else if (!alphaRegex.test(value)) error = 'Last name can only contain alphabets';
        else if (value.length > 15) error = 'Last name cannot exceed 15 characters';
        break;
      case 'username':
        if (!value.trim()) error = 'Username is required';
        else if (!alphaNumRegex.test(value)) error = 'Username can only be alphanumeric';
        else if (value.length > 15) error = 'Username cannot exceed 15 characters';
        break;
      case 'dateOfBirth':
        if (value) {
          const dob = new Date(value);
          const age = today.getFullYear() - dob.getFullYear() - (today < new Date(dob.setFullYear(today.getFullYear())) ? 1 : 0);
          if (age < 15) error = 'You must be at least 15 years old';
        }
        break;
      case 'phoneNumber':
        if (value && !phoneRegex.test(value)) error = 'Phone number must be exactly 10 digits';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    location: '',
    profilePicture: null,
    dateOfBirth: '',
    phoneNumber: '',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    }
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signup');
    } else if (user) {
      console.log('User data in profile setup:', user);
      
      // Pre-fill form with Google user data
      const nameParts = user.displayName ? user.displayName.split(' ') : [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const username = user.email ? user.email.split('@')[0] : '';
      const profilePicture = user.photoURL || null;
      
      console.log('Extracted data:', { firstName, lastName, username, profilePicture });
      
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        username,
        profilePicture
      }));
    }
  }, [user, authLoading, router]);

  const validateStep = (step) => {
    const newErrors = {};
    // Helper regex
    const alphaRegex = /^[A-Za-z]+$/;
    const alphaNumRegex = /^[A-Za-z0-9]+$/;
    const phoneRegex = /^\d{10}$/;
    const today = new Date();
    switch (step) {
      case 1:
        // First Name: Only alphabets, max 15 chars, mandatory
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        } else if (!alphaRegex.test(formData.firstName)) {
          newErrors.firstName = 'First name can only contain alphabets';
        } else if (formData.firstName.length > 15) {
          newErrors.firstName = 'First name cannot exceed 15 characters';
        }

        // Last Name: Only alphabets, max 15 chars, mandatory
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        } else if (!alphaRegex.test(formData.lastName)) {
          newErrors.lastName = 'Last name can only contain alphabets';
        } else if (formData.lastName.length > 15) {
          newErrors.lastName = 'Last name cannot exceed 15 characters';
        }

        // Username: max 15 chars, only alphanumeric
        if (!formData.username.trim()) {
          newErrors.username = 'Username is required';
        } else if (!alphaNumRegex.test(formData.username)) {
          newErrors.username = 'Username can only be alphanumeric';
        } else if (formData.username.length > 15) {
          newErrors.username = 'Username cannot exceed 15 characters';
        }

        // DOB: Cannot be less than 15 years of age
        if (formData.dateOfBirth) {
          const dob = new Date(formData.dateOfBirth);
          const age = today.getFullYear() - dob.getFullYear() - (today < new Date(dob.setFullYear(today.getFullYear())) ? 1 : 0);
          if (age < 15) {
            newErrors.dateOfBirth = 'You must be at least 15 years old';
          }
        }

        // Phone Number: only 10 numeric values, min/max length 10
        if (formData.phoneNumber) {
          if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
          }
        }
        break;
      case 2:
        if (!formData.bio.trim()) newErrors.bio = 'Tell us a bit about yourself';
        if (formData.bio.length < 10) newErrors.bio = 'Bio should be at least 10 characters';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Validate all fields in step 1 on Next click
    if (currentStep === 1) {
      validateField('firstName');
      validateField('lastName');
      validateField('username');
      validateField('dateOfBirth');
      validateField('phoneNumber');
    }
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        ...formData,
        profileCompleted: true,
        profileCompletedAt: new Date().toISOString()
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Profile setup failed:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Basic Info', completed: currentStep > 1 },
    { number: 2, title: 'About You', completed: currentStep > 2 },
    { number: 3, title: 'Preferences', completed: currentStep > 3 }
  ];

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ 
        background: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Complete Your Profile
          </h1>
          <p className="text-lg" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Let's set up your HomeTribe profile to personalize your experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  step.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === step.number
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {step.completed ? <CheckIcon /> : step.number}
              </div>
              <div className="ml-2 hidden sm:block">
                <div className={`text-sm font-medium ${
                  currentStep === step.number ? 'text-blue-500' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-px bg-gray-300 flex-1 mx-4 ${
                  step.completed ? 'bg-green-500' : ''
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div 
          className="p-8 rounded-xl shadow-lg border"
          style={{ 
            background: 'var(--card-bg)',
            borderColor: 'var(--color-accent)',
            borderWidth: '1px'
          }}
        >
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--card-text)' }}>
                  Basic Information
                </h2>
                {user?.photoURL && (
                  <div className="flex items-center space-x-2 text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Pre-filled from Google</span>
                  </div>
                )}
              </div>
              
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div 
                  className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors overflow-hidden"
                  style={{ 
                    borderColor: formData.profilePicture ? 'var(--color-accent)' : 'var(--color-accent)',
                    borderStyle: formData.profilePicture ? 'solid' : 'dashed'
                  }}
                >
                  {formData.profilePicture ? (
                    <img 
                      src={formData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
                <button
                  type="button"
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <CameraIcon />
                  <span>{formData.profilePicture ? 'Change Picture' : 'Add Profile Picture'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    onBlur={() => validateField('firstName')}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: errors.firstName ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--card-text)',
                    }}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    onBlur={() => validateField('lastName')}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: errors.lastName ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--card-text)',
                    }}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  onBlur={() => validateField('username')}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: errors.username ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--card-text)',
                  }}
                  placeholder="Choose a unique username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    onBlur={() => validateField('dateOfBirth')}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: errors.dateOfBirth ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--card-text)',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    onBlur={() => validateField('phoneNumber')}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: errors.phoneNumber ? '#ef4444' : 'var(--border-color)',
                      color: 'var(--card-text)',
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: About You */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--card-text)' }}>
                Tell Us About You
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                  Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: errors.bio ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--card-text)',
                  }}
                  placeholder="Tell us about yourself and what you're looking for in the HomeTribe community..."
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--card-text)' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--card-text)',
                  }}
                  placeholder="City, State/Country"
                />
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--card-text)' }}>
                Notification Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h3 className="font-medium" style={{ color: 'var(--card-text)' }}>Email Notifications</h3>
                    <p className="text-sm" style={{ color: 'var(--card-text)', opacity: 0.7 }}>
                      Receive updates about your connections and community
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        email: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h3 className="font-medium" style={{ color: 'var(--card-text)' }}>Push Notifications</h3>
                    <p className="text-sm" style={{ color: 'var(--card-text)', opacity: 0.7 }}>
                      Get instant notifications on your device
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences.push}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        push: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                  <div>
                    <h3 className="font-medium" style={{ color: 'var(--card-text)' }}>SMS Notifications</h3>
                    <p className="text-sm" style={{ color: 'var(--card-text)', opacity: 0.7 }}>
                      Receive important updates via text message
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences.sms}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: {
                        ...formData.notificationPreferences,
                        sms: e.target.checked
                      }
                    })}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="p-3 rounded-lg bg-red-100 border border-red-300">
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 border rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--card-text)',
                background: 'var(--card-bg)',
              }}
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                }}
              >
                {loading ? 'Completing...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
