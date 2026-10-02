export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: 'Web App' | 'Mobile App' | 'SaaS' | 'Open Source' | 'API / Backend';
  imageUrl: string;
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
  forSale: boolean;
  price?: number;
  featured?: boolean;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  fileOrUrl?: string;
  status: 'disponible' | 'indisponible';
  features: string[];
  createdAt: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  price: number;
  pages?: number;
  format?: string;
  purchaseUrl?: string;
  sampleUrl?: string;
  createdAt: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  syllabus: string[];
  duration?: string;
  level?: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
  price: number;
  enrollmentOpen: boolean;
  createdAt: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishDate: number;
  expireDate?: number;
  active: boolean;
  badge?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: number;
  status: 'active' | 'unsubscribed';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
  read: boolean;
  status: 'new' | 'in_progress' | 'replied' | 'archived';
}

export interface SiteSettings {
  siteName: string;
  publicContactEmail: string; // e.g. contact@spart.dev
  backendEmail: string; // wasoluachristian@gmail.com
  bio: string;
  heroTitle: string;
  heroSubtitle: string;
  githubUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  availableForFreelance: boolean;
}
