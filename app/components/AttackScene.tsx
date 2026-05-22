'use client';
import React, { useMemo, useState, useEffect } from 'react';
import {
  Terminal, Monitor, Server, Database, Building2, Skull,
  Bot, Globe, BrainCircuit, Package, User, Cloud, type LucideIcon,
} from 'lucide-react';
import type { AttackSceneData, SceneEntity, EntityRole } from '../data/scenes';

// ── config ────────────────────────────────────────────────────────────────────
const NODE_R  = 46;
const ICON_SZ = 26;

const ROLE_ICON: Record<EntityRole, LucideIcon> = {
  attacker: Terminal, victim: Monitor,  server: Server,
  database: Database, organization: Building2, c2: Skull,
  botnet:   Bot,      dns: Globe,       ai: BrainCircuit,
  package:  Package,  person: User,     cloud: Cloud,
};

const ROLE_COLOR: Record<EntityRole, string> = {
  attacker:     '#ff4444',
  victim:       '#4d94ff',
  server:       '#9ab',
  database:     '#00d4ff',
  organization: '#ff9500',
  c2:           '#ff1155',
  botnet:       '#b44dff',
  dns:          '#2dff8a',
  ai:           '#a855f7',
  package:      '#e040fb',
  person:       '#ffc83d',
  cloud:        '#60a5fa',
};

// ── geometry ──────────────────────────────────────────────────────────────────
function edgePts(a: SceneEntity, b: SceneEntity, r = NODE_R + 6) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const d  = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / d, ny = dy / d;
  return { x1: a.x + nx * r, y1: a.y + ny * r, x2: b.x - nx * r, y2: b.y - ny * r };
}

function curvePath(x1: number, y1: number, x2: number, y2: number, k = 0.18) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const cx = mx - (dy / len) * len * k;
  const cy = my + (dx / len) * len * k;
  return { d: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, cx, cy };
}

function arrowPts(x2: number, y2: number, cx: number, cy: number, sz = 11) {
  const a = Math.atan2(y2 - cy, x2 - cx);
  return (
    `${x2},${y2} ` +
    `${x2 - sz * Math.cos(a - 0.4)},${y2 - sz * Math.sin(a - 0.4)} ` +
    `${x2 - sz * Math.cos(a + 0.4)},${y2 - sz * Math.sin(a + 0.4)}`
  );
}

