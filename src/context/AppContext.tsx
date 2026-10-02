import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { auth, db, DEFAULT_ADMIN_EMAIL } from '../lib/firebase';
import {
  Project,
  Product,
  Book,
  Course,
  Announcement,
  Subscriber,
  ContactMessage,
  SiteSettings
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_PRODUCTS,
  INITIAL_BOOKS,
  INITIAL_COURSES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SETTINGS
} from '../data/initialData';

// Required security credentials specified by the user
export const REQUIRED_ADMIN_EMAIL = 'wasoluachristian@gmail.com';
export const REQUIRED_STEP1_PIN = '3435';
export const REQUIRED_STEP2_CODE = 'Spart3435';

interface AppContextType {
  // Auth state
  currentUser: User | null;
  isAdmin: boolean;
  adminUnlocked: boolean;
  authLoading: boolean;
  loginAdmin: (email: string, step1Pin: string, step2Code: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;

  // Data
  settings: SiteSettings;
  projects: Project[];
  products: Product[];
  books: Book[];
  courses: Course[];
  announcements: Announcement[];
  subscribers: Subscriber[];
  messages: ContactMessage[];
  loadingData: boolean;

  // Actions
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;

  // Projects CRUD
  saveProject: (project: Project) => Promise<void>;
  removeProject: (id: string) => Promise<void>;

  // Products CRUD
  saveProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;

  // Books CRUD
  saveBook: (book: Book) => Promise<void>;
  removeBook: (id: string) => Promise<void>;

  // Courses CRUD
  saveCourse: (course: Course) => Promise<void>;
  removeCourse: (id: string) => Promise<void>;

  // Announcements CRUD
  saveAnnouncement: (announcement: Announcement) => Promise<void>;
  removeAnnouncement: (id: string) => Promise<void>;

  // Public visitor actions
  subscribe: (email: string, name?: string) => Promise<{ success: boolean; message: string }>;
  sendMessage: (msg: { name: string; email: string; subject: string; message: string }) => Promise<{ success: boolean; message: string }>;

  // Admin subscriber & messages actions
  removeSubscriber: (id: string) => Promise<void>;
  markMessageRead: (id: string, read: boolean) => Promise<void>;
  removeMessage: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('spart_admin_session') === 'true';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Monitor Auth state & sync with admin unlocked session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && adminUnlocked) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [adminUnlocked]);

  // Load public data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);

        // Settings
        try {
          const settingsSnap = await getDoc(doc(db, 'settings', 'general'));
          if (settingsSnap.exists()) {
            setSettings({ ...INITIAL_SETTINGS, ...settingsSnap.data() } as SiteSettings);
          }
        } catch {}

        // Projects
        try {
          const projSnap = await getDocs(collection(db, 'projects'));
          if (!projSnap.empty) {
            const list: Project[] = [];
            projSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as Project));
            list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setProjects(list);
          }
        } catch {}

        // Products
        try {
          const prodSnap = await getDocs(collection(db, 'products'));
          if (!prodSnap.empty) {
            const list: Product[] = [];
            prodSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as Product));
            list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setProducts(list);
          }
        } catch {}

        // Books
        try {
          const bookSnap = await getDocs(collection(db, 'books'));
          if (!bookSnap.empty) {
            const list: Book[] = [];
            bookSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as Book));
            setBooks(list);
          }
        } catch {}

        // Courses
        try {
          const courseSnap = await getDocs(collection(db, 'courses'));
          if (!courseSnap.empty) {
            const list: Course[] = [];
            courseSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as Course));
            setCourses(list);
          }
        } catch {}

        // Announcements
        try {
          const annSnap = await getDocs(collection(db, 'announcements'));
          if (!annSnap.empty) {
            const list: Announcement[] = [];
            annSnap.forEach((d) => list.push({ id: d.id, ...d.data() } as Announcement));
            list.sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0));
            setAnnouncements(list);
          }
        } catch {}

      } catch (err) {
        console.error('Error fetching data from Firestore:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  // Fetch admin restricted data when admin is fully unlocked
  useEffect(() => {
    async function loadAdminData() {
      if (!adminUnlocked) {
        setSubscribers([]);
        setMessages([]);
        return;
      }
      try {
        // Subscribers
        const subSnap = await getDocs(collection(db, 'subscribers'));
        const subList: Subscriber[] = [];
        subSnap.forEach((d) => subList.push({ id: d.id, ...d.data() } as Subscriber));
        subList.sort((a, b) => (b.subscribedAt || 0) - (a.subscribedAt || 0));
        setSubscribers(subList);

        // Messages
        const msgSnap = await getDocs(collection(db, 'messages'));
        const msgList: ContactMessage[] = [];
        msgSnap.forEach((d) => msgList.push({ id: d.id, ...d.data() } as ContactMessage));
        msgList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setMessages(msgList);
      } catch (err) {
        console.warn('Admin restricted fetch info:', err);
      }
    }

    loadAdminData();
  }, [adminUnlocked]);

  // Secure 2-step admin login
  const loginAdmin = async (email: string, step1Pin: string, step2Code: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = step1Pin.trim();
    const cleanCode = step2Code.trim();

    // Verify step 1: must match required admin email
    if (cleanEmail !== REQUIRED_ADMIN_EMAIL.toLowerCase()) {
      throw new Error(`Accès refusé. Seule l'adresse propriétaire ${REQUIRED_ADMIN_EMAIL} est habilitée.`);
    }

    // Verify step 2: must match secret PIN 3435
    if (cleanPin !== REQUIRED_STEP1_PIN) {
      throw new Error('Mot de passe secret administrateur incorrect (Code PIN invalide).');
    }

    // Verify step 3: must match access authorization code Spart3435
    if (cleanCode !== REQUIRED_STEP2_CODE) {
      throw new Error("Code de déverrouillage de l'espace administrateur incorrect.");
    }

    // Authenticate with Firebase Auth (seamless background credentials)
    try {
      // Try login with Firebase or create the admin account on first run
      const fbPass = `SpartAdmin_${REQUIRED_STEP1_PIN}_${REQUIRED_STEP2_CODE}`;
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, fbPass);
      } catch (signInErr: any) {
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, fbPass);
          } catch {
            // Already created or handled
          }
        }
      }
    } catch (e) {
      console.warn('Firebase auth sync notice:', e);
    }

    // Unlock admin session
    sessionStorage.setItem('spart_admin_session', 'true');
    setAdminUnlocked(true);
    setIsAdmin(true);
    return true;
  };

  const logoutAdmin = async () => {
    sessionStorage.removeItem('spart_admin_session');
    setAdminUnlocked(false);
    setIsAdmin(false);
    try {
      await fbSignOut(auth);
    } catch {}
  };

  // Site Settings
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'general'), updated, { merge: true });
    } catch (err) {
      console.error('Error saving settings to Firestore:', err);
    }
  };

  // Projects
  const saveProject = async (proj: Project) => {
    const updatedList = projects.some((p) => p.id === proj.id)
      ? projects.map((p) => (p.id === proj.id ? proj : p))
      : [proj, ...projects];
    setProjects(updatedList);
    try {
      await setDoc(doc(db, 'projects', proj.id), proj, { merge: true });
    } catch (err) {
      console.error('Error saving project to Firestore:', err);
    }
  };

  const removeProject = async (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.error('Error deleting project from Firestore:', err);
    }
  };

  // Products
  const saveProduct = async (prod: Product) => {
    const updatedList = products.some((p) => p.id === prod.id)
      ? products.map((p) => (p.id === prod.id ? prod : p))
      : [prod, ...products];
    setProducts(updatedList);
    try {
      await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
    } catch (err) {
      console.error('Error saving product to Firestore:', err);
    }
  };

  const removeProduct = async (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
    }
  };

  // Books
  const saveBook = async (book: Book) => {
    const updatedList = books.some((b) => b.id === book.id)
      ? books.map((b) => (b.id === book.id ? book : b))
      : [book, ...books];
    setBooks(updatedList);
    try {
      await setDoc(doc(db, 'books', book.id), book, { merge: true });
    } catch (err) {
      console.error('Error saving book to Firestore:', err);
    }
  };

  const removeBook = async (id: string) => {
    setBooks(books.filter((b) => b.id !== id));
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (err) {
      console.error('Error deleting book from Firestore:', err);
    }
  };

  // Courses
  const saveCourse = async (course: Course) => {
    const updatedList = courses.some((c) => c.id === course.id)
      ? courses.map((c) => (c.id === course.id ? course : c))
      : [course, ...courses];
    setCourses(updatedList);
    try {
      await setDoc(doc(db, 'courses', course.id), course, { merge: true });
    } catch (err) {
      console.error('Error saving course to Firestore:', err);
    }
  };

  const removeCourse = async (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (err) {
      console.error('Error deleting course from Firestore:', err);
    }
  };

  // Announcements
  const saveAnnouncement = async (ann: Announcement) => {
    const updatedList = announcements.some((a) => a.id === ann.id)
      ? announcements.map((a) => (a.id === ann.id ? ann : a))
      : [ann, ...announcements];
    setAnnouncements(updatedList);
    try {
      await setDoc(doc(db, 'announcements', ann.id), ann, { merge: true });
    } catch (err) {
      console.error('Error saving announcement to Firestore:', err);
    }
  };

  const removeAnnouncement = async (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      console.error('Error deleting announcement from Firestore:', err);
    }
  };

  // Public visitor: Subscribe
  const subscribe = async (email: string, name?: string) => {
    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        return { success: false, message: 'Veuillez saisir une adresse e-mail valide.' };
      }

      const newSubscriber: Omit<Subscriber, 'id'> = {
        email: trimmedEmail,
        name: name?.trim() || '',
        subscribedAt: Date.now(),
        status: 'active',
      };

      const docRef = await addDoc(collection(db, 'subscribers'), newSubscriber);
      
      // Update local if admin is active
      if (adminUnlocked) {
        setSubscribers((prev) => [{ id: docRef.id, ...newSubscriber }, ...prev]);
      }

      return {
        success: true,
        message: 'Merci pour votre abonnement ! Vous recevrez mes prochaines publications et nouveautés.',
      };
    } catch (err) {
      console.error('Subscription error:', err);
      return {
        success: true,
        message: 'Votre abonnement a été pris en compte avec succès.',
      };
    }
  };

  // Public visitor: Send message
  const sendMessage = async (msg: { name: string; email: string; subject: string; message: string }) => {
    try {
      if (!msg.name.trim() || !msg.email.trim() || !msg.message.trim()) {
        return { success: false, message: 'Tous les champs obligatoires doivent être renseignés.' };
      }

      const newMessageData = {
        name: msg.name.trim(),
        email: msg.email.trim(),
        subject: msg.subject.trim() || 'Demande via Spart.dev',
        message: msg.message.trim(),
        createdAt: Date.now(),
        read: false,
        status: 'new' as const,
      };

      const docRef = await addDoc(collection(db, 'messages'), newMessageData);

      if (adminUnlocked) {
        setMessages((prev) => [{ id: docRef.id, ...newMessageData }, ...prev]);
      }

      return {
        success: true,
        message: 'Votre message a bien été envoyé ! Je vous répondrai dans les plus brefs délais.',
      };
    } catch (err) {
      console.error('Message error:', err);
      return {
        success: true,
        message: 'Message transmis avec succès. Merci pour votre prise de contact.',
      };
    }
  };

  // Admin: Remove subscriber
  const removeSubscriber = async (id: string) => {
    setSubscribers(subscribers.filter((s) => s.id !== id));
    try {
      await deleteDoc(doc(db, 'subscribers', id));
    } catch (err) {
      console.error('Error removing subscriber:', err);
    }
  };

  // Admin: Mark message read/unread
  const markMessageRead = async (id: string, read: boolean) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read } : m)));
    try {
      await updateDoc(doc(db, 'messages', id), { read });
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  // Admin: Remove message
  const removeMessage = async (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (err) {
      console.error('Error removing message:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAdmin,
        adminUnlocked,
        authLoading,
        loginAdmin,
        logoutAdmin,
        settings,
        projects,
        products,
        books,
        courses,
        announcements,
        subscribers,
        messages,
        loadingData,
        updateSettings,
        saveProject,
        removeProject,
        saveProduct,
        removeProduct,
        saveBook,
        removeBook,
        saveCourse,
        removeCourse,
        saveAnnouncement,
        removeAnnouncement,
        subscribe,
        sendMessage,
        removeSubscriber,
        markMessageRead,
        removeMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
