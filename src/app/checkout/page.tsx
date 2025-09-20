'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'yearly';
  
  const [formData, setFormData] = useState({
    email: 'santanaerick1000@gmail.com', // Pre-filled as shown in screenshot
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: 'United States',
    address: ''
  });

  const planDetails = {
    yearly: {
      title: 'Subscribe to Summarist Premium Plus',
      price: '$99.00',
      period: 'per year'
    },
    monthly: {
      title: 'Subscribe to Summarist Premium',
      price: '$9.99',
      period: 'per month'
    }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Processing subscription...', formData);
    
    // For demo purposes, you could redirect to a success page
    // router.push('/subscription-success');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex'
    }}>
      {/* Left Side - Slightly off-white background with subscription details */}
      <div style={{ 
        flex: '1',
        backgroundColor: '#fafafa',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header with back arrow, Summarist, and TEST MODE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1A1A1AE6' 
            }}>
              Summarist
            </span>
            <span style={{
              backgroundColor: '#fbbf24',
              color: '#92400e',
              fontSize: '14px',
              fontWeight: '600',
              padding: '2px 8px',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              TEST MODE
            </span>
          </div>
        </div>

        {/* Subscription Details */}
        <div>
          <h1 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1A1A1A99',
            margin: '0 0 8px 0',
            lineHeight: '1.2'
          }}>
            {currentPlan.title}
          </h1>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '16px 0'
          }}>
            {currentPlan.price}
            <span style={{
              fontSize: '16px',
              fontWeight: '400',
              color: '#6b7280',
              marginLeft: '8px'
            }}>
              {currentPlan.period}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Pure white background with payment form and shadow separation */}
      <div style={{ 
        flex: '1',
        backgroundColor: 'white',
        padding: '40px 48px',
        borderLeft: '1px solid #e5e7eb',
        boxShadow: '-4px 0 6px -1px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 24px 0'
        }}>
          Contact information
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: '#f9fafb',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '32px 0 16px 0'
          }}>
            Payment method
          </h3>

          <p style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            margin: '0 0 8px 0'
          }}>
            Card information
          </p>

          {/* Card Number */}
          <div style={{
            position: 'relative',
            marginBottom: '1px'
          }}>
            <input
              type="text"
              placeholder="1234 1234 1234 1234"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '120px',
                border: '1px solid #d1d5db',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
                borderTopLeftRadius: '6px',
                borderTopRightRadius: '6px',
                fontSize: '16px',
                borderBottom: 'none',
                boxSizing: 'border-box'
              }}
            />
            {/* Card Icons */}
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: '4px'
            }}>
              {/* Visa */}
              <div style={{ width: '32px', height: '20px', backgroundColor: 'white', borderRadius: '2px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
                  <path d="M7.7 1.4L6.3 6.6H4.8L4 2.9C3.9 2.5 3.7 2.3 3.3 2.1C2.8 1.8 2.1 1.5 1.4 1.3L1.5 1.4H4.2C4.6 1.4 4.9 1.7 5 2.1L5.9 6.6H7.4L9.2 1.4H7.7Z" fill="#1434CB"/>
                  <path d="M12.1 1.4L10.7 6.6H9.2L10.6 1.4H12.1Z" fill="#1434CB"/>
                  <path d="M15.9 2.8C15.9 2.4 16.2 2.2 16.7 2.2C17.3 2.2 18 2.4 18.5 2.7L18.9 1.6C18.4 1.4 17.7 1.2 16.9 1.2C15.4 1.2 14.4 2 14.4 3.1C14.4 3.9 15.1 4.4 15.6 4.7C16.2 5 16.4 5.2 16.4 5.5C16.4 5.9 15.9 6.1 15.4 6.1C14.7 6.1 14 5.9 13.4 5.6L13 6.7C13.7 7 14.5 7.1 15.3 7.1C17 7.1 18 6.3 18 5.1C18 3.7 15.9 3.6 15.9 2.8Z" fill="#1434CB"/>
                  <path d="M22.2 6.6H23.6L22.3 1.4H21C20.7 1.4 20.4 1.6 20.3 1.9L18.1 6.6H19.7L20.1 5.5H22L22.2 6.6ZM20.5 4.3L21.2 2.5L21.6 4.3H20.5Z" fill="#1434CB"/>
                </svg>
              </div>
              {/* Mastercard */}
              <div style={{ width: '32px', height: '20px', backgroundColor: 'white', borderRadius: '2px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                  <circle cx="9" cy="7" r="7" fill="#EB001B"/>
                  <circle cx="15" cy="7" r="7" fill="#F79E1B"/>
                  <path d="M12 2.5C13.1 3.4 13.9 4.7 14.2 6.2H9.8C10.1 4.7 10.9 3.4 12 2.5Z" fill="#FF5F00"/>
                  <path d="M12 11.5C10.9 10.6 10.1 9.3 9.8 7.8H14.2C13.9 9.3 13.1 10.6 12 11.5Z" fill="#FF5F00"/>
                </svg>
              </div>
              {/* American Express */}
              <div style={{ width: '32px', height: '20px', backgroundColor: '#006FCF', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="12" viewBox="0 0 20 12" fill="white">
                  <path d="M2.5 2H1L0 4.5H2.5L3.5 2ZM6 2H4.5L3.5 4.5H6L7 2ZM9.5 2H8L7 4.5H9.5L10.5 2ZM13 2H11.5L10.5 4.5H13L14 2ZM16.5 2H15L14 4.5H16.5L17.5 2ZM20 2H18.5L17.5 4.5H20L20 2Z"/>
                  <path d="M2.5 5.5H1L0 8H2.5L3.5 5.5ZM6 5.5H4.5L3.5 8H6L7 5.5ZM9.5 5.5H8L7 8H9.5L10.5 5.5ZM13 5.5H11.5L10.5 8H13L14 5.5ZM16.5 5.5H15L14 8H16.5L17.5 5.5ZM20 5.5H18.5L17.5 8H20L20 5.5Z"/>
                </svg>
              </div>
              {/* JCB */}
              <div style={{ width: '32px', height: '20px', backgroundColor: 'white', borderRadius: '2px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                  <rect width="20" height="12" fill="white"/>
                  <path d="M2 2H6V10H2V2Z" fill="#006FCF"/>
                  <path d="M7 2H11V10H7V2Z" fill="#CC0000"/>
                  <path d="M12 2H16V10H12V2Z" fill="#00A651"/>
                  <text x="2.5" y="8" fill="white" fontSize="3" fontWeight="bold">J</text>
                  <text x="7.5" y="8" fill="white" fontSize="3" fontWeight="bold">C</text>
                  <text x="12.5" y="8" fill="white" fontSize="3" fontWeight="bold">B</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Expiry and CVC */}
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              placeholder="MM / YY"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              style={{
                flex: '1',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderBottomLeftRadius: '6px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
                borderTopLeftRadius: '0',
                borderRight: 'none',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ position: 'relative', flex: '1' }}>
              <input
                type="text"
                placeholder="CVC"
                value={formData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '50px',
                  border: '1px solid #d1d5db',
                  borderBottomRightRadius: '6px',
                  borderTopLeftRadius: '0',
                  borderBottomLeftRadius: '0',
                  borderTopRightRadius: '0',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              {/* Card with 123 icon */}
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '28px',
                height: '18px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                fontWeight: 'bold',
                color: '#666'
              }}>
                123
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Cardholder name
            </label>
            <input
              type="text"
              placeholder="Full name on card"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Billing Address */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Billing address
            </label>
            
            {/* Country Dropdown */}
            <div style={{ position: 'relative', marginBottom: '1px' }}>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  borderBottomLeftRadius: '0',
                  borderBottomRightRadius: '0',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  appearance: 'none',
                  paddingRight: '40px',
                  borderBottom: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Spain">Spain</option>
                <option value="Italy">Italy</option>
                <option value="Japan">Japan</option>
                <option value="Brazil">Brazil</option>
              </select>
              <ChevronDown style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#6b7280'
              }} />
            </div>

            {/* Address */}
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderBottomLeftRadius: '6px',
                borderBottomRightRadius: '6px',
                borderTopLeftRadius: '0',
                borderTopRightRadius: '0',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.4'
          }}>
            <span style={{ textDecoration: 'underline' }}>Same address (required)</span>
          </p>

          {/* Subscribe Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#1d4ed8',
              color: 'white',
              padding: '16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e40af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
          >
            Subscribe
          </button>

          {/* Footer Text */}
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            lineHeight: '1.4',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              Notwithstanding the logo displayed above, when paying with a co-branded eftpos debit card, your payment may be processed through either card network.
            </p>
            <p style={{ margin: '0' }}>
              By subscribing, you authorize Summarist to charge you according to the terms until you cancel.
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;