import React from 'react';
import { Code2, Github, Twitter, Linkedin, Heart, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openSubscribeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openSubscribeModal }) => {
  const { settings } = useApp();

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-500 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Spart<span className="text-cyan-400">.dev</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Espace professionnel personnel de création et développement. Présentation de projets, produits digitaux, publications et cours spécialisés.
            </p>
            <div className="pt-2 flex items-center gap-3">
              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-900 transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-900 transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('projects')}
                  className="hover:text-cyan-400 transition"
                >
                  Mes projets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('products')}
                  className="hover:text-cyan-400 transition"
                >
                  Produits numériques
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('books')}
                  className="hover:text-cyan-400 transition"
                >
                  Livres & Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('courses')}
                  className="hover:text-cyan-400 transition"
                >
                  Formations
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('announcements')}
                  className="hover:text-cyan-400 transition"
                >
                  Annonces & Nouvelles
                </button>
              </li>
            </ul>
          </div>

          {/* Info & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Informations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-cyan-400 transition"
                >
                  À propos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-cyan-400 transition"
                >
                  Me contacter
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('terms')}
                  className="hover:text-cyan-400 transition"
                >
                  Conditions d’utilisation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('privacy')}
                  className="hover:text-cyan-400 transition"
                >
                  Politique de confidentialité
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter box in footer */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Restez informé
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Recevez les notifications lors de nouvelles publications de projets, formations ou produits.
            </p>
            <button
              onClick={openSubscribeModal}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-sm font-medium text-cyan-300 rounded-lg transition flex items-center justify-center gap-2"
            >
              <span>S’abonner gratuitement</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-500 mt-2">
              Adresse e-mail protégée. Aucun spam.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span
              onDoubleClick={() => handleNav('login')}
              className="cursor-default select-none transition-colors hover:text-slate-400 active:text-cyan-400"
              title=""
            >
              ©
            </span>{' '}
            {new Date().getFullYear()} Spart.dev. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {settings.availableForFreelance ? 'Disponible pour nouveaux projets' : 'Actuellement complet'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
