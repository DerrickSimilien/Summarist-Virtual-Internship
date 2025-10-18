import React, { useState, useEffect } from 'react';
import { Home, Bookmark, Highlighter, Search, Settings, HelpCircle, LogIn, LogOut, Clock, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface SidebarLayoutProps {
  children: React.ReactNode;
  bottomOffset?: number;
  sidebarExtrasBelowSearch?: React.ReactNode;
}

const mainNavigationItems = [
  { name: 'For you', href: '/for-you', icon: Home },
  { name: 'My Library', href: '/library', icon: Bookmark },
  { name: 'Highlights', href: '/highlights', icon: Highlighter },
  { name: 'Search', href: '/search', icon: Search },
];

const bottomNavigationItems = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

// Skeleton loader for search results
const SearchResultSkeleton = () => (
  <div className="flex items-center" style={{ padding: '12px 16px', gap: '12px' }}>
    <div
      style={{
        width: '64px',
        height: '64px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}
    ></div>
    <div style={{ flex: 1 }}>
      <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '6px', width: '80%' }}></div>
      <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '6px', width: '60%' }}></div>
      <div style={{ height: '12px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '40%' }}></div>
    </div>
  </div>
);

// Search component
const SearchBarWithDropdown = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const getBookDuration = (bookTitle: string) => {
    const durations: Record<string, string> = {
      'How to Win Friends and Influence People': '03:24',
      "Can't Hurt Me": '04:52',
      'Mastery': '04:40',
      'Atomic Habits': '03:24',
      'How to Talk to Anyone': '03:22',
      'Jim Collins': '03:01',
      'Good to Great': '03:01',
      'The Intelligent Investor': '02:48',
      'The 4 Day Week': '02:20',
      'The 7 Habits of Highly Effective People': '04:36',
      'Zero to One': '03:24',
      'Rich Dad Poor Dad': '05:38',
      'The 10X Rule': '04:15',
      'Deep Work': '04:02',
      'The Second Machine Age': '03:36',
      'The 5 Second Rule': '02:45',
      'The 12 Week Year': '03:36',
      'Getting Things Done': '02:24',
      'The Power of Now': '03:12',
      'Think and Grow Rich': '04:25',
      'The Lean Startup': '03:23'
    };
    return durations[bookTitle] || '03:24';
  };

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setShowDropdown(false);
      setSearchResults([]);
      return;
    }

    setShowDropdown(true);
    setIsSearching(true);

    const searchBooks = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const [recommendedRes, suggestedRes, selectedRes] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected')
        ]);

        const recommended = await recommendedRes.json();
        const suggested = await suggestedRes.json();
        const selected = await selectedRes.json();

        const allBooks = [...(recommended || []), ...(suggested || []), ...(selected || [])];
        const uniqueBooks = allBooks.filter((book: any, index: number, self: any[]) =>
          index === self.findIndex(b => b.id === book.id)
        );

        const filtered = uniqueBooks.filter((book: any) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(filtered.slice(0, 5));
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchBooks, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="search-bar-container">
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for books"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowDropdown(true)}
          className="outline-none transition-all duration-200"
          style={{
            paddingLeft: '20px',
            paddingRight: searchQuery ? '80px' : '50px',
            paddingTop: '14px',
            paddingBottom: '14px',
            width: '100%',
            backgroundColor: showDropdown ? '#ffffff' : '#f1f6f4',
            border: showDropdown ? '2px solid #2bd97c' : '2px solid #e4e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            color: '#032b41',
          }}
        />
        <div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center"
          style={{ height: '20px' }}
        >
          {searchQuery && (
            <button
              onClick={clearSearch}
              style={{
                padding: '4px',
                marginRight: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X style={{ height: '16px', width: '16px', color: '#6b757b' }} />
            </button>
          )}
          <div style={{ width: '1px', height: '44px', backgroundColor: '#d1d5db', marginRight: '12px' }} />
          <Search style={{ height: '20px', width: '20px', color: '#6b757b' }} />
        </div>
      </div>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 2000
          }}
        >
          {isSearching ? (
            <>
              {[...Array(3)].map((_, i) => (
                <SearchResultSkeleton key={i} />
              ))}
            </>
          ) : searchResults.length > 0 ? (
            searchResults.map((book: any) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  gap: '12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <img
                  src={book.imageLink}
                  alt={book.title}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#032B41',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {book.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {book.author}
                  </p>
                  <div className="flex items-center" style={{ gap: '4px' }}>
                    <Clock style={{ width: '12px', height: '12px', color: '#6b7280' }} />
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {getBookDuration(book.title)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px'
              }}
            >
              No books found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, bottomOffset = 0, sidebarExtrasBelowSearch }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Overlay for mobile/tablet */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1999,
            display: 'none'
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 flex flex-col border-r ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}
        style={{
          width: '240px',
          backgroundColor: '#f7f8fc',
          borderColor: '#e4e5e7',
          zIndex: 2000,
          bottom: bottomOffset > 0 ? bottomOffset : 0,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div
          className="flex items-center border-b"
          style={{ padding: '32px 32px', borderColor: '#e4e5e7', height: '96px' }}
        >
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Summarist" style={{ width: '160px', height: 'auto' }} />
          </Link>
        </div>

        <nav
          className="flex-1 flex flex-col overflow-auto"
          style={{ paddingTop: '40px', paddingBottom: bottomOffset > 0 ? 16 : 40 }}
        >
          <ul style={{ paddingLeft: '32px', paddingRight: '32px' }}>
            {mainNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.name} style={{ marginBottom: '24px' }}>
                  <Link
                    href={item.href}
                    className="flex items-center transition-colors duration-150"
                    style={{
                      padding: '12px 16px',
                      fontSize: '16px',
                      fontWeight: '400',
                      color: isActive ? '#2bd97c' : '#032B41',
                      backgroundColor: isActive ? 'rgba(43, 217, 124, 0.08)' : 'transparent',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(3, 43, 65, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon
                      className="flex-shrink-0"
                      style={{
                        marginRight: '16px',
                        height: '20px',
                        width: '20px',
                        color: isActive ? '#2bd97c' : '#6b757b',
                      }}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {sidebarExtrasBelowSearch && (
            <div style={{ paddingLeft: '32px', paddingRight: '32px', marginTop: '4px', marginBottom: '24px' }}>
              {sidebarExtrasBelowSearch}
            </div>
          )}

          <div className="flex-1" />

          <ul style={{ paddingLeft: '32px', paddingRight: '32px' }}>
            {bottomNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.name} style={{ marginBottom: '24px' }}>
                  <Link
                    href={item.href}
                    className="flex items-center transition-colors duration-150"
                    style={{
                      padding: '12px 16px',
                      fontSize: '16px',
                      fontWeight: '400',
                      color: isActive ? '#2bd97c' : '#032B41',
                      backgroundColor: isActive ? 'rgba(43, 217, 124, 0.08)' : 'transparent',
                      textDecoration: 'none',
                      borderRadius: '8px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(3, 43, 65, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon
                      className="flex-shrink-0"
                      style={{
                        marginRight: '16px',
                        height: '20px',
                        width: '20px',
                        color: isActive ? '#2bd97c' : '#6b757b',
                      }}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}

            <li key="auth">
              {!loading &&
                (user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center transition-colors duration-150 w-full text-left"
                    style={{
                      padding: '12px 16px',
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#032B41',
                      backgroundColor: 'transparent',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(3, 43, 65, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut
                      className="flex-shrink-0"
                      style={{ marginRight: '16px', height: '20px', width: '20px', color: '#6b757b' }}
                    />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="flex items-center transition-colors duration-150"
                    style={{
                      padding: '12px 16px',
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#032B41',
                      backgroundColor: 'transparent',
                      textDecoration: 'none',
                      borderRadius: '8px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(3, 43, 65, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogIn
                      className="flex-shrink-0"
                      style={{ marginRight: '16px', height: '20px', width: '20px', color: '#6b757b' }}
                    />
                    Login
                  </Link>
                ))}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col main-wrap" style={{ marginLeft: '240px' }}>
        <header
          className="border-b"
          style={{
            backgroundColor: 'white',
            borderColor: '#e4e5e7',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            height: '96px',
          }}
        >
          <div style={{ padding: '32px 40px', height: '100%' }}>
            <div className="flex items-center justify-end h-full header-content" style={{ gap: '16px' }}>
              {/* Burger appears on tablet/mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hamburger-menu"
                style={{
                  display: 'none',
                  flexDirection: 'column',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px'
                }}
                aria-label="Toggle menu"
              >
                <span style={{ width: '24px', height: '3px', backgroundColor: '#032B41', borderRadius: '2px' }}></span>
                <span style={{ width: '24px', height: '3px', backgroundColor: '#032B41', borderRadius: '2px' }}></span>
                <span style={{ width: '24px', height: '3px', backgroundColor: '#032B41', borderRadius: '2px' }}></span>
              </button>

              <SearchBarWithDropdown />
            </div>
          </div>
        </header>

        <main className="flex-1" style={{ padding: '40px', backgroundColor: 'white', paddingBottom: bottomOffset }}>
          {children}
        </main>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* ====== Tablet/Mobile (≤768px) ====== */
        @media (max-width: 768px) {
          .hamburger-menu {
            display: flex !important;
            order: -1;
            flex-shrink: 0;
          }

          .header-content {
            justify-content: space-between !important;
          }

          .search-bar-container {
            width: 100% !important;
            max-width: calc(100vw - 120px) !important;
            flex-shrink: 1;
            min-width: 0;
          }

          .search-bar-container input {
            font-size: 14px !important;
            padding: 10px 40px 10px 12px !important;
          }

          .search-bar-container .absolute.right-4 {
            right: 8px !important;
          }

          /* Hide sidebar off-canvas by default on tablet/mobile */
          .fixed.left-0.top-0.flex.flex-col.border-r {
            transform: translateX(-100%);
            width: 80vw !important; /* drawer width similar to original */
            max-width: 320px !important;
          }

          /* When open, slide it in */
          .mobile-menu-open {
            transform: translateX(0) !important;
          }

          /* Show the overlay on tablet/mobile */
          .mobile-overlay {
            display: block !important;
          }

          header > div {
            padding: 16px 20px !important;
          }

          .header-content {
            gap: 12px !important;
          }

          /* Remove desktop left margin when sidebar is off-canvas */
          .main-wrap {
            margin-left: 0 !important;
          }

          main {
            padding: 20px 16px !important;
          }
        }

        /* ====== Desktop (>768px) keeps pinned sidebar ====== */
        @media (min-width: 769px) {
          .fixed.left-0.top-0.flex.flex-col.border-r {
            transform: translateX(0);
            width: 240px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarLayout;
