'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import LoginModal from '../components/LoginModal';

// ✅ React Icons (replacing the three Lucide icons only)
import { IoDocumentText } from 'react-icons/io5';
import { RiPlantFill } from 'react-icons/ri';
import { FaHandshake } from 'react-icons/fa6';

const ChoosePlanPage = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('trial');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [showFixedCTA, setShowFixedCTA] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const inlineCtaRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser && showLoginModal) {
        setShowLoginModal(false);
      }
    });

    return () => unsubscribe();
  }, [showLoginModal, selectedPlan, router]);

  useEffect(() => {
    if (!inlineCtaRef.current || !footerRef.current) return;

    let inlineCtaVisible = true;
    let footerVisible = false;

    const updateFixedCTA = () => {
      setShowFixedCTA(!inlineCtaVisible && !footerVisible);
    };

    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 5);
    };

    handleScroll();

    const inlineCtaObserver = new IntersectionObserver(([entry]) => {
      inlineCtaVisible = entry.isIntersecting;
      updateFixedCTA();
    }, { threshold: 0.5 });

    const footerObserver = new IntersectionObserver(([entry]) => {
      footerVisible = entry.isIntersecting;
      updateFixedCTA();
    }, { threshold: 0.1 });

    window.addEventListener('scroll', handleScroll);

    inlineCtaObserver.observe(inlineCtaRef.current);
    footerObserver.observe(footerRef.current);

    return () => {
      inlineCtaObserver.disconnect();
      footerObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleFaq = (faqId: string | null) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const getButtonText = () =>
    selectedPlan === 'yearly' ? 'Start your free 7-day trial' : 'Start your first month';

  const getDisclaimerText = () =>
    selectedPlan === 'yearly'
      ? "Cancel your trial at any time before it ends, and you won't be charged."
      : '30-day money back guarantee, no questions asked.';

  const handleButtonClick = () => {
    if (user) {
      router.push(`/checkout?plan=${selectedPlan}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
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
        className="relative wrapper choose-header"
        style={{
          backgroundColor: '#032B41',
          paddingTop: '80px',
          paddingBottom: '270px',
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
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Get unlimited access to many amazing books to read
          </h1>

        <p
          className="text-white"
          style={{
             color: '#ffffff',
            fontSize: '20px',
            fontFamily: 'Roboto, sans-serif',
            // opacity: 3,
            margin: '0px 0px 32px',
          }}
        >
          Turn ordinary moments into amazing learning opportunities
        </p>

          <div 
            className="plan__img--mask"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '340px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <img
              src="/pricingtop.png"
              alt="Learning illustration"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>

      <div className="text-center" style={{ padding: '64px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12" style={{ marginBottom: '64px' }}>
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
              <IoDocumentText size={56} style={{ color: '#032B41' }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: '#1F2937', fontSize: '18px' }}>
              Key ideas in few min
            </h3>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>with many books to read</p>
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
              <RiPlantFill size={56} style={{ color: '#032B41' }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: '#1F2937', fontSize: '18px' }}>
              3 million people growing
            </h3>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>with Summarist everyday</p>
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
              <FaHandshake size={56} style={{ color: '#032B41' }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: '#1F2937', fontSize: '18px' }}>
              Precise recommendations
            </h3>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>collections curated by experts</p>
          </div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h2 className="font-bold text-center mb-8" style={{ color: '#1F2937', fontSize: '32px' }}>
            Choose the plan that fits you
          </h2>

          {/* ⬇️ Only change here: wider wrapper + taller cards */}
          <div
            className="space-y-4 plan-cards"
            style={{
              maxWidth: '550px',         // wider on mobile
              padding: '0 24px',
              margin: '0 auto',          // center it
            }}
          >
            <div
              className="relative rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: '#F1F6F4',
                padding: '24px',
                minHeight: '168px',       // taller rectangle
                border: selectedPlan === 'yearly' ? '4px solid #4ADE80' : '4px solid #bac8ce',
              }}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
  style={{
    position: 'relative',
    width: 20,
    height: 20,
    marginRight: 16,
    flex: '0 0 20px',
  }}
>
  <input
    type="radio"
    checked={selectedPlan === 'yearly'}
    onChange={() => setSelectedPlan('yearly')}
    style={{
      accentColor: 'transparent',
      appearance: 'none',
      width: '100%',
      height: '100%',
      border: '2px solid #032B41',
      borderRadius: '50%',
      display: 'block',
      background: 'transparent',
    }}
  />
  {selectedPlan === 'yearly' && (
    <span
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#032B41',
        pointerEvents: 'none',
      }}
    />
  )}
</div>

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
                    <p style={{ color: '#6B757B', fontSize: '14px', fontFamily: 'Roboto, sans-serif', margin: '0px' }}>
                      7-day free trial included
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center my-6">
              <div className="w-20 h-px bg-gray-200 mr-4" />
              <span className="text-gray-400 text-base">or</span>
              <div className="w-20 h-px bg-gray-200 ml-4" />
            </div>

            <div
              className="relative rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: '#F1F6F4',
                padding: '24px',
                minHeight: '168px',       // taller rectangle
                border: selectedPlan === 'monthly' ? '4px solid #4ADE80' : '4px solid #bac8ce',
              }}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                 <div
  style={{
    position: 'relative',
    width: 20,
    height: 20,
    marginRight: 16,
    flex: '0 0 20px',
  }}
>
  <input
    type="radio"
    checked={selectedPlan === 'monthly'}
    onChange={() => setSelectedPlan('monthly')}
    style={{
      accentColor: 'transparent',
      appearance: 'none',
      width: '100%',
      height: '100%',
      border: '2px solid #032B41',
      borderRadius: '50%',
      display: 'block',
      background: 'transparent',
    }}
  />
  {selectedPlan === 'monthly' && (
    <span
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#032B41',
        pointerEvents: 'none',
      }}
    />
  )}
</div>

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
                    <p style={{ color: '#6B757B', fontSize: '14px', fontFamily: 'Roboto, sans-serif', margin: '0px' }}>
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
              onClick={handleButtonClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#26c770';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2bd97c';
              }}
            >
              {getButtonText()}
            </button>

            {!isAtTop && (
              <p className="text-center text-gray-400 text-sm"  style={{ marginTop: '24px' }}  >{getDisclaimerText()}</p>
            )}
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-6 mt-14">
          {[
            {
              id: 'trial',
              q: 'How does the free 7-day trial work?',
              a: `Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.`,
            },
            {
              id: 'switch',
              q: 'Can I switch subscriptions from monthly to yearly, or yearly to monthly?',
              a: `While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.`,
            },
            {
              id: 'premium',
              q: "What's included in the Premium plan?",
              a: `Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.`,
            },
            {
              id: 'cancel',
              q: 'Can I cancel during my trial or subscription?',
              a: `You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.`,
            },
          ].map((item, idx, arr) => {
            const isOpen = expandedFaq === item.id;
            const isLast = idx === arr.length - 1;
            return (
              <div
                key={item.id}
                className={`${!isLast ? 'border-b border-gray-200' : ''}`}
                style={{ paddingTop: '32px', paddingBottom: '32px' }}
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="flex w-full items-center justify-between text-left"
                  style={{ background: 'transparent', border: 'none', padding: '0', cursor: 'pointer' }}
                  aria-expanded={isOpen}
                >
                  <h3 className="text-[22px] leading-snug font-medium text-[#032B41] m-0">
                    {item.q}
                  </h3>
                  {isOpen ? (
                    <ChevronUp className="shrink-0 w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="shrink-0 w-6 h-6 text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="text-[16px] leading-relaxed text-gray-600 text-left" style={{ paddingTop: '16px', textAlign: 'left', lineHeight: '1.6' }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <footer
        ref={footerRef}
        style={{
          backgroundColor: '#EAF6F2',
          padding: '48px 24px',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <h4 style={{ 
              color: '#032B41', 
              fontSize: '18px', 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: '600',
              margin: '0px 0px 16px' 
            }}>
              Actions
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Summarist Magazine
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Cancel Subscription
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Help
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ 
              color: '#032B41', 
              fontSize: '18px', 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: '600',
              margin: '0px 0px 16px' 
            }}>
              Useful Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Summarist Business
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Gift Cards
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Authors &amp; Publishers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ 
              color: '#032B41', 
              fontSize: '18px', 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: '600',
              margin: '0px 0px 16px' 
            }}>
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  About
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Careers
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Partners
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Code of Conduct
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ 
              color: '#032B41', 
              fontSize: '18px', 
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: '600',
              margin: '0px 0px 16px' 
            }}>
              Other
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Sitemap
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Legal Notice
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" style={{ color: '#394547', fontSize: '14px', fontFamily: 'Roboto, sans-serif' }}>
                  Privacy Policies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center" style={{ marginTop: '65px', paddingTop: '32px' }}>
          <p style={{ 
            color: '#032B41', 
            fontSize: '16px', 
            fontFamily: 'Roboto, sans-serif', 
            fontWeight: '500',
            margin: '0'
          }}>
            Copyright © 2023 Summarist.
          </p>
        </div>
      </footer>

      {showFixedCTA && (
        <div className="fixed bottom-0 left-0 right-0 bg-white z-50" style={{ padding: '16px 24px' }}>
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
              onClick={handleButtonClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#26c770';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2bd97c';
              }}
            >
              {getButtonText()}
            </button>

            <p
              className="text-center"
              style={{ color: '#6b757b', fontSize: '12px', fontFamily: 'Roboto, sans-serif', marginTop: '16px' }}
            >
              {getDisclaimerText()}
            </p>
          </div>
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
          redirectPath="/choose-plan"
        />
      )}
    </div>
  );
};

export default ChoosePlanPage;