'use client';
import { useMemo } from 'react';
import { Printer } from 'lucide-react';
import { attacks } from '../data/attacks';
import { ATTACK_ICON_MAP } from '../lib/icons';

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#ff0055', HIGH: '#ff7b2c', MEDIUM: '#ffc83d', LOW: '#2dff8a',
};
const CAT_COLOR: Record<string, string> = {
  'Social Engineering': '#ffc83d', 'Malware': '#ff4444', 'Web Attack': '#4d94ff',
  'Network Attack': '#2dff8a', 'Cryptography': '#a78bfa', 'Physical': '#fb923c',
  'Insider Threat': '#f87171', 'AI-Powered': '#a855f7', 'Cloud Security': '#60a5fa',
  'Mobile': '#34d399', 'IoT': '#f59e0b',
};

export default function CheatSheet({ onSelectAttack }: { onSelectAttack: (id: string) => void }) {
  const grouped = useMemo(() => {
    const map = new Map<string, typeof attacks>();
    for (const a of attacks) {
      if (!map.has(a.category)) map.set(a.category, []);
      map.get(a.category)!.push(a);
    }
    return map;
  }, []);

  const totalDefenses = attacks.reduce((s, a) => s + a.defenses.length, 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      <style>{`
        @media print {
          body, html { background: white !important; }
          header, aside { display: none !important; }
          .cheatsheet-root { padding: 16px !important; color: black !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="cheatsheet-root">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>// QUICK REFERENCE</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 800, color: '#e8ecf5', letterSpacing: '0.05em' }}>
              CYBER ATTACK <span style={{ color: '#00d4ff' }}>CHEAT SHEET</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
              {attacks.length} attack types · {totalDefenses} defense measures across {grouped.size} categories
            </div>
          </div>
          <button
            className="no-print"
            onClick={() => window.print()}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px', borderRadius: '8px', flexShrink: 0,
              border: '1px solid var(--border2)', background: 'var(--surface2)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontFamily: 'var(--mono)', fontSize: '13px', letterSpacing: '0.06em',
            }}>
            <Printer size={13} />
            PRINT / PDF
          </button>
        </div>

        {/* Categories */}
        {Array.from(grouped.entries()).map(([cat, list]) => {
          const col = CAT_COLOR[cat] ?? '#00d4ff';
          return (
            <div key={cat} style={{ marginBottom: '36px' }}>
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: `1px solid ${col}33`, marginBottom: '14px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: col, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 700, color: col, letterSpacing: '0.08em' }}>
                  {cat.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>({list.length} attacks)</span>
              </div>

              {/* Attack cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
                {list.map(a => {
                  const Icon = ATTACK_ICON_MAP[a.id];
                  return (
                    <button
                      key={a.id}
                      onClick={() => onSelectAttack(a.id)}
                      style={{
                        background: 'var(--surface)', border: `1px solid ${a.borderColor}`,
                        borderRadius: '10px', padding: '14px', textAlign: 'left',
                        cursor: 'pointer', transition: 'all 0.15s', width: '100%',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = a.bgColor; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: a.bgColor, border: `1px solid ${a.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {Icon && <Icon size={13} color={a.color} strokeWidth={1.5} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, color: a.color }}>{a.name}</div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '3px' }}>
                            <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '3px', background: `${SEV_COLOR[a.severity]}18`, border: `1px solid ${SEV_COLOR[a.severity]}44`, color: SEV_COLOR[a.severity], fontFamily: 'var(--mono)', fontWeight: 700 }}>{a.severity}</span>
                            {a.tags.map(t => (
                              <span key={t} style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 10px' }}>
                        {a.shortDesc}
                      </p>

                      <div style={{ fontSize: '10px', color: a.color, fontFamily: 'var(--mono)', letterSpacing: '0.08em', marginBottom: '5px', fontWeight: 700 }}>DEFENSES</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {a.defenses.map(d => (
                          <span key={d} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '3px', background: `${a.color}0d`, border: `1px solid ${a.color}22`, color: 'var(--text-secondary)', fontFamily: 'var(--mono)' }}>{d}</span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
