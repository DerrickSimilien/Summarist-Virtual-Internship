'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
      transition: 'background-color 0.3s ease',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Book Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <BookOpen 
            size={80} 
            style={{ 
              color: '#2bd97c',
              opacity: 0.8
            }} 
          />
        </div>

        {/* 404 Text */}
        <h1 style={{
          fontSize: '96px',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          margin: '0 0 16px 0',
          transition: 'color 0.3s ease'
        }}>
          404
        </h1>

        {/* Error Message */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          transition: 'color 0.3s ease'
        }}>
          Page Not Found
        </h2>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          marginBottom: '32px',
          lineHeight: '1.6',
          transition: 'color 0.3s ease'
        }}>
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link href="/">
            <button
              className="btn"
              style={{
                backgroundColor: '#2bd97c',
                color: '#032b41',
                padding: '12px 32px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '180px',
                height: '48px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#20ba68';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2bd97c';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Back to Home
            </button>
          </Link>

          <Link href="/for-you">
            <button
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                padding: '12px 32px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                border: '2px solid var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '180px',
                height: '48px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                e.currentTarget.style.color = 'var(--background)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Browse Books
            </button>
          </Link>
        </div>

        {/* Additional Help Text */}
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          marginTop: '32px',
          transition: 'color 0.3s ease'
        }}>
          Need help? <Link href="/contact" style={{ 
            color: '#2bd97c', 
            textDecoration: 'underline',
            transition: 'opacity 0.2s ease'
          }}>
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}