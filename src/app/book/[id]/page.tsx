'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import SidebarLayout from '../../components/SidebarLayout';
import LoginModal from '../../components/LoginModal';
import { Star, Clock, BookOpen, Headphones, Bookmark, Lightbulb } from 'lucide-react';

/* -----------------------------------------
   Duration helpers (ID-first, then title)
   We PREFER our overrides (ID/TITLE) over any
   API-provided duration so pages are consistent.
------------------------------------------ */

const ID_DURATIONS: Record<string, string> = {
  // Can't Hurt Me
  '2l0idxm1rwv': '04:52',
  // How to Win Friends and Influence People in the Digital Age
  '5bxl50cz4bt': '03:24',
  // Rich Dad, Poor Dad (your current page id from the screenshot)
  'hyqzkhdyq7h': '05:38',
};

const TITLE_DURATIONS: Record<string, string> = {
  'how to win friends and influence people in the digital age': '03:24',
  "can't hurt me": '04:52',
  "can’t hurt me": '04:52',
  'mastery': '04:40',
  'atomic habits': '03:24',
  'how to talk to anyone': '03:22',
  'jim collins': '03:01',
  'good to great': '03:01',
  'the intelligent investor': '02:48',
  'the 4 day week': '02:20',
  'the 7 habits of highly effective people': '04:36',
  'zero to one': '03:24',

  // The ones you care about here
  'rich dad poor dad': '05:38',
  'the 10x rule': '03:18',
  'deep work': '02:50',

  'the 5 second rule': '02:45',
  'the power of now': '03:12',
  'think and grow rich': '04:25',
  'the 12 week year': '03:36',
  'getting things done': '02:24',
  'the second machine age': '03:36',
  'the lean startup': '03:23',
};

