'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '../lib/language';

interface City {
  id: string; x: number; y: number; name: string;
  country: string; isAttacker: boolean; color: string;
}

const CITIES: City[] = [
  { id: 'moscow',    x: 579, y: 91,  name: 'Moscow',    country: 'Russia',    isAttacker: true,  color: '#ff2d55' },
  { id: 'beijing',   x: 790, y: 134, name: 'Beijing',   country: 'China',     isAttacker: true,  color: '#ff7b2c' },
  { id: 'shanghai',  x: 810, y: 158, name: 'Shanghai',  country: 'China',     isAttacker: true,  color: '#ff7b2c' },
  { id: 'tehran',    x: 624, y: 145, name: 'Tehran',    country: 'Iran',      isAttacker: true,  color: '#ff2d55' },
  { id: 'pyongyang', x: 817, y: 136, name: 'Pyongyang', country: 'N. Korea',  isAttacker: true,  color: '#ff2d55' },
  { id: 'bucharest', x: 543, y: 116, name: 'Bucharest', country: 'Romania',   isAttacker: true,  color: '#a78bfa' },
  { id: 'saopaulo',  x: 357, y: 302, name: 'São Paulo', country: 'Brazil',    isAttacker: true,  color: '#e8c840' },
  { id: 'lagos',     x: 489, y: 223, name: 'Lagos',     country: 'Nigeria',   isAttacker: true,  color: '#e8c840' },
  { id: 'newyork',   x: 284, y: 131, name: 'New York',  country: 'USA',       isAttacker: false, color: '#00d4ff' },
  { id: 'london',    x: 480, y: 102, name: 'London',    country: 'UK',        isAttacker: false, color: '#00d4ff' },
  { id: 'frankfurt', x: 503, y: 107, name: 'Frankfurt', country: 'Germany',   isAttacker: false, color: '#00d4ff' },
  { id: 'sydney',    x: 884, y: 332, name: 'Sydney',    country: 'Australia', isAttacker: false, color: '#00d4ff' },
  { id: 'seoul',     x: 821, y: 140, name: 'Seoul',     country: 'S. Korea',  isAttacker: false, color: '#00d4ff' },
  { id: 'tokyo',     x: 853, y: 145, name: 'Tokyo',     country: 'Japan',     isAttacker: false, color: '#00d4ff' },
  { id: 'singapore', x: 756, y: 237, name: 'Singapore', country: 'Singapore', isAttacker: false, color: '#00d4ff' },
  { id: 'mumbai',    x: 674, y: 189, name: 'Mumbai',    country: 'India',     isAttacker: false, color: '#00d4ff' },
];

const ATTACKERS = CITIES.filter(c => c.isAttacker);
const TARGETS   = CITIES.filter(c => !c.isAttacker);

const ATTACK_TYPES = ['DDoS', 'Ransomware', 'Phishing', 'SQLi', 'Zero-Day', 'MITM', 'Malware', 'Brute Force'];

interface AttackLine {
  id: number;
  src: City; dst: City;
  type: string;
  startTime: number;
  duration: number;
}

const TOP_ATTACKERS = [
  { country: 'Russia',   flag: '🇷🇺', pct: 34, color: '#ff2d55' },
  { country: 'China',    flag: '🇨🇳', pct: 28, color: '#ff7b2c' },
  { country: 'N. Korea', flag: '🇰🇵', pct: 18, color: '#ff2d55' },
  { country: 'Iran',     flag: '🇮🇷', pct: 12, color: '#ff2d55' },
  { country: 'Others',   flag: '🌍', pct: 8,  color: '#a78bfa' },
];

function getArcPath(src: City, dst: City): string {
  const midX = (src.x + dst.x) / 2;
  const midY = Math.min(src.y, dst.y) - Math.abs(dst.x - src.x) * 0.15 - 30;
  return `M ${src.x},${src.y} Q ${midX},${midY} ${dst.x},${dst.y}`;
}

