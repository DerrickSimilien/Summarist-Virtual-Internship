'use client';

import React, { useState } from 'react';
import { FileText, Sprout, Handshake, ChevronUp, ChevronDown } from 'lucide-react';

const ChoosePlanPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [expandedFaq, setExpandedFaq] = useState('trial');

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <div 
        className="relative"
        style={{ 
          background: 'linear-gradient(135deg, #2D5A87 0%, #1A365D 100%)',
          paddingTop: '80px',
          paddingBottom: '160px'
        }}
      >
        <div 
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '100px',
            background: 'white',
            borderRadius: '50% 50% 0 0 / 100px 100px 0 0'
          }}
        ></div>
        
        <div className="relative z-10 text-center" style={{ padding: '0 24px' }}>
          <h1 
            className="font-bold text-white"
            style={{ 
              fontSize: '48px',
              lineHeight: '1.1',
              marginBottom: '24px',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Get unlimited access to many amazing books to read
          </h1>
          
          <p 
            className="text-white"
            style={{ 
              fontSize: '20px',
              opacity: 0.9,
              marginBottom: '48px'
            }}
          >
            Turn ordinary moments into amazing learning opportunities
          </p>

          <div 
            className="relative mx-auto"
            style={{ 
              width: '240px',
              height: '240px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              className="relative"
              style={{ 
                width: '120px',
                height: '80px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '2px solid #e9ecef'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#28a745',
                  borderRadius: '50%'
                }}
              ></div>
              <div 
                style={{
                  position: 'absolute',
                  top: '24px',
                  left: '8px',
                  right: '8px',
                  height: '2px',
                  backgroundColor: '#28a745'
                }}
              ></div>
              <div 
                style={{
                  position: 'absolute',
                  top: '32px',
                  left: '8px',
                  width: '60%',
                  height: '2px',
                  backgroundColor: '#28a745'
                }}
              ></div>
              
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '8px',
                  width: '24px',
                  height: '40px'
                }}
              >
                <div 
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#8B5CF6',
                    borderRadius: '50%',
                    margin: '0 auto 2px'
                  }}
                ></div>
                <div 
                  style={{
                    width: '16px',
                    height: '20px',
                    backgroundColor: '#374151',
                    borderRadius: '2px',
                    margin: '0 auto'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="text-center"
        style={{ 
          padding: '64px 24px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          style={{ marginBottom: '64px' }}
        >
          <div className="text-center">
            <div 
              className="mx-auto mb-4 flex items-center justify-center"
              style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#1F2937',
                borderRadius: '16px'
              }}
            >
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 
              className="font-bold mb-2"
              style={{ 
                color: '#1F2937',
                fontSize: '18px'
              }}
            >
              Key ideas in few min
            </h3>
            <p 
              style={{ 
                color: '#6B7280',
                fontSize: '16px'
              }}
            >
              with many books to read
            </p>
          </div>

          <div className="text-center">
            <div 
              className="mx-auto mb-4 flex items-center justify-center"
              style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#1F2937',
                borderRadius: '16px'
              }}
            >
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h3 
              className="font-bold mb-2"
              style={{ 
                color: '#1F2937',
                fontSize: '18px'
              }}
            >
              3 million people growing
            </h3>
            <p 
              style={{ 
                color: '#6B7280',
                fontSize: '16px'
              }}
            >
              with Summarist everyday
            </p>
          </div>

          <div className="text-center">
            <div 
              className="mx-auto mb-4 flex items-center justify-center"
              style={{ 
                width: '64px',
                height: '64px',
                backgroundColor: '#1F2937',
                borderRadius: '16px'
              }}
            >
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <h3 
              className="font-bold mb-2"
              style={{ 
                color: '#1F2937',
                fontSize: '18px'
              }}
            >
              Precise recommendations
            </h3>
            <p 
              style={{ 
                color: '#6B7280',
                fontSize: '16px'
              }}
            >
              collections curated by experts
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 
            className="font-bold text-center mb-8"
            style={{ 
              color: '#1F2937',
              fontSize: '32px'
            }}
          >
            Choose the plan that fits you
          </h2>

          <div className="space-y-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div 
              className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPlan === 'yearly' ? 'border-green-400' : 'border-gray-200'
              }`}
              style={{ 
                backgroundColor: selectedPlan === 'yearly' ? '#F0FDF4' : 'white',
                border: selectedPlan === 'yearly' ? '2px solid #4ADE80' : '2px solid #E5E7EB'
              }}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedPlan === 'yearly'}
                    onChange={() => setSelectedPlan('yearly')}
                    className="w-5 h-5 mr-4"
                    style={{ accentColor: '#4ADE80' }}
                  />
                  <div>
                    <h3 
                      className="font-bold"
                      style={{ 
                        color: '#1F2937',
                        fontSize: '20px'
                      }}
                    >
                      Premium Plus Yearly
                    </h3>
                    <p 
                      className="font-bold"
                      style={{ 
                        color: '#1F2937',
                        fontSize: '24px',
                        margin: '4px 0'
                      }}
                    >
                      $99.99/year
                    </p>
                    <p 
                      style={{ 
                        color: '#6B7280',
                        fontSize: '14px'
                      }}
                    >
                      7-day free trial included
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center" style={{ margin: '24px 0' }}>
              <span style={{ color: '#9CA3AF', fontSize: '16px' }}>or</span>
            </div>

            <div 
              className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPlan === 'monthly' ? 'border-green-400' : 'border-gray-200'
              }`}
              style={{ 
                backgroundColor: selectedPlan === 'monthly' ? '#F0FDF4' : 'white',
                border: selectedPlan === 'monthly' ? '2px solid #4ADE80' : '2px solid #E5E7EB'
              }}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedPlan === 'monthly'}
                    onChange={() => setSelectedPlan('monthly')}
                    className="w-5 h-5 mr-4"
                    style={{ accentColor: '#4ADE80' }}
                  />
                  <div>
                    <h3 
                      className="font-bold"
                      style={{ 
                        color: '#1F2937',
                        fontSize: '20px'
                      }}
                    >
                      Premium Monthly
                    </h3>
                    <p 
                      className="font-bold"
                      style={{ 
                        color: '#1F2937',
                        fontSize: '24px',
                        margin: '4px 0'
                      }}
                    >
                      $9.99/month
                    </p>
                    <p 
                      style={{ 
                        color: '#6B7280',
                        fontSize: '14px'
                      }}
                    >
                      No trial included
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="font-bold text-white rounded-md transition-colors"
            style={{ 
              backgroundColor: '#22C55E',
              padding: '16px 48px',
              fontSize: '18px',
              marginTop: '32px',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#16A34A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#22C55E';
            }}
          >
            Start your free 7-day trial
          </button>

          <p 
            className="text-center mt-4"
            style={{ 
              color: '#9CA3AF',
              fontSize: '14px'
            }}
          >
            Cancel your trial at any time before it ends, and you won't be charged.
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div 
            className="border-b border-gray-200 py-6"
            style={{ borderBottom: '1px solid #E5E7EB' }}
          >
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFaq('trial')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <h3 
                className="font-bold"
                style={{ 
                  color: '#1F2937',
                  fontSize: '20px'
                }}
              >
                How does the free 7-day trial work?
              </h3>
              {expandedFaq === 'trial' ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </button>
            
            {expandedFaq === 'trial' && (
              <div 
                className="mt-4"
                style={{ 
                  color: '#4B5563',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}
              >
                Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.
              </div>
            )}
          </div>

          <div 
            className="border-b border-gray-200 py-6"
            style={{ borderBottom: '1px solid #E5E7EB' }}
          >
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFaq('switch')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <h3 
                className="font-bold"
                style={{ 
                  color: '#1F2937',
                  fontSize: '20px'
                }}
              >
                Can I switch subscriptions from monthly to yearly, or yearly to monthly?
              </h3>
              {expandedFaq === 'switch' ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </button>
            
            {expandedFaq === 'switch' && (
              <div 
                className="mt-4"
                style={{ 
                  color: '#4B5563',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}
              >
                Yes, you can switch between subscription plans at any time through your account settings.
              </div>
            )}
          </div>

          <div 
            className="border-b border-gray-200 py-6"
            style={{ borderBottom: '1px solid #E5E7EB' }}
          >
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFaq('premium')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <h3 
                className="font-bold"
                style={{ 
                  color: '#1F2937',
                  fontSize: '20px'
                }}
              >
                What's included in the Premium plan?
              </h3>
              {expandedFaq === 'premium' ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </button>
            
            {expandedFaq === 'premium' && (
              <div 
                className="mt-4"
                style={{ 
                  color: '#4B5563',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}
              >
                Premium includes unlimited access to our entire library of book summaries, audio versions, and personalized recommendations.
              </div>
            )}
          </div>

          <div 
            className="py-6"
          >
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFaq('cancel')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <h3 
                className="font-bold"
                style={{ 
                  color: '#1F2937',
                  fontSize: '20px'
                }}
              >
                Can I cancel during my trial or subscription?
              </h3>
              {expandedFaq === 'cancel' ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </button>
            
            {expandedFaq === 'cancel' && (
              <div 
                className="mt-4"
                style={{ 
                  color: '#4B5563',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}
              >
                Yes, you can cancel your subscription at any time. If you cancel during your trial period, you won't be charged.
              </div>
            )}
          </div>
        </div>
      </div>

      <footer 
        className="border-t"
        style={{ 
          borderTop: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB',
          padding: '48px 24px'
        }}
      >
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <div>
            <h4 
              className="font-bold mb-4"
              style={{ color: '#1F2937', fontSize: '16px' }}
            >
              Actions
            </h4>
            <ul className="space-y-2">
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Summarist Magazine</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Cancel Subscription</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Help</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Contact us</a></li>
            </ul>
          </div>

          <div>
            <h4 
              className="font-bold mb-4"
              style={{ color: '#1F2937', fontSize: '16px' }}
            >
              Useful Links
            </h4>
            <ul className="space-y-2">
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Pricing</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Summarist Business</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Gift Cards</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Authors & Publishers</a></li>
            </ul>
          </div>

          <div>
            <h4 
              className="font-bold mb-4"
              style={{ color: '#1F2937', fontSize: '16px' }}
            >
              Company
            </h4>
            <ul className="space-y-2">
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>About</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Careers</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Partners</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Code of Conduct</a></li>
            </ul>
          </div>

          <div>
            <h4 
              className="font-bold mb-4"
              style={{ color: '#1F2937', fontSize: '16px' }}
            >
              Other
            </h4>
            <ul className="space-y-2">
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Sitemap</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Legal Notice</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Terms of Service</a></li>
              <li><a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>Privacy Policies</a></li>
            </ul>
          </div>
        </div>

        <div 
          className="text-center mt-8 pt-8 border-t"
          style={{ borderTop: '1px solid #E5E7EB' }}
        >
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Copyright © 2023 Summarist.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChoosePlanPage;