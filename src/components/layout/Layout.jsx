import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import ParticleBackground from '@/components/common/ParticleBackground';
import BackToTop from '@/components/common/BackToTop';
import KeyboardShortcuts from '@/components/common/KeyboardShortcuts';
import ToastContainer from '@/components/ui/Toast';
import AnimeChatbot from '@/components/chatbot/AnimeChatbot';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="relative flex flex-col min-h-screen" style={{ backgroundColor: 'var(--page-bg)', transition: 'background-color 0.4s ease' }}>
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 pt-16 md:pt-20 flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
      <BackToTop />
      <KeyboardShortcuts />
      <ToastContainer />
      <AnimeChatbot />
    </div>
  );
}
