'use client';
import { useState, useEffect, useMemo } from 'react';
import { CheckSquare, Square, Shield, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { attacks } from '../data/attacks';
import { useLang } from '../lib/language';

interface Props { onSelectAttack?: (id: string) => void; }

export default function DefenseChecklist({ onSelectAttack }: Props) {
  const { lang } = useLang();

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cyber-viz-checklist');
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleCheck = (key: string) => {
    setChecked(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem('cyber-viz-checklist', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalDefenses = attacks.reduce((sum, a) => sum + a.defenses.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const score = totalDefenses > 0 ? Math.round((checkedCount / totalDefenses) * 100) : 0;

  const scoreColor = score >= 80 ? '#2dff8a' : score >= 60 ? '#e8c840' : score >= 30 ? '#ff7b2c' : '#ff2d55';

  const scoreLabel = score >= 80
    ? 'EXCELLENT'
    : score >= 60
    ? 'BAIK'
    : score >= 30
    ? 'PERLU PERHATIAN'
    : 'KRITIS';

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(attacks.map(a => a.category)))],
    []
  );

  const filteredAttacks = filterCategory === 'all'
    ? attacks
    : attacks.filter(a => a.category === filterCategory);

  const severityColor = (s: string) => {
    if (s === 'CRITICAL') return '#ff2d55';
    if (s === 'HIGH') return '#ff7b2c';
    if (s === 'MEDIUM') return '#e8c840';
    return '#2dff8a';
  };

  const handleReset = () => {
    if (window.confirm('Reset semua checklist? Progres tidak bisa dikembalikan.')) {
      setChecked({});
      try { localStorage.removeItem('cyber-viz-checklist'); } catch {}
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: '24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 4,
        }}>
          <Shield size={18} color="#2dff8a" />
          <span style={{
            fontFamily: 'var(--display)',
            fontSize: 18,
            fontWeight: 700,
            color: '#2dff8a',
            letterSpacing: '0.08em',
          }}>
            DEFENSE CHECKLIST
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Pantau implementasi pertahanan di organisasi Anda
        </div>
      </div>

      {/* Score panel */}
      <div style={{
        flexShrink: 0,
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Circle */}
          <div style={{
            width: 80,
            height: 80,
            border: `3px solid ${scoreColor}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'var(--display)',
              fontSize: 22,
              fontWeight: 700,
              color: scoreColor,
            }}>{score}%</span>
          </div>

          {/* Score details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              SECURITY POSTURE SCORE
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span style={{ color: scoreColor, fontWeight: 600 }}>{checkedCount}</span>
              {' / '}{totalDefenses} pertahanan diimplementasikan
            </div>
            {/* Progress bar */}
            <div style={{
              height: 6,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.08)',
              marginBottom: 6,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 3,
                width: `${score}%`,
                background: scoreColor,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: scoreColor,
              letterSpacing: '0.1em',
            }}>
              {scoreLabel}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 10px',
              background: 'transparent',
              border: '1px solid var(--border2)',
              borderRadius: 6,
              color: 'var(--text-muted)',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={12} />
            Reset Semua
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div style={{
        flexShrink: 0,
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
      }}>
        {categories.map(cat => {
          const isActive = filterCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                border: isActive
                  ? '1px solid #2dff8a'
                  : '1px solid var(--border2)',
                background: isActive
                  ? 'rgba(45,255,138,0.08)'
                  : 'var(--surface2)',
                color: isActive ? '#2dff8a' : 'var(--text-secondary)',
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          );
        })}
      </div>

      {/* Scroll area */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 24px' }}>
        {filteredAttacks.map(attack => {
          const attackChecked = attack.defenses.filter((_, i) => checked[`${attack.id}:${i}`]).length;
          const attackTotal = attack.defenses.length;
          const attackPct = attackTotal > 0 ? Math.round((attackChecked / attackTotal) * 100) : 0;
          const isExpanded = expandedIds.has(attack.id);
          const sColor = severityColor(attack.severity);

          return (
            <div
              key={attack.id}
              style={{
                flexShrink: 0,
                marginBottom: 8,
                border: '1px solid var(--border)',
                borderRadius: 8,
                overflow: 'hidden',
                background: 'var(--surface)',
              }}
            >
              {/* Attack row */}
              <button
                onClick={() => toggleExpand(attack.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {/* Chevron */}
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  {isExpanded
                    ? <ChevronDown size={14} />
                    : <ChevronRight size={14} />
                  }
                </span>

                {/* Name */}
                <span style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {attack.name}
                </span>

                {/* Severity badge */}
                <span style={{
                  flexShrink: 0,
                  padding: '2px 7px',
                  borderRadius: 4,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: sColor,
                  border: `1px solid ${sColor}`,
                  background: `${sColor}18`,
                }}>
                  {attack.severity}
                </span>

                {/* Mini progress bar */}
                <div style={{
                  flexShrink: 0,
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    borderRadius: 2,
                    width: `${attackPct}%`,
                    background: attackPct === 100 ? '#2dff8a' : '#00d4ff',
                  }} />
                </div>

                {/* Count */}
                <span style={{
                  flexShrink: 0,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--mono)',
                }}>
                  {attackChecked}/{attackTotal}
                </span>
              </button>

              {/* Defense items */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  {attack.defenses.map((defense, i) => {
                    const key = `${attack.id}:${i}`;
                    const isChecked = !!checked[key];
                    return (
                      <div
                        key={i}
                        onClick={() => toggleCheck(key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 14px',
                          cursor: 'pointer',
                          borderBottom: i < attack.defenses.length - 1
                            ? '1px solid rgba(255,255,255,0.04)'
                            : 'none',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.background = 'var(--surface2)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                        }}
                      >
                        {/* Checkbox */}
                        <div style={{
                          flexShrink: 0,
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isChecked ? '#2dff8a' : 'transparent',
                          border: isChecked ? '2px solid #2dff8a' : '2px solid var(--border2)',
                          transition: 'all 0.15s ease',
                        }}>
                          {isChecked && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="#060810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>

                        {/* Defense text */}
                        <span style={{
                          fontSize: 13,
                          color: isChecked ? 'var(--text-muted)' : 'var(--text-secondary)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          flex: 1,
                        }}>
                          {defense}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
