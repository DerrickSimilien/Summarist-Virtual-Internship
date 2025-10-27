'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '../components/SidebarLayout';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const SettingsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpgradeClick = () => {
    router.push('/choose-plan');
  };

  return (
    <SidebarLayout>
      {/* Main content container - centered and constrained width */}
      <div className="flex justify-center" style={{ width: '100%' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          
          {/* Settings Header */}
          <div>
            <h1 
              style={{
                fontSize: '32px',
                color: '#032B41',
                fontFamily: 'Roboto, sans-serif',
                margin: '0px 0px 32px',
                padding: '0px 0px 16px',
                borderBottom: '1px solid #e4e5e7'
              }}
            >
              Settings
            </h1>
          </div>

          {/* Your Subscription Plan Section */}
          <section style={{ marginBottom: '32px' }}>
            <h2 
              style={{
                fontSize: '18px',
                color: '#032B41',
                fontFamily: 'Roboto, sans-serif',
                margin: '0px 0px 16px',
                fontWeight: '600'
              }}
            >
              Your Subscription plan
            </h2>
            
            <p 
              style={{
                fontSize: '16px',
                color: '#032B41',
                fontFamily: 'Roboto, sans-serif',
                margin: '0px 0px 16px'
              }}
            >
              Basic
            </p>
            
            <button
              onClick={handleUpgradeClick}
              style={{
                backgroundColor: '#2BD97C',
                color: '#032B41',
                fontSize: '16px',
                fontFamily: 'Roboto, sans-serif',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#26c770';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2BD97C';
              }}
            >
              Upgrade to Premium
            </button>
            
            {/* Horizontal divider line */}
            <div 
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#e4e5e7',
                margin: '32px 0px'
              }}
            ></div>
          </section>

          {/* Email Section */}
          <section>
            <h2 
              style={{
                fontSize: '18px',
                color: '#032B41',
                fontFamily: 'Roboto, sans-serif',
                margin: '0px 0px 16px',
                fontWeight: '600'
              }}
            >
              Email
            </h2>
            
            {loading ? (
              <p 
                style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  fontFamily: 'Roboto, sans-serif'
                }}
              >
                Loading...
              </p>
            ) : (
              <p 
                style={{
                  fontSize: '16px',
                  color: '#032B41',
                  fontFamily: 'Roboto, sans-serif',
                  margin: '0px'
                }}
              >
                {user?.email || 'No email available'}
              </p>
            )}
          </section>

        </div>
      </div>
    </SidebarLayout>
  );
};

export default SettingsPage;