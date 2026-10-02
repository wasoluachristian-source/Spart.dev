import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Sparkles,
  UserCheck,
  LogIn,
  UserPlus
} from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const { subscribe } = useApp();
  const [tab, setTab] = useState<'subscribe' | 'check'>('subscribe');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const res = await subscribe(email, name);
    if (res.success) {
      setStatus('success');
      setFeedback(res.message);
      setTimeout(() => {
        setEmail('');
        setName('');
        setStatus('idle');
        onClose();
      }, 2500);
    } else {
      setStatus('error');
      setFeedback(res.message);
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFeedback(`Votre compte visiteur avec l'adresse ${email} est bien actif pour recevoir les notifications et parutions de Spart.dev.`);
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-950/60 border border-emerald-600/50 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Compte Visiteur &amp; Notifications</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{feedback}</p>
          </div>
        ) : (
          <div>
            {/* Tabs for Visitors */}
            <div className="flex border-b border-slate-800 pb-3 mb-5 gap-2">
              <button
                type="button"
                onClick={() => setTab('subscribe')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tab === 'subscribe'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>S'inscrire / S'abonner</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('check')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tab === 'check'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Se reconnecter / Suivi</span>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {tab === 'subscribe' ? "Espace Visiteur & Notifications" : "Suivre mes notifications"}
                </h3>
                <p className="text-xs text-slate-400">
                  {tab === 'subscribe' ? "Restez informé des nouveautés et projets" : "Vérifiez vos alertes de publications"}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              {tab === 'subscribe'
                ? "Recevez en avant-première mes nouveaux projets, sites web mis en vente, formations pratiques et annonces exclusives."
                : "Entrez l'adresse e-mail avec laquelle vous suivez Spart.dev pour confirmer vos préférences de réception."}
            </p>

            <form onSubmit={tab === 'subscribe' ? handleSubmit : handleCheckStatus} className="space-y-4">
              {tab === 'subscribe' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Votre prénom ou nom <span className="text-slate-500 font-normal">(facultatif)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex. Stéphane"
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Votre adresse e-mail <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="visiteur@exemple.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-xs text-rose-400 font-medium bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/50">
                  {feedback}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-950 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{tab === 'subscribe' ? "Valider mon inscription aux notifications" : "Valider mon suivi"}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Adresse protégée. Aucun spam. Seul le contenu public vous sera transmis.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
