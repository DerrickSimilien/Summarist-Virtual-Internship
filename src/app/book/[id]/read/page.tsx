'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SidebarLayout from '../../../components/SidebarLayout';

const DESKTOP_PLAYER_HEIGHT = 80;
const MOBILE_PLAYER_HEIGHT = 160;
const MOBILE_BP = 600;   // phones and small devices
const TABLET_BP = 768;   // tablets

type Book = {
  title: string;
  author: string;
  imageLink: string;
  summary?: string;
  duration?: string;
  audioLink?: string;
};

const AUDIO_FALLBACK_BY_ID: Record<string, string> = {
  '5bxl50cz4bt':
    'https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fhow-to-win-friends-and-influence-people.mp3?alt=media&token=60872755-13fc-43f4-8b75-bae3fcd73991',
  '2l0idxm1rwv':
    "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fcan't-hurt-me.mp3?alt=media&token=7de57406-60ca-49d6-9113-857507f48312",
};

const FONT_PRESETS = [
  { label: 'Aa', px: 16, box: 20 },
  { label: 'Aa', px: 18, box: 24 },
  { label: 'Aa', px: 22, box: 28 },
  { label: 'Aa', px: 26, box: 32 },
];

function sanitizeFirebaseObjectUrl(input?: string | null): string | null {
  if (!input) return null;
  try {
    const u = new URL(input);
    const idx = u.pathname.indexOf('/o/');
    if (idx === -1) return input;
    const prefix = u.pathname.slice(0, idx + 3);
    const encodedObj = u.pathname.slice(idx + 3);
    const decodedObj = decodeURIComponent(encodedObj);
    u.pathname = prefix + encodeURIComponent(decodedObj);
    return u.toString();
  } catch {
    return input;
  }
}

