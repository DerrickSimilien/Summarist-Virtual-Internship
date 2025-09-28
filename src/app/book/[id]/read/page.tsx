'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarLayout from '../../../components/SidebarLayout';
import { Play, Pause } from 'lucide-react';

const PLAYER_HEIGHT = 80; // match your player's height

type Book = {
  title: string;
  author: string;
  imageLink: string;
  summary?: string;
  duration?: string; // "MM:SS"
};

const FONT_PRESETS = [
  { label: 'Aa', px: 16, box: 20 },
  { label: 'Aa', px: 18, box: 24 },
  { label: 'Aa', px: 22, box: 28 },
  { label: 'Aa', px: 26, box: 32 },
];

const BookReadingPage = () => {
  const params = useParams() as { id: string };
  const router = useRouter();
  const bookId = params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // font size index for summary (persist to localStorage)
  const [fontIndex, setFontIndex] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const val = window.localStorage.getItem('summarist:read_font_index');
    return val ? Number(val) : 0; // default 16px
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('summarist:read_font_index', String(fontIndex));
    }
  }, [fontIndex]);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Book = await response.json();
        if (!data) throw new Error('Book not found');

        setBook(data);

        // duration
        const raw = data.duration || '03:24';
        const [mm, ss] = raw.split(':');
        const minutes = parseInt(mm || '0', 10);
        const seconds = parseInt(ss || '0', 10);
        setDuration(minutes * 60 + seconds);
      } catch (err: any) {
        console.error('Error fetching book data:', err);
        setError(err.message || 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBookData();
  }, [bookId]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const summaryParagraphs = useMemo(() => {
    const summary = book?.summary || '';
    if (!summary) return [] as string[];

    let paras = summary.split(/\n\n+/);
    if (paras.length === 1) {
      const sentences = summary.split(/(?<=\.\s)(?=[A-Z])/);
      paras = [];
      let chunk = '';
      let count = 0;
      for (let s of sentences) {
        s = s.trim();
        if (!s) continue;
        chunk += (chunk ? ' ' : '') + s;
        count++;
        if (count >= 4) {
          paras.push(chunk);
          chunk = '';
          count = 0;
        }
      }
      if (chunk) paras.push(chunk);
    }
    return paras.filter((p) => p.trim().length > 0);
  }, [book?.summary]);

  const handlePlayPause = () => setIsPlaying((p) => !p);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    setCurrentTime((clickX / rect.width) * duration);
  };

  // Sidebar extras (the four Aa buttons under Search)
  const SidebarFontControls = (
    <div
      className="sidebar__link--wrapper sidebar__font--size-wrapper"
      style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
    >
      {FONT_PRESETS.map((fp, idx) => (
        <button
          key={idx}
          onClick={() => setFontIndex(idx)}
          title={`${fp.px}px`}
          aria-label={`Set font size to ${fp.px}px`}
          className="flex items-center justify-center rounded"
          style={{
            width: `${fp.box}px`,
            height: `${fp.box}px`,
            backgroundColor: fontIndex === idx ? 'rgba(43, 217, 124, 0.12)' : 'transparent',
            border: fontIndex === idx ? '1px solid #2bd97c' : '1px solid transparent',
            color: '#032B41',
            fontFamily: 'Roboto, sans-serif',
            fontSize: `${Math.round(fp.px * 0.9)}px`,
            lineHeight: 1,
            cursor: 'pointer',
          }}
        >
          {fp.label}
        </button>
      ))}
    </div>
  );

  const currentFontPx = FONT_PRESETS[fontIndex]?.px ?? 16;

  if (loading) {
    return (
      <SidebarLayout bottomOffset={PLAYER_HEIGHT} sidebarExtrasBelowSearch={SidebarFontControls}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg" style={{ color: '#6b7280' }}>Loading book content...</div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout bottomOffset={PLAYER_HEIGHT} sidebarExtrasBelowSearch={SidebarFontControls}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-lg mb-4" style={{ color: '#dc2626' }}>Error loading book: {error}</div>
            <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Go Back
            </button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!book) {
    return (
      <SidebarLayout bottomOffset={PLAYER_HEIGHT} sidebarExtrasBelowSearch={SidebarFontControls}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg" style={{ color: '#dc2626' }}>Book not found</div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout bottomOffset={PLAYER_HEIGHT} sidebarExtrasBelowSearch={SidebarFontControls}>
      <div className="flex justify-center" style={{ width: '100%', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', width: '100%', padding: '0 20px 40px 20px' }}>
          {/* Title */}
          <h1
            className="font-bold"
            style={{
              fontSize: '24px',
              fontFamily: 'Roboto, sans-serif',
              color: '#032B41',
              lineHeight: '1.4',
              marginTop: '40px',
              marginBottom: '16px',
            }}
          >
            {book.title}
          </h1>

          {/* Divider */}
          <div style={{ width: '100%', height: '1px', backgroundColor: '#e5e7eb', marginBottom: '32px' }} />

          {/* Summary (font size controlled) */}
          <div className="mb-12">
            {summaryParagraphs.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontSize: `${currentFontPx}px`,
                  fontFamily: 'Roboto, sans-serif',
                  color: '#032B41',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Player - fixed bottom (original layout) */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t"
        style={{
          backgroundColor: '#042330',
          height: `${PLAYER_HEIGHT}px`,
          zIndex: 1001,
          padding: '0px 40px',
        }}
      >
        <div className="flex items-center h-full w-full">
          {/* LEFT: Book info */}
          <div className="flex items-center" style={{ gap: '16px', flex: '0 0 260px' }}>
            <img
              src={book.imageLink}
              alt={book.title}
              className="object-cover"
              style={{ width: '48px', height: '48px', borderRadius: '4px' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <h4 className="font-medium text-white text-sm truncate" style={{ maxWidth: '180px' }}>
                {book.title}
              </h4>
              <p className="text-gray-400 text-xs truncate" style={{ maxWidth: '180px' }}>
                {book.author}
              </p>
            </div>
          </div>

          {/* CENTER: Controls */}
          <div className="flex items-center justify-center" style={{ flex: '1', gap: '20px' }}>
            {/* rewind 10s */}
            <button
              className="text-white hover:text-gray-300 transition-colors flex items-center justify-center"
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              style={{ width: '32px', height: '32px' }}
              aria-label="Rewind 10 seconds"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">10</text>
              </svg>
            </button>

            {/* play/pause */}
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
              style={{ width: '48px', height: '48px' }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>

            {/* forward 10s */}
            <button
              className="text-white hover:text-gray-300 transition-colors flex items-center justify-center"
              onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
              style={{ width: '32px', height: '32px' }}
              aria-label="Forward 10 seconds"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">10</text>
              </svg>
            </button>
          </div>

          {/* RIGHT: Time + progress (single row, right-aligned) */}
          <div
            className="flex items-center"
            style={{
              gap: '12px',
              flex: '0 0 auto',
              width: 'min(520px, 45%)',
              justifyContent: 'flex-end',
            }}
          >
            <span className="text-white text-xs font-mono" style={{ minWidth: '40px', textAlign: 'right' }}>
              {formatTime(currentTime)}
            </span>

            <div
              className="bg-gray-600 rounded-full cursor-pointer"
              style={{ height: '4px', flex: 1, minWidth: '160px' }}
              onClick={handleSeek}
              aria-label="Seek in audio"
            >
              <div
                className="bg-white rounded-full h-full transition-all duration-200"
                style={{ width: `${(currentTime / Math.max(duration, 1)) * 100}%` }}
              />
            </div>

            <span className="text-white text-xs font-mono" style={{ minWidth: '40px', textAlign: 'left' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default BookReadingPage;
