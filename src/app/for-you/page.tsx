'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router' to 'next/navigation'
import SidebarLayout from '../components/SidebarLayout';
import BookCard from '../components/BookCard';
import { Play, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for the featured book
const featuredBook = {
  id: '1',
  title: 'The Lean Startup',
  author: 'Eric Ries',
  imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333576876i/10127019.jpg',
  subscriptionRequired: false,
  averageRating: 4.3,
  duration: '3 mins 23 secs'
};

// Smaller BookCard component to match original design
const RecommendedBookCard = ({ book }) => {
  const router = useRouter();

  const handleBookClick = () => {
    router.push(`/book/${book.id}`);
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
        <p 
          style={{ color: '#6b7280', marginBottom: '2px', fontSize: '14px' }}
        >
          {book.author}
        </p>
        
        {/* Subtitle */}
        {book.subTitle && (
          <p 
            style={{ color: '#394547', marginBottom: '6px', fontSize: '14px' }}
          >
            {book.subTitle}
          </p>
        )}
        
        {/* Duration and Rating row */}
        <div className="flex items-center justify-between text-small" style={{ marginTop: '6px' }}>
          {/* Duration */}
          <div className="flex items-center" style={{ gap: '3px', color: '#6b7280' }}>
            <Clock className="w-3 h-3" />
            <span>
              {book.totalDuration ? 
                `${Math.floor(book.totalDuration / 60)}:${String(book.totalDuration % 60).padStart(2, '0')}` : 
                '03:24'}
            </span>
          </div>
          
          {/* Rating */}
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
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestedLoading, setSuggestedLoading] = useState(true);
  const [suggestedError, setSuggestedError] = useState(null);

  // Handle featured book click
  const handleFeaturedBookClick = () => {
    router.push(`/book/${featuredBook.id}`);
  };

  // Fetch recommended books from API
  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRecommendedBooks(data || []);
      } catch (err) {
        console.error('Error fetching recommended books:', err);
        setError(err.message);
        // Fallback to mock data if API fails
        setRecommendedBooks([
          {
            id: '2',
            title: 'How to Win Friends and Influence People',
            author: 'Dale Carnegie',
            subTitle: 'The classic guide to better relationships',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442726934i/4865.jpg',
            subscriptionRequired: false,
            averageRating: 4.2
          },
          {
            id: '3',
            title: "Can't Hurt Me",
            author: 'David Goggins',
            subTitle: 'Master Your Mind and Defy the Odds',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1536184191i/41721428.jpg',
            subscriptionRequired: true,
            averageRating: 4.6
          },
          {
            id: '4',
            title: 'Mastery',
            author: 'Robert Greene',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348866497i/13589182.jpg',
            subscriptionRequired: true,
            averageRating: 4.1
          },
          {
            id: '5',
            title: 'Atomic Habits',
            author: 'James Clear',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320i/40121378.jpg',
            subscriptionRequired: true,
            averageRating: 4.4
          },
          {
            id: '6',
            title: 'How to Talk to Anyone',
            author: 'Leil Lowndes',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1391446893i/35450.jpg',
            subscriptionRequired: true,
            averageRating: 3.9
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, []);

  // Fetch suggested books from API
  useEffect(() => {
    const fetchSuggestedBooks = async () => {
      try {
        setSuggestedLoading(true);
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSuggestedBooks(data || []);
      } catch (err) {
        console.error('Error fetching suggested books:', err);
        setSuggestedError(err.message);
        // Fallback to mock data if API fails
        setSuggestedBooks([
          {
            id: '7',
            title: 'The 7 Habits of Highly Effective People',
            author: 'Stephen R. Covey',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1421842784i/36072.jpg',
            subscriptionRequired: false,
            averageRating: 4.1
          },
          {
            id: '8',
            title: 'Rich Dad Poor Dad',
            author: 'Robert T. Kiyosaki',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg',
            subscriptionRequired: true,
            averageRating: 4.2
          },
          {
            id: '9',
            title: 'The Power of Now',
            author: 'Eckhart Tolle',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386925471i/6708.jpg',
            subscriptionRequired: true,
            averageRating: 4.0
          },
          {
            id: '10',
            title: 'Think and Grow Rich',
            author: 'Napoleon Hill',
            imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1463241782i/30186948.jpg',
            subscriptionRequired: false,
            averageRating: 4.1
          }
        ]);
      } finally {
        setSuggestedLoading(false);
      }
    };

    fetchSuggestedBooks();
  }, []);

  return (
    <SidebarLayout>
      {/* Main content container - centered and constrained width */}
      <div className="flex justify-center" style={{ width: '100%' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
        
        {/* Selected just for you section - centered */}
        <section style={{ marginBottom: '32px' }}>
          <h2 
            className="text-2xl font-bold" 
            style={{ color: '#111827', marginBottom: '24px' }}
          >
            Selected just for you
          </h2>
          
          <div 
            className="rounded-lg flex items-start cursor-pointer transition-transform hover:scale-[1.02]"
            style={{ 
              backgroundColor: '#FBEFD6', 
              maxWidth: '640px', 
              minHeight: '144px',
              padding: '32px 24px 24px 24px'
            }}
            onClick={handleFeaturedBookClick}
          >
            {/* Left side content - only subtitle */}
            <div className="flex-1" style={{ paddingRight: '20px', maxWidth: '288px' }}>
              <div 
                className="leading-relaxed"
                style={{ fontSize: '16px', color: '#374151' }}
              >
                How Constant Innovation Creates Radically Successful Businesses
              </div>
            </div>
            
            {/* Vertical divider line */}
            <div 
              style={{ 
                width: '1px', 
                height: '112px', 
                backgroundColor: '#d1d5db', 
                margin: '0 20px' 
              }}
            ></div>
            
            {/* Right side content */}
            <div className="flex items-center" style={{ gap: '12px' }}>
              {/* Book cover */}
              <img 
                src={featuredBook.imageLink} 
                alt={featuredBook.title}
                className="object-cover rounded-lg shadow-lg"
                style={{ width: '88px', height: '128px' }}
              />
              
              {/* Book info and controls */}
              <div className="flex flex-col">
                <h3 
                  className="text-xl font-bold"
                  style={{ color: '#111827', marginBottom: '4px' }}
                >
                  {featuredBook.title}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: '#374151', marginBottom: '8px' }}
                >
                  by {featuredBook.author}
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
                      e.stopPropagation(); // Prevent the card click when play button is clicked
                    }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: '#111827' }}
                  >
                    {featuredBook.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended For You section */}
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
            <div className="flex items-center justify-center" style={{ height: '256px' }}>
              <div className="text-lg" style={{ color: '#6b7280' }}>
                Loading recommended books...
              </div>
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
                id="recommended-scroll"
                className="flex overflow-x-auto scrollbar-hide"
                style={{ 
                  gap: '26px',
                  paddingBottom: '16px',
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
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

        {/* Suggested Books section */}
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
            <div className="flex items-center justify-center" style={{ height: '256px' }}>
              <div className="text-lg" style={{ color: '#6b7280' }}>
                Loading suggested books...
              </div>
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
                id="suggested-scroll"
                className="flex overflow-x-auto scrollbar-hide"
                style={{ 
                  gap: '28px',
                  paddingBottom: '16px',
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </SidebarLayout>
  );
};

export default ForYouPage;