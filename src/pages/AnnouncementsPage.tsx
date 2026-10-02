import React from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, Calendar, Mail, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface AnnouncementsPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ setCurrentTab }) => {
  const { announcements } = useApp();

  const activeAnnouncements = announcements.filter((a) => a.active);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Megaphone className="w-3.5 h-3.5" />
          <span>Communiqués &amp; Mises à jour</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Annonces &amp; Nouvelles
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Retrouvez les dernières actualités officielles, lancements de projets et annonces d'opportunités sur Spart.dev.
        </p>
      </div>

      {/* Announcements List */}
      {activeAnnouncements.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
          Aucune annonce active en ce moment.
        </div>
      ) : (
        <div className="space-y-8">
          {activeAnnouncements.map((ann) => (
            <article
              key={ann.id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 hover:border-cyan-500/40 transition duration-300 shadow-xl space-y-6"
            >
              {/* Top metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  {ann.badge && (
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {ann.badge}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Publié le {formatDate(ann.publishDate)}
                  </span>
                </div>

                {ann.expireDate && (
                  <span className="text-xs text-slate-500">
                    Valable jusqu'au {formatDate(ann.expireDate)}
                  </span>
                )}
              </div>

              {/* Image banner if present */}
              {ann.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-slate-950 border border-slate-800">
                  <img
                    src={ann.imageUrl}
                    alt={ann.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Title & Content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">{ann.title}</h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Spart.dev • Publication officielle
                </span>
                <button
                  onClick={() => setCurrentTab('contact')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                >
                  <span>Répondre à cette annonce</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
