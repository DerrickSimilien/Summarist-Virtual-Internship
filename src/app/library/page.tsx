'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import SidebarLayout from '../components/SidebarLayout';
import LoginModal from '../components/LoginModal';
import { Star, Clock } from 'lucide-react';

// Skeleton loader for library book cards
const LibraryBookSkeleton = () => (
  <div className="lib-card">
    <div
      style={{
        width: '100%',
        aspectRatio: '3/4',
        backgroundColor: '#e5e7eb',
        borderRadius: '8px',
        marginBottom: '12px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    />
    <div style={{ marginBottom: '4px' }}>
      <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '100%', marginBottom: '4px' }} />
      <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '80%', marginBottom: '4px' }} />
    </div>
    <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '60%', marginBottom: '8px' }} />
    <div className="flex items-center justify-between">
      <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '35%' }} />
      <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '25%' }} />
    </div>
  </div>
);

const MyLibraryPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [savedBooks, setSavedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setIsLoginModalOpen(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadSavedBooks = async () => {
      if (user) {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 2000)); // simulated delay
        const books = JSON.parse(localStorage.getItem('savedBooks') || '[]');
        setSavedBooks(books);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    loadSavedBooks();
  }, [user]);

  const getBookDuration = (bookTitle: string) => {
    const durations: Record<string, string> = {
      'How to Win Friends and Influence People': '03:24',
      "Can't Hurt Me": '04:52',
      Mastery: '04:40',
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
      'The Lean Startup': '03:23',
    };
    return durations[bookTitle] || '03:24';
  };

  const formatRating = (rating?: number) => (rating ? rating.toFixed(1) : '0.0');

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handleLogin = (userData: any) => {
    console.log('User logged in:', userData);
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <SidebarLayout>
        <div className="flex justify-center" style={{ width: '100%', padding: '0 24px' }}>
          <div style={{ maxWidth: '1000px', width: '100%' }}>
            {/* Saved Books */}
            <div style={{ marginTop: '32px', marginBottom: '48px' }}>
              <h2 className="font-bold" style={{ color: '#032B41', fontSize: '24px', marginBottom: '8px' }}>
                Saved Books
              </h2>

              {loading ? (
                <>
                  <div
                    style={{
                      height: '14px',
                      width: '60px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      marginBottom: '24px',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  />
                  <div className="library-grid">
                    {[...Array(8)].map((_, i) => (
                      <LibraryBookSkeleton key={i} />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
                    {savedBooks.length} item{savedBooks.length !== 1 ? 's' : ''}
                  </p>

                  {savedBooks.length > 0 ? (
                    <div className="library-grid">
                      {savedBooks.map((book, index) => (
                        <div
                          key={book.id || index}
                          className="lib-card cursor-pointer transition-transform hover:scale-105"
                          onClick={() => handleBookClick(book.id)}
                        >
                          <div className="relative" style={{ marginBottom: '12px' }}>
                            <img
                              src={book.imageLink}
                              alt={book.title}
                              className="cover"
                              style={{ aspectRatio: '3/4', objectFit: 'cover', borderRadius: 8 }}
                            />

                            {book.subscriptionRequired && (
                              <div
                                className="absolute top-2 left-2 text-white text-xs font-bold rounded"
                                style={{ backgroundColor: '#032B41', padding: '4px 8px' }}
                              >
                                Premium
                              </div>
                            )}
                          </div>

                          <div>
                            <h3
                              className="font-bold line-clamp-2"
                              style={{ color: '#032B41', fontSize: '14px', marginBottom: '4px', lineHeight: '1.3' }}
                            >
                              {book.title}
                            </h3>

                            <p className="line-clamp-1" style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
                              {book.author}
                            </p>

                            {book.subTitle && (
                              <p
                                className="line-clamp-2"
                                style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px', lineHeight: '1.2' }}
                              >
                                {book.subTitle}
                              </p>
                            )}

                            <div className="flex items-center justify-between" style={{ fontSize: '12px' }}>
                              <div className="flex items-center" style={{ gap: '4px' }}>
                                <Clock className="w-3 h-3" style={{ color: '#6b7280' }} />
                                <span style={{ color: '#6b7280' }}>{getBookDuration(book.title)}</span>
                              </div>

                              <div className="flex items-center" style={{ gap: '2px' }}>
                                <Star className="w-3 h-3" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                <span style={{ color: '#6b7280' }}>{formatRating(book.averageRating)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center" style={{ padding: '48px 0', color: '#6b7280' }}>
                      No saved books yet. Start building your library!
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Finished Section (keeps same grid rules when items exist) */}
            <div style={{ marginBottom: '48px' }}>
              <h2 className="font-bold" style={{ color: '#032B41', fontSize: '24px', marginBottom: '8px' }}>
                Finished
              </h2>

              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>0 items</p>

              <div
                className="rounded-lg text-center"
                style={{ backgroundColor: '#f3f4f6', padding: '32px 24px', maxWidth: '400px', margin: '0 auto' }}
              >
                <h3 className="font-bold" style={{ color: '#374151', fontSize: '18px', marginBottom: '8px' }}>
                  Done and dusted!
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.4' }}>
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
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* === Fixed-size card grid like the original === */
        .library-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, 160px); /* fixed column width */
          gap: 24px;
          justify-content: start; /* left align, no stretching */
        }

        .lib-card {
          width: 160px; /* match the column width */
        }

        .cover {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 8px;
        }

        /* Slightly smaller cards on small phones */
        @media (max-width: 600px) {
          .library-grid {
            grid-template-columns: repeat(auto-fill, 140px);
            gap: 20px;
          }
          .lib-card {
            width: 140px;
          }
        }
      `}</style>
    </>
  );
};

export default MyLibraryPage;