export default function BookReadingPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const bookId = params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const [fontIndex, setFontIndex] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const val = window.localStorage.getItem('summarist:read_font_index');
    return val ? Number(val) : 0;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('summarist:read_font_index', String(fontIndex));
    }
  }, [fontIndex]);

  // responsive flags
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BP : false
  );
  const [isTablet, setIsTablet] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.innerWidth > MOBILE_BP && window.innerWidth <= TABLET_BP
      : false
  );
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= MOBILE_BP);
      setIsTablet(w > MOBILE_BP && w <= TABLET_BP);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

        const withAudio: Book = {
          ...data,
          audioLink: data.audioLink || AUDIO_FALLBACK_BY_ID[bookId],
        };

        setBook(withAudio);
        setAudioSrc(sanitizeFirebaseObjectUrl(withAudio.audioLink));

        const raw = withAudio.duration || '03:24';
        const [mm, ss] = raw.split(':');
        setDuration((parseInt(mm || '0', 10) * 60) + parseInt(ss || '0', 10));
      } catch (err: any) {
        console.error('Error fetching book data:', err);
        setError(err.message || 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBookData();
  }, [bookId]);

  // wire audio
  useEffect(() => {
    const el = audioRef.current;
    setIsPlaying(false);
    setCanPlay(false);
    setCurrentTime(0);
    if (!el || !audioSrc) return;

    const onLoadedMetadata = () => {
      setCanPlay(true);
      if (isFinite(el.duration)) setDuration(el.duration);
    };
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setCanPlay(false);
      setIsPlaying(false);
    };

    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('error', onError);

    return () => {
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('error', onError);
    };
  }, [audioSrc]);

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

  const safeDuration = duration || audioRef.current?.duration || 0;

  const playPause = async () => {
    const el = audioRef.current;
    if (!el || !audioSrc || !canPlay) return;
    if (el.paused) {
      try { await el.play(); } catch {}
    } else {
      el.pause();
    }
  };

  const seekTo = (t: number) => {
    const el = audioRef.current;
    if (!el || !audioSrc) return;
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

  const progressPct = safeDuration ? (currentTime / safeDuration) * 100 : 0;

  const bottomOffset = (isMobile || isTablet) ? MOBILE_PLAYER_HEIGHT : DESKTOP_PLAYER_HEIGHT;

  if (loading) {
    return (
      <SidebarLayout bottomOffset={bottomOffset} sidebarExtrasBelowSearch={SidebarFontControls}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg" style={{ color: '#6b7280' }}>Loading book content...</div>
        </div>
      </SidebarLayout>
    );
  }

  if (error || !book) {
    return (
      <SidebarLayout bottomOffset={bottomOffset} sidebarExtrasBelowSearch={SidebarFontControls}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-lg mb-4" style={{ color: '#dc2626' }}>
              Error loading book: {error || 'Unknown error'}
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

  return (
    <SidebarLayout bottomOffset={bottomOffset} sidebarExtrasBelowSearch={SidebarFontControls}>
      {audioSrc ? <audio ref={audioRef} src={audioSrc} preload="metadata" /> : null}

      {/* Content */}
      <div className="flex justify-center" style={{ width: '100%', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', width: '100%', padding: '0 20px 40px 20px' }}>
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
          <div style={{ width: '100%', height: '1px', backgroundColor: '#e5e7eb', marginBottom: '32px' }} />
          <div className="mb-12" style={{ paddingBottom: '120px' }}>
            {summaryParagraphs.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  fontSize: '14px',
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

      {/* Player */}
      <div className="reader-player fixed bottom-0 left-0 right-0 border-t" style={{ backgroundColor: '#042330' }}>
        {/* Row 1: cover + meta */}
        <div className="player-left">
          <img
            src={book.imageLink}
            alt={book.title}
            className="object-cover player-cover"
          />
          <div className="player-meta">
            <div className="player-title">{book.title}</div>
            <div className="player-author">{book.author}</div>
          </div>
        </div>

        {/* Row 2: controls */}
        <div className="player-center">
          <button
            className="skip-btn"
            onClick={rewind10}
            aria-label="Rewind 10 seconds"
            disabled={!audioSrc || !canPlay}
          >
            <div className="skip-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.6 9.6 0 0 0-6.7 2.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>10</span>
            </div>
          </button>

          <button
            onClick={playPause}
            className="play-btn"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={!audioSrc || !canPlay}
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
            className="skip-btn"
            onClick={forward10}
            aria-label="Forward 10 seconds"
            disabled={!audioSrc || !canPlay}
          >
            <div className="skip-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              <span>10</span>
            </div>
          </button>
        </div>

        {/* Row 3: progress */}
        <div className="player-right">
          <span className="time-left">{formatTime(currentTime)}</span>

          <div
            className="seekbar"
            onClick={audioSrc ? handleSeekClick : undefined}
            aria-label="Seek in audio"
          >
            <div className="seekbar-fill" style={{ width: `${progressPct}%` }} />
            <div className="seekbar-thumb" style={{ left: `calc(${progressPct}% - 6px)` }} />
          </div>

          <span className="time-right">{formatTime(safeDuration)}</span>
        </div>
      </div>

      {/* Player CSS */}
      <style jsx>{`
        .reader-player {
          height: ${DESKTOP_PLAYER_HEIGHT}px;
          z-index: 1001;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1fr 240px min(520px, 45%);
          align-items: center;
          gap: 16px;
        }

        .player-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
          padding-right: 16px;
        }
        .player-cover {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          flex: 0 0 auto;
        }
        .player-meta { overflow: hidden; }
        .player-title {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
          line-height: 1.25;
          white-space: normal;
          word-break: break-word;
        }
        .player-author {
          color: #9ca3af;
          font-size: 12px;
          margin-top: 2px;
          white-space: normal;
        }

        .player-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .play-btn {
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          background: #fff;
          display: grid;
          place-items: center;
          opacity: ${audioSrc ? 1 : 0.6};
          cursor: ${audioSrc ? 'pointer' : 'not-allowed'};
        }
        .skip-btn { color: #fff; }
        .skip-icon {
          position: relative;
          width: 28px;
          height: 28px;
        }
        .skip-icon svg { color: #fff; }
        .skip-icon span {
          position: absolute;
          left: 50%;
          top: 10px;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          text-shadow: 0 0 1px rgba(0,0,0,0.5);
        }

        .player-right {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
          opacity: ${audioSrc ? 1 : 0.6};
        }
        .time-left, .time-right {
          color: #fff;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 12px;
          min-width: 44px;
          text-align: center;
        }
        .seekbar {
          position: relative;
          height: 4px;
          flex: 1;
          min-width: 160px;
          background: #4b5563;
          border-radius: 9999px;
          cursor: ${audioSrc ? 'pointer' : 'not-allowed'};
        }
        .seekbar-fill {
          position: absolute; left: 0; top: 0; height: 100%;
          background: #ffffff; border-radius: 9999px;
        }
        .seekbar-thumb {
          position: absolute; top: 50%;
          width: 12px; height: 12px; transform: translateY(-50%);
          background: #ffffff; border-radius: 9999px;
          box-shadow: 0 0 0 2px rgba(0,0,0,.15);
          pointer-events: none;
        }

        /* ——— Mobile layout (<=600px): 3 stacked rows ——— */
        @media (max-width: ${MOBILE_BP}px) {
          .reader-player {
            height: ${MOBILE_PLAYER_HEIGHT}px;
            padding: 10px 16px 12px 16px;
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            justify-items: center;
            gap: 10px;
          }
          .player-left {
            width: 100%;
            justify-content: center;
            gap: 12px;
          }
          .player-center {
            width: 100%;
            justify-content: center;
            gap: 24px;
          }
          .player-right {
            width: 100%;
            justify-content: center;
            gap: 12px;
          }
          .seekbar { min-width: 0; width: 70vw; }
        }

        /* ——— Tablet layout (601px–768px): same stacked structure as mobile ——— */
        @media (min-width: ${MOBILE_BP + 1}px) and (max-width: ${TABLET_BP}px) {
          .reader-player {
            height: ${MOBILE_PLAYER_HEIGHT}px;      /* keep same height as mobile */
            padding: 12px 20px 14px 20px;
            grid-template-columns: 1fr;             /* single column */
            grid-template-rows: auto auto auto;     /* three rows */
            justify-items: center;
            gap: 12px;
          }
          .player-left {
            width: 100%;
            justify-content: center;                 /* cover + meta centered */
            gap: 14px;
          }
          .player-cover {
            width: 52px;                             /* a tad larger is ok */
            height: 52px;
          }
          .player-meta { text-align: left; }
          .player-title { font-size: 14px; }
          .player-author { font-size: 12px; }

          .player-center {
            width: 100%;
            justify-content: center;
            gap: 26px;
          }

          .player-right {
            width: 100%;
            justify-content: center;
            gap: 14px;
          }
          .seekbar { min-width: 0; width: 78vw; }   /* clearer, wider bar */
        }
      `}</style>
    </SidebarLayout>
  );
}
