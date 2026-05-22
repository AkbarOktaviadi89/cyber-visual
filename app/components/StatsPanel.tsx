'use client';
import { useMemo, useState, useEffect } from 'react';
import { attacks } from '../data/attacks';
import { ATTACK_ICON_MAP } from '../lib/icons';

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0);
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

const SEV_ORDER  = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#ff0055', HIGH: '#ff7b2c', MEDIUM: '#ffc83d', LOW: '#2dff8a',
};
const SEV_SCORE: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
const CAT_COLOR: Record<string, string> = {
  'Social Engineering': '#ffc83d', 'Malware': '#ff4444', 'Web Attack': '#4d94ff',
  'Network Attack': '#2dff8a', 'Cryptography': '#a78bfa', 'Physical': '#fb923c',
  'Insider Threat': '#f87171', 'AI-Powered': '#a855f7', 'Cloud Security': '#60a5fa',
  'Mobile': '#34d399', 'IoT': '#f59e0b',
};

// Donut chart via stroke-dasharray
function DonutChart({ data }: { data: { label: string; color: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const R = 68, CX = 96, CY = 96;
  const circ = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg width="192" height="192" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
      {data.map((d, i) => {
        const dash   = (d.count / total) * circ;
        const offset = (acc / total) * circ;
        acc += d.count;
        if (dash < 0.5) return null;
        return (
          <circle key={i} cx={CX} cy={CY} r={R} fill="none"
            stroke={d.color} strokeWidth="18" opacity="0.85"
            strokeDasharray={`${dash - 1.5} ${circ - dash + 1.5}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px` }} />
        );
      })}
      <text x={CX} y={CY - 8} textAnchor="middle" fontSize="26"
        fontFamily="var(--display)" fontWeight="800" fill="#e8ecf5">{total}</text>
      <text x={CX} y={CY + 12} textAnchor="middle" fontSize="8.5"
        fontFamily="var(--mono)" fill="var(--text-muted)" letterSpacing="0.1">ATTACKS</text>
    </svg>
  );
}

function StatCard({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const displayed = useCountUp(value, 1000 + delay);
  return (
    <div style={{
      background: 'var(--surface)', border: `1px solid ${color}22`,
      borderRadius: '10px', padding: '16px', textAlign: 'center',
      animation: `count-up-in 0.5s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms both`,
    }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: '32px', fontWeight: 800, color }}>{displayed}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color, letterSpacing: '0.1em', marginTop: '4px', opacity: 0.7 }}>{label}</div>
    </div>
  );
}

export default function StatsPanel({ onSelectAttack }: { onSelectAttack: (id: string) => void }) {
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of attacks) map.set(a.category, (map.get(a.category) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count, color: CAT_COLOR[label] ?? '#00d4ff' }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const severityData = useMemo(() =>
    SEV_ORDER.map(sev => {
      const count = attacks.filter(a => a.severity === sev).length;
      return { label: sev, count, color: SEV_COLOR[sev] };
    }), []);

  const maxCat = Math.max(...categoryData.map(d => d.count), 1);
  const totalSteps   = attacks.reduce((s, a) => s + a.steps.length, 0);
  const criticalCount = attacks.filter(a => a.severity === 'CRITICAL').length;

  const ranked = useMemo(() =>
    [...attacks]
      .sort((a, b) => {
        const sd = SEV_SCORE[b.severity] - SEV_SCORE[a.severity];
        return sd !== 0 ? sd : b.steps.length - a.steps.length;
      })
      .slice(0, 10), []);

  const maxSteps = Math.max(...attacks.map(a => a.steps.length), 1);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* Title */}
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>// THREAT STATISTICS</div>
        <div style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 800, color: '#e8ecf5', letterSpacing: '0.05em' }}>
          DATABASE <span style={{ color: '#00d4ff' }}>OVERVIEW</span>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {[
          { label: 'TOTAL ATTACKS',  value: attacks.length,     color: '#00d4ff', delay: 0   },
          { label: 'TOTAL STEPS',    value: totalSteps,          color: '#2dff8a', delay: 100 },
          { label: 'CATEGORIES',     value: categoryData.length, color: '#a855f7', delay: 200 },
          { label: 'CRITICAL',       value: criticalCount,       color: '#ff0055', delay: 300 },
        ].map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} color={s.color} delay={s.delay} />
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

        {/* Category bars */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>// BY CATEGORY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {categoryData.map(d => (
              <div key={d.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: d.color }}>{d.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>{d.count}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: d.color, width: `${(d.count / maxCat) * 100}%`, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity donut */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>// BY SEVERITY</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <DonutChart data={severityData} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {severityData.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '2px', background: d.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: d.color, fontWeight: 700, letterSpacing: '0.06em' }}>{d.label}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700 }}>{d.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ranking */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>// MOST DANGEROUS ATTACKS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ranked.map((a, i) => {
            const Icon = ATTACK_ICON_MAP[a.id];
            return (
              <button
                key={a.id}
                onClick={() => onSelectAttack(a.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '8px', border: '1px solid',
                  borderColor: i === 0 ? a.borderColor : 'transparent',
                  background: i === 0 ? `${a.color}0d` : 'transparent',
                  cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (i !== 0) { (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; } }}
                onMouseLeave={e => { if (i !== 0) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; } }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)', width: '22px', textAlign: 'right', flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: a.bgColor, border: `1px solid ${a.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {Icon && <Icon size={13} color={a.color} strokeWidth={1.5} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: a.color, width: `${(a.steps.length / maxSteps) * 100}%` }} />
                  </div>
                </div>
                <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '3px', background: `${SEV_COLOR[a.severity]}18`, border: `1px solid ${SEV_COLOR[a.severity]}44`, color: SEV_COLOR[a.severity], fontFamily: 'var(--mono)', fontWeight: 700, flexShrink: 0 }}>
                  {a.severity}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', width: '48px', textAlign: 'right', flexShrink: 0 }}>
                  {a.steps.length} steps
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
