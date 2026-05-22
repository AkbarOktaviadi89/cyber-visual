'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Code2, Play, Pause, ShieldCheck, ChevronUp, Maximize2, Minimize2, HelpCircle, Terminal as TermIcon } from 'lucide-react';
import { attacks, type Attack } from '../data/attacks';
import { ATTACK_ICON_MAP, STEP_ICON_MAP } from '../lib/icons';
import { SCENES } from '../data/scenes';
import { MITRE } from '../data/mitre';
import AttackScene from './AttackScene';
import QuizView from './QuizView';
import SimulationTerminal from './SimulationTerminal';
import { useLang } from '../lib/language';

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#ff0055', HIGH: '#ff7b2c', MEDIUM: '#ffc83d', LOW: '#2dff8a',
};
const SEV_BG: Record<string, string> = {
  CRITICAL: 'rgba(255,0,85,0.12)', HIGH: 'rgba(255,123,44,0.12)',
  MEDIUM: 'rgba(255,200,61,0.12)', LOW: 'rgba(45,255,138,0.12)',
};

export default function AttackDetail({ attack, onSelectAttack }: { attack: Attack; onSelectAttack?: (id: string) => void }) {
  const { t } = useLang();
  const [step,         setStep]        = useState(0);
  const [showCode,     setShowCode]    = useState(false);
  const [showDesc,     setShowDesc]    = useState(false);
  const [isPlaying,    setIsPlaying]   = useState(false);
  const [showDefense,  setShowDefense] = useState(false);
  const [playTick,     setPlayTick]    = useState(0);
  const [speed,        setSpeed]       = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuiz,     setShowQuiz]    = useState(false);
  const [showSim,      setShowSim]     = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStep(0); setShowCode(false); setShowDesc(false);
    setIsPlaying(false); setShowDefense(false); setSpeed(1);
    setShowQuiz(false); setShowSim(false);
  }, [attack.id]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) sceneRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  useEffect(() => {
    setShowDesc(false); setShowCode(false); setShowDefense(false);
  }, [step]);

  const closePopup = () => { setShowDesc(false); setShowCode(false); };

  const go = useCallback((dir: number) => {
    setStep(s => {
      const next = s + dir;
      if (next < 0 || next >= attack.steps.length) return s;
      return next;
    });
  }, [attack.steps.length]);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'l') go(1);
      else if (e.key === 'ArrowLeft' || e.key === 'h') go(-1);
      else if (e.key === 'Escape') { closePopup(); setShowDefense(false); }
      else if (e.key === ' ') { e.preventDefault(); setIsPlaying(v => !v); }
      else if (e.key >= '1' && e.key <= '9') {
        const n = parseInt(e.key) - 1;
        if (n < attack.steps.length) setStep(n);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, attack.steps.length]);

  // ── Auto-play ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    setPlayTick(0);
    const INTERVAL = 2800 / speed;
    const TICK_MS  = 40;
    let elapsed = 0;

    const ticker = setInterval(() => {
      elapsed += TICK_MS;
      setPlayTick(elapsed / INTERVAL);
      if (elapsed >= INTERVAL) {
        elapsed = 0;
        setStep(s => {
          if (s >= attack.steps.length - 1) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }
    }, TICK_MS);

    return () => clearInterval(ticker);
  }, [isPlaying, attack.steps.length, speed]);

  const cur        = attack.steps[step];
  const progress   = ((step + 1) / attack.steps.length) * 100;
  const AttackIcon = ATTACK_ICON_MAP[attack.id];
  const StepIcon   = STEP_ICON_MAP[cur.icon];
  const scene      = SCENES[attack.id];

  const relatedAttacks = useMemo(() => {
    return attacks
      .filter(a => a.id !== attack.id)
      .map(a => {
        let score = 0;
        if (a.category === attack.category) score += 3;
        if (a.severity === attack.severity) score += 1;
        score += a.tags.filter(tag => attack.tags.includes(tag)).length * 2;
        return { a, score };
      })
      .filter(({ score }) => score > 0)
      .sort((x, y) => y.score - x.score)
      .slice(0, 5)
      .map(({ a }) => a);
  }, [attack.id, attack.category, attack.severity, attack.tags]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', position: 'relative' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid var(--border)', background: 'rgba(6,8,16,0.6)' }}>

        {/* Row 1 — attack identity + action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: attack.bgColor, border: `1px solid ${attack.borderColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {AttackIcon && <AttackIcon size={17} color={attack.color} strokeWidth={1.5} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 800, color: attack.color, letterSpacing: '0.04em', marginBottom: '4px' }}>
                {attack.name}
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
                <span style={{
                  fontSize: '10px', padding: '1px 6px', borderRadius: '3px', flexShrink: 0,
                  background: SEV_BG[attack.severity], border: `1px solid ${SEV_COLOR[attack.severity]}`,
                  color: SEV_COLOR[attack.severity], fontFamily: 'var(--mono)', letterSpacing: '0.1em', fontWeight: 700,
                }}>{attack.severity}</span>
                <span style={{
                  fontSize: '10px', padding: '1px 6px', borderRadius: '3px', flexShrink: 0,
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', fontFamily: 'var(--mono)',
                }}>{attack.category.toUpperCase()}</span>
                {attack.tags.slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    fontSize: '10px', padding: '1px 6px', borderRadius: '3px', flexShrink: 0,
                    background: `${attack.color}0d`, border: `1px solid ${attack.color}1a`,
                    color: `${attack.color}99`, fontFamily: 'var(--mono)',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button onClick={() => setShowQuiz(true)} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px', borderRadius: '6px',
              border: `1px solid ${attack.borderColor}`, background: attack.bgColor,
              color: attack.color, fontFamily: 'var(--mono)', fontSize: '10px',
              fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <HelpCircle size={11} /> {t('takeQuizBtn')}
            </button>
            <button onClick={() => setShowSim(true)} style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px', borderRadius: '6px',
              border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)',
              color: '#00d4ff', fontFamily: 'var(--mono)', fontSize: '10px',
              fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <TermIcon size={11} /> {t('simulateBtn')}
            </button>
          </div>
        </div>

        {/* Row 2 — MITRE badges + step controls */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 20px 8px', borderTop: '1px solid var(--border)',
          gap: '12px',
        }}>
          {/* MITRE badges */}
          <div style={{ display: 'flex', gap: '4px', overflow: 'hidden', flexShrink: 1, minWidth: 0 }}>
            {(MITRE[attack.id] ?? []).map(m => (
              <span key={m.id} title={`${m.tactic} — ${m.technique}`} style={{
                fontSize: '9px', padding: '2px 6px', borderRadius: '3px', flexShrink: 0,
                background: 'rgba(255,200,61,0.07)', border: '1px solid rgba(255,200,61,0.2)',
                color: 'rgba(255,200,61,0.7)', fontFamily: 'var(--mono)', letterSpacing: '0.05em', cursor: 'default',
                whiteSpace: 'nowrap',
              }}>ATT&amp;CK {m.id}</span>
            ))}
          </div>

          {/* Step controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
            {/* Step dots */}
            {attack.steps.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: i === step ? '18px' : '7px', height: '7px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: i === step ? attack.color : i < step ? '#2dff8a' : 'var(--border2)',
                transition: 'all 0.2s', padding: 0,
              }} />
            ))}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', width: '30px', textAlign: 'right' }}>
              {step + 1}/{attack.steps.length}
            </span>
            <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
            {/* Speed */}
            <div style={{ display: 'flex', gap: '2px' }}>
              {([0.5, 1, 1.5, 2] as const).map(s => (
                <button key={s} onClick={() => setSpeed(s)} style={{
                  padding: '3px 7px', borderRadius: '4px', border: '1px solid',
                  borderColor: speed === s ? attack.borderColor : 'var(--border)',
                  background: speed === s ? attack.bgColor : 'transparent',
                  color: speed === s ? attack.color : 'var(--text-muted)',
                  fontFamily: 'var(--mono)', fontSize: '10px', cursor: 'pointer', transition: 'all 0.12s',
                }}>{s}×</button>
              ))}
            </div>
            {/* Play/Pause */}
            <button onClick={() => setIsPlaying(v => !v)} title={isPlaying ? 'Pause (Space)' : 'Play (Space)'} style={{
              width: '27px', height: '27px', borderRadius: '6px',
              border: `1px solid ${isPlaying ? attack.borderColor : 'var(--border2)'}`,
              background: isPlaying ? attack.bgColor : 'var(--surface2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {isPlaying ? <Pause size={12} color={attack.color} /> : <Play size={12} color="var(--text-muted)" />}
            </button>
            {/* Prev / Next */}
            <button onClick={() => go(-1)} disabled={step === 0} style={{
              width: '27px', height: '27px', borderRadius: '6px',
              border: '1px solid var(--border2)', background: 'var(--surface2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: step === 0 ? 'default' : 'pointer',
              opacity: step === 0 ? 0.3 : 1, transition: 'opacity 0.15s',
            }}>
              <ChevronLeft size={14} color="var(--text-primary)" />
            </button>
            <button onClick={() => go(1)} disabled={step === attack.steps.length - 1} style={{
              width: '27px', height: '27px', borderRadius: '6px',
              border: '1px solid var(--border2)', background: 'var(--surface2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: step === attack.steps.length - 1 ? 'default' : 'pointer',
              opacity: step === attack.steps.length - 1 ? 0.3 : 1, transition: 'opacity 0.15s',
          }}>
            <ChevronRight size={14} color="var(--text-primary)" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PROGRESS BAR ───────────────────────────────────────────────────── */}
      <div style={{ height: '3px', background: 'var(--border)', flexShrink: 0, position: 'relative' }}>
        <div style={{ height: '100%', background: attack.color, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        {/* Auto-play sub-progress */}
        {isPlaying && (
          <div style={{
            position: 'absolute', top: 0, left: `${progress - (progress / attack.steps.length)}%`,
            height: '100%',
            width: `${playTick * (100 / attack.steps.length)}%`,
            background: `${attack.color}55`,
            transition: 'width 0.04s linear',
          }} />
        )}
      </div>

      {/* ── VISUAL SCENE ───────────────────────────────────────────────────── */}
      <div ref={sceneRef} style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', background: isFullscreen ? 'var(--bg)' : undefined }}>
        {scene ? (
          <AttackScene
            scene={scene}
            currentStep={step}
            attackColor={attack.color}
            stepKey={`${attack.id}-${step}`}
            onBadgeClick={() => setShowDesc(v => !v)}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px' }}>
            No visual scene available for this attack.
          </div>
        )}

        {/* Impact badges — top right */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {attack.impact.map((imp, i) => (
            <div key={i} style={{
              background: 'rgba(6,8,16,0.80)', border: `1px solid ${attack.borderColor}`,
              borderRadius: '8px', padding: '6px 10px', backdropFilter: 'blur(6px)', minWidth: '100px',
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>{imp.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: attack.color, fontFamily: 'var(--display)' }}>{imp.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{imp.sub}</div>
            </div>
          ))}
        </div>

        {/* ── FULLSCREEN BUTTON ─────────────────────────────────────────────── */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          style={{
            position: 'absolute', bottom: '12px', right: '12px',
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'rgba(6,8,16,0.8)', border: '1px solid var(--border2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 5,
          }}>
          {isFullscreen
            ? <Minimize2 size={12} color="var(--text-muted)" />
            : <Maximize2 size={12} color="var(--text-muted)" />}
        </button>

        {/* ── DEFENSE BUTTON ─────────────────────────────────────────────────── */}
        <button
          onClick={() => setShowDefense(v => !v)}
          style={{
            position: 'absolute', bottom: '12px', left: '12px',
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px', borderRadius: '6px',
            border: `1px solid ${showDefense ? attack.borderColor : 'var(--border2)'}`,
            background: showDefense ? attack.bgColor : 'rgba(6,8,16,0.8)',
            color: showDefense ? attack.color : 'var(--text-muted)',
            fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.2s',
          }}>
          <ShieldCheck size={10} />
          DEFENSES
          <ChevronUp size={9} style={{ transform: showDefense ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
        </button>

        {/* ── DEFENSE PANEL ──────────────────────────────────────────────────── */}
        {showDefense && (
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(5,7,14,0.97)',
              borderTop: `1px solid ${attack.borderColor}`,
              backdropFilter: 'blur(16px)',
              animation: 'slide-up-panel 0.25s ease-out',
              zIndex: 15, maxHeight: '65%', overflowY: 'auto',
              padding: '16px 20px 20px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={13} color={attack.color} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700, color: attack.color, letterSpacing: '0.08em' }}>
                  DEFENSES & MITIGATIONS
                </span>
              </div>
              <button onClick={() => setShowDefense(false)} style={{
                width: '22px', height: '22px', borderRadius: '5px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <X size={11} color="var(--text-muted)" />
              </button>
            </div>

            {/* Defense list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px', marginBottom: '16px' }}>
              {attack.defenses.map((d, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 10px', borderRadius: '6px',
                  background: `${attack.color}0d`, border: `1px solid ${attack.color}22`,
                }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: attack.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{d}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: `linear-gradient(to right, ${attack.color}33, transparent)`, marginBottom: '12px' }} />

            {/* Real-world case */}
            <div style={{ fontSize: '11px', color: attack.color, fontFamily: 'var(--mono)', letterSpacing: '0.1em', marginBottom: '8px' }}>
              // REAL WORLD CASE
            </div>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-secondary)',
              lineHeight: 1.8, borderLeft: `2px solid ${attack.color}55`, paddingLeft: '12px',
            }}>
              {attack.realWorld}
            </p>
          </div>
        )}

        {/* ── DESCRIPTION POPUP ─────────────────────────────────────────────── */}
        {showDesc && (
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
              zIndex: 20,
            }}
            onClick={closePopup}
          >
            <div
              style={{
                background: 'rgba(6,8,16,0.97)',
                border: `1px solid ${attack.borderColor}`,
                borderRadius: '16px',
                padding: '22px 26px',
                maxWidth: '680px', width: 'calc(100% - 32px)',
                maxHeight: '85vh', overflowY: 'auto',
                boxShadow: `0 0 60px ${attack.color}28, 0 8px 32px rgba(0,0,0,0.6)`,
                backdropFilter: 'blur(16px)',
                animation: 'popup-scale-in 0.22s cubic-bezier(0.34, 1.2, 0.64, 1)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
                  background: attack.bgColor, border: `1px solid ${attack.borderColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {StepIcon && <StepIcon size={16} color={attack.color} strokeWidth={1.5} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    STEP {step + 1} OF {attack.steps.length}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--mono)', color: attack.color, letterSpacing: '0.02em' }}>
                    {cur.label}
                  </div>
                </div>
                <button
                  onClick={closePopup}
                  style={{
                    width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} color="var(--text-muted)" />
                </button>
              </div>

              <div style={{ height: '1px', background: `linear-gradient(to right, ${attack.color}44, transparent)`, marginBottom: '16px' }} />

              <p style={{
                fontSize: '17px', color: 'var(--text-secondary)', fontFamily: 'var(--mono)',
                lineHeight: 2, margin: '0 0 24px',
              }}>
                {cur.desc}
              </p>

              {cur.code && (
                <>
                  <button
                    onClick={() => setShowCode(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '9px', padding: '5px 12px', borderRadius: '6px',
                      border: `1px solid ${attack.borderColor}`,
                      background: showCode ? attack.bgColor : 'transparent',
                      color: showCode ? attack.color : 'var(--text-muted)',
                      cursor: 'pointer', fontFamily: 'var(--mono)', letterSpacing: '0.08em',
                      transition: 'all 0.15s', marginBottom: showCode ? '10px' : '0',
                    }}
                  >
                    <Code2 size={10} />
                    {showCode ? t('hideCode') : t('showCode')}
                  </button>

                  {showCode && (
                    <div style={{
                      borderRadius: '8px', border: '1px solid var(--border)',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '12px 16px',
                      fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 1.7,
                      color: '#a8ff78', whiteSpace: 'pre-wrap',
                      overflowX: 'auto', overflowY: 'auto', maxHeight: '180px',
                    }}>
                      {cur.code}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── RELATED ATTACKS ──────────────────────────────────────────────────── */}
      {relatedAttacks.length > 0 && onSelectAttack && (
        <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'rgba(6,8,16,0.7)', padding: '8px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minWidth: 'max-content' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em', flexShrink: 0, marginRight: '4px' }}>
              {t('relatedAttacks').toUpperCase()}
            </span>
            {relatedAttacks.map(rel => {
              const RelIcon = ATTACK_ICON_MAP[rel.id];
              return (
                <button key={rel.id} onClick={() => onSelectAttack(rel.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 10px', borderRadius: '7px', flexShrink: 0,
                  border: `1px solid ${rel.borderColor}`, background: rel.bgColor,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                >
                  {RelIcon && <RelIcon size={11} color={rel.color} strokeWidth={1.5} />}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: rel.color, fontWeight: 600, whiteSpace: 'nowrap' }}>{rel.name}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: rel.color, opacity: 0.6 }}>{rel.severity}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── QUIZ OVERLAY ──────────────────────────────────────────────────────── */}
      {showQuiz && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'var(--bg)', display: 'flex', flexDirection: 'column', animation: 'view-fade-in 0.22s ease-out' }}>
          <QuizView attack={attack} onClose={() => setShowQuiz(false)} />
        </div>
      )}

      {/* ── SIMULATION TERMINAL ───────────────────────────────────────────────── */}
      {showSim && (
        <SimulationTerminal attack={attack} onClose={() => setShowSim(false)} />
      )}

    </div>
  );
}
