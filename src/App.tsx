import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { ApiDocs } from './components/ApiDocs';
import { LeadDetails } from './components/LeadDetails';
import { VoiceBotButton } from './components/VoiceBotButton';

function App() {
  const { isSignedIn } = useUser();
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'api-docs' | 'lead-details'>('home');
  const [leadId, setLeadId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'dashboard' && isSignedIn) {
        setCurrentPage('dashboard');
        setLeadId(null);
      } else if (hash === 'api-docs' && isSignedIn) {
        setCurrentPage('api-docs');
        setLeadId(null);
      } else if (hash.startsWith('lead/') && isSignedIn) {
        const id = hash.split('/')[1];
        setCurrentPage('lead-details');
        setLeadId(id);
      } else {
        setCurrentPage('home');
        setLeadId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn && (currentPage === 'dashboard' || currentPage === 'api-docs' || currentPage === 'lead-details')) {
      window.location.hash = '';
      setCurrentPage('home');
    }
  }, [isSignedIn, currentPage]);

  if (currentPage === 'dashboard' && isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Dashboard />
        <Footer />
      </div>
    );
  }

  if (currentPage === 'api-docs' && isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <ApiDocs />
        <Footer />
      </div>
    );
  }

  if (currentPage === 'lead-details' && isSignedIn && leadId) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <LeadDetails leadId={leadId} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
      <VoiceBotButton />
    </div>
  );
}

export default App;
