'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Use useParams for App Router
import SidebarLayout from '../../components/SidebarLayout';
import { Star, Clock, BookOpen, Headphones, Bookmark, Lightbulb } from 'lucide-react';

const BookDetailPage = () => {
  const params = useParams();
  const id = params?.id; // Get the dynamic route parameter
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

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

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  return (
    <SidebarLayout>
      <div className="flex justify-center" style={{ width: '100%', padding: '0 24px' }}>
        <div style={{ maxWidth: '1000px', width: '100%' }}>
          {/* Main content container */}
          <div className="flex" style={{ gap: '48px', marginTop: '32px' }}>
            
            {/* Left side - Book details */}
            <div className="flex-1" style={{ maxWidth: '600px' }}>
              
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
                
                {/* Gray divider line after subtitle */}
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
                {/* Rating */}
                <div className="flex items-center" style={{ gap: '4px' }}>
                  <Star className="w-5 h-5" style={{ color: '#032B41', fill: 'none', stroke: '#032B41' }} />
                  <span className="font-medium" style={{ color: '#032B41' }}>
                    {formatRating(book.averageRating)} ({book.totalRating || 0} ratings)
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center" style={{ gap: '4px' }}>
                  <Clock className="w-5 h-5" style={{ color: '#032B41' }} />
                  <span style={{ color: '#032B41' }}>
                    {formatDuration(book.totalDuration || 0)}
                  </span>
                </div>

                {/* Audio & Text */}
                <div className="flex items-center" style={{ gap: '8px' }}>
                  <BookOpen className="w-4 h-4" style={{ color: '#032B41' }} />
                  <Headphones className="w-4 h-4" style={{ color: '#032B41' }} />
                  <span className="text-sm" style={{ color: '#032B41' }}>
                    Audio & Text
                  </span>
                </div>

                {/* Key Ideas */}
                <div className="flex items-center" style={{ gap: '4px' }}>
                  <Lightbulb className="w-5 h-5" style={{ color: '#032B41', fill: 'none', stroke: '#032B41' }} />
                  <span style={{ color: '#032B41' }}>
                    {book.keyIdeas || 7} Key ideas
                  </span>
                </div>
              </div>

              {/* Gray divider line after 2x2 grid */}
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
                  className="flex items-center justify-center rounded font-medium transition-colors"
                  style={{ 
                    backgroundColor: '#032B41',
                    color: 'white',
                    padding: '12px 24px',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#032B41';
                  }}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read
                </button>
                
                <button 
                  className="flex items-center justify-center rounded font-medium transition-colors"
                  style={{ 
                    backgroundColor: '#032B41',
                    color: 'white',
                    padding: '12px 24px',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1f2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#032B41';
                  }}
                >
                  <Headphones className="w-5 h-5 mr-2" />
                  Listen
                </button>
              </div>

              {/* Add to My Library */}
              <button 
                className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                style={{ marginBottom: '32px', fontSize: '16px' }}
              >
                <Bookmark className="w-4 h-4 mr-1" style={{ fill: 'none', stroke: '#2563eb' }} />
                Add title to My Library
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

                {/* Tags */}
                {book.tags && book.tags.length > 0 && (
                  <div className="flex flex-wrap" style={{ gap: '12px', marginBottom: '16px' }}>
                    {book.tags.map((tag, index) => (
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

                {/* Book description */}
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
            <div className="flex-shrink-0">
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
    </SidebarLayout>
  );
};

export default BookDetailPage;