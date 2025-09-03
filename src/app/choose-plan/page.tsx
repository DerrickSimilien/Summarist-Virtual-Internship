'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { RiPlantFill } from 'react-icons/ri';
import { FaHandshake } from 'react-icons/fa6';

const ChoosePlanPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [expandedFaq, setExpandedFaq] = useState('trial');

  const [showFixedCTA, setShowFixedCTA] = useState(true);
  const inlineCtaRef = useRef(null);

  useEffect(() => {
    if (!inlineCtaRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFixedCTA(!entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(inlineCtaRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        paddingBottom: showFixedCTA ? 96 : 0,
      }}
    >
      <div
        className="relative wrapper"
        style={{
          backgroundColor: '#032B41',
          paddingTop: '80px',
          paddingBottom: '400px',
          borderBottomLeftRadius: '16rem',
          borderBottomRightRadius: '16rem',
        }}
      >
        <div className="z-10 text-center" style={{ padding: '0 24px' }}>
          <h1
            className="font-bold text-white"
            style={{
              fontSize: '48px',
              fontFamily: 'Roboto, sans-serif',
              lineHeight: '1.1',
              margin: '0px 0px 40px',
              maxWidth: '800px',
              margin: '0 auto 40px auto',
            }}
          >
            Get unlimited access to many amazing books to read
          </h1>

          <p
            className="text-white"
            style={{
              fontSize: '20px',
              fontFamily: 'Roboto, sans-serif',
              opacity: 0.9,
              margin: '0px 0px 32px',
            }}
          >
            Turn ordinary moments into amazing learning opportunities
          </p>

          <div className="plan__img--mask">
            <img
              src="/pricingtop.png"
              alt="Learning illustration"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="text-center"
        style={{
          padding: '64px 24px',
          maxWidth: '1000px',
          margin: '0 auto',
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
                backgroundColor: 'white',
                borderRadius: '16px',
                margin: '0 auto 16px auto',
              }}
            >
              <IoDocumentTextSharp className="w-14 h-14" style={{ color: '#032B41' }} />
            </div>
            <h3
              className="font-bold mb-2"
              style={{
                color: '#1F2937',
                fontSize: '18px',
              }}
            >
              Key ideas in few min
            </h3>
            <p
              style={{
                color: '#6B7280',
                fontSize: '16px',
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
                backgroundColor: 'white',
                borderRadius: '16px',
                margin: '0 auto 16px auto',
              }}
            >
              <RiPlantFill className="w-14 h-14" style={{ color: '#032B41' }} />
            </div>
            <h3
              className="font-bold mb-2"
              style={{
                color: '#1F2937',
                fontSize: '18px',
              }}
            >
              3 million people growing
            </h3>
            <p
              style={{
                color: '#6B7280',
                fontSize: '16px',
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
                backgroundColor: 'white',
                borderRadius: '16px',
                margin: '0 auto 16px auto',
              }}
            >
              <FaHandshake className="w-14 h-14" style={{ color: '#032B41' }} />
            </div>
            <h3
              className="font-bold mb-2"
              style={{
                color: '#1F2937',
                fontSize: '18px',
              }}
            >
              Precise recommendations
            </h3>
            <p
              style={{
                color: '#6B7280',
                fontSize: '16px',
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
              fontSize: '32px',
            }}
          >
            Choose the plan that fits you
          </h2>

          <div className="space-y-4" style={{ margin: '0 92.4px' }}>
            <div
              className="relative rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: '#F1F6F4',
                padding: '24px',
                border: selectedPlan === 'yearly' ? '4px solid #4ADE80' : '4px solid #bac8ce',
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
                    style={{
                      accentColor: 'transparent',
                      appearance: 'none',
                      border: '2px solid #032B41',
                      borderRadius: '50%',
                      position: 'relative',
                    }}
                  />
                  {selectedPlan === 'yearly' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '26px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#032B41',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  <div>
                    <h3
                      style={{
                        color: '#032B41',
                        fontSize: '18px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 'bold',
                        margin: '0px 0px 8px',
                      }}
                    >
                      Premium Plus Yearly
                    </h3>
                    <p
                      style={{
                        color: '#032B41',
                        fontSize: '24px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 'bold',
                        margin: '0px 0px 8px',
                      }}
                    >
                      $99.99/year
                    </p>
                    <p
                      style={{
                        color: '#6B757B',
                        fontSize: '14px',
                        fontFamily: 'Roboto, sans-serif',
                        margin: '0px',
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
              className="relative rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: '#F1F6F4',
                padding: '24px',
                border: selectedPlan === 'monthly' ? '4px solid #4ADE80' : '4px solid #bac8ce',
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
                    style={{
                      accentColor: 'transparent',
                      appearance: 'none',
                      border: '2px solid #032B41',
                      borderRadius: '50%',
                      position: 'relative',
                    }}
                  />
                  {selectedPlan === 'monthly' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '26px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#032B41',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  <div>
                    <h3
                      style={{
                        color: '#032B41',
                        fontSize: '18px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 'bold',
                        margin: '0px 0px 8px',
                      }}
                    >
                      Premium Monthly
                    </h3>
                    <p
                      style={{
                        color: '#032B41',
                        fontSize: '24px',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 'bold',
                        margin: '0px 0px 8px',
                      }}
                    >
                      $9.99/month
                    </p>
                    <p
                      style={{
                        color: '#6B757B',
                        fontSize: '14px',
                        fontFamily: 'Roboto, sans-serif',
                        margin: '0px',
                      }}
                    >
                      No trial included
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={inlineCtaRef} className="text-center">
            <button
              className="font-medium rounded-md transition-colors"
              style={{
                backgroundColor: '#2bd97c',
                color: '#032B41',
                padding: '16px 48px',
                fontSize: '16px',
                fontFamily: 'Roboto, sans-serif',
                marginTop: '32px',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#26c770';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2bd97c';
              }}
            >
              Start your free 7-day trial
            </button>

            <p
              className="text-center mt-4"
              style={{
                color: '#9CA3AF',
                fontSize: '14px',
              }}
            >
              Cancel your trial at any time before it ends, and you won't be charged.
            </p>
          </div>
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
                  fontSize: '20px',
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
                  lineHeight: '1.6',
                }}
              >
                Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to
                continue your subscription, and you will only be billed when the trial period expires. With Premium
                access, you can learn at your own pace and as frequently as you desire, and you may terminate your
                subscription prior to the conclusion of the 7-day free trial.
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
                  fontSize: '20px',
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
                  lineHeight: '1.6',
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
                  fontSize: '20px',
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
                  lineHeight: '1.6',
                }}
              >
                Premium includes unlimited access to our entire library of book summaries, audio versions, and
                personalized recommendations.
              </div>
            )}
          </div>

          <div className="py-6">
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFaq('cancel')}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <h3
                className="font-bold"
                style={{
                  color: '#1F2937',
                  fontSize: '20px',
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
                  lineHeight: '1.6',
                }}
              >
                Yes, you can cancel your subscription at any time. If you cancel during your trial period, you won't be
                charged.
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
          padding: '48px 24px',
        }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#1F2937', fontSize: '16px' }}>
              Actions
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Summarist Magazine
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Cancel Subscription
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Help
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#1F2937', fontSize: '16px' }}>
              Useful Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Summarist Business
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Gift Cards
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Authors & Publishers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#1F2937', fontSize: '16px' }}>
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  About
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Partners
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Code of Conduct
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#1F2937', fontSize: '16px' }}>
              Other
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Sitemap
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Legal Notice
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#6B7280', fontSize: '14px' }}>
                  Privacy Policies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="text-center mt-8 pt-8 border-t"
          style={{ borderTop: '1px solid #E5E7EB' }}
        >
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Copyright © 2023 Summarist.</p>
        </div>
      </footer>

      {showFixedCTA && (
        <div
          className="fixed bottom-0 left-0 right-0 bg-white z-50"
          style={{
            padding: '16px 24px'
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <button
              className="font-medium rounded-md transition-colors"
              style={{
                backgroundColor: '#2bd97c',
                color: '#032B41',
                padding: '16px 48px',
                fontSize: '16px',
                fontFamily: 'Roboto, sans-serif',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#26c770';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2bd97c';
              }}
            >
              Start your free 7-day trial
            </button>

            <p
              className="text-center"
              style={{
                color: '#6b757b',
                fontSize: '12px',
                fontFamily: 'Roboto, sans-serif',
                marginTop: '8px',
              }}
            >
              Cancel your trial at any time before it ends, and you won't be charged.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoosePlanPage;