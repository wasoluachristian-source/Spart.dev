import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  AlertCircle,
  Smartphone,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';

interface SecureCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    price: number;
    type: 'book' | 'course' | 'product' | 'project';
    deliverableUrl?: string;
    deliverableName?: string;
  } | null;
}

export const SecureCheckoutModal: React.FC<SecureCheckoutModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const { settings, createPurchaseOrder } = useApp();

  const [paymentProvider, setPaymentProvider] = useState<'airtel' | 'orange' | string>('airtel');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Success state with generated single-use code
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const activeMethods = (settings.paymentMethods || []).filter((m) => m.active);
  const selectedMethodConfig = activeMethods.find((m) => m.provider === paymentProvider) || activeMethods[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerEmail || !customerName || !customerPhone) {
      setErrorMsg('Veuillez remplir vos informations de contact pour recevoir votre justificatif.');
      return;
    }

    setLoading(true);

    try {
      const res = await createPurchaseOrder({
        itemId: item.id,
        itemType: item.type,
        itemTitle: item.title,
        amount: item.price,
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod: paymentProvider,
        transactionRef: transactionRef || `TX-${Date.now().toString().slice(-6)}`,
        deliverableUrl: item.deliverableUrl,
        deliverableName: item.deliverableName,
      });

      if (res.success) {
        setGeneratedCode(res.downloadCode);
      } else {
        setErrorMsg('Une erreur est survenue lors de la création de la commande.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur lors du traitement du paiement sécurisé.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetAndClose = () => {
    setGeneratedCode(null);
    setTransactionRef('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8">
        {/* Glow ambient */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {generatedCode ? (
          /* STEP 2: CODE GENERATED & INSTRUCTIONS */
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 bg-emerald-950/70 border border-emerald-500/50 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Paiement Sécurisé Enregistré
              </span>
              <h3 className="text-2xl font-black text-white">
                Votre Code à Usage Unique
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Ce code est strictement personnel et valide pour <strong className="text-white">un seul et unique téléchargement</strong> de votre article (<span className="text-cyan-400 font-semibold">{item.title}</span>).
              </p>
            </div>

            {/* Code Box */}
            <div className="bg-slate-950 border-2 border-dashed border-cyan-500/60 rounded-2xl p-5 space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Code de téléchargement unique
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-black text-cyan-400 tracking-wider select-all">
                {generatedCode}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Code copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Copier mon code unique</span>
                  </>
                )}
              </button>
            </div>

            {/* Single Use Security Reminder */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-left space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Règle de sécurité stricte :</span>
              </div>
              <p className="leading-relaxed">
                • Une fois le téléchargement effectué, le fichier vous appartient définitivement.
              </p>
              <p className="leading-relaxed">
                • Le code sera instantanément invalidé et ne pourra pas être réutilisé pour d'autres documents.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#download"
                onClick={() => {
                  handleResetAndClose();
                  window.location.hash = 'download';
                }}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-cyan-950 transition flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger mon document maintenant</span>
              </a>
            </div>
          </div>
        ) : (
          /* STEP 1: PAYMENT FORM */
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Passerelle Sécurisée Spart.dev</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Commander &amp; Débloquer le document
              </h3>
              <p className="text-xs text-slate-400">
                Paiement direct sécurisé avec génération de code à usage unique
              </p>
            </div>

            {/* Item summary banner */}
            <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded">
                  {item.type.toUpperCase()}
                </span>
                <h4 className="font-bold text-white text-sm sm:text-base mt-1 line-clamp-1">
                  {item.title}
                </h4>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400">Montant</div>
                <div className="text-xl font-black text-emerald-400">{item.price} €</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Methods Choice (Airtel & Orange strictly protected) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Choisissez votre mode de paiement sécurisé :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {activeMethods.map((m) => {
                    const isSelected = paymentProvider === m.provider;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentProvider(m.provider)}
                        className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-950/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-bold text-sm ${
                              isSelected ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            {m.name}
                          </span>
                          <Smartphone
                            className={`w-4 h-4 ${
                              isSelected ? 'text-cyan-400' : 'text-slate-500'
                            }`}
                          />
                        </div>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          Canal Sécurisé Automatique
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security notice regarding confidential numbers */}
              <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-[11px] text-cyan-200/90 leading-relaxed flex items-start gap-2">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Transaction Chiffrée :</strong> Le numéro marchand destinataire est crypté et sécurisé en interne par Spart.dev. Vous ne courez aucun risque d'erreur de virement.
                </span>
              </div>

              {/* Customer details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nom &amp; Prénom <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ex. Jean Dupont"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Adresse e-mail <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="jean@exemple.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Numéro de téléphone portable (pour confirmation) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="ex. +243 ... ou votre numéro de mobile money"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Référence de transaction / Numéro de reçu SMS <span className="text-slate-500 font-normal">(facultatif si direct)</span>
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="ex. ID de transaction ou référence de paiement"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-cyan-950 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirmer l'achat &amp; Générer mon code unique</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Génération instantanée d'un mot de passe / code unique de téléchargement</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
