import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Pencil, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Documentation', href: '#docs' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-3 border-gray-900 relative overflow-hidden">
      {/* Decorative doodle elements in navbar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10" aria-hidden="true">
        <svg className="absolute top-2 left-20 w-12 h-12 text-amber-500" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
        </svg>
        <svg className="absolute top-2 right-32 w-10 h-10 text-orange-500" viewBox="0 0 50 50">
          <path d="M 10 25 Q 20 15, 30 25 Q 40 35, 45 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500" 
        aria-hidden="true"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced styling */}
          <Link to="/" className="flex items-center space-x-2 group relative">
            <div 
              className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center border-3 border-gray-900 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 relative"
              style={{ boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.15)' }}
            >
              <Pencil className="w-5 h-5 text-white" strokeWidth={2.5} />
              <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span 
              className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Doodlio
            </span>
            {/* Decorative underline doodle */}
            <svg 
              className="absolute -bottom-1 left-12 w-20 h-2 text-amber-400 opacity-0 group-hover:opacity-60 transition-opacity duration-300"
              viewBox="0 0 80 8"
            >
              <path d="M 2 4 Q 20 2, 40 4 T 78 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>

          {/* Desktop Navigation with creative hover */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-amber-600 transition-all font-medium relative group py-2"
              >
                {link.name}
                {/* Hand-drawn underline effect */}
                <svg 
                  className="absolute -bottom-1 left-0 w-full h-2 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path d="M 2 4 Q 25 2, 50 4 T 98 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-amber-600 hover:bg-amber-50 font-medium rounded-xl transition-all"
            >
              Se connecter
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold border-3 border-gray-900 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 rounded-xl relative overflow-hidden group"
              style={{ boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.15)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Commencer gratuitement
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button with doodle style */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-amber-50 border-2 border-transparent hover:border-amber-300 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu with doodle styling */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t-3 border-gray-900 relative" style={{ boxShadow: '0 4px 0px rgba(0, 0, 0, 0.1)' }}>
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-gray-700 hover:text-amber-600 transition-colors font-medium py-2 px-3 rounded-lg hover:bg-amber-50 border-2 border-transparent hover:border-amber-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 space-y-3">
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full border-3 border-gray-900 hover:border-amber-500 hover:bg-amber-50 rounded-xl font-semibold"
              >
                Se connecter
              </Button>
              <Button
                onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold border-3 border-gray-900 shadow-md rounded-xl"
                style={{ boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.15)' }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Commencer gratuitement
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
