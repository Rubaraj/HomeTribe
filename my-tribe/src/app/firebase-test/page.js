"use client";
import React, { useEffect, useState } from "react";
import { auth } from '../../lib/firebase';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Checking Firebase connection...');
  const [firebaseConfig, setFirebaseConfig] = useState(null);

  useEffect(() => {
    try {
      // Check if Firebase is initialized
      if (auth) {
        setStatus('✅ Firebase Auth initialized successfully');
        setFirebaseConfig({
          projectId: auth.app.options.projectId,
          authDomain: auth.app.options.authDomain
        });
      } else {
        setStatus('❌ Firebase Auth not initialized');
      }
    } catch (error) {
      setStatus(`❌ Firebase Error: ${error.message}`);
      console.error('Firebase test error:', error);
    }
  }, []);

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ 
        background: 'var(--background)',
        color: 'var(--foreground)'
      }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Connection Test</h1>
        
        <div 
          className="p-6 rounded-lg border"
          style={{ 
            background: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="mb-4">{status}</p>
          
          {firebaseConfig && (
            <div>
              <h3 className="font-semibold mb-2">Firebase Config:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(firebaseConfig, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Environment Variables:</h3>
            <ul className="space-y-1 text-sm">
              <li>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
              <li>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</li>
              <li>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
              <li>Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
