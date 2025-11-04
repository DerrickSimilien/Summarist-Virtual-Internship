'use client';

import { useDarkMode } from '@/lib/darkModeContext';
import { useEffect, useState } from 'react';
import { IoSunnyOutline } from 'react-icons/io5';
import { FaRegMoon } from 'react-icons/fa';

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
      className="relative p-2 transition-colors duration-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="w-5 h-5 relative">
        {/* Sun Icon */}
        <IoSunnyOutline
          className={`absolute inset-0 w-7 h-7 text-yellow-500 transition-all duration-300 ${
            isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />

        {/* Moon Icon */}
        <FaRegMoon
          className={`absolute inset-0 w-7 h-7 text-blue-400 transition-all duration-300 ${
            isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
}