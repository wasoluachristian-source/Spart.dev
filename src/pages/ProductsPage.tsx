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
import { SecureCheckoutModal } from '../components/SecureCheckoutModal';

interface ProductsPageProps {
  setCurrentTab: (tab: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ setCurrentTab }) => {
  const { products } = useApp();
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);

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

        {/* Quick link to code page */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setCurrentTab('download')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-800/50 text-cyan-300 hover:text-white text-xs font-semibold hover:border-cyan-500 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Déjà acheté ? Télécharger avec mon code unique</span>
          </button>
        </div>
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

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
                      {product.category}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        isAvailable
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {isAvailable ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition leading-snug">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features checklist */}
                  {product.features && product.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2">
                      {product.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] text-slate-400">Prix unique</div>
                    <div className="text-2xl font-black text-white">{product.price} €</div>
                  </div>

                  {isAvailable ? (
                    <button
                      onClick={() => setSelectedProductForPurchase(product)}
                      className="py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Acheter &amp; Télécharger</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentTab('contact')}
                      className="py-2.5 px-3 bg-slate-800 text-slate-400 text-xs rounded-xl hover:text-white"
                    >
                      Précommander
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Secure Checkout Modal */}
      {selectedProductForPurchase && (
        <SecureCheckoutModal
          isOpen={!!selectedProductForPurchase}
          onClose={() => setSelectedProductForPurchase(null)}
          item={{
            id: selectedProductForPurchase.id,
            title: selectedProductForPurchase.name,
            price: selectedProductForPurchase.price,
            type: 'product',
            deliverableUrl: selectedProductForPurchase.fileOrUrl,
            deliverableName: selectedProductForPurchase.fileName || `${selectedProductForPurchase.name}.zip`,
          }}
        />
      )}
    </div>
  );
};