const normalizeTitle = (s: string) =>
  s
    ?.toLowerCase()
    .replace(/[’`]/g, "'")    // normalize curly/backtick to straight apostrophe
    .replace(/[^a-z0-9\s]/g, '') // strip punctuation (commas, colons, etc.)
    .replace(/\s+/g, ' ')     // collapse spaces
    .trim();

/** Returns a display duration like "04:52".
 *  IMPORTANT: We now use ID/TITLE overrides FIRST,
 *  then fall back to API-provided duration, then default.
 */
const getBookDurationSafe = (book: any): string => {
  if (!book) return '03:24';

  // 1) Known by ID (stable)
  if (book.id && ID_DURATIONS[book.id]) return ID_DURATIONS[book.id];

  // 2) Known by normalized title
  const t = normalizeTitle(book.title || '');
  if (t && TITLE_DURATIONS[t]) return TITLE_DURATIONS[t];

  // 3) If API provides a duration string, use it as a fallback
  if (book.duration && typeof book.duration === 'string') return book.duration;

  // 4) Default
  return '03:24';
};

const BookDetailPage = () => {
  const params = useParams() as { id?: string };
  const router = useRouter();
  const id = params?.id;
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookSaved, setIsBookSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBook(data);

        const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
        const isBookAlreadySaved = savedBooks.some((savedBook: any) => savedBook.id === id);
        setIsBookSaved(isBookAlreadySaved);
      } catch (err: any) {
        console.error('Error fetching book details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const formatRating = (rating: number) => (rating ? rating.toFixed(1) : '0.0');

  const handleReadClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (book?.subscriptionRequired) {
      router.push('/choose-plan');
      return;
    }
    router.push(`/book/${id}/read`);
  };

  const handleListenClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (book?.subscriptionRequired) {
      router.push('/choose-plan');
      return;
    }
    router.push(`/book/${id}/read`);
  };

  const handleLogin = (userData: any) => {
    console.log('User logged in:', userData);
  };

  const handleSaveBook = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');

    if (isBookSaved) {
      const updatedSavedBooks = savedBooks.filter((savedBook: any) => savedBook.id !== id);
      localStorage.setItem('savedBooks', JSON.stringify(updatedSavedBooks));
      setIsBookSaved(false);
    } else {
      const bookToSave = {
        ...book,
        id: id,
        savedAt: new Date().toISOString()
      };
      const updatedSavedBooks = [...savedBooks, bookToSave];
      localStorage.setItem('savedBooks', JSON.stringify(updatedSavedBooks));
      setIsBookSaved(true);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex justify-center items-center" style={{ height: '500px' }}>
          <div className="text-lg" style={{ color: '#6b7280' }}>
            Loading book details...
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error || !book) {
    return (
      <SidebarLayout>
        <div className="flex justify-center items-center" style={{ height: '500px' }}>
          <div className="text-lg" style={{ color: '#dc2626' }}>
            Error loading book: {error}
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <>
      <SidebarLayout>
        <div className="flex justify-center book-detail-container" style={{ width: '100%', padding: '0 24px' }}>
          <div style={{ maxWidth: '1000px', width: '100%' }}>
            <div className="book-detail-content flex" style={{ gap: '48px', marginTop: '32px' }}>
              {/* Left side - Book details */}
              <div className="book-info-section flex-1" style={{ maxWidth: '600px' }}>
                {/* Book title and author */}
                <div style={{ marginBottom: '24px' }}>
                  <h1
                    className="font-bold"
                    style={{
                      color: '#032B41',
                      marginBottom: '8px',
                      fontSize: '24px'
                    }}
                  >
                    {book.title}{book.subscriptionRequired && ' (Premium)'}
                  </h1>

                  <h2
                    style={{
                      color: '#032B41',
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}
                  >
                    {book.author}
                  </h2>

                  {book.subTitle && (
                    <p
                      style={{
                        color: '#032B41',
                        fontSize: '18px',
                        marginBottom: '16px'
                      }}
                    >
                      {book.subTitle}
                    </p>
                  )}

                  <div
                    style={{
                      width: '100%',
                      height: '1px',
                      backgroundColor: '#e5e7eb',
                      marginBottom: '16px'
                    }}
                  ></div>
                </div>

                {/* Rating, duration, and key ideas in 2x2 grid */}
                <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '24px', maxWidth: '400px' }}>
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <Star className="w-5 h-5" style={{ color: '#032B41', fill: 'none', stroke: '#032B41' }} />
                    <span className="font-medium" style={{ color: '#032B41' }}>
                      {formatRating(book.averageRating)} ({book.totalRating || 0} ratings)
                    </span>
                  </div>

                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <Clock className="w-5 h-5" style={{ color: '#032B41' }} />
                    <span style={{ color: '#032B41' }}>
                      {getBookDurationSafe(book)}
                    </span>
                  </div>

                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <BookOpen className="w-4 h-4" style={{ color: '#032B41' }} />
                    <Headphones className="w-4 h-4" style={{ color: '#032B41' }} />
                    <span className="text-sm" style={{ color: '#032B41' }}>
                      Audio & Text
                    </span>
                  </div>

                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <Lightbulb className="w-5 h-5" style={{ color: '#032B41', fill: 'none', stroke: '#032B41' }} />
                    <span style={{ color: '#032B41' }}>
                      {book.keyIdeas || 11} Key ideas
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#e5e7eb',
                    marginBottom: '24px'
                  }}
                ></div>

                {/* Action buttons */}
                <div className="flex" style={{ gap: '12px', marginBottom: '32px' }}>
                  <button
                    onClick={handleReadClick}
                    className="flex items-center justify-center rounded font-medium transition-colors"
                    style={{
                      backgroundColor: '#032B41',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '16px'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#032B41';
                    }}
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read
                  </button>

                  <button
                    onClick={handleListenClick}
                    className="flex items-center justify-center rounded font-medium transition-colors"
                    style={{
                      backgroundColor: '#032B41',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '16px'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#032B41';
                    }}
                  >
                    <Headphones className="w-5 h-5 mr-2" />
                    Listen
                  </button>
                </div>

                {/* Add to My Library / Saved in My Library */}
                <button
                  onClick={handleSaveBook}
                  className="flex items-center font-medium transition-colors"
                  style={{
                    marginBottom: '32px',
                    fontSize: '16px',
                    color: '#2563eb'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#2563eb';
                  }}
                >
                  <Bookmark
                    className="w-4 h-4 mr-1"
                    style={{
                      fill: isBookSaved ? '#2563eb' : 'none',
                      stroke: '#2563eb'
                    }}
                  />
                  {isBookSaved ? 'Saved in My Library' : 'Add title to My Library'}
                </button>

                {/* What's it about section */}
                <div style={{ marginBottom: '32px' }}>
                  <h3
                    className="font-bold"
                    style={{
                      color: '#032B41',
                      marginBottom: '16px',
                      fontSize: '18px'
                    }}
                  >
                    What's it about?
                  </h3>

                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap" style={{ gap: '12px', marginBottom: '16px' }}>
                      {book.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: '#F1F6F4',
                            color: '#032B41',
                            borderRadius: '4px',
                            fontSize: '14px',
                            padding: '16px 20px'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p
                    className="leading-relaxed"
                    style={{
                      color: '#032B41',
                      marginBottom: '24px',
                      fontSize: '14px'
                    }}
                  >
                    {book.bookDescription || 'No description available.'}
                  </p>
                </div>

                {/* About the author section */}
                {book.authorDescription && (
                  <div>
                    <h3
                      className="font-bold"
                      style={{
                        color: '#032B41',
                        marginBottom: '16px',
                        fontSize: '18px'
                      }}
                    >
                      About the author
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{
                        color: '#032B41',
                        fontSize: '14px'
                      }}
                    >
                      {book.authorDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Right side - Book cover */}
              <div className="book-cover-section flex-shrink-0">
                <img
                  src={book.imageLink}
                  alt={book.title}
                  className="object-cover rounded-lg shadow-lg"
                  style={{ width: '300px', height: '400px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .book-detail-container {
              padding: 0 20px !important;
            }

            .book-detail-content {
              flex-direction: column-reverse !important;
              gap: 24px !important;
              margin-top: 20px !important;
            }

            .book-cover-section {
              width: 100%;
              display: flex;
              justify-content: center;
              margin-bottom: 16px;
            }

            .book-cover-section img {
              width: 240px !important;
              height: 320px !important;
            }

            .book-info-section {
              max-width: 100% !important;
            }

            .book-info-section h1 {
              font-size: 22px !important;
            }
          }

          @media (max-width: 600px) {
            .book-detail-container {
              padding: 0 16px !important;
            }

            .book-detail-content {
              flex-direction: column-reverse !important;
              gap: 24px !important;
              margin-top: 16px !important;
            }

            .book-cover-section {
              width: 100%;
              display: flex;
              justify-content: center;
              margin-bottom: 16px;
            }

            .book-cover-section img {
              width: 200px !important;
              height: 267px !important;
            }

            .book-info-section {
              max-width: 100% !important;
            }

            .book-info-section h1 {
              font-size: 20px !important;
            }

            .book-info-section h2 {
              font-size: 14px !important;
            }
          }
        `}</style>
      </SidebarLayout>

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

export default BookDetailPage;
