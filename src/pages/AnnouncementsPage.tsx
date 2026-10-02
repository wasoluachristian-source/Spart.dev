import React from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, Calendar, Mail, Sparkles, Tag, ArrowRight, Video, FileText, Download } from 'lucide-react';

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
          Retrouvez les dernières actualités officielles, publications multimédias (images, vidéos, fichiers et écrits) sur Spart.dev.
        </p>
      </div>

      {/* Announcements List */}
      {activeAnnouncements.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
          Aucune annonce active en ce moment.
        </div>
      ) : (
        <div className="space-y-8">
          {activeAnnouncements.map((ann) => {
            const hasVideo = ann.mediaType === 'video' || (ann.mediaUrl && ann.mediaUrl.includes('video'));
            const hasFile = ann.mediaType === 'file' || (ann.mediaUrl && !ann.mediaType);
            const imageDisplayUrl = ann.mediaType === 'image' ? (ann.mediaUrl || ann.imageUrl) : ann.imageUrl;

            return (
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
                    {ann.mediaType && ann.mediaType !== 'text' && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-950 text-slate-300 border border-slate-800">
                        {ann.mediaType}
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

                {/* Video Media Player if video */}
                {hasVideo && (ann.mediaUrl || ann.imageUrl) && (
                  <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-[460px] flex items-center justify-center">
                    <video
                      controls
                      playsInline
                      className="w-full max-h-[460px] rounded-2xl bg-black"
                      src={ann.mediaUrl || ann.imageUrl}
                    >
                      Votre navigateur ne prend pas en charge la lecture de cette vidéo.
                    </video>
                  </div>
                )}

                {/* Image banner if present and not video */}
                {!hasVideo && imageDisplayUrl && (
                  <div className="rounded-2xl overflow-hidden aspect-[21/9] bg-slate-950 border border-slate-800">
                    <img
                      src={imageDisplayUrl}
                      alt={ann.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Downloadable Attached Document / File if provided */}
                {hasFile && ann.mediaUrl && ann.mediaType === 'file' && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Document joint à l'annonce</div>
                        <div className="text-[11px] text-slate-400">
                          {ann.mediaFileName || 'Fichier téléchargeable (PDF / Document)'}
                        </div>
                      </div>
                    </div>
                    <a
                      href={ann.mediaUrl}
                      download={ann.mediaFileName || 'document-annonce'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                )}

                {/* Title & Content (Written text) */}
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
            );
          })}
        </div>
      )}
    </div>
  );
};
