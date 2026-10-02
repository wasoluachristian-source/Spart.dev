import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  Server,
  Zap,
  CheckCircle2,
  Mail,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentTab }) => {
  const { settings } = useApp();

  const skills = [
    { name: 'TypeScript & JavaScript', level: 'Avancé', category: 'Frontend & Backend' },
    { name: 'React / Next.js', level: 'Expert', category: 'Frontend' },
    { name: 'Node.js & Go', level: 'Avancé', category: 'Backend' },
    { name: 'Bases de données (PostgreSQL, Firestore)', level: 'Avancé', category: 'Storage' },
    { name: 'Architectures Cloud & Docker', level: 'Intermédiaire / Avancé', category: 'DevOps' },
    { name: 'Sécurité & OAuth', level: 'Avancé', category: 'Sécurité' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero / Presentation */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Code2 className="w-3.5 h-3.5" />
          <span>Espace Professionnel Personnel</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          À propos de Spart.dev
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed">
          {settings.bio}
        </p>
      </div>

      {/* Vision & Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Performance &amp; Simplicité</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Chaque ligne de code est pensée pour être maintenable, réactive et économe en ressources serveur.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Sécurité de bout en bout</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Protection des données privées, règles d'accès strictes et contrôle absolu de l'administrateur sur l'espace.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Partage &amp; Produits</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Mise à disposition de boilerplates prêts pour la production, livres techniques et formations pratiques.
          </p>
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Compétences &amp; Technologies</h2>
          <p className="text-sm text-slate-400 mt-1">
            Les principaux outils que j'utilise pour concevoir et déployer des applications complètes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-white">{s.name}</div>
                <div className="text-xs text-slate-500">{s.category}</div>
              </div>
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {s.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Prêt à discuter d'une collaboration ?</h3>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Je réponds personnellement à toute demande de développement, mission freelance ou partenariat technique.
        </p>
        <button
          onClick={() => setCurrentTab('contact')}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition inline-flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          <span>Accéder au formulaire de contact</span>
        </button>
      </div>
    </div>
  );
};
