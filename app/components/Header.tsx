'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, Menu, BarChart2, BookOpen, ArrowLeftRight, GraduationCap, Languages, BookMarked, GitMerge, Brain, Clock, Bug, CheckSquare, Globe } from 'lucide-react';
import { useLang } from '../lib/language';

export type AppView = 'attack' | 'stats' | 'cheatsheet' | 'compare' | 'learn' | 'glossary' | 'chain' | 'scenario' | 'timeline' | 'cve' | 'checklist' | 'map';

interface HeaderProps {
  isMobile?: boolean;
  onToggleSidebar?: () => void;
  currentView: AppView;
  onNav: (v: AppView) => void;
}

const NAV_ITEMS: { view: AppView; icon: typeof BarChart2; labelKey: string }[] = [
  { view: 'stats',      icon: BarChart2,       labelKey: 'navStats'      },
  { view: 'cheatsheet', icon: BookOpen,         labelKey: 'navCheatSheet' },
  { view: 'compare',    icon: ArrowLeftRight,   labelKey: 'navCompare'    },
  { view: 'learn',      icon: GraduationCap,    labelKey: 'navLearn'      },
  { view: 'glossary',   icon: BookMarked,       labelKey: 'navGlossary'   },
  { view: 'chain',      icon: GitMerge,         labelKey: 'navChain'      },
  { view: 'scenario',   icon: Brain,            labelKey: 'navScenario'   },
  { view: 'timeline',   icon: Clock,            labelKey: 'navTimeline'   },
  { view: 'cve',        icon: Bug,              labelKey: 'navCVE'        },
  { view: 'checklist',  icon: CheckSquare,      labelKey: 'navChecklist'  },
  { view: 'map',        icon: Globe,            labelKey: 'navMap'        },
];

export default function Header({ isMobile, onToggleSidebar, currentView, onNav }: HeaderProps) {
  const { lang, toggle, t } = useLang();
  const [time,    setTime]    = useState('');
  const [threats, setThreats] = useState(0);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('id-ID', { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    let count = 127483;
    const inc = setInterval(() => { count += Math.floor(Math.random() * 5); setThreats(count); }, 2000);
    return () => { clearInterval(t); clearInterval(inc); };
  }, []);

  return (
    <header style={{
      position: 'relative', zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(6,8,16,0.95)',
      backdropFilter: 'blur(10px)',
      flexShrink: 0, gap: '12px',
    }}>

      {/* Left: hamburger + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {isMobile && (
          <button onClick={onToggleSidebar} style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Menu size={16} color="#00d4ff" />
          </button>
        )}
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,0,85,0.12)', border: '1px solid rgba(255,0,85,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldAlert size={16} color="#ff0055" strokeWidth={1.5} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: '14px', fontWeight: 800, letterSpacing: '0.1em', color: '#e8ecf5' }}>
            CYBER<span style={{ color: '#00d4ff' }}>THREAT</span>LAB
          </div>
          {!isMobile && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              // Visualisasi Serangan Siber Interaktif
            </div>
          )}
        </div>
      </div>

      {/* Center: navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {NAV_ITEMS.map(({ view, icon: Icon, labelKey }) => {
          const active = currentView === view;
          const label  = t(labelKey as Parameters<typeof t>[0]);
          return (
            <button
              key={view}
              onClick={() => onNav(active ? 'attack' : view)}
              title={label}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: isMobile ? '6px 8px' : '6px 12px',
                borderRadius: '7px', border: '1px solid',
                borderColor: active ? 'rgba(0,212,255,0.4)' : 'var(--border)',
                background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: active ? '#00d4ff' : 'var(--text-muted)',
                cursor: 'pointer', fontFamily: 'var(--mono)',
                fontSize: '9px', letterSpacing: '0.06em',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Icon size={12} />
              {!isMobile && label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Right: language toggle + status + clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button
          onClick={toggle}
          title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px', borderRadius: '6px',
            border: '1px solid var(--border)', background: 'var(--surface2)',
            color: 'var(--text-muted)', fontFamily: 'var(--mono)',
            fontSize: '10px', letterSpacing: '0.06em',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)'; (e.currentTarget as HTMLElement).style.color = '#00d4ff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
        >
          <Languages size={11} />
          {lang.toUpperCase()}
        </button>
        <div className="header-status-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff0055', animation: 'pulse-dot 1.5s infinite' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: '#ff0055', letterSpacing: '0.08em' }}>LIVE</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#ff3b3b', fontWeight: 600 }}>{threats.toLocaleString()}</span>
          </div>
          <div style={{ width: '1px', height: '14px', background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2dff8a', animation: 'pulse-dot 2s infinite' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: '#2dff8a', letterSpacing: '0.08em' }}>ONLINE</span>
          </div>
        </div>
        <div className="header-clock" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          {time} <span style={{ opacity: 0.5 }}>UTC+7</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </header>
  );
}
