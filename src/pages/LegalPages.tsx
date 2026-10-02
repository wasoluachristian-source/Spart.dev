import React from 'react';

export const LegalPages: React.FC<{ type: 'terms' | 'privacy' }> = ({ type }) => {
  if (type === 'terms') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Conditions Générales d'Utilisation</h1>
        <div className="prose prose-invert text-slate-300 text-sm leading-relaxed space-y-6">
          <p>Dernière mise à jour : Septembre 2026</p>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Objet du site</h2>
            <p>
              Le site <strong>Spart.dev</strong> est un espace professionnel personnel présentant les travaux, réalisations, produits numériques, livres et formations de son éditeur.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Droits de propriété intellectuelle</h2>
            <p>
              L’ensemble des contenus, marques, logos, codes sources, vidéos et textes présents sur Spart.dev sont la propriété exclusive de leur auteur, sauf mention contraire. Toute reproduction ou réutilisation sans autorisation préalable est interdite.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Produits numériques et licences</h2>
            <p>
              L'acquisition d'un produit numérique confère une licence d'utilisation selon les modalités spécifiées sur la fiche du produit. Les téléchargements sont réservés à l’acheteur.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Contact et réclamations</h2>
            <p>
              Pour toute question ou demande relative aux présentes conditions, vous pouvez utiliser le formulaire de contact officiel présent sur Spart.dev.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Politique de Confidentialité</h1>
      <div className="prose prose-invert text-slate-300 text-sm leading-relaxed space-y-6">
        <p>Dernière mise à jour : Septembre 2026</p>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Collecte des données personnelles</h2>
          <p>
            Spart.dev collecte uniquement les données nécessaires au bon fonctionnement des services :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Votre adresse e-mail lors de l’inscription à la lettre d’information (abonnement).</li>
            <li>Vos nom, adresse e-mail et message lors de l’envoi d’une demande via le formulaire de contact.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Utilisation et protection des données</h2>
          <p>
            Vos informations ne sont jamais vendues, louées ou cédées à des tiers. Les échanges via le formulaire restent strictement confidentiels et protégés par une base de données sécurisée.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Vos droits (RGPD)</h2>
          <p>
            Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez demander la suppression de votre adresse e-mail ou désabonnement à tout moment par le biais du formulaire de contact.
          </p>
        </section>
      </div>
    </div>
  );
};
