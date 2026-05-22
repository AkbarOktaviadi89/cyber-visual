'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { attacks } from './data/attacks';
import Sidebar from './components/Sidebar';
import AttackDetail from './components/AttackDetail';
import WelcomeScreen from './components/WelcomeScreen';
import Header, { type AppView } from './components/Header';
import StatsPanel from './components/StatsPanel';
import CheatSheet from './components/CheatSheet';
import CompareView from './components/CompareView';
import LearningPath from './components/LearningPath';
import Glossary from './components/Glossary';
import AttackChainView from './components/AttackChain';
import ScenarioQuiz from './components/ScenarioQuiz';
import { LanguageProvider } from './lib/language';

const NetworkBackground = dynamic(() => import('./components/NetworkBackground'), { ssr: false });

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

export default function Home() {
  const [selected,    setSelected]    = useState<string | null>(null);
  const [search,      setSearch]      = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view,        setView]        = useState<AppView>('attack');
  const isMobile = useIsMobile();

  const selectedAttack = attacks.find(a => a.id === selected) || null;

  const handleSelect = (id: string) => {
    setSelected(id);
    setView('attack');
    if (isMobile) setSidebarOpen(false);
  };

  const handleNav = (v: AppView) => {
    setView(v);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <LanguageProvider>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <NetworkBackground />

      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header
          isMobile={isMobile}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          currentView={view}
          onNav={handleNav}
        />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Mobile backdrop */}
          {isMobile && sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
            />
          )}

          <Sidebar
            selected={selected}
            onSelect={handleSelect}
            search={search}
            onSearch={setSearch}
            isMobile={isMobile}
            isOpen={isMobile ? sidebarOpen : true}
            onClose={() => setSidebarOpen(false)}
          />

          <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'rgba(6,8,16,0.7)' }}>
            <div key={view} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'view-fade-in 0.22s ease-out' }}>
              {view === 'stats'      && <StatsPanel   onSelectAttack={handleSelect} />}
              {view === 'cheatsheet' && <CheatSheet   onSelectAttack={handleSelect} />}
              {view === 'compare'    && <CompareView />}
              {view === 'learn'      && <LearningPath onSelectAttack={handleSelect} />}
              {view === 'glossary'   && <Glossary     onSelectAttack={handleSelect} />}
              {view === 'chain'      && <AttackChainView onSelectAttack={handleSelect} />}
              {view === 'scenario'   && <ScenarioQuiz    onSelectAttack={handleSelect} />}
              {view === 'attack'     && (
                selectedAttack
                  ? <AttackDetail attack={selectedAttack} onSelectAttack={handleSelect} />
                  : <WelcomeScreen onSelect={handleSelect} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
    </LanguageProvider>
  );
}
