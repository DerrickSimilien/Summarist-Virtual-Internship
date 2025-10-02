'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '../components/SidebarLayout';
import { Play, Clock } from 'lucide-react';

// Skeleton loader for the selected book card
const SelectedBookSkeleton = () => (
  <div 
    className="rounded-lg flex items-start"
    style={{ 
      backgroundColor: '#e5e7eb',
      maxWidth: '640px', 
      minHeight: '144px',
      padding: '32px 24px 24px 24px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }}
  >
    <div className="flex-1" style={{ paddingRight: '20px', maxWidth: '288px' }}>
      <div style={{ height: '16px', backgroundColor: '#d1d5db', borderRadius: '4px', marginBottom: '8px', width: '100%' }}></div>
      <div style={{ height: '16px', backgroundColor: '#d1d5db', borderRadius: '4px', marginBottom: '8px', width: '90%' }}></div>
      <div style={{ height: '16px', backgroundColor: '#d1d5db', borderRadius: '4px', width: '80%' }}></div>
    </div>
    
    <div style={{ width: '1px', height: '112px', backgroundColor: '#d1d5db', margin: '0 20px' }}></div>
    
    <div className="flex items-center" style={{ gap: '12px' }}>
      <div style={{ width: '88px', height: '128px', backgroundColor: '#d1d5db', borderRadius: '8px' }}></div>
      <div className="flex flex-col">
        <div style={{ height: '20px', width: '120px', backgroundColor: '#d1d5db', borderRadius: '4px', marginBottom: '8px' }}></div>
        <div style={{ height: '14px', width: '100px', backgroundColor: '#d1d5db', borderRadius: '4px', marginBottom: '12px' }}></div>
        <div className="flex items-center" style={{ gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#d1d5db', borderRadius: '50%' }}></div>
          <div style={{ height: '14px', width: '80px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton loader for book cards
const BookCardSkeleton = () => (
  <div 
    className="flex-shrink-0" 
    style={{ width: '140px', paddingTop: '40px' }}
  >
    <div style={{ marginBottom: '8px' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '180px', 
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      ></div>
    </div>
    
    <div style={{ paddingTop: '2px' }}>
      <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '6px', width: '100%' }}></div>
      <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '6px', width: '80%' }}></div>
      <div className="flex items-center justify-between" style={{ marginTop: '6px' }}>
        <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '40%' }}></div>
        <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '30%' }}></div>
      </div>
    </div>
  </div>
);

// Smaller BookCard component
const RecommendedBookCard = ({ book }) => {
  const router = useRouter();

  const handleBookClick = () => {
    router.push(`/book/${book.id}`);
  };

  const getBookDuration = (bookTitle) => {
    const durations = {
      'How to Win Friends and Influence People': '03:24',
      "Can't Hurt Me": '04:52', 
      'Mastery': '04:40',
      'Atomic Habits': '03:24',
      'How to Talk to Anyone': '03:22',
      'Jim Collins': '03:01',
      'Good to Great': '03:01',
      'The Intelligent Investor': '02:48',
      'The 4 Day Week': '02:20',
      'The 7 Habits of Highly Effective People': '04:36',
      'Rich Dad Poor Dad': '05:38',
      'The Power of Now': '03:12',
      'Think and Grow Rich': '04:25',
      'Zero to One': '03:24',
      'The 10X Rule': '04:15',
      'Deep Work': '04:02',
      'The Second Machine Age': '03:36',
      'The 5 Second Rule': '02:45',
      'The 12 Week Year': '03:36',
      'Getting Things Done': '02:24'
    };
    return durations[bookTitle] || '03:24';
  };

  return (
    <div 
      className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105" 
      style={{ width: '140px', paddingTop: '40px' }}
      onClick={handleBookClick}
    >
      <div className="relative" style={{ marginBottom: '8px' }}>
        <img 
          src={book.imageLink} 
          alt={book.title}
          className="w-full object-cover rounded-lg shadow-sm"
          style={{ height: '180px' }}
        />
        {book.subscriptionRequired && (
          <div 
            className="absolute text-white text-xs px-2 py-1 rounded font-medium"
            style={{ 
              backgroundColor: '#032B41',
              top: '-36px',
              right: '6px'
            }}
          >
            Premium
          </div>
        )}
      </div>
      
      <div style={{ paddingTop: '2px' }}>
        <h3 
          className="font-semibold line-clamp-2" 
          style={{ 
            color: '#111827', 
            marginBottom: '2px',
            lineHeight: '1.3',
            fontSize: '16px'
          }}
        >
          {book.title}
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '2px', fontSize: '14px' }}>
          {book.author}
        </p>
        
        {book.subTitle && (
          <p style={{ color: '#394547', marginBottom: '6px', fontSize: '14px' }}>
            {book.subTitle}
          </p>
        )}
        
        <div className="flex items-center justify-between text-small" style={{ marginTop: '6px' }}>
          <div className="flex items-center" style={{ gap: '3px', color: '#6b7280' }}>
            <Clock className="w-3 h-3" />
            <span>{getBookDuration(book.title)}</span>
          </div>
          
          <div className="flex items-center" style={{ gap: '3px', color: '#6b7280' }}>
            <span>☆</span>
            <span>{book.averageRating || '4.0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForYouPage = () => {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [selectedLoading, setSelectedLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestedLoading, setSuggestedLoading] = useState(true);
  const [suggestedError, setSuggestedError] = useState(null);

  useEffect(() => {
    const fetchSelectedBook = async () => {
      try {
        setSelectedLoading(true);
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add 2 second delay before showing content
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (data && data.length > 0) {
          setSelectedBook(data[0]);
        }
      } catch (err) {
        console.error('Error fetching selected book:', err);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSelectedBook({
          id: '1',
          title: 'The Lean Startup',
          author: 'Eric Ries',
          imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333576876i/10127019.jpg',
          subscriptionRequired: false,
          averageRating: 4.3,
          duration: '3 mins 23 secs',
          subTitle: 'How Constant Innovation Creates Radically Successful Businesses'
        });
      } finally {
        setSelectedLoading(false);
      }
    };

    fetchSelectedBook();
  }, []);

  const handleSelectedBookClick = () => {
    if (selectedBook) {
      router.push(`/book/${selectedBook.id}`);
    }
  };

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add 2 second delay before showing content
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setRecommendedBooks(data || []);
      } catch (err) {
        console.error('Error fetching recommended books:', err);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setError(err.message);
        setRecommendedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, []);

  useEffect(() => {
    const fetchSuggestedBooks = async () => {
      try {
        setSuggestedLoading(true);
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add 2 second delay before showing content
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSuggestedBooks(data || []);
      } catch (err) {
        console.error('Error fetching suggested books:', err);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuggestedError(err.message);
        setSuggestedBooks([]);
      } finally {
        setSuggestedLoading(false);
      }
    };

    fetchSuggestedBooks();
  }, []);

  return (
    <SidebarLayout>
      <div className="flex justify-center" style={{ width: '100%' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
        
        <section style={{ marginBottom: '32px' }}>
          <h2 
            className="text-2xl font-bold" 
            style={{ color: '#111827', marginBottom: '24px' }}
          >
            Selected just for you
          </h2>
          
          {selectedLoading ? (
            <SelectedBookSkeleton />
          ) : selectedBook ? (
            <div 
              className="rounded-lg flex lg:flex-row justify-center flex-col items-start cursor-pointer transition-transform hover:scale-[1.02]"
              style={{ 
                backgroundColor: '#FBEFD6', 
                maxWidth: '640px', 
                minHeight: '144px',
                padding: '32px 24px 24px 24px'
              }}
              onClick={handleSelectedBookClick}
            >
              <div className="flex-1" style={{ paddingRight: '20px', maxWidth: '288px' }}>
                <div 
                  className="leading-relaxed"
                  style={{ fontSize: '16px', color: '#374151' }}
                >
                  {selectedBook.subTitle || selectedBook.summary || 'How Constant Innovation Creates Radically Successful Businesses'}
                </div>
              </div>
              
              <div 
                style={{ 
                  width: '1px', 
                  height: '112px', 
                  backgroundColor: '#d1d5db', 
                  margin: '0 20px' 
                }}
              ></div>
              
              <div className="flex items-center" style={{ gap: '12px' }}>
                <img 
                  src={selectedBook.imageLink} 
                  alt={selectedBook.title}
                  className="object-cover rounded-lg shadow-lg"
                  style={{ width: '88px', height: '128px' }}
                />
                
                <div className="flex flex-col">
                  <h3 
                    className="text-xl font-bold"
                    style={{ color: '#111827', marginBottom: '4px' }}
                  >
                    {selectedBook.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: '#374151', marginBottom: '8px' }}
                  >
                    by {selectedBook.author}
                  </p>
                  
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <button 
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{ 
                        backgroundColor: '#000', 
                        color: 'white',
                        width: '36px',
                        height: '36px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#374151';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#000';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: '#111827' }}
                    >
                      {selectedBook.duration || '3 mins 23 secs'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center" style={{ height: '144px' }}>
              <div className="text-lg" style={{ color: '#dc2626' }}>
                Error loading selected book
              </div>
            </div>
          )}
        </section>

        <section style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 
              className="text-2xl font-bold"
              style={{ color: '#111827' }}
            >
              Recommended For You
            </h2>
            <p 
              style={{ color: '#6b7280', marginTop: '6px' }}
            >
              We think you'll like these
            </p>
          </div>
          
          {loading ? (
            <div className="flex overflow-x-auto" style={{ gap: '26px', paddingBottom: '16px' }}>
              {[...Array(5)].map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center" style={{ height: '256px' }}>
              <div className="text-lg" style={{ color: '#dc2626' }}>
                Error loading books: {error}
              </div>
            </div>
          ) : (
            <div className="relative">
              <div 
                className="flex overflow-x-auto scrollbar-hide"
                style={{ 
                  gap: '26px',
                  paddingBottom: '16px',
                  paddingRight: '20px'
                }}
              >
                {recommendedBooks.map((book) => (
                  <RecommendedBookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <div style={{ marginBottom: '24px' }}>
            <h2 
              className="text-2xl font-bold"
              style={{ color: '#111827' }}
            >
              Suggested Books
            </h2>
            <p 
              style={{ color: '#6b7280', marginTop: '4px' }}
            >
              Browse those books
            </p>
          </div>
          
          {suggestedLoading ? (
            <div className="flex overflow-x-auto" style={{ gap: '28px', paddingBottom: '16px' }}>
              {[...Array(5)].map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : suggestedError ? (
            <div className="flex items-center justify-center" style={{ height: '256px' }}>
              <div className="text-lg" style={{ color: '#dc2626' }}>
                Error loading books: {suggestedError}
              </div>
            </div>
          ) : (
            <div className="relative">
              <div 
                className="flex overflow-x-auto scrollbar-hide"
                style={{ 
                  gap: '28px',
                  paddingBottom: '16px',
                  paddingRight: '20px'
                }}
              >
                {suggestedBooks.map((book) => (
                  <RecommendedBookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          )}
        </section>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </SidebarLayout>
  );
};

export default ForYouPage;