'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import SidebarLayout from '../../components/SidebarLayout';
import LoginModal from '../../components/LoginModal';
import { Star, Clock, BookOpen, Headphones, Bookmark, Lightbulb } from 'lucide-react';

const BookDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookSaved, setIsBookSaved] = useState(false);

  // Listen for authentication state changes
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

        // Check if book is already saved in localStorage
        const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
        const isBookAlreadySaved = savedBooks.some(savedBook => savedBook.id === id);
        setIsBookSaved(isBookAlreadySaved);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  // Hardcoded durations matching the original site (same as ForYouPage)
  const getBookDuration = (bookTitle) => {
    const durations = {
      // Recommended Books
      'How to Win Friends and Influence People': '03:24',
      "Can't Hurt Me": '04:52',
      "Can't Hurt Me": '04:52', // curly apostrophe version
      'Mastery': '04:40',
      'Atomic Habits': '03:24',
      'How to Talk to Anyone': '03:22',
      'Jim Collins': '03:01',
      'Good to Great': '03:01',
      'The Intelligent Investor': '02:48',
      'The 4 Day Week': '02:20',
      
      // Suggested Books
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
      
      // Additional books that might appear
      'The Lean Startup': '03:23'
    };
    return durations[bookTitle] || '03:24';
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  // Handle Read button click
  const handleReadClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    
    // If book is premium, redirect to choose-plan page
    if (book?.subscriptionRequired) {
      router.push('/choose-plan');
      return;
    }
    
    // Navigate to reading page for non-premium books
    router.push(`/book/${id}/read`);
  };

  // Handle Listen button click
  const handleListenClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    
    // If book is premium, redirect to choose-plan page
    if (book?.subscriptionRequired) {
      router.push('/choose-plan');
      return;
    }
    
    // TODO: Implement listen functionality for non-premium books
    console.log('User is authenticated, proceed with listen functionality for free book');
  };

  // Handle successful login
  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    // The auth state listener will automatically update the user state
  };

  // Handle save/unsave book
  const handleSaveBook = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
    
    if (isBookSaved) {
      // Remove book from saved books
      const updatedSavedBooks = savedBooks.filter(savedBook => savedBook.id !== id);
      localStorage.setItem('savedBooks', JSON.stringify(updatedSavedBooks));
      setIsBookSaved(false);
    } else {
      // Add book to saved books
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

                  {/* Duration - Now using hardcoded durations */}
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <Clock className="w-5 h-5" style={{ color: '#032B41' }} />
                    <span style={{ color: '#032B41' }}>
                      {getBookDuration(book.title)}
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
                      {book.keyIdeas || 11} Key ideas
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
                    onClick={handleReadClick}
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
                    onClick={handleListenClick}
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

                {/* Add to My Library / Saved in My Library */}
                <button 
                  onClick={handleSaveBook}
                  className="flex items-center font-medium transition-colors"
                  style={{ 
                    marginBottom: '32px', 
                    fontSize: '16px',
                    color: isBookSaved ? '#2563eb' : '#2563eb'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#2563eb';
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

      {/* Login Modal - Moved outside SidebarLayout for proper full-screen overlay */}
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