'use client';
import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { GLOSSARY, type GlossaryTerm, type TermCategory } from '../data/glossary';
import { useLang } from '../lib/language';

interface Props {
  onSelectAttack?: (id: string) => void;
}

const CATEGORIES: { key: TermCategory | 'all'; label: string; color: string }[] = [
  { key: 'all',      label: 'Semua',    color: '#7a8299' },
  { key: 'attack',   label: 'Attack',   color: '#ff2d55' },
  { key: 'defense',  label: 'Defense',  color: '#2dff8a' },
  { key: 'protocol', label: 'Protocol', color: '#00d4ff' },
  { key: 'concept',  label: 'Concept',  color: '#ffc83d' },
  { key: 'tool',     label: 'Tool',     color: '#a78bfa' },
];

function catColor(cat: TermCategory): string {
  return CATEGORIES.find(c => c.key === cat)?.color ?? '#7a8299';
}

export default function Glossary({ onSelectAttack }: Props) {
  const { t } = useLang();
  const [query,       setQuery]       = useState('');
  const [activecat,   setActivecat]   = useState<TermCategory | 'all'>('all');
  const [expandedId,  setExpandedId]  = useState<string | null>(null);

  const filtered = GLOSSARY.filter(term => {
    const matchCat = activecat === 'all' || term.category === activecat;
    const q = query.toLowerCase();
    const matchQ = !q || term.term.toLowerCase().includes(q) || term.short.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  // Group by first letter
  const groups: Record<string, GlossaryTerm[]> = {};
  filtered.forEach(term => {
    const letter = term.term[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(term);
  });
  const sortedLetters = Object.keys(groups).sort();

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '18px', fontWeight: 700, color: '#00d4ff', letterSpacing: '0.12em' }}>
            GLOSARIUM
          </h2>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            // {GLOSSARY.length} {t('attacksCount').toLowerCase()}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
          Referensi terminologi keamanan siber
        </p>
      </div>

      {/* Search + Filters */}
      <div style={{ padding: '14px 24px 0', flexShrink: 0 }}>
        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari istilah..."
            style={{
              width: '100%', padding: '9px 36px 9px 34px',
              background: 'var(--surface2)', border: '1px solid var(--border2)',
              borderRadius: '8px', color: 'var(--text-primary)',
              fontFamily: 'var(--mono)', fontSize: '13px', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}>
              <X size={12} color="var(--text-muted)" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingBottom: '14px' }}>
          {CATEGORIES.map(cat => {
            const active = activecat === cat.key;
            return (
              <button key={cat.key} onClick={() => setActivecat(cat.key)}
                style={{
                  padding: '4px 12px', borderRadius: '20px', border: `1px solid ${active ? cat.color : 'var(--border2)'}`,
                  background: active ? `${cat.color}18` : 'var(--surface2)',
                  color: active ? cat.color : 'var(--text-muted)',
                  fontFamily: 'var(--mono)', fontSize: '11px', cursor: 'pointer',
                  transition: 'all 0.15s', letterSpacing: '0.05em',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Term list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        {sortedLetters.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 16px', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🔍</span>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Tidak ada istilah yang cocok dengan pencarian.
            </p>
          </div>
        ) : (
          sortedLetters.map(letter => (
            <div key={letter}>
              {/* Letter header */}
              <div style={{
                fontFamily: 'var(--display)', fontSize: '11px', letterSpacing: '0.16em',
                color: '#00d4ff', padding: '10px 0 6px', opacity: 0.7,
                borderBottom: '1px solid var(--border)',
              }}>
                {letter}
              </div>

              {groups[letter].map(term => {
                const isOpen = expandedId === term.id;
                const color  = catColor(term.category);
                return (
                  <div key={term.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    {/* Row */}
                    <button onClick={() => toggle(term.id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '11px 4px', background: 'none', border: 'none', cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ flex: '0 0 auto', fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', minWidth: '0' }}>
                        {term.term}
                      </span>
                      <span style={{
                        flex: '0 0 auto', padding: '1px 7px', borderRadius: '4px', fontSize: '9px',
                        fontFamily: 'var(--mono)', letterSpacing: '0.06em', textTransform: 'uppercase',
                        background: `${color}18`, color, border: `1px solid ${color}44`,
                      }}>
                        {term.category}
                      </span>
                      <span style={{ flex: 1, fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {term.short}
                      </span>
                      <span style={{ flex: '0 0 auto', color: 'var(--text-muted)' }}>
                        {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </span>
                    </button>

                    {/* Expanded */}
                    {isOpen && (
                      <div style={{
                        padding: '0 4px 14px', animation: 'view-fade-in 0.18s ease-out',
                      }}>
                        <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
                          {term.desc}
                        </p>
                        {(term.related ?? []).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>LIHAT JUGA:</span>
                            {(term.related ?? []).map(relId => {
                              const rel = GLOSSARY.find(g => g.id === relId);
                              const attackIds = ['phishing','ransomware','sqli','ddos','mitm','xss','zero-day','social-engineering','credential-stuffing','csrf'];
                              return (
                                <button key={relId}
                                  onClick={e => { e.stopPropagation(); attackIds.includes(relId) && onSelectAttack?.(relId); }}
                                  style={{
                                    padding: '2px 9px', borderRadius: '4px', border: '1px solid var(--border2)',
                                    background: 'var(--surface3)', color: '#00d4ff',
                                    fontFamily: 'var(--mono)', fontSize: '11px', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                  }}
                                >
                                  {rel ? rel.term : relId}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
