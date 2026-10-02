import React, { useState } from 'react';
import { useApp, REQUIRED_ADMIN_EMAIL } from '../context/AppContext';
import {
  ShieldCheck,
  KeyRound,
  Mail,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  Info
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { loginAdmin } = useApp();

  // Authentication states
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Step 1: Verification of Email + Secret Admin PIN (3435)
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();

    if (cleanEmail !== REQUIRED_ADMIN_EMAIL.toLowerCase()) {
      setErrorMsg(`Accès refusé. Seul le propriétaire (${REQUIRED_ADMIN_EMAIL}) est autorisé à se connecter.`);
      return;
    }

    if (cleanPin !== '3435') {
      setErrorMsg('Code PIN secret administrateur incorrect.');
      return;
    }

    // Success step 1 -> proceed to Step 2
    setStep(2);
  };

  // Handle Step 2: Verification of Admin Entry Code (Spart3435)
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const cleanCode = adminCode.trim();
      if (cleanCode !== 'Spart3435') {
        setErrorMsg("Code de validation d'accès administrateur incorrect.");
        setLoading(false);
        return;
      }

      await loginAdmin(email, pin, adminCode);
      onSuccess();
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || "Échec d'authentification administrateur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-slate-950 border border-slate-800 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            {step === 1 ? <ShieldCheck className="w-7 h-7" /> : <Fingerprint className="w-7 h-7 text-rose-400" />}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Accès Espace Administrateur
          </h1>
          <p className="text-xs text-slate-400">
            {step === 1
              ? 'Étape 1/2 : Identification du compte propriétaire & Mot de passe secret'
              : 'Étape 2/2 : Code de déverrouillage sécurisé'}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'w-12 bg-cyan-500' : 'w-6 bg-slate-800'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'w-12 bg-rose-500' : 'w-6 bg-slate-800'}`} />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Adresse e-mail administrateur
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Mot de passe secret administrateur (PIN)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Saisir votre mot de passe secret"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition font-mono tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-950 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuer vers l'étape suivante</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Compte vérifié : {email}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Code de déverrouillage de l'espace administrateur
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Code d'accès administrateur"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-rose-900/60 focus:border-rose-500 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-500 transition font-mono tracking-wider"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setStep(1); setAdminCode(''); setErrorMsg(''); }}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-950 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Déverrouiller l'espace admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Security Notice */}
        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Accès strictement contrôlé. Les visiteurs réguliers n'y ont pas accès.</span>
        </div>
      </div>
    </div>
  );
};
