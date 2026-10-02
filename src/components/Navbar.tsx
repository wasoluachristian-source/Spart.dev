import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2,
  Menu,
  X,
  ShieldCheck,
  Mail,
  Bell,
  Sparkles,
  LogOut,
  ChevronRight,
  Layers,
  ShoppingBag,
  BookOpen,
  GraduationCap,
  Megaphone,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSubscribeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openSubscribeModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { adminUnlocked, logoutAdmin, settings } = useApp();

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'projects', label: 'Mes projets' },
    { id: 'products', label: 'Produits' },
    { id: 'books', label: 'Livres' },
    { id: 'courses', label: 'Formations' },
    { id: 'announcements', label: 'Annonces' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavigate = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-500 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-cyan-400 group-hover:text-rose-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  Spart<span className="text-cyan-400">.dev</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 shadow-sm shadow-cyan-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Admin Status */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={openSubscribeModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition shadow-sm"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>S'abonner</span>
            </button>

            <button
              onClick={() => handleNavigate('contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md shadow-cyan-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Mail className="w-4 h-4" />
              <span>Me contacter</span>
            </button>

            {/* Admin Badge only if currently logged in */}
            {adminUnlocked && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  onClick={() => handleNavigate('admin')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border ${
                    currentTab === 'admin'
                      ? 'bg-rose-950/70 border-rose-600 text-rose-300'
                      : 'bg-rose-950/30 border-rose-800/60 text-rose-400 hover:bg-rose-900/40'
                  }`}
                  title="Tableau de bord Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={() => logoutAdmin()}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-900"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={openSubscribeModal}
              className="p-2 text-slate-300 bg-slate-900 border border-slate-800 rounded-lg"
              aria-label="S'abonner"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const active = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition ${
                  active
                    ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                    : 'text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => handleNavigate('contact')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-600 to-indigo-600 shadow-md shadow-cyan-900/30"
            >
              <Mail className="w-4 h-4" />
              <span>Me contacter</span>
            </button>

            {adminUnlocked && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleNavigate('admin')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-950/60 border border-rose-700/60 text-rose-300 text-sm font-medium"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tableau de bord Admin</span>
                </button>
                <button
                  onClick={() => logoutAdmin()}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
