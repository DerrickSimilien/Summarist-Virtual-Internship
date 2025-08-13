import React from 'react';
import { Home, Bookmark, Highlighter, Search, Settings, HelpCircle, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

// Main navigation items (top of sidebar)
const mainNavigationItems = [
  { name: 'For you', href: '/for-you', icon: Home },
  { name: 'My Library', href: '/library', icon: Bookmark },
  { name: 'Highlights', href: '/highlights', icon: Highlighter },
  { name: 'Search', href: '/search', icon: Search },
];

// Bottom navigation items (pushed to bottom)
const bottomNavigationItems = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
  { name: 'Login', href: '/login', icon: LogIn },
];

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed Position */}
      <div className="fixed left-0 top-0 w-64 h-full bg-gray-100 shadow-sm border-r border-gray-200 flex flex-col z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Summarist Logo" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col">
          {/* Main navigation items */}
          <ul className="space-y-1 px-3">
            {mainNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name} className="relative">
                  {/* Green active indicator tab */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full"></div>
                  )}
                  
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                        : 'hover:bg-gray-200'
                    }`}
                    style={{ color: isActive ? undefined : '#032B41' }}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Spacer to push bottom items down */}
          <div className="flex-1"></div>

          {/* Bottom navigation items */}
          <ul className="space-y-1 px-3 mt-4">
            {bottomNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name} className="relative">
                  {/* Green active indicator tab */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full"></div>
                  )}
                  
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                        : 'hover:bg-gray-200'
                    }`}
                    style={{ color: isActive ? undefined : '#032B41' }}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content - with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top header with search */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-end">
                <div className="relative">
                {/* Vertical divider line */}
                <div className="absolute right-9 top-1/2 transform -translate-y-1/2 h-8 w-px bg-gray-400"></div>
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for books"
                  className="pl-4 pr-10 py-2 w-80 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;