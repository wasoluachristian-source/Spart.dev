import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Download,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FileText,
  Lock,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DownloadAccessPage: React.FC<{ setCurrentTab: (tab: string) => void }> = ({
  setCurrentTab,
}) => {
  const { verifyAndConsumeDownloadCode } = useApp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    deliverableUrl?: string;
    deliverableName?: string;
    orderTitle?: string;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await verifyAndConsumeDownloadCode(code);
      if (res.success) {
        setResult({
          success: true,
          message: res.message,
          deliverableUrl: res.deliverableUrl,
          deliverableName: res.deliverableName,
          orderTitle: res.order?.itemTitle,
        });
      } else {
        setResult({
          success: false,
          message: res.message,
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err?.message || 'Erreur lors de la validation du code.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.deliverableUrl) return;

    // Create an anchor and trigger the download
    const link = document.createElement('a');
    link.href = result.deliverableUrl;
    link.download = result.deliverableName || 'spart-document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Espace Téléchargement Sécurisé</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Télécharger votre Document
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Entrez le code secret à usage unique généré lors de votre achat avec Airtel Money ou Orange Money pour récupérer immédiatement votre fichier PDF, livre ou formation.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {result?.success ? (
          /* SUCCESS: FILE UNLOCKED & DOWNLOAD READY */
          <div className="text-center space-y-6 py-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Code Authentifié &amp; Document Prêt
              </span>
              <h2 className="text-2xl font-black text-white">
                {result.orderTitle || 'Votre document numérique'}
              </h2>
              <p className="text-xs text-slate-400">
                Fichier débloqué : <span className="font-mono text-cyan-300">{result.deliverableName}</span>
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {result.message}
            </p>

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-950/40 transition flex items-center justify-center gap-3 text-base cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download className="w-5 h-5" />
                <span>Télécharger mon document sur mon appareil</span>
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                Conservez ce document sur votre ordinateur ou téléphone. Le code ne pourra plus servir pour un autre achat.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-center">
              <button
                onClick={() => {
                  setResult(null);
                  setCode('');
                }}
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Saisir un autre code d'achat
              </button>
            </div>
          </div>
        ) : (
          /* CODE INPUT FORM */
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Votre Code d'Achat Unique
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-cyan-400 absolute left-4 top-4" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ex. SPART-A8K2-9M4P"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base sm:text-lg font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition tracking-wider uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Format : <code className="text-cyan-400">SPART-XXXX-XXXX</code> généré automatiquement après validation de votre achat Airtel ou Orange.
              </p>
            </div>

            {result?.success === false && (
              <div className="flex items-start gap-3 p-4 bg-rose-950/40 border border-rose-900/60 rounded-2xl text-xs text-rose-300">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Accès non autorisé :</span>
                  <p className="leading-relaxed">{result.message}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-cyan-950 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Valider mon code et débloquer le téléchargement</span>
                </>
              )}
            </button>

            {/* Single Use Security Explanation */}
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Fonctionnement du code à usage unique :</span>
              </div>
              <ul className="space-y-1 list-disc list-inside text-slate-400 leading-relaxed text-[11px]">
                <li>Chaque achat génère un code sécurisé unique lié au document acheté.</li>
                <li>Le mot de passe / code ne sert qu'à <strong>une seule opération de téléchargement</strong>.</li>
                <li>Une fois le téléchargement déclenché, le fichier reste acquis sur votre appareil mais le code devient inactif pour toute autre utilisation.</li>
              </ul>
            </div>
          </form>
        )}
      </div>

      {/* Helpful links */}
      <div className="text-center space-y-2">
        <p className="text-xs text-slate-400">
          Vous n'avez pas encore acheté de document ou souhaitez passer commande ?
        </p>
        <div className="flex justify-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setCurrentTab('books')}
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Voir les Livres &amp; Guides
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => setCurrentTab('courses')}
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Voir les Formations
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => setCurrentTab('products')}
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Boutique Numérique
          </button>
        </div>
      </div>
    </div>
  );
};
