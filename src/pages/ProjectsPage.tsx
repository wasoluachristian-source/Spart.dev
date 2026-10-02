import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import {
  ExternalLink,
  Github,
  Mail,
  Filter,
  Layers,
  Sparkles,
  ShoppingBag,
  Info,
  CheckCircle,
  X
} from 'lucide-react';

interface ProjectsPageProps {
  setCurrentTab: (tab: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ setCurrentTab }) => {
  const { projects } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  const categories = ['Tous', 'Web App', 'SaaS', 'Mobile App', 'Open Source', 'API / Backend'];

  const filteredProjects = selectedCategory === 'Tous'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Portfolio d'ingénierie</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Mes Projets &amp; Créations
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Explorez les applications, plateformes SaaS et outils open source développés avec passion, rigueur et performance.
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-slate-400">Aucun projet trouvé dans cette catégorie pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setActiveProjectModal(project)}>
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-800/40">
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

                {/* Content */}
                <div className="p-6">
                  <h3
                    onClick={() => setActiveProjectModal(project)}
                    className="text-xl font-bold text-white group-hover:text-cyan-400 transition cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Visiter le site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Code source GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setActiveProjectModal(project)}
                    className="text-xs text-slate-400 hover:text-cyan-400 transition ml-1"
                  >
                    Détails
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {project.forSale ? (
                    <button
                      onClick={() => setCurrentTab('contact')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Acheter ({project.price} €)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentTab('contact')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Me contacter</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setActiveProjectModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                <img
                  src={activeProjectModal.imageUrl}
                  alt={activeProjectModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    {activeProjectModal.category}
                  </span>
                  {activeProjectModal.forSale && (
                    <span className="text-sm font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800/60">
                      Prix : {activeProjectModal.price} €
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">{activeProjectModal.title}</h2>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Description complète
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {activeProjectModal.longDescription || activeProjectModal.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Technologies utilisées
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProjectModal.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-950 text-cyan-300 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {activeProjectModal.projectUrl && (
                    <a
                      href={activeProjectModal.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ouvrir l’application</span>
                    </a>
                  )}
                  {activeProjectModal.githubUrl && (
                    <a
                      href={activeProjectModal.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code GitHub</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    setActiveProjectModal(null);
                    setCurrentTab('contact');
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition"
                >
                  {activeProjectModal.forSale ? 'Acheter ce projet' : 'Me contacter pour un projet similaire'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
