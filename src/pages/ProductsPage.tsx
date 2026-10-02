import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  ShoppingBag,
  CheckCircle2,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  Filter,
  Package,
  X,
  Sparkles
} from 'lucide-react';

interface ProductsPageProps {
  setCurrentTab: (tab: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ setCurrentTab }) => {
  const { products } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'success'>('details');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Boutique Numérique</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Produits &amp; Outils Numériques
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Boilerplates de code, packs graphiques et utilitaires conçus pour accélérer vos déploiements et projets logiciels.
        </p>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
          Aucun produit disponible actuellement.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const isAvailable = product.status === 'disponible';
            return (
              <div
                key={product.id}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500/40 transition duration-300 relative group shadow-xl"
              >
                <div>
                  {/* Image preview */}
                  {product.images && product.images.length > 0 && (
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-950 border border-slate-800">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Header info */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-1 rounded-md">
                      {product.category}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">{product.price} €</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features list */}
                  {product.features && product.features.length > 0 && (
                    <div className="mt-6 space-y-2.5">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Inclus dans ce produit :
                      </div>
                      <ul className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Action */}
                <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                      {isAvailable ? 'Disponible immédiatement' : 'Actuellement indisponible'}
                    </span>
                    <span className="text-slate-500">Mises à jour incluses</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setCheckoutStep('details');
                    }}
                    disabled={!isAvailable}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-950 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Commander ({product.price} €)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Purchase Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutStep === 'details' ? (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    Achat sécurisé
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{selectedProduct.name}</h3>
                  <p className="text-sm text-slate-300 mt-1">{selectedProduct.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Prix unitaire</span>
                    <span className="text-white font-bold">{selectedProduct.price} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Accès au fichier / lien</span>
                    <span className="text-emerald-400 font-medium">Instantané</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Licence</span>
                    <span className="text-slate-200">Commerciale &amp; Personnelle</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-extrabold text-white">
                    <span>Total</span>
                    <span className="text-cyan-400">{selectedProduct.price} €</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setCheckoutStep('success')}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Confirmer la commande &amp; Obtenir le lien</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setCurrentTab('contact');
                    }}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                  >
                    Poser une question avant d'acheter
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Transaction protégée et sécurisée par Spart.dev</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-emerald-950 border border-emerald-600/60 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-white">Félicitations pour votre achat !</h3>
                <p className="text-sm text-slate-300">
                  Votre accès à <strong>{selectedProduct.name}</strong> est validé.
                </p>

                {selectedProduct.fileOrUrl ? (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="text-xs font-mono text-slate-400">Lien direct de téléchargement :</div>
                    <a
                      href={selectedProduct.fileOrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>{selectedProduct.fileOrUrl}</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Le lien de téléchargement a été généré avec succès.
                  </p>
                )}

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
