'use client';
import { useState, useEffect, useRef } from 'react';
import type { ElementType } from 'react';
import {
  X, Play, ChevronRight, Terminal as TermIcon,
  Monitor, Server, Database, Wifi, Shield, Eye, AlertTriangle,
} from 'lucide-react';
import type { Attack } from '../data/attacks';
import { ATTACK_ICON_MAP } from '../lib/icons';
import { useLang } from '../lib/language';

// ── Types ─────────────────────────────────────────────────────────────────────
interface TermLine {
  text: string;
  type: 'cmd' | 'output' | 'header' | 'warn' | 'success';
}
interface Props { attack: Attack; onClose: () => void; }
type NodeState = 'idle' | 'active' | 'compromised';

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseCode(code: string): TermLine[] {
  return code.split('\n').map(line => {
    if (line.startsWith('> ') || line.startsWith('$ ')) return { text: line, type: 'cmd' };
    if (line.toUpperCase() === line && line.length > 3 && /[A-Z]/.test(line))
      return { text: line, type: line.includes('SUCCESS') || line.includes('✓') ? 'success' : line.includes('WARN') || line.includes('!') ? 'warn' : 'output' };
    return { text: line, type: 'output' };
  });
}
const LINE_COLOR: Record<TermLine['type'], string> = {
  cmd: '#00d4ff', output: '#a8ff78', header: '#ffc83d', warn: '#ff7b2c', success: '#2dff8a',
};
function detectionRisk(phase: number, total: number) {
  const p = phase / Math.max(total - 1, 1);
  if (p < 0.25) return { label: 'MINIMAL', color: '#2dff8a' };
  if (p < 0.5)  return { label: 'LOW',     color: '#a8ff78' };
  if (p < 0.75) return { label: 'MEDIUM',  color: '#e8c840' };
  return                 { label: 'HIGH',   color: '#ff7b2c' };
}

