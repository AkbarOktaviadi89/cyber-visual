'use client';
import { useState } from 'react';
import { Shield, ChevronRight, ChevronDown } from 'lucide-react';
import { CHAINS, type AttackChain } from '../data/chains';
import { attacks } from '../data/attacks';
import { ATTACK_ICON_MAP } from '../lib/icons';
import { useLang } from '../lib/language';

interface Props {
  onSelectAttack: (id: string) => void;
}

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#ff2d55',
  HIGH:     '#ff7b2c',
  MEDIUM:   '#e8c840',
};

export default function AttackChainView({ onSelectAttack }: Props) {
  const { t, lang } = useLang();
  const [selectedId, setSelectedId] = useState<string>(CHAINS[0].id);

  const chain = CHAINS.find(c => c.id === selectedId) ?? CHAINS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '18px', fontWeight: 700, color: '#ff7b2c', letterSpacing: '0.12em' }}>
            ATTACK CHAIN
          </h2>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            // {lang === 'id' ? 'Rantai Serangan Nyata' : 'Real-World Attack Chains'}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
          {lang === 'id' ? 'Pelajari bagaimana serangan nyata dirangkai step-by-step' : 'Learn how real attacks are chained step-by-step'}
        </p>
      </div>

      {/* Chain selector tabs */}
      <div style={{ display: 'flex', gap: '0', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid var(--border)', scrollbarWidth: 'none' }}>
        {CHAINS.map(c => {
          const active = c.id === selectedId;
          return (
            <button key={c.id} onClick={() => setSelectedId(c.id)}
              style={{
                flexShrink: 0, padding: '10px 18px',
                background: active ? `${c.color}12` : 'transparent',
                border: 'none', borderBottom: active ? `2px solid ${c.color}` : '2px solid transparent',
                color: active ? c.color : 'var(--text-muted)',
                fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: active ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Selected chain body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px' }}>

        {/* Chain meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: '16px', fontWeight: 700, color: chain.color, marginBottom: '6px' }}>
              {chain.name}
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Threat actor badge */}
              <span style={{
                padding: '3px 9px', borderRadius: '5px', fontFamily: 'var(--mono)', fontSize: '10px',
                background: `${chain.color}14`, color: chain.color, border: `1px solid ${chain.color}40`,
                letterSpacing: '0.05em',
              }}>
                {chain.threat}
              </span>
              {/* Severity badge */}
              <span style={{
                padding: '3px 9px', borderRadius: '5px', fontFamily: 'var(--mono)', fontSize: '10px',
                background: `${SEV_COLOR[chain.severity]}14`,
                color: SEV_COLOR[chain.severity],
                border: `1px solid ${SEV_COLOR[chain.severity]}40`,
                letterSpacing: '0.08em',
              }}>
                {chain.severity}
              </span>
            </div>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '720px' }}>
          {chain.desc}
        </p>

        {/* Step flow */}
        <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '0', minWidth: 'max-content' }}>
            {chain.steps.map((step, idx) => {
              const attack = attacks.find(a => a.id === step.attackId);
              const IconComp = ATTACK_ICON_MAP[step.attackId];
              const isLast = idx === chain.steps.length - 1;

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                  {/* Step card */}
                  <button
                    onClick={() => onSelectAttack(step.attackId)}
                    title={step.note}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      padding: '16px 14px', width: '140px', flexShrink: 0,
                      background: 'var(--surface)', border: `1px solid ${chain.color}40`,
                      borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                      transition: 'all 0.18s', position: 'relative',
                      boxShadow: `0 0 0 0 ${chain.color}00`,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = chain.color;
                      (e.currentTarget as HTMLButtonElement).style.background = `${chain.color}10`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${chain.color}40`;
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)';
                    }}
                  >
                    {/* Step number */}
                    <div style={{
                      position: 'absolute', top: '6px', left: '8px',
                      fontFamily: 'var(--mono)', fontSize: '9px', color: chain.color, opacity: 0.7,
                    }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {/* Phase label */}
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)',
                      letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px',
                    }}>
                      {step.phase}
                    </div>

                    {/* Icon */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: attack ? `${attack.bgColor}` : `${chain.color}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${chain.color}30`,
                    }}>
                      {IconComp
                        ? <IconComp size={20} color={attack?.color ?? chain.color} strokeWidth={1.5} />
                        : <Shield size={20} color={chain.color} strokeWidth={1.5} />
                      }
                    </div>

                    {/* Attack name */}
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
                      color: 'var(--text-primary)', lineHeight: 1.3,
                    }}>
                      {attack?.name ?? step.attackId}
                    </div>

                    {/* Note */}
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)',
                      lineHeight: 1.4, maxWidth: '110px',
                    }}>
                      {step.note.length > 50 ? step.note.slice(0, 50) + '…' : step.note}
                    </div>
                  </button>

                  {/* Arrow connector */}
                  {!isLast && (
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '0 4px', color: chain.color, opacity: 0.5, flexShrink: 0,
                    }}>
                      <ChevronRight size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '20px', padding: '12px 14px', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronDown size={12} color="var(--text-muted)" />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            {lang === 'id' ? 'Klik kartu untuk mempelajari detail serangan tersebut' : 'Click a card to learn about that attack in detail'}
          </span>
        </div>
      </div>
    </div>
  );
}
