'use client';

import React, { useState, useEffect } from 'react';
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

// Mock data for suggested books
const suggestedBooks = [
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
];

// Horizontal scrolling BookCard for recommended books only
const RecommendedBookCard = ({ book }) => {
  return (
    <div className="flex-shrink-0" style={{ width: '172px' }}>
      <div className="relative" style={{ marginBottom: '10px' }}>
        <img 
          src={book.imageLink} 
          alt={book.title}
          className="w-full object-cover rounded-lg shadow-sm"
          style={{ height: '230px' }}
        />
        {book.subscriptionRequired && (
          <div 
            className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded font-medium"
            style={{ backgroundColor: '#f59e0b' }}
          >
            Premium
          </div>
        )}
      </div>
      
      <div style={{ paddingTop: '4px' }}>
        <h3 
          className="font-semibold text-sm line-clamp-2" 
          style={{ 
            color: '#111827', 
            marginBottom: '4px',
            lineHeight: '1.4'
          }}
        >
          {book.title}
        </h3>
        <p 
          className="text-xs" 
          style={{ color: '#6b7280' }}
        >
          {book.author}
        </p>
      </div>
    </div>
  );
};

const ForYouPage = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <SidebarLayout>
      {/* Main content container - removed extra margin since SidebarLayout handles it */}
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        
        {/* Selected just for you section - moved slightly to the right */}
        <section style={{ marginBottom: '32px', marginLeft: '146px' }}>
          <h2 
            className="text-2xl font-bold" 
            style={{ color: '#111827', marginBottom: '24px' }}
          >
            Selected just for you
          </h2>
          
          <div 
            className="rounded-lg flex items-start"
            style={{ 
              backgroundColor: '#FBEFD6', 
              maxWidth: '640px', 
              minHeight: '144px',
              padding: '32px 24px 24px 24px'
            }}
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

        {/* Recommended For You section - removed navigation arrows */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 
              className="text-2xl font-bold"
              style={{ color: '#111827' }}
            >
              Recommended For You
            </h2>
            <p 
              style={{ color: '#6b7280', marginTop: '4px' }}
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
                  gap: '24px',
                  paddingBottom: '16px',
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none'
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
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <div>
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
          </div>
          
          <div 
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
            }}
          >
            {suggestedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
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
      `}</style>
    </SidebarLayout>
  );
};

export default ForYouPage;