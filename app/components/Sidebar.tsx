'use client';
import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, X } from 'lucide-react';
import { attacks, type Attack, type Severity } from '../data/attacks';
import { ATTACK_ICON_MAP } from '../lib/icons';

interface SidebarProps {
  selected: string | null;
  onSelect: (id: string) => void;
  search: string;
  onSearch: (s: string) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const severityColor: Record<string, string> = {
  CRITICAL: '#ff2d55', HIGH: '#ff7b2c', MEDIUM: '#e8c840', LOW: '#2dff8a',
};

const SEV_ITEMS: { sev: Severity; color: string }[] = [
  { sev: 'CRITICAL', color: '#ff0055' },
  { sev: 'HIGH',     color: '#ff7b2c' },
  { sev: 'MEDIUM',   color: '#ffc83d' },
  { sev: 'LOW',      color: '#2dff8a' },
];

function AttackItem({ attack, selected, onSelect }: { attack: Attack; selected: string | null; onSelect: (id: string) => void }) {
  const Icon       = ATTACK_ICON_MAP[attack.id];
  const isSelected = selected === attack.id;

  return (
    <button
      onClick={() => onSelect(attack.id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 10px', borderRadius: '8px', border: '1px solid',
        borderColor: isSelected ? 'rgba(0,212,255,0.22)' : 'transparent',
        background: isSelected ? 'rgba(0,212,255,0.07)' : 'transparent',
        cursor: 'pointer', textAlign: 'left', marginBottom: '3px', transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface2)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(2px)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(0)';
        }
      }}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
        background: isSelected ? 'rgba(0,212,255,0.12)' : 'var(--surface2)',
        border: `1px solid ${isSelected ? 'rgba(0,212,255,0.3)' : 'var(--border2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {Icon && <Icon size={15} color={isSelected ? '#00d4ff' : 'var(--text-secondary)'} strokeWidth={1.5} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '13px', fontWeight: 600, fontFamily: 'var(--mono)',
          color: isSelected ? '#00d4ff' : 'var(--text-primary)',
          marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {attack.name}
        </div>
        <div style={{
          fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {attack.shortDesc}
        </div>
      </div>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severityColor[attack.severity], flexShrink: 0 }} />
    </button>
  );
}

export default function Sidebar({ selected, onSelect, search, onSearch, isMobile, isOpen = true, onClose }: SidebarProps) {
  const [sevFilter, setSevFilter] = useState<Set<Severity>>(new Set());
  const toggleSev = (sev: Severity) => {
    setSevFilter(prev => {
      const next = new Set(prev);
      if (next.has(sev)) next.delete(sev); else next.add(sev);
      return next;
    });
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Attack[]>();
    for (const a of attacks) {
      if (!map.has(a.category)) map.set(a.category, []);
      map.get(a.category)!.push(a);
    }
    return map;
  }, []);

  const allCategories = useMemo(() => Array.from(grouped.keys()), [grouped]);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(allCategories));

  const toggle = (cat: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const isSearching = search.trim().length > 0;
  const q = search.toLowerCase();

  const filteredGrouped = useMemo(() => {
    const result = new Map<string, Attack[]>();
    for (const [cat, list] of grouped) {
      const matched = list.filter(a => {
        const matchSev    = sevFilter.size === 0 || sevFilter.has(a.severity);
        const matchSearch = !isSearching || a.name.toLowerCase().includes(q) || a.shortDesc.toLowerCase().includes(q);
        return matchSev && matchSearch;
      });
      if (matched.length > 0) result.set(cat, matched);
    }
    return result;
  }, [grouped, isSearching, q, sevFilter]);

  const totalVisible = useMemo(() => {
    let n = 0;
    for (const list of filteredGrouped.values()) n += list.length;
    return n;
  }, [filteredGrouped]);

  if (isMobile && !isOpen) return null;

  const sidebarStyle: React.CSSProperties = isMobile
    ? {
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: '290px', zIndex: 50, flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface)',
        animation: 'sidebar-slide-in 0.22s ease-out',
      }
    : {
        width: '268px', flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden',
        background: 'var(--surface)',
      };

  return (
    <aside style={sidebarStyle}>
      {/* Search */}
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
              <Search size={13} color="var(--text-muted)" />
            </span>
            <input
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Cari serangan..."
              style={{
                width: '100%', background: 'var(--surface2)',
                border: '1px solid var(--border2)', borderRadius: '8px',
                padding: '8px 12px 8px 30px',
                color: 'var(--text-primary)', fontFamily: 'var(--mono)',
                fontSize: '12px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {isMobile && (
            <button onClick={onClose} style={{
              width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <X size={14} color="var(--text-muted)" />
            </button>
          )}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', marginTop: '6px', letterSpacing: '0.06em' }}>
          {totalVisible} SERANGAN • {filteredGrouped.size} KATEGORI
        </div>
      </div>

      {/* Severity filter */}
      <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '5px', flexShrink: 0 }}>
        {SEV_ITEMS.map(({ sev, color }) => {
          const active = sevFilter.has(sev);
          return (
            <button key={sev} onClick={() => toggleSev(sev)} style={{
              flex: 1, padding: '5px 0', borderRadius: '6px', border: '1px solid',
              borderColor: active ? color : 'var(--border)',
              background: active ? `${color}18` : 'transparent',
              color: active ? color : 'var(--text-muted)',
              fontFamily: 'var(--mono)', fontSize: '9px', fontWeight: 700,
              letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.15s',
            }}>{sev.slice(0, 4)}</button>
          );
        })}
      </div>

      {/* Accordion list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
        {Array.from(filteredGrouped.entries()).map(([cat, list]) => {
          const catOpen = isSearching || expanded.has(cat);
          const col     = 'rgba(0,212,255,0.45)';

          return (
            <div key={cat} style={{ marginBottom: '6px' }}>
              {/* Category header */}
              <button
                onClick={() => !isSearching && toggle(cat)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 8px', borderRadius: '7px', border: 'none',
                  background: 'transparent', cursor: isSearching ? 'default' : 'pointer',
                  textAlign: 'left', transition: 'background 0.1s', marginBottom: '3px',
                }}
                onMouseEnter={e => { if (!isSearching) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: col, flexShrink: 0 }} />
                <span style={{
                  flex: 1, fontSize: '11px', fontFamily: 'var(--mono)', fontWeight: 700,
                  color: col, letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>
                  {cat}
                </span>
                <span style={{
                  fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--text-muted)',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: '4px', padding: '1px 6px',
                }}>
                  {list.length}
                </span>
                {!isSearching && (
                  catOpen
                    ? <ChevronDown  size={13} color="var(--text-muted)" />
                    : <ChevronRight size={13} color="var(--text-muted)" />
                )}
              </button>

              {/* Smooth accordion: always rendered, height animated */}
              <div style={{
                paddingLeft: '8px',
                maxHeight: catOpen ? '2000px' : '0',
                overflow: 'hidden',
                opacity: catOpen ? 1 : 0,
                transition: 'max-height 0.3s ease, opacity 0.2s ease',
              }}>
                {list.map(attack => (
                  <AttackItem key={attack.id} attack={attack} selected={selected} onSelect={onSelect} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
