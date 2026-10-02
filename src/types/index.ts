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
  fileOrUrl?: string; // Downloadable source code/archive or deliverable
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  fileOrUrl?: string; // Digital file data URL or external download URL
  fileName?: string;
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
  fileOrUrl?: string; // PDF file data URL or download link
  fileName?: string;
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
  fileOrUrl?: string; // Course video/PDF materials or access link
  fileName?: string;
  createdAt: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  mediaType?: 'text' | 'image' | 'video' | 'file';
  mediaUrl?: string;
  mediaFileName?: string;
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

export interface PaymentMethodConfig {
  id: string;
  provider: 'airtel' | 'orange' | 'custom';
  name: string;
  // Private phone number or internal identifier (NEVER exposed publicly to visitors)
  privateAccountNumber: string;
  merchantName: string;
  instructions: string;
  active: boolean;
}

export interface PurchaseOrder {
  id: string;
  downloadCode: string; // Unique single-use code e.g. "SPART-9284-XK19"
  itemId: string;
  itemType: 'book' | 'course' | 'product' | 'project';
  itemTitle: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'airtel' | 'orange' | string;
  transactionRef: string;
  status: 'pending' | 'approved' | 'rejected' | 'used';
  downloadUsed: boolean;
  downloadUsedAt?: number;
  deliverableUrl?: string;
  deliverableName?: string;
  createdAt: number;
}

export interface SiteSettings {
  siteName: string;
  publicContactEmail: string;
  backendEmail: string;
  bio: string;
  heroTitle: string;
  heroSubtitle: string;
  githubUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  availableForFreelance: boolean;
  paymentMethods?: PaymentMethodConfig[];
}
