'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Play, ChevronRight, Terminal as TermIcon } from 'lucide-react';
import type { Attack } from '../data/attacks';
import { useLang } from '../lib/language';

interface TermLine {
  text: string;
  type: 'cmd' | 'output' | 'header' | 'warn' | 'success';
}

interface Props {
  attack: Attack;
  onClose: () => void;
}

function parseCode(code: string): TermLine[] {
  return code.split('\n').map(line => {
    if (line.startsWith('> ') || line.startsWith('$ '))
      return { text: line, type: 'cmd' };
    if (line.startsWith('//') || line.startsWith('#'))
      return { text: line, type: 'output' };
    if (line.toUpperCase() === line && line.length > 3 && /[A-Z]/.test(line))
      return { text: line, type: line.includes('SUCCESS') || line.includes('✓') ? 'success' : line.includes('WARN') || line.includes('!') ? 'warn' : 'output' };
    return { text: line, type: 'output' };
  });
}

const LINE_COLOR: Record<TermLine['type'], string> = {
  cmd:     '#00d4ff',
  output:  '#a8ff78',
  header:  '#ffc83d',
  warn:    '#ff7b2c',
  success: '#2dff8a',
};

export default function SimulationTerminal({ attack, onClose }: Props) {
  const { t } = useLang();
  const [phase,      setPhase]      = useState(-1); // -1 = intro
  const [history,    setHistory]    = useState<TermLine[]>([]);
  const [typing,     setTyping]     = useState('');
  const [isTyping,   setIsTyping]   = useState(false);
  const [waitInput,  setWaitInput]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollBottom(); }, [history, typing]);

  // Keyboard handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && waitInput && !isTyping) {
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitInput, isTyping, phase]);

  const addLine = (line: TermLine) => setHistory(h => [...h, line]);

  const typeString = (text: string, color: TermLine['type'], onDone: () => void) => {
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyping(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTyping('');
        setIsTyping(false);
        addLine({ text, type: color });
        onDone();
      }
    }, 18);
  };

  const runPhase = (p: number) => {
    if (p >= attack.steps.length) {
      addLine({ text: '', type: 'output' });
      addLine({ text: `══════════ ${t('simComplete').toUpperCase()} ══════════`, type: 'success' });
      addLine({ text: `All ${attack.steps.length} phases of ${attack.name} simulated.`, type: 'output' });
      setWaitInput(false);
      return;
    }

    const step = attack.steps[p];
    const lines = parseCode(step.code);

    addLine({ text: '', type: 'output' });
    addLine({ text: `══ ${t('phaseLabel')} ${p + 1}/${attack.steps.length}: ${step.label.toUpperCase()} ══`, type: 'header' });
    addLine({ text: '', type: 'output' });

    let lineIdx = 0;

    const processNext = () => {
      if (lineIdx >= lines.length) {
        setWaitInput(true);
        return;
      }
      const line = lines[lineIdx];
      lineIdx++;

      if (line.type === 'cmd') {
        setTimeout(() => typeString(line.text, 'cmd', () => {
          setTimeout(processNext, 120);
        }), 80);
      } else {
        setTimeout(() => {
          addLine(line);
          processNext();
        }, line.text === '' ? 0 : 60);
      }
    };

    processNext();
  };

  const handleNext = () => {
    if (isTyping) return;
    setWaitInput(false);
    const next = phase + 1;
    setPhase(next);
    runPhase(next);
  };

  const handleStart = () => {
    addLine({ text: `╔═══════════════════════════════════════╗`, type: 'header' });
    addLine({ text: `║  ${t('simulationTitle')}: ${attack.name.padEnd(18)} ║`, type: 'header' });
    addLine({ text: `╚═══════════════════════════════════════╝`, type: 'header' });
    addLine({ text: '', type: 'output' });
    addLine({ text: `[SYS] Initializing attack simulation...`, type: 'output' });
    addLine({ text: `[SYS] Target: ${attack.name} | Category: ${attack.category}`, type: 'output' });
    addLine({ text: `[SYS] Phases: ${attack.steps.length} | Severity: ${attack.severity}`, type: 'output' });
    addLine({ text: '', type: 'output' });
    addLine({ text: `[WARNING] This is a controlled simulation for educational purposes only.`, type: 'warn' });
    addLine({ text: '', type: 'output' });
    const next = 0;
    setPhase(next);
    setTimeout(() => runPhase(next), 300);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#060a06', display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--mono)',
      animation: 'view-fade-in 0.2s ease-out',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderBottom: '1px solid rgba(0,212,255,0.2)',
        background: 'rgba(0,212,255,0.04)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TermIcon size={14} color="#00d4ff" />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#00d4ff', letterSpacing: '0.12em', fontWeight: 700 }}>
            {t('simulationTitle')}: {attack.name.toUpperCase()}
          </span>
          <span style={{
            fontSize: '10px', padding: '2px 8px', borderRadius: '3px',
            background: `${attack.color}18`, border: `1px solid ${attack.borderColor}`,
            color: attack.color, letterSpacing: '0.1em',
          }}>{attack.severity}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {phase >= 0 && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {t('phaseLabel')} {Math.min(phase + 1, attack.steps.length)}/{attack.steps.length}
            </span>
          )}
          <button onClick={onClose} title={`${t('exitSim')} (Esc)`} style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'rgba(255,0,85,0.1)', border: '1px solid rgba(255,0,85,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <X size={12} color="#ff0055" />
          </button>
        </div>
      </div>

      {/* Phase tabs */}
      {phase >= 0 && (
        <div style={{ display: 'flex', padding: '0 16px', gap: '4px', borderBottom: '1px solid rgba(0,212,255,0.1)', flexShrink: 0, overflowX: 'auto' }}>
          {attack.steps.map((step, i) => (
            <div key={i} style={{
              padding: '6px 12px', fontSize: '10px', fontFamily: 'var(--mono)',
              borderBottom: `2px solid ${i <= phase ? attack.color : 'transparent'}`,
              color: i === phase ? attack.color : i < phase ? 'rgba(45,255,138,0.7)' : 'var(--text-muted)',
              letterSpacing: '0.06em', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {i + 1}. {step.label}
            </div>
          ))}
        </div>
      )}

      {/* Terminal body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '1px' }}>

        {/* Intro screen */}
        {phase === -1 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '24px', animation: 'view-fade-in 0.3s ease-out' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '20px',
              background: attack.bgColor, border: `1px solid ${attack.borderColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TermIcon size={36} color={attack.color} strokeWidth={1.2} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 800, color: attack.color, marginBottom: '10px' }}>
                {attack.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.8 }}>
                {t('simIntro')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {attack.steps.map((step, i) => (
                <div key={i} style={{
                  padding: '5px 12px', borderRadius: '5px', fontSize: '10px',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', fontFamily: 'var(--mono)',
                }}>
                  {i + 1}. {step.label}
                </div>
              ))}
            </div>
            <button onClick={handleStart} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '10px',
              border: `1px solid ${attack.borderColor}`, background: attack.bgColor,
              color: attack.color, fontFamily: 'var(--mono)', fontSize: '13px',
              fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              <Play size={14} />
              {t('startSim')}
            </button>
          </div>
        )}

        {/* History lines */}
        {history.map((line, i) => (
          <div key={i} style={{
            fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 1.6,
            color: LINE_COLOR[line.type],
            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>
            {line.type === 'cmd' ? (
              <><span style={{ color: 'rgba(0,212,255,0.4)' }}>$ </span>{line.text.replace(/^[>$] /, '')}</>
            ) : line.text}
          </div>
        ))}

        {/* Currently typing */}
        {typing && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: '#00d4ff', lineHeight: 1.6 }}>
            <span style={{ color: 'rgba(0,212,255,0.4)' }}>$ </span>
            {typing.replace(/^[>$] /, '')}
            <span style={{ animation: 'cursor-blink 0.8s step-end infinite', borderRight: '2px solid #00d4ff' }} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Bottom controls */}
      {phase >= 0 && (
        <div style={{
          padding: '12px 20px', borderTop: '1px solid rgba(0,212,255,0.15)',
          background: 'rgba(0,212,255,0.02)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            {waitInput && !isTyping ? '▶ Press ENTER or click to continue...' : isTyping ? '⟳ Executing...' : ''}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} style={{
              padding: '7px 16px', borderRadius: '6px',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '11px',
              cursor: 'pointer',
            }}>
              {t('exitSim')}
            </button>
            {waitInput && phase < attack.steps.length && (
              <button onClick={handleNext} disabled={isTyping} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 16px', borderRadius: '6px',
                border: `1px solid ${attack.borderColor}`, background: attack.bgColor,
                color: attack.color, fontFamily: 'var(--mono)', fontSize: '11px',
                fontWeight: 700, cursor: isTyping ? 'default' : 'pointer',
                opacity: isTyping ? 0.5 : 1,
              }}>
                {t('nextPhase')} <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
