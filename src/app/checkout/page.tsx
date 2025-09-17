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
      backgroundColor: '#f7f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e3e8ee',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937' 
            }}>
              Summarist
            </span>
            <span style={{
              backgroundColor: '#fbbf24',
              color: '#92400e',
              fontSize: '12px',
              fontWeight: '600',
              padding: '2px 8px',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              TEST MODE
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Left Side - Subscription Details */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 8px 0'
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

        {/* Right Side - Payment Form */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '32px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
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
                  backgroundColor: '#f9fafb'
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
                  borderBottom: 'none'
                }}
              />
              {/* Card Icons */}
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                gap: '8px'
              }}>
                <div style={{ width: '24px', height: '16px', backgroundColor: '#1a73e8', borderRadius: '2px', fontSize: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>VISA</div>
                <div style={{ width: '24px', height: '16px', backgroundColor: '#eb001b', borderRadius: '2px' }}></div>
                <div style={{ width: '24px', height: '16px', backgroundColor: '#0066cc', borderRadius: '2px' }}></div>
                <div style={{ width: '24px', height: '16px', backgroundColor: '#00a653', borderRadius: '2px' }}></div>
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
                  fontSize: '16px'
                }}
              />
              <input
                type="text"
                placeholder="CVC"
                value={formData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value)}
                style={{
                  flex: '1',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderBottomRightRadius: '6px',
                  borderTopLeftRadius: '0',
                  borderBottomLeftRadius: '0',
                  borderTopRightRadius: '0',
                  fontSize: '16px'
                }}
              />
              <div style={{
                width: '32px',
                height: '48px',
                border: '1px solid #d1d5db',
                borderLeft: 'none',
                borderBottomRightRadius: '6px',
                borderTopRightRadius: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>🔒</div>
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
                  fontSize: '16px'
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
                    borderBottom: 'none'
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
                  fontSize: '16px'
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