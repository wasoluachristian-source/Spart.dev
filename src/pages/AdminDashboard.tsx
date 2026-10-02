import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Project,
  Product,
  Book,
  Course,
  Announcement,
  SiteSettings,
  PurchaseOrder,
  PaymentMethodConfig
} from '../types';
import { FileUploadInput } from '../components/FileUploadInput';
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
  Globe,
  Lock,
  CreditCard,
  KeyRound,
  FileCheck,
  Smartphone,
  Eye,
  EyeOff,
  Video,
  FileText
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const {
    currentUser,
    settings,
    updateSettings,
    updatePaymentMethods,
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
    orders,
    updateOrderStatus,
    removeOrder,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'projects' | 'products' | 'books' | 'courses' | 'announcements' | 'orders' | 'payments' | 'subscribers' | 'messages' | 'settings'
  >('orders');

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

  // Settings & Payment methods local state
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [localPaymentMethods, setLocalPaymentMethods] = useState<PaymentMethodConfig[]>(
    settings.paymentMethods || []
  );

  // New custom payment method form
  const [newPayMethod, setNewPayMethod] = useState<{
    name: string;
    privateAccountNumber: string;
    instructions: string;
  }>({
    name: '',
    privateAccountNumber: '',
    instructions: '',
  });

  const [showAccountNumbers, setShowAccountNumbers] = useState(false);

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
            Connecté en tant que <span className="text-cyan-400 font-mono">{currentUser?.email || 'wasoluachristian@gmail.com'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open('/', '_blank')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Voir le site</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800/60 flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'orders', label: 'Commandes & Codes Uniques', icon: KeyRound, count: orders.length },
          { id: 'payments', label: 'Paiements Airtel / Orange', icon: CreditCard },
          { id: 'announcements', label: 'Annonces & Médias', icon: Megaphone, count: announcements.length },
          { id: 'books', label: 'Livres / PDF', icon: BookOpen, count: books.length },
          { id: 'courses', label: 'Formations', icon: GraduationCap, count: courses.length },
          { id: 'products', label: 'Produits', icon: ShoppingBag, count: products.length },
          { id: 'projects', label: 'Projets', icon: Layers, count: projects.length },
          { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter((m) => !m.read).length },
          { id: 'subscribers', label: 'Abonnés', icon: Users, count: subscribers.length },
          { id: 'settings', label: 'Paramètres du site', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                active
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-800 text-cyan-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS & SINGLE USE CODES */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Commandes &amp; Codes de Téléchargement à Usage Unique
              </h2>
              <p className="text-xs text-slate-400">
                Chaque code généré permet un téléchargement unique. Une fois consommé, le mot de passe est définitivement invalidé.
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-xs">
              Aucune commande enregistrée pour le moment. Lorsqu'un visiteur achète un PDF, un livre ou une formation via Airtel ou Orange Money, sa commande et son code à usage unique apparaissent ici.
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">Code Unique</th>
                      <th className="p-4">Article</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Paiement</th>
                      <th className="p-4">Montant</th>
                      <th className="p-4">Statut Téléchargement</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-sans">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                          {ord.downloadCode}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          <span className="text-[10px] text-slate-500 font-mono mr-1.5 uppercase">
                            [{ord.itemType}]
                          </span>
                          {ord.itemTitle}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-white">{ord.customerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</div>
                          <div className="text-[10px] text-slate-500">{ord.customerEmail}</div>
                        </td>
                        <td className="p-4 uppercase font-mono text-cyan-300">
                          {ord.paymentMethod}
                          <div className="text-[10px] text-slate-500">Ref: {ord.transactionRef}</div>
                        </td>
                        <td className="p-4 font-bold text-emerald-400 whitespace-nowrap">
                          {ord.amount} €
                        </td>
                        <td className="p-4">
                          {ord.downloadUsed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60">
                              <Lock className="w-3 h-3" />
                              <span>Utilisé (Code expiré)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                              <CheckCircle className="w-3 h-3" />
                              <span>Actif (Prêt pour 1 téléchargement)</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap font-mono">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              if (confirm(`Supprimer la commande ${ord.downloadCode} ?`)) {
                                await removeOrder(ord.id);
                                showFeedback('Commande supprimée.');
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded bg-slate-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENT METHODS MANAGEMENT (AIRTEL & ORANGE CONFIDENTIAL) */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Gestion des Modes de Paiement</h2>
              <p className="text-xs text-slate-400">
                Vos numéros Airtel Money et Orange Money restent strictement invisibles aux visiteurs pour une sécurité absolue.
              </p>
            </div>
            <button
              onClick={() => setShowAccountNumbers(!showAccountNumbers)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2 self-start sm:self-auto"
            >
              {showAccountNumbers ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4 text-cyan-400" />}
              <span>{showAccountNumbers ? 'Masquer les numéros' : 'Révéler les numéros (Admin)'}</span>
            </button>
          </div>

          {/* Active Payment Channels Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localPaymentMethods.map((method, idx) => (
              <div
                key={method.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{method.name}</h3>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">
                        Fournisseur : {method.provider}
                      </span>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={method.active}
                      onChange={(e) => {
                        const updated = [...localPaymentMethods];
                        updated[idx].active = e.target.checked;
                        setLocalPaymentMethods(updated);
                        updatePaymentMethods(updated);
                        showFeedback('Statut du paiement mis à jour.');
                      }}
                      className="rounded"
                    />
                    <span>{method.active ? 'Actif' : 'Désactivé'}</span>
                  </label>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Numéro privé / Compte secret (Non visible aux utilisateurs)
                    </label>
                    <input
                      type={showAccountNumbers ? 'text' : 'password'}
                      value={method.privateAccountNumber}
                      onChange={(e) => {
                        const updated = [...localPaymentMethods];
                        updated[idx].privateAccountNumber = e.target.value;
                        setLocalPaymentMethods(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Nom marchand / Titulaire
                    </label>
                    <input
                      type="text"
                      value={method.merchantName}
                      onChange={(e) => {
                        const updated = [...localPaymentMethods];
                        updated[idx].merchantName = e.target.value;
                        setLocalPaymentMethods(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">
                      Instructions internes
                    </label>
                    <textarea
                      rows={2}
                      value={method.instructions}
                      onChange={(e) => {
                        const updated = [...localPaymentMethods];
                        updated[idx].instructions = e.target.value;
                        setLocalPaymentMethods(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      await updatePaymentMethods(localPaymentMethods);
                      showFeedback('Paramètres de paiement sauvegardés.');
                    }}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Sauvegarder ce canal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom extra payment method */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Ajouter un autre mode de paiement</h3>
            <p className="text-xs text-slate-400">
              Vous pouvez configurer d'autres canaux de paiement selon vos besoins.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                placeholder="Nom (ex. M-Pesa, Carte Bancaire, Virement)"
                value={newPayMethod.name}
                onChange={(e) => setNewPayMethod({ ...newPayMethod, name: e.target.value })}
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
              <input
                type="text"
                placeholder="Numéro ou identifiant privé"
                value={newPayMethod.privateAccountNumber}
                onChange={(e) => setNewPayMethod({ ...newPayMethod, privateAccountNumber: e.target.value })}
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
              <input
                type="text"
                placeholder="Instructions pour validation"
                value={newPayMethod.instructions}
                onChange={(e) => setNewPayMethod({ ...newPayMethod, instructions: e.target.value })}
                className="px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  if (!newPayMethod.name.trim()) return alert('Nom obligatoire.');
                  const created: PaymentMethodConfig = {
                    id: 'pay-' + Date.now(),
                    provider: 'custom',
                    name: newPayMethod.name.trim(),
                    privateAccountNumber: newPayMethod.privateAccountNumber.trim(),
                    merchantName: 'Spart.dev Custom',
                    instructions: newPayMethod.instructions.trim() || 'Paiement direct sécurisé.',
                    active: true,
                  };
                  const updated = [...localPaymentMethods, created];
                  setLocalPaymentMethods(updated);
                  await updatePaymentMethods(updated);
                  setNewPayMethod({ name: '', privateAccountNumber: '', instructions: '' });
                  showFeedback('Nouveau mode de paiement ajouté avec succès !');
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter ce mode de paiement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS WITH MULTIMEDIA (IMAGE, VIDEO, WRITTEN, FILE UPLOADS) */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Gestion des Annonces &amp; Médias</h2>
              <p className="text-xs text-slate-400">
                Publiez des écrits, des images ou des vidéos importées depuis votre téléphone ou ordinateur.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingAnnouncement({
                  id: 'ann-' + Date.now(),
                  title: '',
                  content: '',
                  badge: 'Nouveau',
                  mediaType: 'image',
                  imageUrl: '',
                  mediaUrl: '',
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
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      {a.badge || 'Annonce'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(a.publishDate).toLocaleDateString()}
                    </span>
                    {a.mediaType && (
                      <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                        {a.mediaType}
                      </span>
                    )}
                    {a.active ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                        Visible publiquement
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                        Désactivée
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-lg">{a.title}</h3>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed whitespace-pre-line">
                    {a.content}
                  </p>

                  {/* Media preview */}
                  {(a.imageUrl || a.mediaUrl) && (
                    <div className="pt-2">
                      {a.mediaType === 'video' ? (
                        <div className="w-48 h-28 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-cyan-400">
                          <Video className="w-8 h-8" />
                        </div>
                      ) : a.mediaType === 'file' ? (
                        <div className="flex items-center gap-2 text-xs text-cyan-300">
                          <FileText className="w-4 h-4" />
                          <span>Fichier joint disponible au téléchargement</span>
                        </div>
                      ) : (
                        <img
                          src={a.imageUrl || a.mediaUrl}
                          alt={a.title}
                          className="w-48 h-28 object-cover rounded-xl border border-slate-800 bg-slate-950"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => setEditingAnnouncement(a)}
                    className="p-2.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-xl transition"
                    title="Modifier"
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
                    className="p-2.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-xl transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EDIT ANNOUNCEMENT MODAL */}
          {editingAnnouncement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
              <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setEditingAnnouncement(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white">
                  {editingAnnouncement.id?.includes('ann-') ? 'Publier une annonce' : 'Modifier l’annonce'}
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Titre de l'annonce *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingAnnouncement.title || ''}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                      placeholder="ex. Nouveau livre disponible en téléchargement..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Badge (ex: Info, Promo, Urgent)
                      </label>
                      <input
                        type="text"
                        value={editingAnnouncement.badge || ''}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Format du média
                      </label>
                      <select
                        value={editingAnnouncement.mediaType || 'image'}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, mediaType: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                      >
                        <option value="image">Image (Galerie / Photo)</option>
                        <option value="video">Vidéo (Galerie / Caméra)</option>
                        <option value="file">Fichier / Document (PDF, archive)</option>
                        <option value="text">Texte écrit pur (Sans média)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Texte écrit complet de l'annonce *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={editingAnnouncement.content || ''}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs leading-relaxed"
                      placeholder="Rédigez ici le message détaillé..."
                    />
                  </div>

                  {/* MEDIA UPLOAD SECTION: DIRECT FROM PHONE GALLERY OR PC */}
                  {editingAnnouncement.mediaType !== 'text' && (
                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                      <FileUploadInput
                        label={
                          editingAnnouncement.mediaType === 'video'
                            ? 'Vidéo de l’annonce (Importer depuis votre galerie)'
                            : editingAnnouncement.mediaType === 'file'
                            ? 'Fichier joint (PDF, document, etc.)'
                            : 'Image de l’annonce (Importer depuis votre galerie ou photos)'
                        }
                        value={editingAnnouncement.imageUrl || editingAnnouncement.mediaUrl || ''}
                        fileName={editingAnnouncement.mediaFileName}
                        accept={
                          editingAnnouncement.mediaType === 'video'
                            ? 'video/*'
                            : editingAnnouncement.mediaType === 'file'
                            ? '.pdf,.zip,.doc,.docx,.txt'
                            : 'image/*'
                        }
                        mediaType={editingAnnouncement.mediaType || 'image'}
                        onChange={(url, fileName) => {
                          setEditingAnnouncement({
                            ...editingAnnouncement,
                            imageUrl: url,
                            mediaUrl: url,
                            mediaFileName: fileName,
                          });
                        }}
                        helperText="Appuyez pour sélectionner directement un fichier sur votre téléphone (galerie d'images ou vidéos) ou votre PC."
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 pt-1">
                    <input
                      type="checkbox"
                      checked={editingAnnouncement.active ?? true}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, active: e.target.checked })}
                      className="rounded"
                    />
                    <span>Afficher publiquement l'annonce sur le site web</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    onClick={() => setEditingAnnouncement(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingAnnouncement.title) return alert('Titre obligatoire.');
                      await saveAnnouncement(editingAnnouncement as Announcement);
                      setEditingAnnouncement(null);
                      showFeedback('Annonce enregistrée et publiée avec succès !');
                    }}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold"
                  >
                    Enregistrer l'annonce
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BOOKS / PDF MANAGEMENT WITH GALLERY UPLOADS */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Gestion des Livres &amp; PDF</h2>
              <p className="text-xs text-slate-400">
                Téléchargez les couvertures depuis votre galerie et attachez les fichiers PDF livrés après paiement.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingBook({
                  id: 'book-' + Date.now(),
                  title: '',
                  author: 'Spart (Wasolua Christian)',
                  description: '',
                  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&auto=format&fit=crop&q=80',
                  price: 19,
                  format: 'Ebook PDF',
                  pages: 150,
                  createdAt: Date.now(),
                })
              }
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un livre / PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {books.map((b) => (
              <div
                key={b.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex gap-4 items-start shadow-xl"
              >
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-24 aspect-[3/4] object-cover rounded-xl border border-slate-800 bg-slate-950 shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base line-clamp-1">{b.title}</h3>
                    <span className="font-black text-cyan-400">{b.price} €</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{b.description}</p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {b.format} • {b.pages} pages
                  </div>
                  {b.fileName && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono truncate">
                      <FileCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>PDF joint : {b.fileName}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2 border-t border-slate-800/80">
                    <button
                      onClick={() => setEditingBook(b)}
                      className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg"
                      title="Modifier"
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
                      className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EDIT BOOK MODAL */}
          {editingBook && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
              <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setEditingBook(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white">Éditer le livre / PDF</h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Titre du livre *</label>
                    <input
                      type="text"
                      required
                      value={editingBook.title || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Auteur</label>
                      <input
                        type="text"
                        value={editingBook.author || ''}
                        onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Prix (€)</label>
                      <input
                        type="number"
                        value={editingBook.price || 0}
                        onChange={(e) => setEditingBook({ ...editingBook, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingBook.description || ''}
                      onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  {/* COVER IMAGE IMPORT FROM PHONE/PC */}
                  <FileUploadInput
                    label="Image de couverture (Importer depuis la galerie du téléphone ou PC)"
                    value={editingBook.coverImage || ''}
                    accept="image/*"
                    mediaType="image"
                    onChange={(url) => setEditingBook({ ...editingBook, coverImage: url })}
                  />

                  {/* PDF FILE DELIVERED ON PAYMENT */}
                  <FileUploadInput
                    label="Fichier PDF téléchargeable par l'acheteur après validation du code unique"
                    value={editingBook.fileOrUrl || ''}
                    fileName={editingBook.fileName}
                    accept=".pdf,.epub,.zip"
                    mediaType="file"
                    onChange={(url, fileName) => setEditingBook({ ...editingBook, fileOrUrl: url, fileName })}
                    helperText="Importez le fichier PDF complet depuis les dossiers de votre appareil."
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button onClick={() => setEditingBook(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingBook.title) return alert('Titre obligatoire.');
                      await saveBook(editingBook as Book);
                      setEditingBook(null);
                      showFeedback('Livre / PDF sauvegardé.');
                    }}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold"
                  >
                    Enregistrer le livre
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: COURSES MANAGEMENT */}
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
                  syllabus: ['Module 1 : Fondations'],
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
              <div key={c.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3">
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
                      className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg"
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
                      className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
              <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white">Éditer la formation</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Titre de la formation *</label>
                    <input
                      type="text"
                      value={editingCourse.title || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Prix (€)</label>
                      <input
                        type="number"
                        value={editingCourse.price || 0}
                        onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Durée (ex: 20 heures)</label>
                      <input
                        type="text"
                        value={editingCourse.duration || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingCourse.description || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  {/* COURSE BANNER IMAGE FROM GALLERY */}
                  <FileUploadInput
                    label="Image de bannière de la formation (Galerie / Photo)"
                    value={editingCourse.imageUrl || ''}
                    accept="image/*"
                    mediaType="image"
                    onChange={(url) => setEditingCourse({ ...editingCourse, imageUrl: url })}
                  />

                  {/* COURSE DELIVERABLE / CURRICULUM FILE */}
                  <FileUploadInput
                    label="Fichier ou Guide du cours à télécharger par le client"
                    value={editingCourse.fileOrUrl || ''}
                    fileName={editingCourse.fileName}
                    accept=".pdf,.zip,.mp4"
                    mediaType="file"
                    onChange={(url, fileName) => setEditingCourse({ ...editingCourse, fileOrUrl: url, fileName })}
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button onClick={() => setEditingCourse(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingCourse.title) return;
                      await saveCourse(editingCourse as Course);
                      setEditingCourse(null);
                      showFeedback('Formation sauvegardée.');
                    }}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: PRODUCTS MANAGEMENT */}
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
                  features: ['Code source propre'],
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
            {products.map((prod) => (
              <div key={prod.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full aspect-[16/10] object-cover rounded-2xl bg-slate-950 border border-slate-800"
                />
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{prod.name}</h3>
                  <span className="font-black text-cyan-400">{prod.price} €</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>
                <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    onClick={() => setEditingProduct(prod)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Supprimer le produit "${prod.name}" ?`)) {
                        await removeProduct(prod.id);
                        showFeedback('Produit supprimé.');
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
              <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white">Éditer le produit</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom du produit *</label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Prix (€)</label>
                      <input
                        type="number"
                        value={editingProduct.price || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Catégorie</label>
                      <input
                        type="text"
                        value={editingProduct.category || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  {/* PRODUCT IMAGE IMPORT */}
                  <FileUploadInput
                    label="Image du produit (Galerie téléphone / PC)"
                    value={(editingProduct.images && editingProduct.images[0]) || ''}
                    accept="image/*"
                    mediaType="image"
                    onChange={(url) => setEditingProduct({ ...editingProduct, images: [url] })}
                  />

                  {/* PRODUCT DELIVERABLE ARCHIVE */}
                  <FileUploadInput
                    label="Fichier archive / ZIP du produit livré après validation du code"
                    value={editingProduct.fileOrUrl || ''}
                    fileName={editingProduct.fileName}
                    accept=".zip,.pdf,.tar.gz"
                    mediaType="file"
                    onChange={(url, fileName) => setEditingProduct({ ...editingProduct, fileOrUrl: url, fileName })}
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button onClick={() => setEditingProduct(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingProduct.name) return;
                      await saveProduct(editingProduct as Product);
                      setEditingProduct(null);
                      showFeedback('Produit sauvegardé.');
                    }}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestion des Projets &amp; Sites à Vendre</h2>
            <button
              onClick={() =>
                setEditingProject({
                  id: 'proj-' + Date.now(),
                  title: '',
                  description: '',
                  category: 'Web App',
                  imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
                  technologies: ['React', 'TypeScript'],
                  forSale: true,
                  price: 499,
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
              <div key={p.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full aspect-video object-cover rounded-2xl bg-slate-950 border border-slate-800"
                />
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  {p.forSale && <span className="font-black text-emerald-400">{p.price} €</span>}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    onClick={() => setEditingProject(p)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-lg"
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
                    className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
              <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white">Éditer le projet</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Titre du projet *</label>
                    <input
                      type="text"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Catégorie</label>
                      <select
                        value={editingProject.category || 'Web App'}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      >
                        <option value="Web App">Web App</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Open Source">Open Source</option>
                        <option value="API / Backend">API / Backend</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Prix de vente (€)</label>
                      <input
                        type="number"
                        value={editingProject.price || 0}
                        onChange={(e) => setEditingProject({ ...editingProject, price: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  {/* PROJECT IMAGE FROM PHONE/PC */}
                  <FileUploadInput
                    label="Image / Capture du projet (Galerie téléphone / PC)"
                    value={editingProject.imageUrl || ''}
                    accept="image/*"
                    mediaType="image"
                    onChange={(url) => setEditingProject({ ...editingProject, imageUrl: url })}
                  />

                  {/* CODE SOURCE ARCHIVE DELIVERABLE */}
                  <FileUploadInput
                    label="Archive source livrée après achat (ZIP / Source)"
                    value={editingProject.fileOrUrl || ''}
                    accept=".zip,.tar.gz"
                    mediaType="file"
                    onChange={(url) => setEditingProject({ ...editingProject, fileOrUrl: url })}
                  />

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={editingProject.forSale ?? false}
                      onChange={(e) => setEditingProject({ ...editingProject, forSale: e.target.checked })}
                      className="rounded"
                    />
                    <span>Site ou application en vente directe avec checkout sécurisé</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button onClick={() => setEditingProject(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingProject.title) return;
                      await saveProject(editingProject as Project);
                      setEditingProject(null);
                      showFeedback('Projet enregistré.');
                    }}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Boîte de Réception ({messages.length})</h2>
          {messages.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-xs">
              Aucun message pour l'instant.
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-6 rounded-3xl border transition space-y-3 ${
                    m.read ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-900/90 border-cyan-800/60 shadow-lg'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <span className="font-bold text-white text-sm mr-2">{m.name}</span>
                      <span className="text-xs text-cyan-400 font-mono">&lt;{m.email}&gt;</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-cyan-300">{m.subject}</h4>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{m.message}</p>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => markMessageRead(m.id, !m.read)}
                      className="px-3 py-1.5 bg-slate-800 text-xs rounded-xl text-slate-300"
                    >
                      {m.read ? 'Marquer non-lu' : 'Marquer comme lu'}
                    </button>
                    <button
                      onClick={async () => {
                        await removeMessage(m.id);
                        showFeedback('Message supprimé.');
                      }}
                      className="p-1.5 text-rose-400 bg-slate-800 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 9: SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Liste des Abonnés ({subscribers.length})</h2>
          {subscribers.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-xs">
              Aucun abonné enregistré.
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Email</th>
                    <th className="p-4">Nom</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {subscribers.map((sub) => (
                    <tr key={sub.id}>
                      <td className="p-4 font-mono text-cyan-400">{sub.email}</td>
                      <td className="p-4">{sub.name || 'Visiteur'}</td>
                      <td className="p-4 text-slate-500 font-mono">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={async () => {
                            if (confirm(`Supprimer l'abonné ${sub.email} ?`)) {
                              await removeSubscriber(sub.id);
                              showFeedback('Abonné supprimé.');
                            }
                          }}
                          className="p-1.5 text-rose-400 bg-slate-800 rounded"
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

      {/* TAB 10: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Paramètres Généraux du Site</h2>
          <div className="space-y-4 text-xs max-w-2xl">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nom du site</label>
              <input
                type="text"
                value={localSettings.siteName}
                onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">E-mail public de contact</label>
              <input
                type="text"
                value={localSettings.publicContactEmail}
                onChange={(e) => setLocalSettings({ ...localSettings, publicContactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Bio professionnelle</label>
              <textarea
                rows={3}
                value={localSettings.bio}
                onChange={(e) => setLocalSettings({ ...localSettings, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <button
              onClick={async () => {
                await updateSettings(localSettings);
                showFeedback('Paramètres sauvegardés avec succès !');
              }}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder les paramètres</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
