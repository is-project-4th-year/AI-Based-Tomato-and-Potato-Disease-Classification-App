import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, History, Menu, X, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', Icon: Home },
    { name: 'History', href: '/history', Icon: History },
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
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden sm:block">
                Plant Health
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.Icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/60 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-white/50 rounded-xl">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full text-white font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all duration-200 hover:shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200/50 animate-slide-up">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.Icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                          : 'text-gray-700 hover:bg-white/60'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <div className="flex items-center space-x-3 px-4 py-3 bg-white/50 rounded-xl mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full text-white font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
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
