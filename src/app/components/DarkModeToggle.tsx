'use client';

import { useDarkMode } from '@/lib/darkModeContext';
import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-200 animate-pulse"></div>
    );
  }

  return <DarkModeToggleContent />;
}

function DarkModeToggleContent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="w-5 h-5 relative">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
            isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
            isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
    </button>
  );
}