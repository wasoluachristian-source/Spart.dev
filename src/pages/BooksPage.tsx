import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { BookOpen, CheckCircle, Download, ExternalLink, Mail, ShieldCheck, Star, Sparkles } from 'lucide-react';
import { SecureCheckoutModal } from '../components/SecureCheckoutModal';

interface BooksPageProps {
  setCurrentTab: (tab: string) => void;
}

export const BooksPage: React.FC<BooksPageProps> = ({ setCurrentTab }) => {
  const { books } = useApp();
  const [selectedBookForPurchase, setSelectedBookForPurchase] = useState<Book | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Publications &amp; Ebooks</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Livres &amp; Guides Techniques
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Des ouvrages complets, documentés et pratiques pour structurer vos connaissances logicielles et progresser en développement web et architecture.
        </p>

        {/* Quick link to download already purchased book */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setCurrentTab('download')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-800/50 text-cyan-300 hover:text-white text-xs font-semibold hover:border-cyan-500 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Déjà acheté ? Entrer mon code unique de téléchargement</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start hover:border-cyan-500/40 transition duration-300 shadow-xl group"
          >
            {/* Book Cover */}
            <div className="w-full sm:w-48 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                loading="lazy"
              />
            </div>

            {/* Book Info */}
            <div className="flex-1 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                    {book.format || 'Ebook (PDF & ePub)'}
                  </span>
                  <span className="text-2xl font-black text-white">{book.price} €</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition leading-snug">
                  {book.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Par <span className="text-slate-200">{book.author}</span>
                  {book.pages && ` • ${book.pages} pages`}
                </p>

                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSelectedBookForPurchase(book)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Acheter &amp; Obtenir le Code ({book.price} €)</span>
                </button>

                <button
                  onClick={() => setCurrentTab('contact')}
                  className="py-3 px-3 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Poser une question"
                >
                  <Mail className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secure Checkout Modal */}
      {selectedBookForPurchase && (
        <SecureCheckoutModal
          isOpen={!!selectedBookForPurchase}
          onClose={() => setSelectedBookForPurchase(null)}
          item={{
            id: selectedBookForPurchase.id,
            title: selectedBookForPurchase.title,
            price: selectedBookForPurchase.price,
            type: 'book',
            deliverableUrl: selectedBookForPurchase.fileOrUrl,
            deliverableName: selectedBookForPurchase.fileName || `${selectedBookForPurchase.title}.pdf`,
          }}
        />
      )}
    </div>
  );
};