// ── Sub-components ────────────────────────────────────────────────────────────
function DiagramNode({ icon: Icon, label, sub, color, state }: {
  icon: ElementType; label: string; sub?: string; color: string; state: NodeState;
}) {
  const glow = state === 'compromised' ? `0 0 18px ${color}50` : state === 'active' ? `0 0 8px ${color}28` : 'none';
  return (
    <div style={{
      width: '86px', height: '86px', borderRadius: '14px', flexShrink: 0,
      background: state === 'idle' ? 'rgba(255,255,255,0.03)' : `${color}12`,
      border: `1px solid ${state === 'idle' ? 'rgba(255,255,255,0.08)' : state === 'compromised' ? color : `${color}55`}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
      transition: 'all 0.5s ease', boxShadow: glow, position: 'relative',
    }}>
      <Icon size={24} color={state === 'idle' ? 'rgba(255,255,255,0.2)' : color} strokeWidth={1.4} />
      <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.1em', color: state === 'idle' ? 'rgba(255,255,255,0.2)' : color, textAlign: 'center' }}>{label}</div>
      {sub && <div style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>{sub}</div>}
      {state === 'compromised' && (
        <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '16px', height: '16px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={9} color="#000" />
        </div>
      )}
      {state === 'active' && (
        <div style={{ position: 'absolute', top: '-5px', right: '-5px', width: '10px', height: '10px', borderRadius: '50%', background: color, animation: 'pulse-dot 1.2s infinite' }} />
      )}
    </div>
  );
}

function ConnArrow({ color, active }: { color: string; active: boolean }) {
  return (
    <div style={{ position: 'relative', width: '72px', height: '2px', background: active ? `${color}30` : 'rgba(255,255,255,0.06)', flexShrink: 0, margin: '0 2px', transition: 'background 0.4s' }}>
      {/* arrowhead */}
      <div style={{ position: 'absolute', right: '-1px', top: '50%', transform: 'translateY(-50%)',
        borderLeft: `7px solid ${active ? color : 'rgba(255,255,255,0.06)'}`,
        borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
        transition: 'border-color 0.4s',
      }} />
      {/* traveling packet */}
      {active && (
        <div style={{
          position: 'absolute', top: '50%', width: '8px', height: '8px', borderRadius: '50%',
          background: color, boxShadow: `0 0 6px ${color}`,
          transform: 'translateY(-50%)',
          animation: 'packet-travel 1.6s ease-in-out infinite',
        }} />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SimulationTerminal({ attack, onClose }: Props) {
  const { t } = useLang();
  const [phase,     setPhase]     = useState(-1);
  const [history,   setHistory]   = useState<TermLine[]>([]);
  const [typing,    setTyping]    = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const [waitInput, setWaitInput] = useState(false);
  const [nodes,     setNodes]     = useState<{ net: NodeState; target: NodeState; db: NodeState }>({ net: 'idle', target: 'idle', db: 'idle' });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && waitInput && !isTyping) handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitInput, isTyping, phase]);

  const addLine = (line: TermLine) => setHistory(h => [...h, line]);

  const typeString = (text: string, color: TermLine['type'], onDone: () => void) => {
    setIsTyping(true);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyping(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setTyping('');
        setIsTyping(false);
        addLine({ text, type: color });
        onDone();
      }
    }, 15);
  };

  const runPhase = (p: number) => {
    if (p >= attack.steps.length) {
      addLine({ text: '', type: 'output' });
      addLine({ text: `══ ${t('simComplete').toUpperCase()} ══`, type: 'success' });
      addLine({ text: `All ${attack.steps.length} phases simulated.`, type: 'output' });
      setNodes({ net: 'compromised', target: 'compromised', db: 'compromised' });
      setWaitInput(false);
      return;
    }

    const step  = attack.steps[p];
    const lines = parseCode(step.code);
    const pct   = p / Math.max(attack.steps.length - 1, 1);

    setNodes({
      net:    p >= 0                ? 'active'      : 'idle',
      target: pct >= 0.35           ? 'compromised' : p >= 0 ? 'active' : 'idle',
      db:     pct >= 0.65           ? 'compromised' : pct >= 0.45 ? 'active' : 'idle',
    });

    addLine({ text: '', type: 'output' });
    addLine({ text: `══ ${t('phaseLabel')} ${p + 1}/${attack.steps.length}: ${step.label.toUpperCase()} ══`, type: 'header' });
    addLine({ text: '', type: 'output' });

    let idx = 0;
    const next = () => {
      if (idx >= lines.length) { setWaitInput(true); return; }
      const line = lines[idx++];
      if (line.type === 'cmd') {
        setTimeout(() => typeString(line.text, 'cmd', () => setTimeout(next, 100)), 60);
      } else {
        setTimeout(() => { addLine(line); next(); }, line.text === '' ? 0 : 50);
      }
    };
    next();
  };

  const handleNext = () => {
    if (isTyping) return;
    setWaitInput(false);
    const n = phase + 1;
    setPhase(n);
    runPhase(n);
  };

  const handleStart = () => {
    addLine({ text: `╔═══════════════════════════════╗`, type: 'header' });
    addLine({ text: `║  ATTACK SIM: ${attack.name.slice(0, 17).padEnd(17)} ║`, type: 'header' });
    addLine({ text: `╚═══════════════════════════════╝`, type: 'header' });
    addLine({ text: '', type: 'output' });
    addLine({ text: `[SYS] ${attack.name} | ${attack.category}`, type: 'output' });
    addLine({ text: `[SYS] Phases: ${attack.steps.length} | ${attack.severity}`, type: 'output' });
    addLine({ text: `[WARN] Educational simulation only.`, type: 'warn' });
    addLine({ text: '', type: 'output' });
    setNodes({ net: 'active', target: 'active', db: 'idle' });
    setPhase(0);
    setTimeout(() => runPhase(0), 300);
  };

  const AttackIcon = ATTACK_ICON_MAP[attack.id];
  const curStep    = phase >= 0 && phase < attack.steps.length ? attack.steps[phase] : null;
  const isComplete = phase >= attack.steps.length;
  const risk       = phase >= 0 ? detectionRisk(phase, attack.steps.length) : { label: '—', color: 'rgba(255,255,255,0.2)' };
  const hasDB      = ['Web Attack', 'Cloud Security'].includes(attack.category) || ['sqli', 'ransomware', 'cloud-misconfig', 'credential-stuffing'].includes(attack.id);
  const arrowActive = nodes.target === 'active' || nodes.target === 'compromised';
  const dbArrowActive = nodes.db === 'active' || nodes.db === 'compromised';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#060810', display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--mono)', animation: 'view-fade-in 0.2s ease-out',
    }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 16px', borderBottom: '1px solid rgba(0,212,255,0.18)',
        background: 'rgba(0,212,255,0.04)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TermIcon size={13} color="#00d4ff" />
          <span style={{ fontSize: '12px', color: '#00d4ff', letterSpacing: '0.12em', fontWeight: 700 }}>
            {t('simulationTitle')}: {attack.name.toUpperCase()}
          </span>
          <span style={{ fontSize: '9px', padding: '2px 7px', borderRadius: '3px', background: `${attack.color}18`, border: `1px solid ${attack.borderColor}`, color: attack.color, letterSpacing: '0.1em' }}>
            {attack.severity}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {phase >= 0 && (
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {isComplete ? '✓ COMPLETE' : `${t('phaseLabel')} ${phase + 1} / ${attack.steps.length}`}
            </span>
          )}
          <button onClick={onClose} style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,0,85,0.1)', border: '1px solid rgba(255,0,85,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={12} color="#ff0055" />
          </button>
        </div>
      </div>

      {/* ── PHASE TABS ──────────────────────────────────────────────────────── */}
      {phase >= 0 && (
        <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid rgba(0,212,255,0.08)', flexShrink: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {attack.steps.map((s, i) => (
            <div key={i} style={{
              padding: '5px 12px', fontSize: '10px',
              borderBottom: `2px solid ${i < phase ? '#2dff8a' : i === phase ? attack.color : 'transparent'}`,
              color: i < phase ? 'rgba(45,255,138,0.6)' : i === phase ? attack.color : 'var(--text-muted)',
              letterSpacing: '0.06em', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.3s',
            }}>
              {i < phase ? '✓' : i + 1}. {s.label}
            </div>
          ))}
        </div>
      )}

      {/* ── MAIN SPLIT ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — terminal ──────────────────────────────── */}
        <div style={{ width: '42%', flexShrink: 0, borderRight: '1px solid rgba(0,212,255,0.1)', display: 'flex', flexDirection: 'column', background: '#02040a' }}>
          {/* macOS-style title bar */}
          <div style={{ padding: '7px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', marginLeft: '8px', letterSpacing: '0.06em' }}>
              attack@simulator ~ {attack.id}
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* Intro (terminal side) */}
            {phase === -1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '18px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: attack.bgColor, border: `1px solid ${attack.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {AttackIcon ? <AttackIcon size={28} color={attack.color} strokeWidth={1.2} /> : <TermIcon size={28} color={attack.color} strokeWidth={1.2} />}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: '16px', fontWeight: 800, color: attack.color, marginBottom: '6px' }}>{attack.name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', maxWidth: '280px', lineHeight: 1.8 }}>{t('simIntro')}</div>
                </div>
                <button onClick={handleStart} style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '9px 22px', borderRadius: '8px',
                  border: `1px solid ${attack.borderColor}`, background: attack.bgColor,
                  color: attack.color, fontSize: '12px', fontFamily: 'var(--mono)', fontWeight: 700,
                  letterSpacing: '0.1em', cursor: 'pointer',
                }}>
                  <Play size={12} /> {t('startSim')}
                </button>
              </div>
            )}

            {/* History */}
            {history.map((line, i) => (
              <div key={i} style={{ fontSize: '12px', lineHeight: '1.65', color: LINE_COLOR[line.type], whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginBottom: '1px' }}>
                {line.type === 'cmd'
                  ? <><span style={{ color: 'rgba(0,212,255,0.38)' }}>$ </span>{line.text.replace(/^[>$] /, '')}</>
                  : line.text}
              </div>
            ))}

            {/* Typing cursor */}
            {typing && (
              <div style={{ fontSize: '12px', color: '#00d4ff', lineHeight: '1.65' }}>
                <span style={{ color: 'rgba(0,212,255,0.38)' }}>$ </span>
                {typing.replace(/^[>$] /, '')}
                <span style={{ borderRight: '2px solid #00d4ff', animation: 'cursor-blink 0.75s step-end infinite' }} />
              </div>
            )}

            {/* Prompt when waiting */}
            {waitInput && !isTyping && !isComplete && (
              <div style={{ fontSize: '12px', color: 'rgba(0,212,255,0.4)', lineHeight: '1.65', marginTop: '4px' }}>
                <span style={{ animation: 'cursor-blink 1s step-end infinite' }}>▶</span>
                {' '}press ENTER to continue...
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* RIGHT — visual panel ─────────────────────────── */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '20px 22px', gap: '14px' }}>

          {phase === -1 ? (
            /* INTRO visual */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em' }}>ATTACK PHASES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '440px' }}>
                {attack.steps.map((s, i) => (
                  <div key={i} style={{ padding: '7px 13px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: `${attack.color}18`, border: `1px solid ${attack.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: attack.color }}>{i + 1}</div>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 18px', borderRadius: '10px', background: `${attack.color}08`, border: `1px solid ${attack.color}20`, textAlign: 'center', maxWidth: '380px' }}>
                <div style={{ fontSize: '10px', color: attack.color, letterSpacing: '0.12em', marginBottom: '6px' }}>{attack.category.toUpperCase()}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>{attack.shortDesc}</div>
              </div>
            </div>
          ) : (
            <>
              {/* ── Network diagram ─────────────────────── */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '18px 20px', flexShrink: 0 }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', marginBottom: '14px' }}>// NETWORK TOPOLOGY</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DiagramNode icon={Monitor} label="ATTACKER" sub={attack.id} color={attack.color} state="active" />
                  <ConnArrow color={attack.color} active={nodes.net === 'active' || nodes.net === 'compromised'} />
                  <DiagramNode icon={Wifi} label="NETWORK" sub="Internet" color={nodes.net === 'idle' ? 'rgba(255,255,255,0.15)' : attack.color} state={nodes.net} />
                  <ConnArrow color={attack.color} active={arrowActive} />
                  <DiagramNode
                    icon={Server}
                    label="TARGET"
                    sub={attack.category === 'Web Attack' ? 'Web Server' : attack.category === 'Network Attack' ? 'Router' : 'System'}
                    color={nodes.target === 'compromised' ? '#ff2d55' : nodes.target === 'active' ? attack.color : 'rgba(255,255,255,0.15)'}
                    state={nodes.target}
                  />
                  {hasDB && (
                    <>
                      <ConnArrow color={nodes.db === 'idle' ? 'rgba(255,255,255,0.06)' : '#ff7b2c'} active={dbArrowActive} />
                      <DiagramNode icon={Database} label="DATABASE" sub="Data Store" color={nodes.db === 'compromised' ? '#ff7b2c' : nodes.db === 'active' ? '#e8c840' : 'rgba(255,255,255,0.15)'} state={nodes.db} />
                    </>
                  )}
                </div>

                {/* Status row */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[
                    { key: 'ATTACKER', st: 'ACTIVE',      color: attack.color },
                    { key: 'NETWORK',  st: nodes.net === 'idle' ? 'CLEAR' : nodes.net === 'active' ? 'SCANNING' : 'BREACHED', color: nodes.net === 'idle' ? 'rgba(255,255,255,0.2)' : nodes.net === 'active' ? '#e8c840' : '#ff2d55' },
                    { key: 'TARGET',   st: nodes.target === 'idle' ? 'SECURE' : nodes.target === 'active' ? 'PROBED' : 'PWNED',   color: nodes.target === 'idle' ? 'rgba(255,255,255,0.2)' : nodes.target === 'active' ? '#e8c840' : '#ff2d55' },
                  ].map(({ key, st, color }) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '4px', background: `${color}10`, border: `1px solid ${color}28` }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, animation: st !== 'SECURE' && st !== 'CLEAR' ? 'pulse-dot 1.5s infinite' : 'none' }} />
                      <span style={{ fontSize: '9px', color, letterSpacing: '0.08em' }}>{key}: {st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Current step card ──────────────────── */}
              {curStep && (
                <div style={{ background: `${attack.color}08`, border: `1px solid ${attack.color}22`, borderRadius: '12px', padding: '15px 17px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0, background: attack.bgColor, border: `1px solid ${attack.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {AttackIcon ? <AttackIcon size={17} color={attack.color} strokeWidth={1.5} /> : <TermIcon size={17} color={attack.color} strokeWidth={1.5} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.14em', marginBottom: '3px' }}>
                        {t('phaseLabel')} {phase + 1} / {attack.steps.length}
                      </div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: '13px', fontWeight: 800, color: attack.color, letterSpacing: '0.05em', marginBottom: '6px' }}>
                        {curStep.label.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.75 }}>
                        {curStep.desc}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Complete banner ────────────────────── */}
              {isComplete && (
                <div style={{ background: 'rgba(45,255,138,0.05)', border: '1px solid rgba(45,255,138,0.22)', borderRadius: '12px', padding: '14px 18px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 800, color: '#2dff8a', marginBottom: '5px' }}>{t('simComplete')}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)' }}>
                    All {attack.steps.length} phases of {attack.name} simulated.
                  </div>
                </div>
              )}

              {/* ── Metrics row ────────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', flexShrink: 0 }}>
                {[
                  { label: 'PHASES DONE', val: `${isComplete ? attack.steps.length : phase}/${attack.steps.length}`, color: attack.color,   Icon: ChevronRight },
                  { label: 'DETECT RISK', val: risk.label,                                                            color: risk.color,     Icon: Eye          },
                  { label: 'SEVERITY',    val: attack.severity,                                                       color: attack.color,   Icon: AlertTriangle },
                ].map(({ label, val, color, Icon }) => (
                  <div key={label} style={{ padding: '11px 13px', borderRadius: '10px', background: `${color}08`, border: `1px solid ${color}20` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                      <Icon size={9} color={color} />
                      <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{label}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 800, color }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* ── Key defenses ───────────────────────── */}
              {attack.defenses.length > 0 && (
                <div style={{ background: 'rgba(45,255,138,0.04)', border: '1px solid rgba(45,255,138,0.14)', borderRadius: '10px', padding: '11px 14px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Shield size={10} color="#2dff8a" />
                    <span style={{ fontSize: '9px', color: '#2dff8a', letterSpacing: '0.1em' }}>KEY DEFENSES</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {attack.defenses.slice(0, 5).map((d, i) => (
                      <span key={i} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)', padding: '2px 8px', borderRadius: '4px', background: 'rgba(45,255,138,0.06)', border: '1px solid rgba(45,255,138,0.12)' }}>{d}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── BOTTOM CONTROLS ─────────────────────────────────────────────────── */}
      {phase >= 0 && (
        <div style={{ padding: '9px 18px', borderTop: '1px solid rgba(0,212,255,0.1)', background: 'rgba(0,212,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            {isTyping ? '⟳  Executing...' : waitInput && !isComplete ? '▶  ENTER or click to continue' : ''}
          </div>
          <div style={{ display: 'flex', gap: '7px' }}>
            <button onClick={onClose} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--mono)', cursor: 'pointer' }}>
              {t('exitSim')}
            </button>
            {waitInput && !isComplete && (
              <button onClick={handleNext} disabled={isTyping} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 16px', borderRadius: '6px',
                border: `1px solid ${attack.borderColor}`, background: attack.bgColor,
                color: attack.color, fontSize: '10px', fontFamily: 'var(--mono)',
                fontWeight: 700, cursor: isTyping ? 'default' : 'pointer', opacity: isTyping ? 0.5 : 1,
              }}>
                {t('nextPhase')} <ChevronRight size={11} />
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes packet-travel {
          0%   { transform: translateX(0)    translateY(-50%); opacity: 0; }
          8%   { opacity: 1; }
          82%  { transform: translateX(64px) translateY(-50%); opacity: 1; }
          100% { transform: translateX(64px) translateY(-50%); opacity: 0; }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.4; transform:scale(0.65); }
        }
      `}</style>
    </div>
  );
}