export default function AttackMapLive() {
  const { lang } = useLang();

  const [lines, setLines]     = useState<AttackLine[]>([]);
  const [counter, setCounter] = useState(127483);
  const [log, setLog]         = useState<{ src: string; dst: string; type: string; ago: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const src = ATTACKERS[Math.floor(Math.random() * ATTACKERS.length)];
      const dst = TARGETS[Math.floor(Math.random() * TARGETS.length)];
      const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
      const duration = 2000 + Math.random() * 1500;
      const newId = ++idRef.current;
      const newLine: AttackLine = { id: newId, src, dst, type, startTime: Date.now(), duration };

      setLines(prev => [...prev.slice(-7), newLine]);
      setCounter(prev => prev + Math.floor(Math.random() * 5) + 1);
      setLog(prev => [
        { src: src.country, dst: dst.country, type, ago: 0 },
        ...prev.slice(0, 7),
      ]);

      setTimeout(() => {
        setLines(prev => prev.filter(l => l.id !== newId));
      }, duration + 500);
    }, 1800);

    const ageInterval = setInterval(() => {
      setLog(prev => prev.map(l => ({ ...l, ago: l.ago + 2 })));
    }, 2000);

    return () => { clearInterval(interval); clearInterval(ageInterval); };
  }, []);

  // Grid lines
  const hLines: number[] = [];
  for (let y = 0; y <= 480; y += 60) hLines.push(y);
  const vLines: number[] = [];
  for (let x = 0; x <= 960; x += 60) vLines.push(x);

  const getSrcColor = (country: string): string => {
    const city = CITIES.find(c => c.country === country);
    return city ? city.color : '#00d4ff';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: '#060810' }}>
      <style>{`
        @keyframes draw-line {
          0%   { stroke-dashoffset: 400; opacity: 0; }
          8%   { opacity: 0.9; }
          85%  { stroke-dashoffset: 0; opacity: 0.9; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes pulse-ring {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(3); }
        }
        @keyframes impact {
          0%   { r: 2; opacity: 0; }
          50%  { r: 8; opacity: 0.8; }
          100% { r: 14; opacity: 0; }
        }
        @keyframes blink-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>

      {/* Header bar */}
      <div style={{
        flexShrink: 0,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,212,255,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Pulsing red dot */}
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ff2d55',
            animation: 'blink-dot 1.2s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--display)',
            fontSize: 14,
            fontWeight: 700,
            color: '#00d4ff',
            letterSpacing: '0.1em',
          }}>
            LIVE THREAT MAP
          </span>
          <span style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'var(--mono)',
          }}>
            // simulasi peta serangan global
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: '#ff2d55',
          letterSpacing: '0.06em',
        }}>
          {counter.toLocaleString()} ATTACKS DETECTED TODAY
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>

        {/* SVG map */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <svg
            viewBox="0 0 960 480"
            style={{ width: '100%', height: '100%' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {hLines.map(y => (
              <line key={`h${y}`} x1={0} y1={y} x2={960} y2={y}
                stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" />
            ))}
            {vLines.map(x => (
              <line key={`v${x}`} x1={x} y1={0} x2={x} y2={480}
                stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" />
            ))}

            {/* Continent polygons */}
            <polygon
              points="40,65 80,50 140,45 195,58 245,95 258,145 238,200 210,248 178,270 148,262 118,230 93,192 70,152 60,120"
              fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8"
            />
            <polygon
              points="170,255 205,245 235,260 258,300 268,368 242,448 210,458 178,432 158,380 148,322 162,275"
              fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8"
            />
            <polygon
              points="432,58 458,44 502,47 536,62 542,86 528,108 490,120 458,132 430,115 420,86 428,68"
              fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8"
            />
            <polygon
              points="446,178 488,164 540,170 580,195 594,245 588,306 560,375 525,442 485,452 453,428 430,376 416,308 420,236 436,200"
              fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8"
            />
            <polygon
              points="540,52 588,38 678,42 758,50 835,68 895,108 945,155 950,215 916,265 855,295 795,305 748,285 696,275 655,245 615,215 585,185 555,155 540,125 535,88"
              fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8"
            />
            <polygon
              points="815,326 862,310 916,320 940,356 935,396 905,426 864,430 828,410 806,374 804,346"
              fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8"
            />

            {/* City dots */}
            {CITIES.map(city => (
              <g key={city.id}>
                <circle cx={city.x} cy={city.y} r={3} fill={city.color} opacity={0.9} />
                {city.isAttacker && (
                  <circle
                    cx={city.x} cy={city.y} r={6}
                    fill="none" stroke={city.color} strokeWidth="1"
                    style={{
                      animation: 'pulse-ring 2s ease-out infinite',
                      transformOrigin: `${city.x}px ${city.y}px`,
                    }}
                  />
                )}
                <text
                  x={city.x} y={city.y - 7}
                  textAnchor="middle"
                  fill={city.color}
                  fontSize="7"
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  {city.name}
                </text>
              </g>
            ))}

            {/* Attack lines */}
            {lines.map(line => (
              <g key={line.id}>
                <path
                  d={getArcPath(line.src, line.dst)}
                  fill="none"
                  stroke={line.src.color}
                  strokeWidth="1.5"
                  opacity="0.8"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 400,
                    strokeDashoffset: 400,
                    animation: `draw-line ${line.duration}ms ease-in-out forwards`,
                  }}
                />
                <circle
                  cx={line.dst.x} cy={line.dst.y} r={5}
                  fill="none" stroke={line.src.color} strokeWidth="1.5"
                  style={{ animation: `impact ${line.duration}ms ease-out forwards` }}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Right sidebar */}
        <div style={{
          width: 220,
          flexShrink: 0,
          borderLeft: '1px solid rgba(0,212,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Top attacker nations */}
          <div style={{
            padding: 14,
            borderBottom: '1px solid rgba(0,212,255,0.1)',
            flexShrink: 0,
          }}>
            <div style={{
              fontSize: 9,
              color: '#00d4ff',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 10,
            }}>
              TOP ATTACKER NATIONS
            </div>
            {TOP_ATTACKERS.map(item => (
              <div key={item.country} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                <span style={{ fontSize: 12, flexShrink: 0 }}>{item.flag}</span>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', width: 56, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.country}
                </span>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${item.pct}%`,
                    borderRadius: 2,
                    background: item.color,
                  }} />
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--mono)', flexShrink: 0, width: 28, textAlign: 'right' }}>
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>

          {/* Attack log */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
            <div style={{
              fontSize: 9,
              color: '#00d4ff',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 10,
              flexShrink: 0,
            }}>
              RECENT ATTACKS
            </div>
            {log.map((entry, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  marginBottom: 8,
                  paddingBottom: 8,
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: getSrcColor(entry.src),
                  marginBottom: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {entry.src} → {entry.dst}
                </div>
                <div style={{
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--mono)',
                }}>
                  {entry.type} • {entry.ago}s ago
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
