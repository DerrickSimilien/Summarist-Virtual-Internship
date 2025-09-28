'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarLayout from '../../../components/SidebarLayout';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const BookReadingPage = () => {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id;
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data) {
          throw new Error('Book not found');
        }
        
        setBook(data);
        
        // Parse duration for progress bar (convert "03:24" to seconds)
        if (data.duration) {
          const timeParts = data.duration.split(':');
          if (timeParts.length === 2) {
            const minutes = parseInt(timeParts[0]);
            const seconds = parseInt(timeParts[1]);
            setDuration((minutes * 60) + seconds);
          }
        } else {
          setDuration(204); // 3:24 default
        }
        
      } catch (err) {
        console.error('Error fetching book data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookData();
    }
  }, [bookId]);

  // Format time for display
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Split summary into paragraphs
  const formatSummary = (summary) => {
    if (!summary) return [];
    
    // Split by double newlines first, then by sentence patterns
    let paragraphs = summary.split(/\n\n+/);
    
    // If no double newlines found, split by sentences
    if (paragraphs.length === 1) {
      const sentences = summary.split(/(?<=\.\s)(?=[A-Z])/);
      paragraphs = [];
      let currentParagraph = '';
      let sentenceCount = 0;
      
      for (let sentence of sentences) {
        sentence = sentence.trim();
        if (sentence) {
          currentParagraph += (currentParagraph ? ' ' : '') + sentence;
          sentenceCount++;
          
          if (sentenceCount >= 4) {
            paragraphs.push(currentParagraph);
            currentParagraph = '';
            sentenceCount = 0;
          }
        }
      }
      
      if (currentParagraph) {
        paragraphs.push(currentParagraph);
      }
    }
    
    return paragraphs.filter(p => p.trim().length > 0);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would be implemented here
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(newTime);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg" style={{ color: '#6b7280' }}>
            Loading book content...
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-lg mb-4" style={{ color: '#dc2626' }}>
              Error loading book: {error}
            </div>
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!book) {
    return (
      <SidebarLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg" style={{ color: '#dc2626' }}>
            Book not found
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const summaryParagraphs = formatSummary(book.summary);

  return (
    <SidebarLayout>
      <div className="flex justify-center" style={{ width: '100%', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', width: '100%', padding: '0 20px 40px 20px' }}>
          
          {/* Book Title */}
          <h1 
            className="font-bold"
            style={{ 
              fontSize: '24px', 
              fontFamily: 'Roboto, sans-serif',
              color: '#032B41',
              lineHeight: '1.4',
              marginTop: '40px',
              marginBottom: '16px'
            }}
          >
            {book.title}
          </h1>
          
          {/* Gray divider line under title */}
          <div 
            style={{ 
              width: '100%', 
              height: '1px', 
              backgroundColor: '#e5e7eb', 
              marginBottom: '32px' 
            }}
          ></div>
          
          {/* Book Summary */}
          <div className="mb-12">
            {summaryParagraphs.map((paragraph, index) => (
              <p 
                key={index}
                style={{ 
                  fontSize: '16px', 
                  fontFamily: 'Roboto, sans-serif',
                  color: '#032B41',
                  lineHeight: '1.8',
                  marginBottom: '24px'
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
          
        </div>
      </div>
      
      {/* Audio Player - Fixed at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t"
        style={{ 
          backgroundColor: '#2d3f4e',
          height: '80px',
          zIndex: 50
        }}
      >
        <div className="flex items-center justify-between h-full" style={{ padding: '0 32px' }}>
          
          {/* Left: Book Info */}
          <div className="flex items-center" style={{ gap: '16px', flex: '0 0 250px' }}>
            <img 
              src={book.imageLink} 
              alt={book.title}
              className="object-cover"
              style={{ width: '48px', height: '48px', borderRadius: '4px' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <h4 
                className="font-medium text-white text-sm truncate"
                style={{ maxWidth: '180px' }}
              >
                {book.title}
              </h4>
              <p className="text-gray-400 text-xs truncate" style={{ maxWidth: '180px' }}>
                {book.author}
              </p>
            </div>
          </div>
          
          {/* Center: Playback Controls */}
          <div className="flex flex-col items-center" style={{ flex: '1', maxWidth: '600px' }}>
            <div className="flex items-center" style={{ gap: '20px', marginBottom: '8px' }}>
              {/* 10 second rewind */}
              <button 
                className="text-white hover:text-gray-300 transition-colors flex items-center justify-center"
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                style={{ width: '32px', height: '32px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">10</text>
                </svg>
              </button>
              
              {/* Play/Pause button */}
              <button 
                onClick={handlePlayPause}
                className="flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                style={{ width: '48px', height: '48px' }}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                )}
              </button>
              
              {/* 10 second forward */}
              <button 
                className="text-white hover:text-gray-300 transition-colors flex items-center justify-center"
                onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                style={{ width: '32px', height: '32px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">10</text>
                </svg>
              </button>
            </div>
            
            {/* Progress bar with time */}
            <div className="flex items-center w-full" style={{ gap: '12px' }}>
              <span className="text-white text-xs font-mono" style={{ minWidth: '40px', textAlign: 'right' }}>
                {formatTime(currentTime)}
              </span>
              
              <div 
                className="flex-1 bg-gray-600 rounded-full cursor-pointer"
                style={{ height: '4px' }}
                onClick={handleSeek}
              >
                <div 
                  className="bg-white rounded-full h-full transition-all duration-200"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              
              <span className="text-white text-xs font-mono" style={{ minWidth: '40px' }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>
          
          {/* Right: Empty space for balance */}
          <div style={{ flex: '0 0 250px' }}></div>
          
        </div>
      </div>
      
      {/* Add padding to prevent content from being hidden behind fixed player */}
      <div style={{ height: '80px' }} />
      
    </SidebarLayout>
  );
};

export default BookReadingPage;