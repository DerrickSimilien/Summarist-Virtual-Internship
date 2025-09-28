'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarLayout from '../../../components/SidebarLayout';

const PLAYER_HEIGHT = 80; // match your player's height

type Book = {
  title: string;
  author: string;
  imageLink: string;
  summary?: string;
  duration?: string;      // "MM:SS" fallback
  audioUrl?: string;      // MP3/OGG URL (CORS-enabled)
};

/** Add known audio fallbacks by book id. Extend as needed. */
const AUDIO_FALLBACK_BY_ID: Record<string, string> = {
  // How to Win Friends and Influence People in the Digital Age
  '5bxl50cz4bt':
    'https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fhow-to-win-friends-and-influence-people.mp3?alt=media&token=60872755-13fc-43f4-8b75-bae3fcd73991',

  // Can't Hurt Me — David Goggins
  '2l0idxm1rwv':
    "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fcan't-hurt-me.mp3?alt=media&token=7de57406-60ca-49d6-9113-857507f48312",  
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

  // audio + player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);
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

  // fetch book
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

        // Apply fallback audio if API doesn't send one
        const withAudio: Book = {
          ...data,
          audioUrl: data.audioUrl || AUDIO_FALLBACK_BY_ID[bookId],
        };

        setBook(withAudio);

        // Fallback duration from API; later we overwrite with audio metadata
        const raw = withAudio.duration || '03:24';
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

  // wire audio element events when source changes
  useEffect(() => {
    // If no audioUrl, reset state and bail
    if (!book?.audioUrl) {
      const el = audioRef.current;
      if (el) {
        try {
          el.pause();
        } catch {}
      }
      setIsPlaying(false);
      setCanPlay(false);
      setCurrentTime(0);
      return;
    }

    const el = audioRef.current;
    if (!el) return;

    const onLoadedMetadata = () => {
      setCanPlay(true);
      if (isFinite(el.duration)) setDuration(el.duration);
    };
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);

    // Reset playhead whenever src changes
    setCurrentTime(0);
    setCanPlay(false);
    setIsPlaying(false);

    return () => {
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, [book?.audioUrl]);

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

  // ---- audio control helpers ----
  const safeDuration = duration || audioRef.current?.duration || 0;

  const playPause = async () => {
    const el = audioRef.current;
    if (!el || !book?.audioUrl || !canPlay) return;
    if (el.paused) {
      try {
        await el.play();
      } catch {
        // user gesture might be required by browser
      }
    } else {
      el.pause();
    }
  };

  const seekTo = (t: number) => {
    const el = audioRef.current;
    if (!el || !book?.audioUrl) return;
    const d = safeDuration || 0;
    el.currentTime = Math.max(0, Math.min(t, d));
    setCurrentTime(el.currentTime);
  };

  const rewind10 = () => seekTo(currentTime - 10);
  const forward10 = () => seekTo(currentTime + 10);

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bar.left;
    const pct = clickX / bar.width;
    seekTo((safeDuration || 0) * pct);
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
  const progressPct = (safeDuration ? (currentTime / safeDuration) * 100 : 0);

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
      {/* Hidden audio element that the UI controls — render ONLY when audioUrl exists */}
      {book.audioUrl ? (
        <audio ref={audioRef} src={book.audioUrl} preload="metadata" />
      ) : null}

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
          <div
            className="flex items-center"
            style={{ gap: '16px', flex: '1 1 auto', minWidth: 0, paddingRight: '16px' }}
          >
            <img
              src={book.imageLink}
              alt={book.title}
              className="object-cover"
              style={{ width: '48px', height: '48px', borderRadius: '4px', flex: '0 0 auto' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div
                className="text-white"
                style={{
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: 1.25,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {book.title}
              </div>
              <div className="text-gray-400" style={{ fontSize: '12px', marginTop: '2px', whiteSpace: 'normal' }}>
                {book.author}
              </div>
            </div>
          </div>

          {/* CENTER: Controls */}
          <div className="flex items-center justify-center" style={{ flex: '0 0 240px', gap: '20px' }}>
            <button
              className="text-white hover:text-gray-300 transition-colors flex items-center justify-center relative"
              onClick={rewind10}
              style={{ width: '40px', height: '40px' }}
              aria-label="Rewind 10 seconds"
              disabled={!book.audioUrl}
            >
              <div style={{ width: 28, height: 28, position: 'relative' }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'white', shapeRendering: 'geometricPrecision' as any, opacity: book.audioUrl ? 1 : 0.5 }}
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.6 9.6 0 0 0-6.7 2.7L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 10,
                    transform: 'translateX(-50%)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1,
                    WebkitFontSmoothing: 'antialiased',
                    textShadow: '0 0 1px rgba(0,0,0,0.5)',
                    opacity: book.audioUrl ? 1 : 0.5,
                  }}
                >
                  10
                </span>
              </div>
            </button>

            <button
              onClick={playPause}
              className="flex items-center justify-center rounded-full transition-colors"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#ffffff',
                opacity: book.audioUrl ? 1 : 0.6,
                cursor: book.audioUrl ? 'pointer' : 'not-allowed',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              disabled={!book.audioUrl || !canPlay}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="6" y="5" width="5" height="14" fill="#032B41" />
                  <rect x="13" y="5" width="5" height="14" fill="#032B41" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <polygon points="8,5 19,12 8,19" fill="#032B41" />
                </svg>
              )}
            </button>

            <button
              className="text-white hover:text-gray-300 transition-colors flex items-center justify-center relative"
              onClick={forward10}
              style={{ width: '40px', height: '40px' }}
              aria-label="Forward 10 seconds"
              disabled={!book.audioUrl}
            >
              <div style={{ width: 28, height: 28, position: 'relative' }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'white', shapeRendering: 'geometricPrecision' as any, opacity: book.audioUrl ? 1 : 0.5 }}
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 10,
                    transform: 'translateX(-50%)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1,
                    WebkitFontSmoothing: 'antialiased',
                    textShadow: '0 0 1px rgba(0,0,0,0.5)',
                    opacity: book.audioUrl ? 1 : 0.5,
                  }}
                >
                  10
                </span>
              </div>
            </button>
          </div>

          {/* RIGHT: Time + progress */}
          <div
            className="flex items-center"
            style={{
              gap: '12px',
              flex: '0 0 auto',
              width: 'min(520px, 45%)',
              justifyContent: 'flex-end',
              opacity: book.audioUrl ? 1 : 0.6,
            }}
          >
            <span className="text-white text-xs font-mono" style={{ minWidth: '40px', textAlign: 'right' }}>
              {formatTime(currentTime)}
            </span>

            <div
              className="relative rounded-full"
              style={{
                height: '4px',
                flex: 1,
                minWidth: '160px',
                backgroundColor: '#4b5563',
                overflow: 'visible',
                cursor: book.audioUrl ? 'pointer' : 'not-allowed',
              }}
              onClick={book.audioUrl ? handleSeekClick : undefined}
              aria-label="Seek in audio"
            >
              <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: '#ffffff' }} />
              <div
                className="absolute"
                style={{
                  top: '50%',
                  left: `calc(${progressPct}% - 6px)`,
                  transform: 'translateY(-50%)',
                  width: '12px',
                  height: '12px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 0 0 2px rgba(0,0,0,0.15)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <span className="text-white text-xs font-mono" style={{ minWidth: '40px', textAlign: 'left' }}>
              {formatTime(safeDuration)}
            </span>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default BookReadingPage;
