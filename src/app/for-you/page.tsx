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
    <div className="flex-shrink-0 w-48">
      <div className="relative mb-3">
        <img 
          src={book.imageLink} 
          alt={book.title}
          className="w-full h-64 object-cover rounded-lg shadow-sm"
        />
        {book.subscriptionRequired && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-medium">
            Premium
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-xs">{book.author}</p>
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, []);

  // Horizontal scroll functions
  const scrollLeft = () => {
    const container = document.getElementById('recommended-scroll');
    if (container) {
      container.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('recommended-scroll');
    if (container) {
      container.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <SidebarLayout>
      <div className="max-w-6xl">
        {/* Selected just for you section - UNCHANGED */}
        <section className="mb-8 ml-32">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Selected just for you</h2>
          
          <div className="rounded-lg p-5 flex items-start max-w-2xl" style={{backgroundColor: '#FBEFD6'}}>
            {/* Left side content - only subtitle */}
            <div className="flex-1 pr-5 max-w-xs">
              <div className="text-med text-black-600 leading-relaxed">
                How Constant Innovation Creates Radically Successful Businesses
              </div>
            </div>
            
            {/* Vertical divider line */}
            <div className="w-px h-28 bg-gray-300 mx-5"></div>
            
            {/* Right side content */}
            <div className="flex items-center gap-3">
              {/* Book cover */}
              <img 
                src={featuredBook.imageLink} 
                alt={featuredBook.title}
                className="w-22 h-32 object-cover rounded-lg shadow-lg"
              />
              
              {/* Book info and controls */}
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{featuredBook.title}</h3>
                <p className="text-gray-700 mb-2 text-sm">by {featuredBook.author}</p>
                
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center bg-black text-white w-9 h-9 rounded-full hover:bg-gray-800 transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                  <span className="text-sm font-medium">{featuredBook.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended For You section - MODIFIED with API and horizontal scrolling */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
              <p className="text-gray-600 mt-1">We think you'll like these</p>
            </div>
            
            {/* Navigation arrows */}
            <div className="flex items-center gap-2">
              <button 
                onClick={scrollLeft}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={scrollRight}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Loading recommended books...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-600">Error loading books: {error}</div>
            </div>
          ) : (
            <div className="relative">
              <div 
                id="recommended-scroll"
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {recommendedBooks.map((book) => (
                  <RecommendedBookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Suggested Books section - UNCHANGED, uses your original BookCard */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Suggested Books</h2>
              <p className="text-gray-600 mt-1">Browse those books</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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