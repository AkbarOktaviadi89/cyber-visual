'use client';
import { useState } from 'react';
import { Clock, Calendar, TrendingUp, ChevronDown } from 'lucide-react';
import { ATTACK_TIMINGS, type AttackTiming } from '../data/timeline';
import { attacks } from '../data/attacks';
import { useLang } from '../lib/language';

interface Props { onSelectAttack?: (id: string) => void; }

type Tab = 'hourly' | 'daily' | 'monthly';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

function cellBg(value: number): string {
  return `rgba(0,212,255,${(value / 100) * 0.85 + 0.04})`;
}

function cellBorder(value: number): string {
  return `1px solid rgba(0,212,255,${(value / 100) * 0.3 + 0.05})`;
}

export default function TimelineHeatmap({ onSelectAttack }: Props) {
  const { lang } = useLang();

  const [activeTab, setActiveTab] = useState<Tab>('hourly');
  const [selectedAttackId, setSelectedAttackId] = useState<string>(
    ATTACK_TIMINGS[0]?.attackId ?? ''
  );

  const timing: AttackTiming | undefined = ATTACK_TIMINGS.find(t => t.attackId === selectedAttackId);
  const attackName = attacks.find(a => a.id === selectedAttackId)?.name ?? selectedAttackId;

  const activeData: number[] = timing
    ? activeTab === 'hourly'
      ? timing.hourly
      : activeTab === 'daily'
      ? timing.daily
      : timing.monthly
    : [];

  const maxVal = activeData.length > 0 ? Math.max(...activeData, 1) : 1;

  const peakHour = timing ? timing.hourly.indexOf(Math.max(...timing.hourly)) : 0;
  const peakDay = timing ? timing.daily.indexOf(Math.max(...timing.daily)) : 0;
  const peakMonth = timing ? timing.monthly.indexOf(Math.max(...timing.monthly)) : 0;

  const tabSectionTitle =
    activeTab === 'hourly' ? '24 JAM' :
    activeTab === 'daily' ? '7 HARI' : '12 BULAN';

  const tabs: { key: Tab; label: string }[] = [
    { key: 'hourly', label: 'HOURLY' },
    { key: 'daily', label: 'DAILY' },
    { key: 'monthly', label: 'MONTHLY' },
  ];

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: '24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(0,212,255,0.1)',
          border: '1px solid rgba(0,212,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Clock size={18} color="#00d4ff" strokeWidth={1.5} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--display)',
            fontSize: 18,
            fontWeight: 800,
            color: '#00d4ff',
            letterSpacing: '0.12em',
            marginBottom: 4,
          }}>
            ATTACK TIMELINE
          </div>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: 12,
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            // Pola waktu aktivitas serangan berdasarkan threat intelligence
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        flexShrink: 0,
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {/* Attack selector */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            value={selectedAttackId}
            onChange={e => setSelectedAttackId(e.target.value)}
            style={{
              appearance: 'none',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '7px 34px 7px 12px',
              fontFamily: 'var(--mono)',
              fontSize: 12,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none',
              minWidth: 200,
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { (e.currentTarget as HTMLSelectElement).style.borderColor = '#00d4ff'; }}
            onBlur={e => { (e.currentTarget as HTMLSelectElement).style.borderColor = 'var(--border)'; }}
          >
            {ATTACK_TIMINGS.map(t => {
              const name = attacks.find(a => a.id === t.attackId)?.name ?? t.attackId;
              return (
                <option key={t.attackId} value={t.attackId}>{name}</option>
              );
            })}
          </select>
          <ChevronDown
            size={14}
            color="var(--text-muted)"
            strokeWidth={1.5}
            style={{ position: 'absolute', right: 10, pointerEvents: 'none' }}
          />
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: activeTab === tab.key
                  ? '1px solid #00d4ff'
                  : '1px solid var(--border)',
                background: activeTab === tab.key
                  ? 'rgba(0,212,255,0.1)'
                  : 'transparent',
                color: activeTab === tab.key ? '#00d4ff' : 'var(--text-muted)',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px' }}>

        {/* Heatmap section */}
        <div style={{ flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: 'rgba(0,212,255,0.6)',
            letterSpacing: '0.12em',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <Calendar size={12} strokeWidth={1.5} color="rgba(0,212,255,0.6)" />
            {tabSectionTitle}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {activeData.map((value, i) => {
              const label =
                activeTab === 'hourly'
                  ? String(i).padStart(2, '0')
                  : activeTab === 'daily'
                  ? DAY_LABELS[i]
                  : MONTH_LABELS[i];

              const titleAttr =
                activeTab === 'hourly'
                  ? `${String(i).padStart(2, '0')}:00 — ${value}% frequency`
                  : activeTab === 'daily'
                  ? `${DAY_NAMES[i]} — ${value}% frequency`
                  : `${MONTH_NAMES[i]} — ${value}% frequency`;

              const cellWidth =
                activeTab === 'hourly' ? 34 :
                activeTab === 'daily' ? 110 : 65;

              return (
                <div
                  key={i}
                  title={titleAttr}
                  style={{
                    width: cellWidth,
                    height: 64,
                    borderRadius: 4,
                    background: cellBg(value),
                    border: cellBorder(value),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: 6,
                    cursor: 'default',
                    transition: 'transform 0.1s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
                >
                  <div style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ flexShrink: 0, marginTop: 24 }}>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: 'rgba(0,212,255,0.6)',
            letterSpacing: '0.12em',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <TrendingUp size={12} strokeWidth={1.5} color="rgba(0,212,255,0.6)" />
            DISTRIBUSI FREKUENSI
          </div>

          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {activeData.map((value, i) => {
              const label =
                activeTab === 'hourly'
                  ? String(i).padStart(2, '0')
                  : activeTab === 'daily'
                  ? DAY_LABELS[i]
                  : MONTH_LABELS[i];

              return (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}
                >
                  <div style={{
                    width: 40,
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {label}
                  </div>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 3,
                      background: 'rgba(0,212,255,0.7)',
                      width: `${(value / maxVal) * 100}%`,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{
                    width: 36,
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    color: '#00d4ff',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak info cards */}
        <div style={{ flexShrink: 0, marginTop: 20, display: 'flex', gap: 12 }}>
          {[
            {
              label: 'PEAK HOUR',
              value: `${String(peakHour).padStart(2, '0')}:00`,
              icon: <Clock size={14} color="rgba(0,212,255,0.5)" strokeWidth={1.5} />,
            },
            {
              label: 'PEAK DAY',
              value: DAY_NAMES[peakDay],
              icon: <Calendar size={14} color="rgba(0,212,255,0.5)" strokeWidth={1.5} />,
            },
            {
              label: 'PEAK MONTH',
              value: MONTH_NAMES[peakMonth],
              icon: <TrendingUp size={14} color="rgba(0,212,255,0.5)" strokeWidth={1.5} />,
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: 14,
                background: 'var(--surface)',
                border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: 10,
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                {card.icon}
              </div>
              <div style={{
                fontFamily: 'var(--mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginBottom: 6,
              }}>
                {card.label}
              </div>
              <div style={{
                fontFamily: 'var(--display)',
                fontSize: 20,
                fontWeight: 800,
                color: '#00d4ff',
                letterSpacing: '0.04em',
                lineHeight: 1.1,
              }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
