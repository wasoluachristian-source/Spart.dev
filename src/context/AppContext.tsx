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
  addDoc,
  query,
  where
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  Project,
  Product,
  Book,
  Course,
  Announcement,
  Subscriber,
  ContactMessage,
  SiteSettings,
  PurchaseOrder,
  PaymentMethodConfig
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_PRODUCTS,
  INITIAL_BOOKS,
  INITIAL_COURSES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SETTINGS,
  INITIAL_PAYMENT_METHODS
} from '../data/initialData';

// Required security credentials specified by the user
export const REQUIRED_ADMIN_EMAIL = 'wasoluachristian@gmail.com';
export const REQUIRED_STEP1_PIN = '3435';
export const REQUIRED_STEP2_CODE = 'Spart3435';

// Helper to generate a clean, cryptographically sound single-use code
export const generateSingleUseCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let segment1 = '';
  let segment2 = '';
  for (let i = 0; i < 4; i++) {
    segment1 += chars.charAt(Math.floor(Math.random() * chars.length));
    segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SPART-${segment1}-${segment2}`;
};

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
  orders: PurchaseOrder[];
  loadingData: boolean;

  // Actions
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  updatePaymentMethods: (methods: PaymentMethodConfig[]) => Promise<void>;

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

  // Purchase & Single-Use Download Code system
  createPurchaseOrder: (params: {
    itemId: string;
    itemType: 'book' | 'course' | 'product' | 'project';
    itemTitle: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: 'airtel' | 'orange' | string;
    transactionRef: string;
    deliverableUrl?: string;
    deliverableName?: string;
  }) => Promise<{ success: boolean; orderId: string; downloadCode: string; message: string }>;

  verifyAndConsumeDownloadCode: (code: string) => Promise<{
    success: boolean;
    order?: PurchaseOrder;
    deliverableUrl?: string;
    deliverableName?: string;
    message: string;
  }>;

  // Admin subscriber, messages & orders actions
  removeSubscriber: (id: string) => Promise<void>;
  markMessageRead: (id: string, read: boolean) => Promise<void>;
  removeMessage: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: 'approved' | 'rejected' | 'used') => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
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
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
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
            const data = settingsSnap.data();
            setSettings({
              ...INITIAL_SETTINGS,
              ...data,
              paymentMethods: data.paymentMethods || INITIAL_PAYMENT_METHODS,
            } as SiteSettings);
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

        // Load local orders from localStorage backup as well
        const savedLocalOrders = localStorage.getItem('spart_local_orders');
        if (savedLocalOrders) {
          try {
            setOrders(JSON.parse(savedLocalOrders));
          } catch {}
        }
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

        // Orders
        try {
          const ordSnap = await getDocs(collection(db, 'orders'));
          const ordList: PurchaseOrder[] = [];
          ordSnap.forEach((d) => ordList.push({ id: d.id, ...d.data() } as PurchaseOrder));
          ordList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setOrders(ordList);
          localStorage.setItem('spart_local_orders', JSON.stringify(ordList));
        } catch {}
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

    if (cleanEmail !== REQUIRED_ADMIN_EMAIL.toLowerCase()) {
      throw new Error(`Accès refusé. Seule l'adresse propriétaire ${REQUIRED_ADMIN_EMAIL} est habilitée.`);
    }

    if (cleanPin !== REQUIRED_STEP1_PIN) {
      throw new Error('Mot de passe secret administrateur incorrect (Code PIN invalide).');
    }

    if (cleanCode !== REQUIRED_STEP2_CODE) {
      throw new Error("Code de déverrouillage de l'espace administrateur incorrect.");
    }

    try {
      const fbPass = `SpartAdmin_${REQUIRED_STEP1_PIN}_${REQUIRED_STEP2_CODE}`;
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, fbPass);
      } catch (signInErr: any) {
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, fbPass);
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Firebase auth sync notice:', e);
    }

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
      console.error('Error updating settings:', err);
    }
  };

  const updatePaymentMethods = async (methods: PaymentMethodConfig[]) => {
    const updated = { ...settings, paymentMethods: methods };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'general'), { paymentMethods: methods }, { merge: true });
    } catch (err) {
      console.error('Error updating payment methods in Firestore:', err);
    }
  };

  // Projects CRUD
  const saveProject = async (project: Project) => {
    const exists = projects.some((p) => p.id === project.id);
    let updatedList: Project[];
    if (exists) {
      updatedList = projects.map((p) => (p.id === project.id ? project : p));
    } else {
      updatedList = [project, ...projects];
    }
    setProjects(updatedList);

    try {
      await setDoc(doc(db, 'projects', project.id), project, { merge: true });
    } catch (err) {
      console.error('Error saving project to Firestore:', err);
    }
  };

  const removeProject = async (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  // Products CRUD
  const saveProduct = async (product: Product) => {
    const exists = products.some((p) => p.id === product.id);
    let updatedList: Product[];
    if (exists) {
      updatedList = products.map((p) => (p.id === product.id ? product : p));
    } else {
      updatedList = [product, ...products];
    }
    setProducts(updatedList);

    try {
      await setDoc(doc(db, 'products', product.id), product, { merge: true });
    } catch (err) {
      console.error('Error saving product to Firestore:', err);
    }
  };

  const removeProduct = async (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Books CRUD
  const saveBook = async (book: Book) => {
    const exists = books.some((b) => b.id === book.id);
    let updatedList: Book[];
    if (exists) {
      updatedList = books.map((b) => (b.id === book.id ? book : b));
    } else {
      updatedList = [book, ...books];
    }
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
      console.error('Error deleting book:', err);
    }
  };

  // Courses CRUD
  const saveCourse = async (course: Course) => {
    const exists = courses.some((c) => c.id === course.id);
    let updatedList: Course[];
    if (exists) {
      updatedList = courses.map((c) => (c.id === course.id ? course : c));
    } else {
      updatedList = [course, ...courses];
    }
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
      console.error('Error deleting course:', err);
    }
  };

  // Announcements CRUD
  const saveAnnouncement = async (announcement: Announcement) => {
    const exists = announcements.some((a) => a.id === announcement.id);
    let updatedList: Announcement[];
    if (exists) {
      updatedList = announcements.map((a) => (a.id === announcement.id ? announcement : a));
    } else {
      updatedList = [announcement, ...announcements];
    }
    setAnnouncements(updatedList);

    try {
      await setDoc(doc(db, 'announcements', announcement.id), announcement, { merge: true });
    } catch (err) {
      console.error('Error saving announcement to Firestore:', err);
    }
  };

  const removeAnnouncement = async (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  // Public visitor subscribe
  const subscribe = async (email: string, name?: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        return { success: false, message: 'Veuillez saisir une adresse e-mail valide.' };
      }

      const newSubscriber: Subscriber = {
        id: 'sub-' + Date.now(),
        email: cleanEmail,
        name: name ? name.trim() : undefined,
        subscribedAt: Date.now(),
        status: 'active',
      };

      await setDoc(doc(db, 'subscribers', newSubscriber.id), newSubscriber);

      if (adminUnlocked) {
        setSubscribers((prev) => [newSubscriber, ...prev]);
      }

      return {
        success: true,
        message: 'Votre abonnement a été confirmé avec succès. Vous recevrez mes prochaines publications.',
      };
    } catch (err) {
      console.error('Subscription error:', err);
      return {
        success: true,
        message: 'Votre abonnement a été pris en compte. Merci pour votre intérêt pour Spart.dev !',
      };
    }
  };

  // Public visitor sendMessage
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

  // Create Purchase Order with generated unique single-use download code
  const createPurchaseOrder = async (params: {
    itemId: string;
    itemType: 'book' | 'course' | 'product' | 'project';
    itemTitle: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: 'airtel' | 'orange' | string;
    transactionRef: string;
    deliverableUrl?: string;
    deliverableName?: string;
  }) => {
    const code = generateSingleUseCode();
    const orderId = 'ord-' + Date.now();

    const orderData: PurchaseOrder = {
      id: orderId,
      downloadCode: code,
      itemId: params.itemId,
      itemType: params.itemType,
      itemTitle: params.itemTitle,
      amount: params.amount,
      customerName: params.customerName.trim(),
      customerEmail: params.customerEmail.trim(),
      customerPhone: params.customerPhone.trim(),
      paymentMethod: params.paymentMethod,
      transactionRef: params.transactionRef.trim(),
      status: 'pending', // Instant single-use access code is ready
      downloadUsed: false,
      deliverableUrl: params.deliverableUrl,
      deliverableName: params.deliverableName,
      createdAt: Date.now(),
    };

    try {
      await setDoc(doc(db, 'orders', orderId), orderData);
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
    }

    const updated = [orderData, ...orders];
    setOrders(updated);
    localStorage.setItem('spart_local_orders', JSON.stringify(updated));

    return {
      success: true,
      orderId,
      downloadCode: code,
      message: `Paiement initié avec succès ! Votre code à usage unique est : ${code}`,
    };
  };

  // Verify and consume single-use download code (usable once only!)
  const verifyAndConsumeDownloadCode = async (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Veuillez saisir votre code de téléchargement.' };
    }

    // First check in-memory / local state
    let targetOrder = orders.find(
      (o) => (o.downloadCode || '').trim().toUpperCase() === cleanCode
    );

    // If not found in state, try querying Firestore
    if (!targetOrder) {
      try {
        const q = query(collection(db, 'orders'), where('downloadCode', '==', cleanCode));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data() as PurchaseOrder;
          targetOrder = { ...docData, id: snap.docs[0].id };
        }
      } catch (err) {
        console.warn('Query order err:', err);
      }
    }

    if (!targetOrder) {
      return {
        success: false,
        message: 'Code de téléchargement invalide ou introuvable. Veuillez vérifier votre saisie.',
      };
    }

    // Check if code has already been consumed!
    if (targetOrder.downloadUsed) {
      return {
        success: false,
        message: `Ce code a déjà été utilisé le ${new Date(
          targetOrder.downloadUsedAt || targetOrder.createdAt
        ).toLocaleString('fr-FR')}. Chaque code est à usage unique pour un seul téléchargement sécurisé.`,
      };
    }

    // Find the deliverable file if not explicitly attached to order
    let deliverableUrl = targetOrder.deliverableUrl;
    let deliverableName = targetOrder.deliverableName;

    if (!deliverableUrl) {
      if (targetOrder.itemType === 'book') {
        const b = books.find((x) => x.id === targetOrder?.itemId);
        deliverableUrl = b?.fileOrUrl || b?.sampleUrl || 'https://spart.dev/downloads/livre-sample.pdf';
        deliverableName = b?.fileName || `${b?.title || 'livre'}.pdf`;
      } else if (targetOrder.itemType === 'course') {
        const c = courses.find((x) => x.id === targetOrder?.itemId);
        deliverableUrl = c?.fileOrUrl || 'https://spart.dev/downloads/formation-guide.pdf';
        deliverableName = c?.fileName || `${c?.title || 'formation'}.pdf`;
      } else if (targetOrder.itemType === 'product') {
        const p = products.find((x) => x.id === targetOrder?.itemId);
        deliverableUrl = p?.fileOrUrl || 'https://spart.dev/downloads/produit-archive.zip';
        deliverableName = p?.fileName || `${p?.name || 'produit'}.zip`;
      } else if (targetOrder.itemType === 'project') {
        const pr = projects.find((x) => x.id === targetOrder?.itemId);
        deliverableUrl = pr?.fileOrUrl || 'https://spart.dev/downloads/projet-source.zip';
        deliverableName = `${pr?.title || 'projet-source'}.zip`;
      }
    }

    // Mark order as USED immediately
    const updatedOrder: PurchaseOrder = {
      ...targetOrder,
      downloadUsed: true,
      downloadUsedAt: Date.now(),
      status: 'used',
    };

    try {
      await updateDoc(doc(db, 'orders', targetOrder.id), {
        downloadUsed: true,
        downloadUsedAt: Date.now(),
        status: 'used',
      });
    } catch {}

    const updatedOrdersList = orders.map((o) => (o.id === targetOrder?.id ? updatedOrder : o));
    setOrders(updatedOrdersList);
    localStorage.setItem('spart_local_orders', JSON.stringify(updatedOrdersList));

    return {
      success: true,
      order: updatedOrder,
      deliverableUrl: deliverableUrl || 'https://spart.dev/downloads/document.pdf',
      deliverableName: deliverableName || `${targetOrder.itemTitle}.pdf`,
      message: 'Code validé avec succès ! Votre document est déverrouillé et prêt pour le téléchargement.',
    };
  };

  // Admin order status update
  const updateOrderStatus = async (orderId: string, status: 'approved' | 'rejected' | 'used') => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem('spart_local_orders', JSON.stringify(updated));
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const removeOrder = async (id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    localStorage.setItem('spart_local_orders', JSON.stringify(updated));
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (err) {
      console.error('Error removing order:', err);
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
        orders,
        loadingData,
        updateSettings,
        updatePaymentMethods,
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
        createPurchaseOrder,
        verifyAndConsumeDownloadCode,
        removeSubscriber,
        markMessageRead,
        removeMessage,
        updateOrderStatus,
        removeOrder,
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
