import React, { useState, useEffect } from 'react';
import { Home, Bookmark, Highlighter, Search, Settings, HelpCircle, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface SidebarLayoutProps {
  children: React.ReactNode;
  /** Optional space reserved at the bottom for fixed UI (e.g., audio player) */
  bottomOffset?: number;
  /** Optional extra content to render RIGHT BELOW Search in the sidebar (read page only) */
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

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, bottomOffset = 0, sidebarExtrasBelowSearch }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      {/* Sidebar (fixed). Ends above the player when bottomOffset > 0 */}
      <div
        className="fixed left-0 top-0 flex flex-col border-r"
        style={{
          width: '240px',
          backgroundColor: '#f7f8fc',
          borderColor: '#e4e5e7',
          zIndex: 1000,
          bottom: bottomOffset > 0 ? bottomOffset : 0,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center border-b"
          style={{ padding: '32px 32px', borderColor: '#e4e5e7', height: '96px' }}
        >
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Summarist" style={{ width: '160px', height: 'auto' }} />
          </Link>
        </div>

        {/* Nav (scrollable) */}
        <nav
          className="flex-1 flex flex-col overflow-auto"
          style={{ paddingTop: '40px', paddingBottom: bottomOffset > 0 ? 16 : 40 }}
        >
          {/* Main items */}
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

          {/* Slot: extras below Search (read page only) */}
          {sidebarExtrasBelowSearch && (
            <div style={{ paddingLeft: '32px', paddingRight: '32px', marginTop: '4px', marginBottom: '24px' }}>
              {sidebarExtrasBelowSearch}
            </div>
          )}

          {/* Push bottom items down */}
          <div className="flex-1" />

          {/* Bottom items */}
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

            {/* Auth */}
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

      {/* Main content area */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '240px' }}>
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
            <div className="flex items-center justify-end h-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for books"
                  className="outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200"
                  style={{
                    paddingLeft: '20px',
                    paddingRight: '50px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    width: '360px',
                    backgroundColor: '#f1f6f4',
                    border: '2px solid #e4e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#032b41',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2bd97c';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e4e7eb';
                    e.target.style.backgroundColor = '#f1f6f4';
                  }}
                />
                <div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center"
                  style={{ height: '20px' }}
                >
                  <div style={{ width: '1px', height: '44px', backgroundColor: '#d1d5db', marginRight: '12px' }} />
                  <Search className="pointer-events-none" style={{ height: '20px', width: '20px', color: '#6b757b' }} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content with bottom padding = player height (if any) */}
        <main className="flex-1" style={{ padding: '40px', backgroundColor: 'white', paddingBottom: bottomOffset }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