function bezierMid(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number) {
  return {
    mx: 0.25 * x1 + 0.5 * cx + 0.25 * x2,
    my: 0.25 * y1 + 0.5 * cy + 0.25 * y2,
  };
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function NodeTooltip({ e, color }: { e: SceneEntity; color: string }) {
  const roleText = e.role.toUpperCase();
  const hasSub   = Boolean(e.sublabel);

  const halfW = Math.min(
    130,
    Math.max(
      44,
      Math.ceil(roleText.length * 6.5 / 2) + 14,
      hasSub ? Math.ceil(e.sublabel!.length * 5.8 / 2) + 14 : 0,
    ),
  );

  const boxH   = hasSub ? 36 : 24;
  const PAD    = 10;
  const above  = e.y - NODE_R - PAD - boxH > 4;
  const boxTop = above ? e.y - NODE_R - PAD - boxH : e.y + NODE_R + PAD;
  const boxLeft = Math.min(Math.max(e.x - halfW, 4), 756 - halfW * 2);
  const textX   = boxLeft + halfW;

  return (
    <g style={{ pointerEvents: 'none', animation: 'step-fade-in 0.15s ease-out' }}>
      <rect x={boxLeft} y={boxTop} width={halfW * 2} height={boxH}
        rx="7" fill="rgba(5,7,14,0.97)" stroke={color} strokeWidth="0.9" />
      <text x={textX} y={boxTop + (hasSub ? 14 : 15)}
        textAnchor="middle" fontSize="10" fontFamily="var(--mono)"
        fontWeight="700" fill={color} letterSpacing="0.06em">
        {roleText}
      </text>
      {hasSub && (
        <text x={textX} y={boxTop + 29}
          textAnchor="middle" fontSize="9" fontFamily="var(--mono)"
          fill="rgba(255,255,255,0.5)">
          {e.sublabel}
        </text>
      )}
    </g>
  );
}

// ── EntityNode ────────────────────────────────────────────────────────────────
function EntityNode({ e, active, idx }: { e: SceneEntity; active: boolean; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon  = ROLE_ICON[e.role];
  const color = ROLE_COLOR[e.role];
  const dim   = 'rgba(255,255,255,0.18)';

  return (
    <g
      filter={active ? 'url(#glow-md)' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'crosshair',
        animation: `node-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.08}s both`,
        transformBox: 'fill-box' as React.CSSProperties['transformBox'],
        transformOrigin: `${e.x}px ${e.y}px`,
      }}
    >
      {active && <>
        <circle cx={e.x} cy={e.y} r={NODE_R}
          fill={color} opacity="0">
          <animate attributeName="r"       values={`${NODE_R};${NODE_R+38};${NODE_R+38}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0;0"                               dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={e.x} cy={e.y} r={NODE_R}
          fill={color} opacity="0">
          <animate attributeName="r"       values={`${NODE_R};${NODE_R+38};${NODE_R+38}`} dur="2s" begin="-1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0;0"                               dur="2s" begin="-1s" repeatCount="indefinite" />
        </circle>
        <circle cx={e.x} cy={e.y} r={NODE_R + 4}
          fill="none" stroke={color} strokeWidth="2" opacity="0">
          <animate attributeName="r"       values={`${NODE_R+2};${NODE_R+28};${NODE_R+28}`} dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0;0"                                 dur="1.8s" repeatCount="indefinite" />
        </circle>
      </>}

      <circle cx={e.x} cy={e.y} r={NODE_R + 2}
        fill="none"
        stroke={hovered ? color : active ? color : dim}
        strokeWidth="0.8"
        strokeDasharray={active ? undefined : '4 3'}
        opacity={hovered ? 0.7 : active ? 0.55 : 0.2} />

      <circle cx={e.x} cy={e.y} r={NODE_R}
        fill={active ? `${color}22` : hovered ? `${color}14` : 'rgba(255,255,255,0.03)'}
        stroke={hovered ? color : active ? color : dim}
        strokeWidth={active ? 2.5 : hovered ? 1.8 : 1}
        style={{ transition: 'stroke 0.15s, fill 0.15s, stroke-width 0.15s' }} />

      <circle cx={e.x} cy={e.y} r={NODE_R - 10}
        fill="none"
        stroke={active ? color : dim}
        strokeWidth="0.5"
        opacity={active ? 0.4 : 0.1} />

      <foreignObject x={e.x - ICON_SZ / 2} y={e.y - ICON_SZ / 2}
        width={ICON_SZ} height={ICON_SZ}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Icon size={ICON_SZ - 2} color={hovered ? color : active ? color : dim} strokeWidth={active ? 1.5 : 1} />
        </div>
      </foreignObject>

      {/* Larger labels */}
      <text x={e.x} y={e.y + NODE_R + 20}
        textAnchor="middle" fontSize="13" fontFamily="var(--mono)"
        fontWeight={active ? '700' : '400'}
        fill={active ? color : hovered ? `${color}99` : 'rgba(255,255,255,0.32)'}>
        {e.label}
      </text>
      {e.sublabel && (
        <text x={e.x} y={e.y + NODE_R + 34}
          textAnchor="middle" fontSize="10" fontFamily="var(--mono)"
          fill={active ? `${color}88` : 'rgba(255,255,255,0.16)'}>
          [{e.sublabel}]
        </text>
      )}

      {hovered && <NodeTooltip e={e} color={color} />}
    </g>
  );
}

// ── DimConnection ─────────────────────────────────────────────────────────────
function DimConnection({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const { d } = curvePath(x1, y1, x2, y2, 0.1);
  return <path d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="5 4" />;
}

// ── ActiveConnection ──────────────────────────────────────────────────────────
function ActiveConnection({
  connId, x1, y1, x2, y2, color, label, style, onBadgeClick,
}: {
  connId: string;
  x1: number; y1: number; x2: number; y2: number;
  color: string; label?: string; style?: 'recon' | 'normal' | 'danger';
  onBadgeClick?: () => void;
}) {
  const col    = style === 'danger' ? '#ff3333' : style === 'recon' ? 'rgba(180,180,220,0.75)' : color;
  const dashed = style === 'recon';
  const pathId = `ap-${connId}`;

  const { d, cx, cy } = curvePath(x1, y1, x2, y2);
  const arrow          = arrowPts(x2, y2, cx, cy);
  const { mx, my }     = bezierMid(x1, y1, x2, y2, cx, cy);

  // Badge width: ideal based on text, capped by available edge length
  const edgeDist    = Math.hypot(x2 - x1, y2 - y1);
  const idealHalfW  = label ? Math.max(52, Math.ceil(label.length * 6.2 / 2) + 14) : 52;
  const maxHalfW    = Math.max(34, Math.floor(edgeDist / 2) - 8);
  const badgeHalfW  = Math.min(idealHalfW, maxHalfW);
  // When capped, compress text to fit available badge interior via SVG textLength
  const textFitW    = badgeHalfW < idealHalfW ? (badgeHalfW - 10) * 2 : undefined;

  const particles = [
    { delay: '-1.65s', r: 10,  op: '0;1;1;0'       },
    { delay: '-1.1s',  r: 6.5, op: '0;0.62;0.62;0' },
    { delay: '-0.55s', r: 4,   op: '0;0.35;0.35;0' },
    { delay: '0s',     r: 2.5, op: '0;0.16;0.16;0' },
  ];

  return (
    <g>
      <defs>
        <path id={pathId} d={d} />
      </defs>

      <path d={d} fill="none" stroke={col} strokeWidth="12" opacity="0.08" />
      <path d={d} fill="none" stroke={col} strokeWidth="5"  opacity="0.14" />
      <path d={d} fill="none" stroke={col} strokeWidth="1.8" opacity="0.88"
        strokeDasharray={dashed ? '8 5' : undefined} />

      {!dashed && (
        <path d={d} fill="none" stroke={col} strokeWidth="1.4" opacity="0.55" strokeDasharray="14 10">
          <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.55s" repeatCount="indefinite" />
        </path>
      )}

      {!dashed && <polygon points={arrow} fill={col} opacity="0.95" />}

      {!dashed && particles.map(({ delay, r, op }, i) => (
        <circle key={i} r={r} fill={col} opacity="0" filter="url(#glow-md)">
          <animateMotion dur="2.2s" begin={delay} repeatCount="indefinite" calcMode="linear">
            <mpath href={`#${pathId}`} />
          </animateMotion>
          <animate attributeName="opacity" values={op} keyTimes="0;0.05;0.85;1"
            dur="2.2s" begin={delay} repeatCount="indefinite" />
        </circle>
      ))}

      {label && (
        <g transform={`translate(${mx},${my})`} filter="url(#glow-md)"
          style={{ cursor: onBadgeClick ? 'pointer' : 'default' }}
          onClick={onBadgeClick}>
          <rect x={-badgeHalfW} y="-12" width={badgeHalfW * 2} height="24" rx="12"
            fill="rgba(5,7,14,0.96)" stroke={col} strokeWidth="1" />
          <circle cx={-(badgeHalfW - 8)} cy="0" r="2.5" fill={col} opacity="0.7" />
          <circle cx={  badgeHalfW - 8}  cy="0" r="2.5" fill={col} opacity="0.7" />
          <text textAnchor="middle" dy="4" fontSize="10" fontFamily="var(--mono)"
            fontWeight="700" fill={col} letterSpacing="0.06em"
            textLength={textFitW} lengthAdjust={textFitW ? 'spacingAndGlyphs' : undefined}>
            {label.toUpperCase()}
          </text>
        </g>
      )}
    </g>
  );
}

