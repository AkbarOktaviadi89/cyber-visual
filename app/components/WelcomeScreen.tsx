'use client';
import { Shield, TriangleAlert } from 'lucide-react';
import { attacks } from '../data/attacks';
import { ATTACK_ICON_MAP } from '../lib/icons';

const severityColor: Record<string, string> = {
  CRITICAL: '#ff0055', HIGH: '#ff7b2c', MEDIUM: '#ffc83d', LOW: '#2dff8a',
};

export default function WelcomeScreen({ onSelect }: { onSelect: (id: string) => void }) {
  const criticalAttacks = attacks.filter(a => a.severity === 'CRITICAL');
  const categoryCount   = new Set(attacks.map(a => a.category)).size;
  const stats = [
    { label: 'JENIS SERANGAN', value: attacks.length.toString(), sub: 'dalam database' },
    { label: 'STEP TOTAL', value: attacks.reduce((s, a) => s + a.steps.length, 0).toString(), sub: 'langkah detail' },
    { label: 'KATEGORI', value: categoryCount.toString(), sub: 'tipe serangan' },
    { label: 'CRITICAL', value: criticalAttacks.length.toString(), sub: 'ancaman tertinggi' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={36} color="#00d4ff" strokeWidth={1.5} />
          </div>
        </div>
        <h1 style={{
          fontFamily: 'var(--display)', fontSize: '32px', fontWeight: 900,
          color: 'var(--text-primary)', letterSpacing: '0.05em', marginBottom: '10px',
        }}>
          CYBER<span style={{ color: '#00d4ff' }}>THREAT</span> INTEL
        </h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto' }}>
          Platform visualisasi serangan siber interaktif. Pilih serangan dari sidebar untuk mempelajari mekanisme, step-by-step flow, dan cara bertahan.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 800, color: '#00d4ff', marginBottom: '6px' }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#00d4ff', letterSpacing: '0.1em', marginBottom: '3px' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Critical threats */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--mono)', fontSize: '11px', color: '#ff0055', letterSpacing: '0.1em', marginBottom: '14px' }}>
          <TriangleAlert size={13} color="#ff0055" strokeWidth={2} />
          ANCAMAN CRITICAL — PRIORITAS TERTINGGI
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '12px' }}>
          {criticalAttacks.map(a => {
            const Icon = ATTACK_ICON_MAP[a.id];
            return (
              <button key={a.id} onClick={() => onSelect(a.id)} style={{
                textAlign: 'left', background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.18)',
                borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(255,45,85,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ marginBottom: '12px' }}>
                  {Icon && <Icon size={26} color="#ff2d55" strokeWidth={1.5} />}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, color: '#ff2d55', marginBottom: '6px' }}>{a.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{a.shortDesc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* All attacks grid */}
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '14px' }}>
          // SEMUA SERANGAN — KLIK UNTUK PELAJARI
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
          {attacks.map(a => {
            const Icon = ATTACK_ICON_MAP[a.id];
            return (
              <button key={a.id} onClick={() => onSelect(a.id)} style={{
                textAlign: 'left', background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '14px', cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface2)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: 'var(--surface2)', border: '1px solid var(--border2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {Icon && <Icon size={20} color="var(--text-secondary)" strokeWidth={1.5} />}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{a.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: severityColor[a.severity] }}>{a.severity}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
