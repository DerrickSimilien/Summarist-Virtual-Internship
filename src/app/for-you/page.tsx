'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SidebarLayout from '../components/SidebarLayout';
import { Play, Clock } from 'lucide-react';

/* ---------- Skeletons ---------- */

const SelectedBookSkeleton = () => (
  <div
    className="rounded-lg flex items-start selected-book-skeleton"
    style={{
      backgroundColor: '#e5e7eb',
      width: '100%',
      maxWidth: '960px',
      minHeight: '144px',
      padding: '32px 24px 24px 24px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      margin: '0 auto'
    }}
  >
    <div className="flex-1" style={{ paddingRight: '20px', maxWidth: '288px' }}>
      <div style={{ height: '16px', backgroundColor: '#d1d5db', borderRadius: '4px', marginBottom: '8px', width: '100%' }} />
      <div style={{ height: '16px', backgroundColor: '#d1d5db', borderRadius: '4px', marginBottom: '8px', width: '90%' }} />
      <div style={{ height: '16px', backgroundColor: '#d1d5db', borderRadius: '4px', width: '80%' }} />
    </div>

    <div className="book-divider" style={{ width: '1px', height: '112px', backgroundColor: '#d1d5db', margin: '0 20px' }} />

    <div className="flex items-center" style={{ gap: '12px' }}>
      <div style={{ width: '88px', height: '128px', backgroundColor: '#d1d5db', borderRadius: '8px' }} />
      <div className="flex flex-col">
        <div style={{ height: '20px', width: '120px', backgroundColor: '#d1d5db', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '14px', width: '100px', backgroundColor: '#d1d5db', borderRadius: '4px', marginBottom: '12px' }} />
        <div className="flex items-center" style={{ gap: '8px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#d1d5db', borderRadius: '50%' }} />
          <div style={{ height: '14px', width: '80px', backgroundColor: '#d1d5db', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  </div>
);

const BookCardSkeleton = () => (
  <div className="flex-shrink-0" style={{ width: '140px', paddingTop: '40px' }}>
    <div style={{ marginBottom: '8px' }}>
      <div
        style={{
          width: '100%',
          height: '180px',
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
    </div>

    <div style={{ paddingTop: '2px' }}>
      <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '6px', width: '100%' }} />
      <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '6px', width: '80%' }} />
      <div className="flex items-center justify-between" style={{ marginTop: '6px' }}>
        <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '40%' }} />
        <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '30%' }} />
      </div>
    </div>
  </div>
);

/* ---------- Book Card ---------- */

/** Robust mapping: prefer ID (stable), then title (normalized), else '03:24'. */
const ID_DURATIONS: Record<string, string> = {
  // Can't Hurt Me (your API id)
  '2l0idxm1rwv': '04:52',
  // Add others by id here if you want to be future-proof
  // '5bxl50cz4bt': '03:24', // How to Win Friends..., etc.
};

const TITLE_DURATIONS: Record<string, string> = {
  'how to win friends and influence people': '03:24',
  "can't hurt me": '04:52',     // straight apostrophe
  "can’t hurt me": '04:52',     // curly apostrophe
  'mastery': '04:40',
  'atomic habits': '03:24',
  'how to talk to anyone': '03:22',
  'jim collins': '03:01',
  'good to great': '03:01',
  'the intelligent investor': '02:48',
  'the 4 day week': '02:20',
  'the 7 habits of highly effective people': '04:36',
  'rich dad poor dad': '05:38',
  'the power of now': '03:12',
  'think and grow rich': '04:25',
  'zero to one': '03:24',
  'the 10x rule': '04:15',
  'deep work': '04:02',
  'the second machine age': '03:36',
  'the 5 second rule': '02:45',
  'the 12 week year': '03:36',
  'getting things done': '02:24',
};

