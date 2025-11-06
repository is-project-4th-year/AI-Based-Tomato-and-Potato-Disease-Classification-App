import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'History', href: '/history', icon: '📊' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen">
      {/* Navigation bar */}
      <nav className="glass-card sticky top-4 mx-4 my-4 z-50 animate-slide-up">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl glow-green">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">
                Plant Health
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg glow-green'
                      : 'text-gray-700 hover:bg-white/60 hover:shadow-md'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-white/50 rounded-xl">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full text-white font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-red-100/80 hover:bg-red-200/80 text-red-700 font-medium transition-all duration-200 hover:shadow-md"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-all"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200/50 animate-slide-up">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                        : 'text-gray-700 hover:bg-white/60'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <div className="flex items-center space-x-3 px-4 py-3 bg-white/50 rounded-xl mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full text-white font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl bg-red-100/80 hover:bg-red-200/80 text-red-700 font-medium transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="px-4 pb-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-sm text-gray-500">
        <div className="glass-card mx-4 py-6">
          <p>&copy; 2025 Plant Disease Detection. Protecting your crops with AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
