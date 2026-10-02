import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, Product, Book, Course, Announcement, SiteSettings } from '../types';
import {
  Layers,
  ShoppingBag,
  BookOpen,
  GraduationCap,
  Megaphone,
  Users,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  ExternalLink,
  Save,
  LogOut,
  Mail,
  ShieldAlert,
  Search,
  Check,
  Globe
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const {
    currentUser,
    settings,
    updateSettings,
    projects,
    saveProject,
    removeProject,
    products,
    saveProduct,
    removeProduct,
    books,
    saveBook,
    removeBook,
    courses,
    saveCourse,
    removeCourse,
    announcements,
    saveAnnouncement,
    removeAnnouncement,
    subscribers,
    removeSubscriber,
    messages,
    markMessageRead,
    removeMessage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'projects' | 'products' | 'books' | 'courses' | 'announcements' | 'subscribers' | 'messages' | 'settings'
  >('projects');

  const [feedbackMsg, setFeedbackMsg] = useState('');

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // State for forms
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null);

  // Settings local state
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded border border-rose-800/60">
              Espace Administrateur Privé
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Tableau de Bord Spart.dev
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Connecté en tant que <span className="text-cyan-400 font-mono">{currentUser?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 hover:border-rose-800 transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'projects', label: 'Projets', icon: Layers, count: projects.length },
          { id: 'products', label: 'Produits', icon: ShoppingBag, count: products.length },
          { id: 'books', label: 'Livres', icon: BookOpen, count: books.length },
          { id: 'courses', label: 'Formations', icon: GraduationCap, count: courses.length },
          { id: 'announcements', label: 'Annonces', icon: Megaphone, count: announcements.length },
          { id: 'messages', label: 'Messages reçus', icon: MessageSquare, count: messages.filter((m) => !m.read).length, unread: true },
          { id: 'subscribers', label: 'Abonnés', icon: Users, count: subscribers.length },
          { id: 'settings', label: 'Paramètres du site', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                active
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    active
                      ? 'bg-slate-950 text-cyan-400'
                      : tab.unread && tab.count > 0
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestion des Projets</h2>
            <button
              onClick={() =>
                setEditingProject({
                  id: 'proj-' + Date.now(),
                  title: '',
                  description: '',
                  longDescription: '',
                  category: 'Web App',
                  imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
                  technologies: ['React', 'TypeScript'],
                  forSale: false,
                  price: 0,
                  createdAt: Date.now(),
                })
              }
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un projet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full aspect-video object-cover rounded-xl bg-slate-950 mb-3 border border-slate-800"
                  />
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    {p.forSale && (
                      <span className="text-xs font-bold text-emerald-400">
                        {p.price} €
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">ID: {p.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProject(p)}
                      className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg transition"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Supprimer le projet "${p.title}" ?`)) {
                          await removeProject(p.id);
                          showFeedback('Projet supprimé.');
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit / Create Project Modal */}
          {editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setEditingProject(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-white">
                  {editingProject.id && projects.some((x) => x.id === editingProject.id)
                    ? 'Modifier le projet'
                    : 'Créer un nouveau projet'}
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Titre du projet *</label>
                    <input
                      type="text"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                      placeholder="Nom du projet"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Catégorie</label>
                    <select
                      value={editingProject.category || 'Web App'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      <option value="Web App">Web App</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Open Source">Open Source</option>
                      <option value="API / Backend">API / Backend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Description courte *</label>
                    <textarea
                      rows={2}
                      value={editingProject.description || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Description détaillée</label>
                    <textarea
                      rows={4}
                      value={editingProject.longDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">URL de l'image / Capture</label>
                    <input
                      type="text"
                      value={editingProject.imageUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Technologies (séparées par une virgule)</label>
                    <input
                      type="text"
                      value={(editingProject.technologies || []).join(', ')}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1">Lien de l'application (URL)</label>
                      <input
                        type="text"
                        value={editingProject.projectUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, projectUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Lien GitHub</label>
                      <input
                        type="text"
                        value={editingProject.githubUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={editingProject.forSale || false}
                        onChange={(e) => setEditingProject({ ...editingProject, forSale: e.target.checked })}
                        className="rounded"
                      />
                      <span>Projet mis en vente</span>
                    </label>

                    {editingProject.forSale && (
                      <div className="flex items-center gap-2">
                        <label className="text-slate-300">Prix (€) :</label>
                        <input
                          type="number"
                          value={editingProject.price || 0}
                          onChange={(e) => setEditingProject({ ...editingProject, price: Number(e.target.value) })}
                          className="w-24 px-3 py-1 bg-slate-950 border border-slate-800 rounded text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingProject.title) return alert('Titre obligatoire.');
                      await saveProject(editingProject as Project);
                      setEditingProject(null);
                      showFeedback('Projet enregistré avec succès.');
                    }}
                    className="px-5 py-2 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold"
                  >
                    Enregistrer le projet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestion des Produits Numériques</h2>
            <button
              onClick={() =>
                setEditingProduct({
                  id: 'prod-' + Date.now(),
                  name: '',
                  description: '',
                  images: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80'],
                  price: 49,
                  category: 'Templates',
                  status: 'disponible',
                  features: ['Code source propre', 'Documentation incluse'],
                  fileOrUrl: '',
                  createdAt: Date.now(),
                })
              }
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau produit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className="text-lg font-black text-white">{p.price} €</span>
                  </div>
                  <h3 className="font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className={p.status === 'disponible' ? 'text-emerald-400' : 'text-rose-400'}>
                    {p.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Supprimer le produit "${p.name}" ?`)) {
                          await removeProduct(p.id);
                          showFeedback('Produit supprimé.');
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-white">Éditer le produit</h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Nom du produit *</label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-1">Prix (€) *</label>
                      <input
                        type="number"
                        value={editingProduct.price || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Statut</label>
                      <select
                        value={editingProduct.status || 'disponible'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                      >
                        <option value="disponible">Disponible</option>
                        <option value="indisponible">Indisponible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Catégorie</label>
                    <input
                      type="text"
                      value={editingProduct.category || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                      placeholder="Templates, UI Kits, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={(editingProduct.images && editingProduct.images[0]) || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Lien de téléchargement ou fichier délivré après achat</label>
                    <input
                      type="text"
                      value={editingProduct.fileOrUrl || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fileOrUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                      placeholder="https://spart.dev/downloads/mon-produit.zip"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Points clés / Inclus (séparés par une virgule)</label>
                    <input
                      type="text"
                      value={(editingProduct.features || []).join(', ')}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingProduct.name) return alert('Nom obligatoire.');
                      await saveProduct(editingProduct as Product);
                      setEditingProduct(null);
                      showFeedback('Produit sauvegardé.');
                    }}
                    className="px-5 py-2 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold"
                  >
                    Enregistrer le produit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BOOKS */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestion des Livres</h2>
            <button
              onClick={() =>
                setEditingBook({
                  id: 'book-' + Date.now(),
                  title: '',
                  author: 'Spart.dev',
                  description: '',
                  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&auto=format&fit=crop&q=80',
                  price: 29,
                  format: 'Ebook (PDF & ePub)',
                  createdAt: Date.now(),
                })
              }
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publier un livre</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {books.map((b) => (
              <div
                key={b.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex gap-4 items-start"
              >
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-20 aspect-[3/4] object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base">{b.title}</h3>
                    <span className="font-bold text-cyan-400">{b.price} €</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{b.description}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setEditingBook(b)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Supprimer le livre "${b.title}" ?`)) {
                          await removeBook(b.id);
                          showFeedback('Livre supprimé.');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingBook && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Éditer le livre</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Titre *</label>
                    <input
                      type="text"
                      value={editingBook.title || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Prix (€)</label>
                    <input
                      type="number"
                      value={editingBook.price || 0}
                      onChange={(e) => setEditingBook({ ...editingBook, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingBook.description || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Image de couverture (URL)</label>
                    <input
                      type="text"
                      value={editingBook.coverImage || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, coverImage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white font-mono"
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button onClick={() => setEditingBook(null)} className="px-4 py-2 bg-slate-800 text-xs rounded text-slate-300">
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingBook.title) return;
                      await saveBook(editingBook as Book);
                      setEditingBook(null);
                      showFeedback('Livre sauvegardé.');
                    }}
                    className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestion des Formations</h2>
            <button
              onClick={() =>
                setEditingCourse({
                  id: 'course-' + Date.now(),
                  title: '',
                  description: '',
                  imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80',
                  syllabus: ['Module 1 : Introduction & Architecture'],
                  price: 149,
                  duration: '10 heures',
                  level: 'Tous niveaux',
                  enrollmentOpen: true,
                  createdAt: Date.now(),
                })
              }
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une formation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{c.title}</h3>
                  <span className="font-bold text-cyan-400">{c.price} €</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-500">{c.duration}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCourse(c)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Supprimer la formation "${c.title}" ?`)) {
                          await removeCourse(c.id);
                          showFeedback('Formation supprimée.');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-white">Éditer la formation</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Titre de la formation *</label>
                    <input
                      type="text"
                      value={editingCourse.title || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Prix (€)</label>
                      <input
                        type="number"
                        value={editingCourse.price || 0}
                        onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Durée (ex: 20 heures)</label>
                      <input
                        type="text"
                        value={editingCourse.duration || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingCourse.description || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Programme (lignes séparées par un retour à la ligne)</label>
                    <textarea
                      rows={4}
                      value={(editingCourse.syllabus || []).join('\n')}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          syllabus: e.target.value.split('\n').filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button onClick={() => setEditingCourse(null)} className="px-4 py-2 bg-slate-800 text-xs rounded text-slate-300">
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingCourse.title) return;
                      await saveCourse(editingCourse as Course);
                      setEditingCourse(null);
                      showFeedback('Formation sauvegardée.');
                    }}
                    className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestion des Annonces</h2>
            <button
              onClick={() =>
                setEditingAnnouncement({
                  id: 'ann-' + Date.now(),
                  title: '',
                  content: '',
                  badge: 'Info',
                  publishDate: Date.now(),
                  active: true,
                })
              }
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publier une annonce</span>
            </button>
          </div>

          <div className="space-y-4">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      {a.badge || 'Annonce'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(a.publishDate).toLocaleDateString()}
                    </span>
                    {a.active ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                        Visible
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                        Désactivée
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base">{a.title}</h3>
                  <p className="text-xs text-slate-300 max-w-2xl">{a.content}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingAnnouncement(a)}
                    className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Supprimer l'annonce "${a.title}" ?`)) {
                        await removeAnnouncement(a.id);
                        showFeedback('Annonce supprimée.');
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingAnnouncement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Éditer l'annonce</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Titre de l'annonce *</label>
                    <input
                      type="text"
                      value={editingAnnouncement.title || ''}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Badge (ex: Nouveau, Important, Mission)</label>
                    <input
                      type="text"
                      value={editingAnnouncement.badge || ''}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, badge: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Contenu complet *</label>
                    <textarea
                      rows={4}
                      value={editingAnnouncement.content || ''}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Image URL (optionnel)</label>
                    <input
                      type="text"
                      value={editingAnnouncement.imageUrl || ''}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-white font-mono"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={editingAnnouncement.active ?? true}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, active: e.target.checked })}
                    />
                    <span>Publier immédiatement et afficher publiquement</span>
                  </label>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button onClick={() => setEditingAnnouncement(null)} className="px-4 py-2 bg-slate-800 text-xs rounded text-slate-300">
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingAnnouncement.title) return;
                      await saveAnnouncement(editingAnnouncement as Announcement);
                      setEditingAnnouncement(null);
                      showFeedback('Annonce publiée.');
                    }}
                    className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Boîte de Réception ({messages.length})</h2>
              <p className="text-xs text-slate-400">
                Messages envoyés par les visiteurs via le formulaire public
              </p>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Aucun message pour l'instant.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-6 rounded-2xl border transition space-y-3 ${
                    m.read
                      ? 'bg-slate-900/40 border-slate-800'
                      : 'bg-slate-900/90 border-cyan-800/60 shadow-lg shadow-cyan-950/30'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{m.name}</span>
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded">
                        {m.email}
                      </span>
                      {!m.read && (
                        <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">
                      Sujet : {m.subject}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                      {m.message}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => markMessageRead(m.id, !m.read)}
                      className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{m.read ? 'Marquer non-lu' : 'Marquer comme lu'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Répondre par e-mail</span>
                      </a>
                      <button
                        onClick={async () => {
                          if (confirm('Supprimer définitivement ce message ?')) {
                            await removeMessage(m.id);
                            showFeedback('Message supprimé.');
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Liste des Abonnés ({subscribers.length})</h2>
              <p className="text-xs text-slate-400">
                Visiteurs inscrits pour recevoir les notifications et newsletters
              </p>
            </div>
          </div>

          {subscribers.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Aucun abonné enregistré pour l'instant.
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Nom</th>
                    <th className="px-6 py-3.5">Adresse E-mail</th>
                    <th className="px-6 py-3.5">Date d'inscription</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 font-medium text-white">
                        {sub.name || <span className="text-slate-500">—</span>}
                      </td>
                      <td className="px-6 py-4 font-mono text-cyan-300">{sub.email}</td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            if (confirm(`Supprimer l'abonné ${sub.email} ?`)) {
                              await removeSubscriber(sub.id);
                              showFeedback('Abonné supprimé.');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Configuration du Site Spart.dev</h2>
            <p className="text-xs text-slate-400">
              Gérez les informations d'identité, les adresses de contact protégées et les liens sociaux
            </p>
          </div>

          <div className="space-y-5 text-xs max-w-2xl">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nom du site</label>
              <input
                type="text"
                value={localSettings.siteName}
                onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Adresse e-mail publique affichée aux visiteurs
              </label>
              <input
                type="text"
                value={localSettings.publicContactEmail}
                onChange={(e) => setLocalSettings({ ...localSettings, publicContactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                placeholder="contact@spart.dev"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Identité publique (ex: contact@spart.dev). Votre e-mail personnel reste protégé.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Adresse e-mail d'administration &amp; réception technique (protégée)
              </label>
              <input
                type="email"
                value={localSettings.backendEmail}
                onChange={(e) => setLocalSettings({ ...localSettings, backendEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Actuellement : wasoluachristian@gmail.com (protégé côté serveur).
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sous-titre d'accueil</label>
              <input
                type="text"
                value={localSettings.heroSubtitle}
                onChange={(e) => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bio professionnelle</label>
              <textarea
                rows={3}
                value={localSettings.bio}
                onChange={(e) => setLocalSettings({ ...localSettings, bio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={localSettings.githubUrl}
                  onChange={(e) => setLocalSettings({ ...localSettings, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Twitter / X URL</label>
                <input
                  type="text"
                  value={localSettings.twitterUrl}
                  onChange={(e) => setLocalSettings({ ...localSettings, twitterUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={localSettings.linkedinUrl}
                  onChange={(e) => setLocalSettings({ ...localSettings, linkedinUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={localSettings.availableForFreelance}
                  onChange={(e) => setLocalSettings({ ...localSettings, availableForFreelance: e.target.checked })}
                />
                <span>Indiquer "Disponible pour nouveaux projets"</span>
              </label>
            </div>

            <button
              onClick={async () => {
                await updateSettings(localSettings);
                showFeedback('Paramètres du site mis à jour avec succès.');
              }}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-950"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
