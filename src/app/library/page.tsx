'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import SidebarLayout from '../components/SidebarLayout';
import LoginModal from '../components/LoginModal';
import { Star, Clock } from 'lucide-react';

const MyLibraryPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setIsLoginModalOpen(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load saved books from localStorage
  useEffect(() => {
    if (user) {
      const books = JSON.parse(localStorage.getItem('savedBooks') || '[]');
      setSavedBooks(books);
    }
  }, [user]);

  // Hardcoded durations matching the original site
  const getBookDuration = (bookTitle) => {
    const durations = {
      'How to Win Friends and Influence People': '03:24',
      "Can't Hurt Me": '04:52',
      "Can't Hurt Me": '04:52',
      'Mastery': '04:40',
      'Atomic Habits': '03:24',
      'How to Talk to Anyone': '03:22',
      'Jim Collins': '03:01',
      'Good to Great': '03:01',
      'The Intelligent Investor': '02:48',
      'The 4 Day Week': '02:20',
      'The 7 Habits of Highly Effective People': '04:36',
      'Zero to One': '03:24',
      'Rich Dad Poor Dad': '05:38',
      'The 10X Rule': '03:18',
      'Deep Work': '02:50',
      'The 5 Second Rule': '02:45',
      'The Power of Now': '03:12',
      'Think and Grow Rich': '04:25',
      'The 12 Week Year': '03:36',
      'Getting Things Done': '02:24',
      'The Second Machine Age': '03:36',
      'The Lean Startup': '03:23'
    };
    return durations[bookTitle] || '03:24';
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const handleBookClick = (bookId) => {
    router.push(`/book/${bookId}`);
  };

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setIsLoginModalOpen(false);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex justify-center items-center" style={{ height: '500px' }}>
          <div className="text-lg" style={{ color: '#6b7280' }}>
            Loading...
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <>
      <SidebarLayout>
        <div className="flex justify-center" style={{ width: '100%', padding: '0 24px' }}>
          <div style={{ maxWidth: '1000px', width: '100%' }}>
            
            {/* Saved Books Section */}
            <div style={{ marginTop: '32px', marginBottom: '48px' }}>
              <h2 
                className="font-bold"
                style={{ 
                  color: '#032B41', 
                  fontSize: '24px',
                  marginBottom: '8px'
                }}
              >
                Saved Books
              </h2>
              
              <p 
                style={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  marginBottom: '24px'
                }}
              >
                {savedBooks.length} item{savedBooks.length !== 1 ? 's' : ''}
              </p>

              {savedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" style={{ gap: '24px' }}>
                  {savedBooks.map((book, index) => (
                    <div 
                      key={book.id || index}
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={() => handleBookClick(book.id)}
                    >
                      {/* Book Cover Container */}
                      <div className="relative" style={{ marginBottom: '12px' }}>
                        <img 
                          src={book.imageLink} 
                          alt={book.title}
                          className="w-full rounded-lg shadow-lg"
                          style={{ 
                            aspectRatio: '3/4',
                            objectFit: 'cover'
                          }}
                        />
                        
                        {/* Premium Badge */}
                        {book.subscriptionRequired && (
                          <div 
                            className="absolute top-2 left-2 text-white text-xs font-bold rounded"
                            style={{ 
                              backgroundColor: '#032B41',
                              padding: '4px 8px'
                            }}
                          >
                            Premium
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div>
                        <h3 
                          className="font-bold line-clamp-2"
                          style={{ 
                            color: '#032B41',
                            fontSize: '14px',
                            marginBottom: '4px',
                            lineHeight: '1.3'
                          }}
                        >
                          {book.title}
                        </h3>
                        
                        <p 
                          className="line-clamp-1"
                          style={{ 
                            color: '#6b7280',
                            fontSize: '12px',
                            marginBottom: '4px'
                          }}
                        >
                          {book.author}
                        </p>

                        {book.subTitle && (
                          <p 
                            className="line-clamp-2"
                            style={{ 
                              color: '#6b7280',
                              fontSize: '12px',
                              marginBottom: '8px',
                              lineHeight: '1.2'
                            }}
                          >
                            {book.subTitle}
                          </p>
                        )}

                        {/* Rating and Duration */}
                        <div className="flex items-center justify-between" style={{ fontSize: '12px' }}>
                          <div className="flex items-center" style={{ gap: '4px' }}>
                            <Clock className="w-3 h-3" style={{ color: '#6b7280' }} />
                            <span style={{ color: '#6b7280' }}>
                              {getBookDuration(book.title)}
                            </span>
                          </div>
                          
                          <div className="flex items-center" style={{ gap: '2px' }}>
                            <Star className="w-3 h-3" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                            <span style={{ color: '#6b7280' }}>
                              {formatRating(book.averageRating)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div 
                  className="text-center"
                  style={{ 
                    padding: '48px 0',
                    color: '#6b7280'
                  }}
                >
                  No saved books yet. Start building your library!
                </div>
              )}
            </div>

            {/* Finished Section */}
            <div style={{ marginBottom: '48px' }}>
              <h2 
                className="font-bold"
                style={{ 
                  color: '#032B41', 
                  fontSize: '24px',
                  marginBottom: '8px'
                }}
              >
                Finished
              </h2>
              
              <p 
                style={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  marginBottom: '24px'
                }}
              >
                0 items
              </p>

              {/* Gray "Done and dusted" box */}
              <div 
                className="rounded-lg text-center"
                style={{ 
                  backgroundColor: '#f3f4f6',
                  padding: '32px 24px',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}
              >
                <h3 
                  className="font-bold"
                  style={{ 
                    color: '#374151',
                    fontSize: '18px',
                    marginBottom: '8px'
                  }}
                >
                  Done and dusted!
                </h3>
                <p 
                  style={{ 
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}
                >
                  When you finish a book, you can find it here later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center"
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LoginModal 
              isOpen={isLoginModalOpen} 
              onClose={() => setIsLoginModalOpen(false)}
              onLogin={handleLogin}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MyLibraryPage;