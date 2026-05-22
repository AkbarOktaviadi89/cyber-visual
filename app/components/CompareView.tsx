'use client';
import { useState } from 'react';
import { attacks } from '../data/attacks';
import { ATTACK_ICON_MAP, STEP_ICON_MAP } from '../lib/icons';

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#ff0055', HIGH: '#ff7b2c', MEDIUM: '#ffc83d', LOW: '#2dff8a',
};
const SEV_SCORE: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

function AttackColumn({ attackId, onChangeId }: { attackId: string; onChangeId: (id: string) => void }) {
  const attack = attacks.find(a => a.id === attackId)!;
  const Icon   = ATTACK_ICON_MAP[attackId];

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Dropdown */}
      <select
        value={attackId}
        onChange={e => onChangeId(e.target.value)}
        style={{
          width: '100%', background: 'var(--surface2)',
          border: `1px solid ${attack.borderColor}`,
          borderRadius: '8px', padding: '8px 12px', color: attack.color,
          fontFamily: 'var(--mono)', fontSize: '14px', outline: 'none', cursor: 'pointer',
        }}>
        {attacks.map(a => (
          <option key={a.id} value={a.id} style={{ background: '#0d1017', color: '#e8ecf5' }}>
            {a.name}
          </option>
        ))}
      </select>

      {/* Identity */}
      <div style={{ background: attack.bgColor, border: `1px solid ${attack.borderColor}`, borderRadius: '12px', padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: attack.bgColor, border: `1px solid ${attack.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {Icon && <Icon size={18} color={attack.color} strokeWidth={1.5} />}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, color: attack.color }}>{attack.name}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{attack.category}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '3px', background: `${SEV_COLOR[attack.severity]}18`, border: `1px solid ${SEV_COLOR[attack.severity]}55`, color: SEV_COLOR[attack.severity], fontFamily: 'var(--mono)', fontWeight: 700 }}>
            {attack.severity}
          </span>
          {attack.tags.map(t => (
            <span key={t} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Impact */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '10px' }}>IMPACT</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {attack.impact.map((imp, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: '6px', background: attack.bgColor }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 700, color: attack.color }}>{imp.value}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{imp.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '10px' }}>
          ATTACK FLOW — {attack.steps.length} STEPS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {attack.steps.map((s, i) => {
            const StepIcon = STEP_ICON_MAP[s.icon];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', background: 'var(--surface2)' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', width: '14px', textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                {StepIcon && <StepIcon size={10} color={attack.color} strokeWidth={1.5} />}
                <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-primary)' }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defenses */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '10px' }}>
          DEFENSES — {attack.defenses.length}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {attack.defenses.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 8px', borderRadius: '5px', background: `${attack.color}0d`, border: `1px solid ${attack.color}1a` }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: attack.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CompareView() {
  const [idA, setIdA] = useState(attacks[0].id);
  const [idB, setIdB] = useState(attacks[1].id);

  const attackA = attacks.find(a => a.id === idA)!;
  const attackB = attacks.find(a => a.id === idB)!;

  const metrics = [
    {
      label: 'SEVERITY',
      a: SEV_SCORE[attackA.severity], b: SEV_SCORE[attackB.severity], max: 4,
      fmt: (v: number) => Object.entries(SEV_SCORE).find(([, s]) => s === v)?.[0] ?? '',
    },
    {
      label: 'STEPS',
      a: attackA.steps.length, b: attackB.steps.length,
      max: Math.max(attackA.steps.length, attackB.steps.length, 1),
      fmt: (v: number) => `${v} steps`,
    },
    {
      label: 'DEFENSES',
      a: attackA.defenses.length, b: attackB.defenses.length,
      max: Math.max(attackA.defenses.length, attackB.defenses.length, 1),
      fmt: (v: number) => `${v}`,
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* Title */}
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px' }}>// COMPARE ATTACKS</div>
        <div style={{ fontFamily: 'var(--display)', fontSize: '20px', fontWeight: 800, color: '#e8ecf5', letterSpacing: '0.05em' }}>
          ATTACK <span style={{ color: '#00d4ff' }}>COMPARISON</span>
        </div>
      </div>

      {/* VS metrics */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {metrics.map(m => (
          <div key={m.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: attackA.color, fontWeight: 700 }}>{m.fmt(m.a)}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{m.label}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: attackB.color, fontWeight: 700 }}>{m.fmt(m.b)}</span>
            </div>
            <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', gap: '3px' }}>
              <div style={{ flex: m.a / m.max, background: attackA.color, borderRadius: '3px 0 0 3px', opacity: 0.75 }} />
              <div style={{ flex: 1 - m.a / m.max, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ width: '3px', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
              <div style={{ flex: 1 - m.b / m.max, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ flex: m.b / m.max, background: attackB.color, borderRadius: '0 3px 3px 0', opacity: 0.75 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <AttackColumn attackId={idA} onChangeId={setIdA} />

        {/* VS divider */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '44px', flexShrink: 0 }}>
          <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />
          <div style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.12em', padding: '6px 0' }}>VS</div>
          <div style={{ width: '1px', height: '100px', background: 'var(--border)' }} />
        </div>

        <AttackColumn attackId={idB} onChangeId={setIdB} />
      </div>
    </div>
  );
}
