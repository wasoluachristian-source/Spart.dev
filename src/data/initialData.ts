import { Project, Product, Book, Course, Announcement, SiteSettings, PaymentMethodConfig } from '../types';

export const INITIAL_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'pay-airtel',
    provider: 'airtel',
    name: 'Airtel Money',
    privateAccountNumber: '0998861950', // Admin-only: never shown to customers
    merchantName: 'Spart.dev Airtel Merchant',
    instructions: 'Effectuez le paiement sécurisé via le prompt Airtel Money ou validation marchande.',
    active: true,
  },
  {
    id: 'pay-orange',
    provider: 'orange',
    name: 'Orange Money',
    privateAccountNumber: '0808237426', // Admin-only: never shown to customers
    merchantName: 'Spart.dev Orange Merchant',
    instructions: 'Effectuez le paiement sécurisé via le prompt Orange Money ou code marchand sécurisé.',
    active: true,
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'Spart.dev',
  publicContactEmail: 'contact@spart.dev',
  backendEmail: 'wasoluachristian@gmail.com',
  bio: 'Développeur Informatique & Architecte Web. Je conçois des sites web sur mesure pour les entreprises et les particuliers, et je développe et vends des sites web et applications prêts à l’emploi.',
  heroTitle: 'Bienvenue sur Spart.dev',
  heroSubtitle: 'Création de sites web professionnels pour entreprises et particuliers & Vente de sites web.',
  githubUrl: 'https://github.com',
  twitterUrl: 'https://twitter.com',
  linkedinUrl: 'https://linkedin.com',
  availableForFreelance: true,
  paymentMethods: INITIAL_PAYMENT_METHODS,
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Nexus Cloud Dashboard',
    description: 'Plateforme unifiée de monitoring multi-cloud avec métriques temps réel et alertes intelligentes.',
    longDescription: 'Architecture serverless ultra-performante basée sur React, Go et GCP. Visualisation interactive de flux de données, analytics de consommation de bande passante et intégration continue.',
    category: 'SaaS',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Docker'],
    projectUrl: 'https://nexus.spart.dev',
    githubUrl: 'https://github.com/spartdev/nexus-dashboard',
    forSale: true,
    price: 499,
    featured: true,
    fileOrUrl: 'https://spart.dev/downloads/nexus-cloud-dashboard-src.zip',
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: 'proj-2',
    title: 'Pulse Commerce Platform',
    description: 'Moteur e-commerce headless moderne, avec gestion de panier optimisée et checkout ultra-rapide.',
    longDescription: 'Solution pensée pour les créateurs de produits numériques avec génération sécurisée de liens de téléchargement, facturation automatique et statistiques de ventes.',
    category: 'Web App',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
    technologies: ['Next.js', 'Tailwind CSS', 'Stripe API', 'Firebase', 'Redis'],
    projectUrl: 'https://pulse.spart.dev',
    forSale: false,
    featured: true,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'proj-3',
    title: 'DevForge CLI & Core Engine',
    description: 'Suite d’outils en ligne de commande pour automatiser le scaffolding, les tests d’API et les déploiements.',
    category: 'Open Source',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    technologies: ['Rust', 'Node.js', 'CLI', 'Docker'],
    projectUrl: 'https://forge.spart.dev',
    githubUrl: 'https://github.com/spartdev/devforge',
    forSale: false,
    featured: true,
    createdAt: Date.now() - 86400000 * 60,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'SaaS Boilerplate Ultra TypeScript & Tailwind',
    description: 'Starter kit complet de niveau production intégrant authentification, base de données, dashboard réactif et dark mode.',
    images: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
    ],
    price: 49,
    category: 'Code Templates',
    fileOrUrl: 'https://spart.dev/downloads/saas-boilerplate-v2.zip',
    fileName: 'saas-boilerplate-v2.zip',
    status: 'disponible',
    features: [
      'Architecture moderne React 19 + TypeScript',
      'Composants Tailwind prêts à l’emploi',
      'Système de rôles et permissions inclus',
      'Documentation claire pas à pas',
    ],
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'prod-2',
    name: 'Design System & UI Component Library',
    description: 'Plus de 80 composants web accessibles, hautement personnalisables avec thèmes sombres/clairs dynamiques.',
    images: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80',
    ],
    price: 29,
    category: 'UI Kits',
    fileOrUrl: 'https://spart.dev/downloads/spart-ui-kit.zip',
    fileName: 'spart-ui-kit.zip',
    status: 'disponible',
    features: [
      'Plus de 80 composants React',
      'Accessible WCAG AA',
      'Fichiers Figma complets inclus',
    ],
    createdAt: Date.now() - 86400000 * 40,
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'L’Art du Code Moderne : Architecture Web & Scalabilité',
    author: 'Spart (Wasolua Christian)',
    description: 'Un guide approfondi pour concevoir des applications web résilientes, maintenables et performantes de zéro jusqu’en production.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&auto=format&fit=crop&q=80',
    price: 19,
    pages: 280,
    format: 'Ebook PDF (Haute Définition)',
    fileOrUrl: 'https://spart.dev/downloads/livre-art-du-code-moderne.pdf',
    fileName: 'livre-art-du-code-moderne.pdf',
    sampleUrl: 'https://spart.dev/sample-book.pdf',
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'book-2',
    title: 'Guide Pratique des APIs REST & GraphQL',
    author: 'Spart (Wasolua Christian)',
    description: 'Maîtrisez la conception des protocoles d’API modernes, les stratégies de mise en cache, la sécurité OAuth et les bonnes pratiques de versioning.',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=1000&auto=format&fit=crop&q=80',
    price: 15,
    pages: 195,
    format: 'Ebook PDF (Téléchargement direct)',
    fileOrUrl: 'https://spart.dev/downloads/guide-apis-rest-graphql.pdf',
    fileName: 'guide-apis-rest-graphql.pdf',
    createdAt: Date.now() - 86400000 * 50,
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Formation Complète Développeur Full-Stack Moderne',
    description: 'Apprenez à maîtriser React, Node.js, TypeScript, PostgreSQL et le déploiement cloud avec des cas réels.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80',
    syllabus: [
      'Architecture logicielle moderne & Clean Architecture',
      'Développement frontend avancé avec React et Tailwind',
      'API REST et GraphQL sécurisées avec Node & Express',
      'Modélisation de données & indexation SQL',
      'Déploiement continu CI/CD sur Cloud Run et Docker',
    ],
    duration: '25 heures',
    level: 'Tous niveaux',
    price: 199,
    enrollmentOpen: true,
    fileOrUrl: 'https://spart.dev/downloads/programme-complet-fullstack.pdf',
    fileName: 'programme-complet-fullstack.pdf',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'course-2',
    title: 'Atelier Architecture Micro-SaaS & Automatisation',
    description: 'Concevez, codez et mettez en ligne un micro-SaaS rentable avec gestion des abonnements, webhooks et automatisation des sauvegardes.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    syllabus: [
      'Conception du modèle économique et MVP',
      'Mise en place de Stripe & facturation récurrente',
      'Sécurisation des routes et gestion des accès',
      'Stratégie de lancement et acquisition',
    ],
    duration: '12 heures',
    level: 'Intermédiaire',
    price: 149,
    enrollmentOpen: true,
    fileOrUrl: 'https://spart.dev/downloads/atelier-microsaas-guide.pdf',
    fileName: 'atelier-microsaas-guide.pdf',
    createdAt: Date.now() - 86400000 * 25,
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Lancement officiel du portail Spart.dev',
    content: 'Bienvenue sur la version officielle de Spart.dev ! Vous y retrouverez désormais toutes mes créations, projets open source, formations et services professionnels de développement.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80',
    mediaType: 'image',
    publishDate: Date.now() - 86400000 * 2,
    expireDate: Date.now() + 86400000 * 30,
    active: true,
    badge: 'Nouveau',
  },
  {
    id: 'ann-2',
    title: 'Disponibilité pour nouveaux projets & consultations techniques',
    content: 'J’ouvre actuellement 2 créneaux pour accompagner des startups ou entreprises sur l’architecture de leurs applications web et l’audit technique de performance.',
    mediaType: 'text',
    publishDate: Date.now() - 86400000 * 5,
    expireDate: Date.now() + 86400000 * 45,
    active: true,
    badge: 'Mission',
  },
];
