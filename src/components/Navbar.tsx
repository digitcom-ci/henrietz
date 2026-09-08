import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ShieldCheck, User as UserIcon, LogOut, LayoutDashboard, Menu, X, Sparkles, LogIn, ArrowLeft } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    cartCount, 
    setIsCartOpen,
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenClientPortal = () => {
    if (currentUser) {
      setViewMode('client-portal');
    } else {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const navLinks = [
    { href: '#hero', label: 'Accueil', onClick: () => setViewMode('client') },
    { href: '#catalogue', label: 'Collection Meubles', onClick: () => setViewMode('client') },
    { href: '#devis-builder', label: 'Devis Sur-Mesure', highlight: true, onClick: () => setViewMode('client') },
    { href: '#contact', label: 'Contact', onClick: () => setViewMode('client') },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-md font-sans transition-colors duration-300 ${
      viewMode === 'admin' 
        ? 'bg-henrietz-walnut text-white border-henrietz-gold/20'
        : 'bg-cacao/95 text-ivoire border-sable/20'
    }`}>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex justify-between items-center">
        
        {/* Brand Logo Image */}
        <div 
          className="flex items-center cursor-pointer group" 
          onClick={() => { setViewMode('client'); setMobileMenuOpen(false); }}
        >
          <img 
            src="/logo-henrietz-light.png" 
            alt="Maison HENRIETZ Meubles & Déco" 
            className="h-9 sm:h-11 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Desktop Client Navigation */}
        {viewMode === 'client' ? (
          <nav className="hidden lg:flex items-center gap-7 text-[12px] tracking-wider font-medium text-ivoire/90">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.onClick}
                className={`transition-colors duration-200 hover:text-sable ${
                  link.highlight ? 'text-sable font-bold underline underline-offset-4 decoration-terracotta' : ''
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : viewMode === 'client-portal' ? (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-terracotta/20 text-sable border border-terracotta/40 rounded-full font-semibold text-xs flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-cognac" />
              Espace Personnel Client
            </span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-henrietz-gold/15 text-henrietz-gold border border-henrietz-gold/30 rounded-full font-medium text-[11px] flex items-center gap-1.5 tracking-wider">
              <LayoutDashboard className="w-3.5 h-3.5" />
              Session ERP Admin Active
            </span>
          </div>
        )}

          {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {viewMode !== 'admin' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-charbon/50 hover:bg-terracotta/40 rounded-full transition border border-sable/30"
              aria-label="Panier"
            >
              <ShoppingBag className="w-4 h-4 text-sable" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-ivoire font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-cacao">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {viewMode === 'client' ? (
            <a
              href="#devis-builder"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-terracotta to-cognac hover:brightness-110 text-ivoire font-bold text-[11px] tracking-wider uppercase rounded-lg shadow-md transition transform hover:-translate-y-0.5"
            >
              Demander un Devis
            </a>
          ) : viewMode === 'client-portal' ? (
            <button
              onClick={() => setViewMode('client')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-charbon hover:bg-terracotta text-ivoire font-bold text-[11px] tracking-wider uppercase rounded-lg border border-sable/30 transition shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sable" />
              Retour Vitrine
            </button>
          ) : (
            <button
              onClick={() => setViewMode('client')}
              className="px-3 py-1 border border-white/20 hover:bg-white/10 text-[11px] rounded-lg transition text-gray-300 tracking-wider font-medium"
            >
              Retour Vitrine
            </button>
          )}

          {/* Profil Button & LogOut Icon */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleOpenClientPortal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-charbon/50 hover:bg-terracotta/30 text-sable hover:text-ivoire font-medium text-xs rounded-lg border border-sable/30 transition"
                title="Espace Client / Profil"
              >
                <UserIcon className="w-4 h-4 text-sable" />
                <span className="hidden md:inline max-w-[90px] truncate text-[11px]">{currentUser.name || 'Profil'}</span>
              </button>
              <button
                onClick={logout}
                className="p-2 bg-charbon/50 hover:bg-terracotta/40 text-sable hover:text-terracotta rounded-full transition border border-sable/30"
                title="Déconnexion"
                aria-label="Déconnexion"
              >
                <LogOut className="w-4 h-4 text-sable hover:text-terracotta" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-charbon/50 hover:bg-terracotta/30 text-sable hover:text-ivoire font-medium text-xs rounded-lg border border-sable/30 transition"
              title="Se connecter / Profil"
            >
              <UserIcon className="w-4 h-4 text-sable" />
              <span className="hidden sm:inline text-[11px]">Profil</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          {viewMode === 'client' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-charbon/50 hover:bg-terracotta/40 text-sable transition border border-sable/30"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-sable" /> : <Menu className="w-4 h-4 text-sable" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {viewMode === 'client' && mobileMenuOpen && (
        <div className="lg:hidden bg-charbon border-b border-sable/20 px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 text-ivoire">
          <nav className="flex flex-col space-y-3 text-xs tracking-wider font-medium text-ivoire/90">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => { setMobileMenuOpen(false); link.onClick(); }}
                className={`py-1.5 border-b border-sable/10 transition-colors ${
                  link.highlight ? 'text-sable font-bold' : 'hover:text-sable'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            {!currentUser && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                  className="py-2 text-center bg-charbon/80 border border-sable/30 text-sable font-bold text-xs rounded-lg"
                >
                  Se Connecter
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setAuthModalMode('register'); setIsAuthModalOpen(true); }}
                  className="py-2 text-center bg-terracotta text-ivoire font-bold text-xs rounded-lg"
                >
                  S'inscrire
                </button>
              </div>
            )}

            <a
              href="#devis-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 bg-gradient-to-r from-terracotta to-cognac text-ivoire font-bold text-xs uppercase tracking-wider rounded-lg shadow"
            >
              Demander un Devis Sur-Mesure
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
