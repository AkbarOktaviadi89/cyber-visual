'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, BookOpen, Shield, Zap, ChevronRight } from 'lucide-react';
import { attacks, type Attack } from '../data/attacks';
import { ATTACK_ICON_MAP } from '../lib/icons';
import { useLang } from '../lib/language';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const DIFFICULTY_MAP: Record<string, Difficulty> = {
  phishing: 'beginner',
  'social-engineering': 'beginner',
  'sim-swapping': 'beginner',
  ddos: 'beginner',
  sqli: 'beginner',
  'brute-force': 'beginner',
  'evil-maid': 'beginner',
  'bad-usb': 'beginner',
  'credential-stuffing': 'beginner',
  tailgating: 'beginner',
  qrishing: 'beginner',
  keylogger: 'beginner',
  xss: 'intermediate',
  ransomware: 'intermediate',
  mitm: 'intermediate',
  csrf: 'intermediate',
  'dns-spoofing': 'intermediate',
  clickjacking: 'intermediate',
  cryptojacking: 'intermediate',
  'rainbow-table': 'intermediate',
  'cloud-misconfig': 'intermediate',
  'insider-threat': 'intermediate',
  'mobile-malware': 'intermediate',
  'iot-botnet': 'intermediate',
  'oauth-bypass': 'intermediate',
  xxe: 'intermediate',
  'arp-spoofing': 'intermediate',
  'jwt-attack': 'intermediate',
  'subdomain-takeover': 'intermediate',
  bec: 'intermediate',
  'zero-day': 'advanced',
  'supply-chain': 'advanced',
  'ai-attack': 'advanced',
  'fileless-malware': 'advanced',
  ssrf: 'advanced',
  log4shell: 'advanced',
  printnightmare: 'advanced',
  ssti: 'advanced',
  rootkit: 'advanced',
  'watering-hole': 'advanced',
  'dependency-confusion': 'advanced',
};

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#ff0055', HIGH: '#ff7b2c', MEDIUM: '#ffc83d', LOW: '#2dff8a',
};

const LEVEL_CONFIG: Record<Difficulty, { icon: typeof BookOpen; color: string; bg: string; border: string; descKey: string }> = {
  beginner: {
    icon: BookOpen, color: '#2dff8a',
    bg: 'rgba(45,255,138,0.08)', border: 'rgba(45,255,138,0.2)',
    descKey: 'beginnerDesc',
  },
  intermediate: {
    icon: Shield, color: '#ffc83d',
    bg: 'rgba(255,200,61,0.08)', border: 'rgba(255,200,61,0.2)',
    descKey: 'intermediateDesc',
  },
  advanced: {
    icon: Zap, color: '#ff7b2c',
    bg: 'rgba(255,123,44,0.08)', border: 'rgba(255,123,44,0.2)',
    descKey: 'advancedDesc',
  },
};

const STORAGE_KEY = 'cyber-viz-viewed';

function useViewedAttacks() {
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setViewed(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, []);
  const markViewed = (id: string) => {
    setViewed(prev => {
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  };
  return { viewed, markViewed };
}

interface Props {
  onSelectAttack: (id: string) => void;
}

export default function LearningPath({ onSelectAttack }: Props) {
  const { t } = useLang();
  const { viewed } = useViewedAttacks();

  const grouped: Record<Difficulty, Attack[]> = { beginner: [], intermediate: [], advanced: [] };
  for (const a of attacks) {
    const diff = DIFFICULTY_MAP[a.id] ?? 'intermediate';
    grouped[diff].push(a);
  }

  const levels: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Title */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.05em', marginBottom: '6px' }}>
          {t('learningPathTitle')}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
          // {t('yourProgress')}: {viewed.size}/{attacks.length} {t('progressLabel')}
        </div>
      </div>

      {/* Overall progress bar */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '3px',
            background: 'linear-gradient(to right, #2dff8a, #ffc83d, #ff7b2c)',
            width: `${Math.round((viewed.size / Math.max(attacks.length, 1)) * 100)}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          {levels.map(lvl => {
            const cfg = LEVEL_CONFIG[lvl];
            const lvlAttacks = grouped[lvl];
            const done = lvlAttacks.filter(a => viewed.has(a.id)).length;
            return (
              <div key={lvl} style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: cfg.color, letterSpacing: '0.06em' }}>
                {t(lvl).toUpperCase()} {done}/{lvlAttacks.length}
              </div>
            );
          })}
        </div>
      </div>

      {/* Level sections */}
      {levels.map(lvl => {
        const cfg  = LEVEL_CONFIG[lvl];
        const LvlIcon = cfg.icon;
        const lvlAttacks = grouped[lvl];
        const done = lvlAttacks.filter(a => viewed.has(a.id)).length;
        const pct  = lvlAttacks.length > 0 ? Math.round((done / lvlAttacks.length) * 100) : 0;

        return (
          <div key={lvl} style={{
            background: 'var(--surface)', border: `1px solid ${cfg.border}`,
            borderRadius: '14px', overflow: 'hidden',
            flexShrink: 0,
          }}>
            {/* Level header */}
            <div style={{
              padding: '16px 20px', background: cfg.bg,
              borderBottom: `1px solid ${cfg.border}`,
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LvlIcon size={17} color={cfg.color} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: '15px', fontWeight: 800, color: cfg.color, letterSpacing: '0.05em' }}>
                  {t(lvl).toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {/* Safe translation lookup */}
                  {lvl === 'beginner' ? t('beginnerDesc') : lvl === 'intermediate' ? t('intermediateDesc') : t('advancedDesc')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: '18px', fontWeight: 800, color: cfg.color }}>
                  {pct}%
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  {done}/{lvlAttacks.length}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: '3px', background: 'var(--border)' }}>
              <div style={{ height: '100%', background: cfg.color, width: `${pct}%`, transition: 'width 0.4s ease' }} />
            </div>

            {/* Attack grid */}
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
              {lvlAttacks.map((a, idx) => {
                const Icon = ATTACK_ICON_MAP[a.id];
                const isViewed = viewed.has(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => onSelectAttack(a.id)}
                    style={{
                      textAlign: 'left', padding: '12px 14px',
                      borderRadius: '10px',
                      border: `1px solid ${isViewed ? a.borderColor : 'var(--border)'}`,
                      background: isViewed ? a.bgColor : 'var(--surface2)',
                      cursor: 'pointer', transition: 'all 0.18s',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}
                    onMouseEnter={e => {
                      if (!isViewed) {
                        (e.currentTarget as HTMLElement).style.background = a.bgColor;
                        (e.currentTarget as HTMLElement).style.borderColor = a.borderColor;
                      }
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      if (!isViewed) {
                        (e.currentTarget as HTMLElement).style.background = 'var(--surface2)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      }
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                      background: isViewed ? 'rgba(45,255,138,0.15)' : 'var(--border)',
                      border: `1px solid ${isViewed ? '#2dff8a' : 'var(--border2)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--mono)', fontSize: '9px',
                      color: isViewed ? '#2dff8a' : 'var(--text-muted)',
                    }}>
                      {isViewed ? <CheckCircle size={11} color="#2dff8a" /> : idx + 1}
                    </div>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                      background: a.bgColor, border: `1px solid ${a.borderColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {Icon && <Icon size={13} color={a.color} strokeWidth={1.5} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
                        color: isViewed ? a.color : 'var(--text-primary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        marginBottom: '2px',
                      }}>{a.name}</div>
                      <span style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: SEV_COLOR[a.severity] }}>
                        {a.severity}
                      </span>
                    </div>
                    <ChevronRight size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
