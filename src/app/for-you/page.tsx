'use client';

import React from 'react';
import SidebarLayout from '../components/SidebarLayout';
import BookCard from '../components/BookCard';
import { Play, Clock } from 'lucide-react';

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

// Mock data for recommended books
const recommendedBooks = [
  {
    id: '2',
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442726934i/4865.jpg',
    subscriptionRequired: false,
    averageRating: 4.2
  },
  {
    id: '3',
    title: "Can't Hurt Me",
    author: 'David Goggins',
    imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1536184191i/41721428.jpg',
    subscriptionRequired: true,
    averageRating: 4.6
  },
  {
    id: '4',
    title: 'Mastery',
    author: 'Robert Greene',
    imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348710018i/13589182.jpg',
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
    imageLink: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1387772020i/35167.jpg',
    subscriptionRequired: true,
    averageRating: 4.0
  }
];

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

const ForYouPage = () => {
  return (
    <SidebarLayout>
      <div className="max-w-6xl">
        {/* Selected just for you section */}
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

        {/* Recommended For You section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
              <p className="text-gray-600 mt-1">We think you'll like these</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Suggested Books section */}
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
    </SidebarLayout>
  );
};

export default ForYouPage;