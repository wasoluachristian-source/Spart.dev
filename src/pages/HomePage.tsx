import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Code2,
  Sparkles,
  Terminal,
  ExternalLink,
  ShoppingBag,
  BookOpen,
  GraduationCap,
  Megaphone,
  CheckCircle2,
  Mail,
  Zap,
  Globe,
  ShieldCheck,
  ChevronRight,
  Star
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  openSubscribeModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab, openSubscribeModal }) => {
  const { settings, projects, products, books, courses, announcements } = useApp();

  const featuredProjects = projects.slice(0, 3);
  const featuredProducts = products.slice(0, 2);
  const latestAnnouncement = announcements.find((a) => a.active);

  return (
    <div className="space-y-24 pb-20">
      {/* Top Announcement Banner if active */}
      {latestAnnouncement && (
        <div className="w-full bg-slate-900/95 border-b border-cyan-800/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  {latestAnnouncement.badge || 'Annonce'}
                </span>
                <span className="font-medium text-slate-200">
                  {latestAnnouncement.title}
                </span>
              </div>
              <button
                onClick={() => setCurrentTab('announcements')}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold whitespace-nowrap text-xs"
              >
                <span>Lire l’annonce</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-rose-600/10 blur-[130px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 mb-8 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-cyan-400 font-semibold">Spart.dev</span>
            <span className="text-slate-500">•</span>
            <span>Création &amp; Vente de Sites Web • Solutions Sur Mesure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
            Bienvenue sur <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Spart.dev</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-semibold">
            Je conçois des sites web professionnels pour les entreprises et les particuliers, et je vends des applications et sites web clés en main.
          </p>

          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {settings.bio}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCurrentTab('projects')}
              className="px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-xl shadow-cyan-900/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base"
            >
              <span>Voir mes projets</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentTab('contact')}
              className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 text-sm sm:text-base shadow-sm"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Me contacter</span>
            </button>

            <button
              onClick={openSubscribeModal}
              className="px-5 py-3.5 rounded-xl font-medium text-slate-400 hover:text-white transition flex items-center gap-1.5 text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>S'abonner aux alertes</span>
            </button>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">100%</div>
              <div className="text-xs text-slate-400 mt-1">Code sur mesure &amp; Scalable</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-tight">{projects.length}+</div>
              <div className="text-xs text-slate-400 mt-1">Projets d'ingénierie</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-400 tracking-tight">{products.length}</div>
              <div className="text-xs text-slate-400 mt-1">Produits &amp; Templates</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm text-center">
              <div className="text-2xl sm:text-3xl font-bold text-rose-400 tracking-tight">{books.length + courses.length}</div>
              <div className="text-xs text-slate-400 mt-1">Livres &amp; Formations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Portfolio &amp; Vente de Sites Web
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Sites Web &amp; Applications Disponibles
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Création sur mesure pour entreprises ou particuliers, et sites web prêts à l'achat immédiat.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('projects')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Explorer tous les projets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-800/40">
                      {project.category}
                    </span>
                  </div>
                  {project.forSale && project.price && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-700/60 backdrop-blur-md">
                        {project.price} €
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentTab('projects')}
                  className="text-xs font-medium text-slate-400 hover:text-white transition flex items-center gap-1"
                >
                  <span>Détails</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-2">
                  {project.forSale ? (
                    <button
                      onClick={() => setCurrentTab('contact')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                    >
                      Acheter
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentTab('contact')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    >
                      Me contacter
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Digital Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Boutique &amp; Téléchargements</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Produits Numériques &amp; Templates Pro
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-xl">
                Gagnez des semaines de travail avec mes boilerplates prêts pour la production, kits de démarrage SaaS et packs d'icônes.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('products')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Voir la boutique complète
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                        {prod.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">{prod.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-cyan-400">{prod.price} €</div>
                      <div className="text-[10px] text-slate-400">Paiement unique</div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {prod.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {prod.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/70 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Accès immédiat après confirmation
                  </span>
                  <button
                    onClick={() => setCurrentTab('products')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition flex items-center gap-1.5"
                  >
                    <span>Commander ({prod.price} €)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications / Books & Courses Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Books */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Livres &amp; Publications</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Ouvrages techniques détaillant les bonnes pratiques de génie logiciel, le clean architecture et le développement full-stack moderne.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <div>• Format numérique (PDF, ePub)</div>
                <div>• Exemples concrets et projets téléchargeables</div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-white">{books.length} publications disponibles</span>
              <button
                onClick={() => setCurrentTab('books')}
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Découvrir les livres</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Courses */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-700/50 flex items-center justify-center text-cyan-400 mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Formations &amp; Ateliers</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Programmes complets orientés pratique pour monter en compétences sur React, TypeScript, APIs cloud et micro-SaaS rentables.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <div>• Ateliers vidéos structurés pas à pas</div>
                <div>• Support technique direct &amp; exercices appliqués</div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-white">{courses.length} formations ouvertes</span>
              <button
                onClick={() => setCurrentTab('courses')}
                className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Voir les programmes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action: Subscription & Contact */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-cyan-900/30 via-slate-900 to-indigo-900/30 border border-cyan-800/40 p-8 sm:p-12 text-center overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white">
              Vous avez un projet ou souhaitez collaborer ?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Qu'il s'agisse de développer votre prochaine application web, d'auditer une architecture ou de concevoir un produit numérique sur mesure, je suis à votre écoute.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setCurrentTab('contact')}
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-xl shadow-cyan-900/40 transition"
              >
                Envoyer une demande de projet
              </button>
              <button
                onClick={openSubscribeModal}
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
              >
                S'abonner aux publications
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
