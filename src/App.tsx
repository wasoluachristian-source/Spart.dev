import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SubscribeModal } from './components/SubscribeModal';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProductsPage } from './pages/ProductsPage';
import { BooksPage } from './pages/BooksPage';
import { CoursesPage } from './pages/CoursesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LegalPages } from './pages/LegalPages';
import { DownloadAccessPage } from './pages/DownloadAccessPage';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [subscribeModalOpen, setSubscribeModalOpen] = useState<boolean>(false);
  const { adminUnlocked, logoutAdmin } = useApp();

  // Handle URL hash navigation on mount and hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (
        hash &&
        [
          'home',
          'projects',
          'products',
          'books',
          'courses',
          'announcements',
          'download',
          'about',
          'contact',
          'login',
          'admin',
          'terms',
          'privacy',
        ].includes(hash)
      ) {
        setCurrentTab(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update hash when tab changes
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        openSubscribeModal={() => setSubscribeModalOpen(true)}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={handleTabChange}
            openSubscribeModal={() => setSubscribeModalOpen(true)}
          />
        )}
        {currentTab === 'projects' && (
          <ProjectsPage setCurrentTab={handleTabChange} />
        )}
        {currentTab === 'products' && (
          <ProductsPage setCurrentTab={handleTabChange} />
        )}
        {currentTab === 'books' && (
          <BooksPage setCurrentTab={handleTabChange} />
        )}
        {currentTab === 'courses' && (
          <CoursesPage setCurrentTab={handleTabChange} />
        )}
        {currentTab === 'announcements' && (
          <AnnouncementsPage setCurrentTab={handleTabChange} />
        )}
        {currentTab === 'download' && (
          <DownloadAccessPage setCurrentTab={handleTabChange} />
        )}
        {currentTab === 'about' && (
          <AboutPage setCurrentTab={handleTabChange} />
        )}
        {currentTab === 'contact' && (
          <ContactPage />
        )}
        {currentTab === 'terms' && (
          <LegalPages type="terms" />
        )}
        {currentTab === 'privacy' && (
          <LegalPages type="privacy" />
        )}
        {currentTab === 'login' && (
          adminUnlocked ? (
            <AdminDashboard onLogout={() => { logoutAdmin(); handleTabChange('home'); }} />
          ) : (
            <LoginPage onSuccess={() => handleTabChange('admin')} />
          )
        )}
        {currentTab === 'admin' && (
          adminUnlocked ? (
            <AdminDashboard onLogout={() => { logoutAdmin(); handleTabChange('home'); }} />
          ) : (
            <LoginPage onSuccess={() => handleTabChange('admin')} />
          )
        )}
      </main>

      <Footer
        setCurrentTab={handleTabChange}
        openSubscribeModal={() => setSubscribeModalOpen(true)}
      />

      <SubscribeModal
        isOpen={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