const normalizeTitle = (s: string) =>
  s
    ?.toLowerCase()
    .replace(/[’`]/g, "'") // normalize curly/backtick to straight
    .trim();

const RecommendedBookCard = ({ book }: { book: any }) => {
  const router = useRouter();

  const handleBookClick = () => router.push(`/book/${book.id}`);

  const getBookDuration = (b: any) => {
    // 1) If API already gives a duration we trust, use it
    if (b?.duration && typeof b.duration === 'string') return b.duration;

    // 2) Prefer known duration by book id
    if (b?.id && ID_DURATIONS[b.id]) return ID_DURATIONS[b.id];

    // 3) Fallback to normalized title lookup
    const key = normalizeTitle(b?.title || '');
    if (key && TITLE_DURATIONS[key]) return TITLE_DURATIONS[key];

    // 4) Final fallback – what you were showing before
    return '03:24';
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
            style={{ backgroundColor: '#032B41', top: '-36px', right: '6px' }}
          >
            Premium
          </div>
        )}
      </div>

      <div style={{ paddingTop: '2px' }}>
        <h3
          className="font-semibold line-clamp-2"
          style={{ color: '#111827', marginBottom: '2px', lineHeight: '1.3', fontSize: '16px' }}
        >
          {book.title}
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '2px', fontSize: '14px' }}>{book.author}</p>
        {book.subTitle && <p style={{ color: '#394547', marginBottom: '6px', fontSize: '14px' }}>{book.subTitle}</p>}

        <div className="flex items-center justify-between text-small" style={{ marginTop: '6px' }}>
          <div className="flex items-center" style={{ gap: '3px', color: '#6b7280' }}>
            <Clock className="w-3 h-3" />
            <span>{getBookDuration(book)}</span>
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

/* ---------- Page ---------- */

const ForYouPage = () => {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<any[]>([]);
  const [selectedLoading, setSelectedLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestedLoading, setSuggestedLoading] = useState(true);
  const [suggestedError, setSuggestedError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSelectedBook = async () => {
      try {
        setSelectedLoading(true);
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        await new Promise((r) => setTimeout(r, 2000));
        if (data && data.length > 0) setSelectedBook(data[0]);
      } catch (err: any) {
        await new Promise((r) => setTimeout(r, 2000));
        setSelectedBook({
          id: '1',
          title: 'The Lean Startup',
          author: 'Eric Ries',
          imageLink:
            'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333576876i/10127019.jpg',
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
    if (selectedBook) router.push(`/book/${selectedBook.id}`);
  };

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        await new Promise((r) => setTimeout(r, 2000));
        setRecommendedBooks(data || []);
      } catch (err: any) {
        await new Promise((r) => setTimeout(r, 2000));
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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        await new Promise((r) => setTimeout(r, 2000));
        setSuggestedBooks(data || []);
      } catch (err: any) {
        await new Promise((r) => setTimeout(r, 2000));
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
      {/* clamp width + kill horizontal overflow */}
      <div className="for-you-root flex justify-center" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        <div
          className="for-you-container"
          style={{ maxWidth: '1000px', width: '100%', maxWidthShrink: 0, padding: '0 20px', margin: '0 auto' }}
        >
          {/* Featured */}
          <section style={{ marginBottom: '32px' }}>
            <h2 className="text-2xl font-bold" style={{ color: '#111827', marginBottom: '24px' }}>
              Selected just for you
            </h2>

            {selectedLoading ? (
              <SelectedBookSkeleton />
            ) : selectedBook ? (
              <div
                className="selected-book-card rounded-lg flex lg:flex-row justify-center flex-col items-start cursor-pointer transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: '#FBEFD6',
                  width: '100%',
                  maxWidth: '610px',
                  minHeight: '144px',
                  padding: '32px 24px 24px 24px',
                  margin: '0 0 0 5px'
                }}
                onClick={handleSelectedBookClick}
              >
                <div className="book-description flex-1" style={{ paddingRight: '20px', maxWidth: '288px' }}>
                  <div className="leading-relaxed featured-desc" style={{ fontSize: '16px', color: '#374151' }}>
                    {selectedBook.subTitle ||
                      selectedBook.summary ||
                      'How Constant Innovation Creates Radically Successful Businesses'}
                  </div>
                </div>

                <div className="book-divider" style={{ width: '1px', height: '112px', backgroundColor: '#d1d5db', margin: '0 20px' }} />

                <div className="book-info flex items-center" style={{ gap: '12px' }}>
                  <img
                    src={selectedBook.imageLink}
                    alt={selectedBook.title}
                    className="object-cover rounded-lg shadow-lg"
                    style={{ width: '88px', height: '128px' }}
                  />

                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold" style={{ color: '#111827', marginBottom: '4px' }}>
                      {selectedBook.title}
                    </h3>
                    <p className="text-sm" style={{ color: '#374151', marginBottom: '8px' }}>
                      by {selectedBook.author}
                    </p>

                    <div className="flex items-center" style={{ gap: '8px' }}>
                      <button
                        className="flex items-center justify-center rounded-full transition-colors"
                        style={{ backgroundColor: '#000', color: 'white', width: '36px', height: '36px' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#000')}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <span className="text-sm font-medium" style={{ color: '#111827' }}>
                        {selectedBook.duration || '3 mins 23 secs'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center" style={{ height: '144px' }}>
                <div className="text-lg" style={{ color: '#dc2626' }}>Error loading selected book</div>
              </div>
            )}
          </section>

          {/* Recommended */}
          <section style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#111827' }}>Recommended For You</h2>
              <p style={{ color: '#6b7280', marginTop: '6px' }}>We think you'll like these</p>
            </div>

            {loading ? (
              <div className="h-scroll flex" style={{ gap: '26px', paddingBottom: '16px', width: '100%', maxWidth: '100%' }}>
                {[...Array(5)].map((_, i) => <BookCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center" style={{ height: '256px' }}>
                <div className="text-lg" style={{ color: '#dc2626' }}>Error loading books: {error}</div>
              </div>
            ) : (
              <div className="relative">
                <div className="h-scroll flex scrollbar-hide" style={{ gap: '26px', paddingBottom: '16px', width: '100%', maxWidth: '100%' }}>
                  {recommendedBooks.map((book) => <RecommendedBookCard key={book.id} book={book} />)}
                </div>
              </div>
            )}
          </section>

          {/* Suggested */}
          <section>
            <div style={{ marginBottom: '24px' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#111827' }}>Suggested Books</h2>
              <p style={{ color: '#6b7280', marginTop: '4px' }}>Browse those books</p>
            </div>

            {suggestedLoading ? (
              <div className="h-scroll flex" style={{ gap: '28px', paddingBottom: '16px', width: '100%', maxWidth: '100%' }}>
                {[...Array(5)].map((_, i) => <BookCardSkeleton key={i} />)}
              </div>
            ) : suggestedError ? (
              <div className="flex items-center justify-center" style={{ height: '256px' }}>
                <div className="text-lg" style={{ color: '#dc2626' }}>Error loading books: {suggestedError}</div>
              </div>
            ) : (
              <div className="relative">
                <div className="h-scroll flex scrollbar-hide" style={{ gap: '28px', paddingBottom: '16px', width: '100%', maxWidth: '100%' }}>
                  {suggestedBooks.map((book) => <RecommendedBookCard key={book.id} book={book} />)}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        /* Horizontal scrollers that never grow the page width */
        .h-scroll { overflow-x: auto; overflow-y: hidden; width: 100%; max-width: 100%; }

        /* Tablet & mobile: clamp everything to the viewport */
        @media (max-width: 768px) {
          .for-you-root { max-width: 100vw !important; overflow-x: hidden !important; }
          .for-you-container { padding: 0 16px !important; max-width: 100vw !important; }
          .selected-book-card,
          .selected-book-skeleton { width: 100% !important; max-width: 100% !important; margin: 0 auto !important; }
          .h-scroll { width: 100% !important; max-width: 100% !important; }
        }

        /* Small phones: stack the featured card */
        @media (max-width: 600px) {
          .selected-book-card { flex-direction: column !important; padding: 20px 16px !important; }
          .book-description { max-width: 100% !important; padding-right: 0 !important; margin-bottom: 16px; }
          .book-divider { display: none !important; }
          .book-info { width: 100%; justify-content: flex-start; }
          .selected-book-skeleton { flex-direction: column !important; padding: 20px 16px !important; }
        }
      `}</style>
    </SidebarLayout>
  );
};

export default ForYouPage;