// ── Background ────────────────────────────────────────────────────────────────
function SceneBg({ attackColor }: { attackColor: string }) {
  return (
    <g opacity="0.4">
      <defs>
        <pattern id="dots" width="38" height="38" patternUnits="userSpaceOnUse">
          <circle cx="19" cy="19" r="1" fill="rgba(255,255,255,0.07)" />
        </pattern>
      </defs>
      <rect width="760" height="340" fill="url(#dots)" />
      <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none">
        <polyline points="0,60 20,60 20,20 60,20" />
        <polyline points="0,100 10,100 10,10 100,10" />
        <polyline points="760,60 740,60 740,20 700,20" />
        <polyline points="760,100 750,100 750,10 660,10" />
        <polyline points="0,280 20,280 20,320 60,320" />
        <polyline points="760,280 740,280 740,320 700,320" />
      </g>
      <circle cx="380" cy="170" r="180" fill={`${attackColor}06`} />
      <circle cx="380" cy="170" r="220" fill="none" stroke={attackColor} strokeWidth="0.5" opacity="0.06" strokeDasharray="12 8">
        <animateTransform attributeName="transform" type="rotate" from="0 380 170" to="360 380 170" dur="40s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="170" r="140" fill="none" stroke={attackColor} strokeWidth="0.4" opacity="0.05" strokeDasharray="6 14">
        <animateTransform attributeName="transform" type="rotate" from="360 380 170" to="0 380 170" dur="28s" repeatCount="indefinite" />
      </circle>
      {/* Scan line */}
      <rect x="0" y="0" width="760" height="3" fill={`${attackColor}18`} style={{ animation: 'scan-line 6s linear infinite' }} />
    </g>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface Props {
  scene: AttackSceneData;
  currentStep: number;
  attackColor: string;
  stepKey: string;
  onBadgeClick?: () => void;
}

export default function AttackScene({ scene, currentStep, attackColor, stepKey, onBadgeClick }: Props) {
  const [flash,   setFlash]   = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [nodeKey, setNodeKey] = useState(0);

  // Step change: connection fade
  useEffect(() => {
    setFlash(true);
    setAnimKey(k => k + 1);
    const t = setTimeout(() => setFlash(false), 400);
    return () => clearTimeout(t);
  }, [currentStep]);

  // Scene/attack change: node pop-in
  useEffect(() => {
    setNodeKey(k => k + 1);
  }, [scene]);

  const stepData   = scene.steps[currentStep];
  const entityMap  = useMemo(() => Object.fromEntries(scene.entities.map(e => [e.id, e])), [scene]);
  const activeId   = stepData?.conn ?? null;
  const highlights = new Set(stepData?.highlight ?? []);
  const activeConn = activeId ? scene.connections.find(c => c.id === activeId) : null;

  return (
    <svg width="100%" height="100%"
      viewBox="0 0 760 340"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}>

      <defs>
        <filter id="glow-md" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-lg" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <SceneBg attackColor={attackColor} />

      {flash && (
        <rect width="760" height="340" opacity="0" fill={attackColor}>
          <animate attributeName="opacity" values="0.1;0" dur="0.4s" fill="freeze" />
        </rect>
      )}

      {/* Dim connections */}
      {scene.connections.map(c => {
        if (c.id === activeId) return null;
        const from = entityMap[c.from], to = entityMap[c.to];
        if (!from || !to) return null;
        return <DimConnection key={c.id} {...edgePts(from, to)} />;
      })}

      {/* Active connection — fades in on step change */}
      <g key={animKey} style={{ animation: 'step-fade-in 0.35s ease-out' }}>
        {activeConn && (() => {
          const from = entityMap[activeConn.from], to = entityMap[activeConn.to];
          if (!from || !to) return null;
          return (
            <ActiveConnection
              key={stepKey}
              connId={activeConn.id}
              {...edgePts(from, to)}
              color={attackColor}
              label={stepData?.label}
              style={stepData?.style}
              onBadgeClick={onBadgeClick}
            />
          );
        })()}
      </g>

      {/* Entity nodes — pop in on attack change, staggered */}
      {scene.entities.map((e, idx) => (
        <EntityNode key={`${nodeKey}-${e.id}`} e={e} active={highlights.has(e.id)} idx={idx} />
      ))}

      {/* Step counter */}
      <g filter="url(#glow-md)">
        <rect x="14" y="304" width="70" height="28" rx="7"
          fill="rgba(5,7,14,0.90)" stroke={attackColor} strokeWidth="1.2" />
        <text x="49" y="323" textAnchor="middle"
          fontSize="13" fontFamily="var(--mono)" fontWeight="700" fill={attackColor}>
          {String(currentStep + 1).padStart(2, '0')}/{scene.steps.length}
        </text>
      </g>
    </svg>
  );
}
