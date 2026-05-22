'use client';
import { useState, useMemo } from 'react';
import { ShieldAlert, ExternalLink, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { CVE_DATA, type CVERecord, type CVESeverity } from '../data/cves';
import { attacks } from '../data/attacks';
import { useLang } from '../lib/language';

interface Props { onSelectAttack?: (id: string) => void; }

const SEV_COLOR: Record<CVESeverity, string> = {
  CRITICAL: '#ff2d55',
  HIGH: '#ff7b2c',
  MEDIUM: '#e8c840',
  LOW: '#2dff8a',
};

const PATCH_COLOR: Record<string, string> = {
  patched: '#2dff8a',
  partial: '#e8c840',
  unpatched: '#ff2d55',
};

const PATCH_LABEL: Record<string, string> = {
  patched: 'PATCHED',
  partial: 'PARTIAL',
  unpatched: 'UNPATCHED',
};

const PATCH_EMOJI: Record<string, string> = {
  patched: '✓',
  partial: '⚡',
  unpatched: '✗',
};

type PatchFilter = 'all' | 'patched' | 'partial' | 'unpatched';
type SortBy = 'cvss' | 'year';

const SEV_ORDER: CVESeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function CVEExplorer({ onSelectAttack }: Props) {
  const { lang } = useLang();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<CVESeverity | 'ALL'>('ALL');
  const [patchFilter, setPatchFilter] = useState<PatchFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('cvss');

  const sevCounts = useMemo(() => {
    const counts: Record<CVESeverity, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    for (const cve of CVE_DATA) counts[cve.severity] = (counts[cve.severity] ?? 0) + 1;
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CVE_DATA
      .filter(cve => {
        if (severityFilter !== 'ALL' && cve.severity !== severityFilter) return false;
        if (patchFilter !== 'all' && cve.patchStatus !== patchFilter) return false;
        if (q) {
          const haystack = `${cve.cveId} ${cve.title}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'cvss') return b.cvssScore - a.cvssScore;
        return b.year - a.year;
      });
  }, [search, severityFilter, patchFilter, sortBy]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: '24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(232,200,64,0.1)',
            border: '1px solid rgba(232,200,64,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <ShieldAlert size={18} color="#e8c840" strokeWidth={1.5} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--display)',
              fontSize: 18,
              fontWeight: 800,
              color: '#e8c840',
              letterSpacing: '0.12em',
              marginBottom: 3,
            }}>
              CVE EXPLORER
            </div>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              marginBottom: 2,
            }}>
              {`// ${CVE_DATA.length} vulnerabilitas terdokumentasi`}
            </div>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--text-secondary)',
            }}>
              Basis data CVE nyata dengan skor CVSS dan status patch
            </div>
          </div>
        </div>

        {/* Severity stat badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SEV_ORDER.map(sev => (
            <div
              key={sev}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: `1px solid ${SEV_COLOR[sev]}44`,
                background: `${SEV_COLOR[sev]}10`,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: SEV_COLOR[sev],
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              {sevCounts[sev]} {sev}
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{
        flexShrink: 0,
        padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={14}
            color="var(--text-muted)"
            strokeWidth={1.5}
            style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari CVE ID atau judul..."
            style={{
              width: '100%',
              padding: '8px 36px 8px 34px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontFamily: 'var(--mono)',
              fontSize: 12,
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            }}
            onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#e8c840'; }}
            onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border)'; }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: 10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Severity pills */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['ALL', ...SEV_ORDER] as (CVESeverity | 'ALL')[]).map(sev => {
            const active = severityFilter === sev;
            const color = sev === 'ALL' ? 'var(--text-muted)' : SEV_COLOR[sev as CVESeverity];
            return (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: active
                    ? `1px solid ${sev === 'ALL' ? 'var(--text-muted)' : SEV_COLOR[sev as CVESeverity]}`
                    : '1px solid var(--border)',
                  background: active
                    ? sev === 'ALL' ? 'rgba(255,255,255,0.08)' : `${SEV_COLOR[sev as CVESeverity]}15`
                    : 'transparent',
                  color: active ? color : 'var(--text-muted)',
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  fontWeight: active ? 700 : 400,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {sev}
              </button>
            );
          })}
        </div>

        {/* Patch + Sort row */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['all', 'patched', 'partial', 'unpatched'] as PatchFilter[]).map(p => {
            const active = patchFilter === p;
            const color = p === 'all' ? 'var(--text-muted)' : PATCH_COLOR[p];
            const label = p === 'all' ? 'ALL' : `${PATCH_EMOJI[p]} ${PATCH_LABEL[p]}`;
            return (
              <button
                key={p}
                onClick={() => setPatchFilter(p)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: active
                    ? `1px solid ${p === 'all' ? 'var(--text-muted)' : PATCH_COLOR[p]}`
                    : '1px solid var(--border)',
                  background: active
                    ? p === 'all' ? 'rgba(255,255,255,0.08)' : `${PATCH_COLOR[p]}15`
                    : 'transparent',
                  color: active ? color : 'var(--text-muted)',
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  fontWeight: active ? 700 : 400,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            );
          })}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {([
              { key: 'cvss' as SortBy, label: 'CVSS ↓' },
              { key: 'year' as SortBy, label: 'TAHUN ↓' },
            ]).map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: sortBy === s.key ? '1px solid #e8c840' : '1px solid var(--border)',
                  background: sortBy === s.key ? 'rgba(232,200,64,0.1)' : 'transparent',
                  color: sortBy === s.key ? '#e8c840' : 'var(--text-muted)',
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  fontWeight: sortBy === s.key ? 700 : 400,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 24px' }}>

        {/* Count */}
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          marginBottom: 14,
          letterSpacing: '0.06em',
        }}>
          {filtered.length} CVE ditampilkan
        </div>

        {filtered.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: 12,
          }}>
            <ShieldAlert size={40} color="var(--text-muted)" strokeWidth={1} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              Tidak ada CVE yang cocok dengan filter
            </div>
          </div>
        ) : (
          filtered.map(cve => {
            const sevColor = SEV_COLOR[cve.severity];
            const patchColor = PATCH_COLOR[cve.patchStatus];
            const attackEntry = attacks.find(a => a.id === cve.attackId);
            const attackDisplayName = attackEntry?.name ?? cve.attackId;
            const displayProducts = cve.affectedProducts.slice(0, 3);
            const hasMore = cve.affectedProducts.length > 3;

            return (
              <div
                key={`${cve.cveId}-${cve.attackId}`}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 10,
                  flexShrink: 0,
                }}
              >
                {/* Top row: CVE ID, badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: sevColor,
                    letterSpacing: '0.04em',
                  }}>
                    {cve.cveId}
                  </span>

                  {/* Severity badge */}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: `${sevColor}18`,
                    border: `1px solid ${sevColor}55`,
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: sevColor,
                    letterSpacing: '0.06em',
                  }}>
                    {cve.severity}
                  </span>

                  {/* Year badge */}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em',
                  }}>
                    {cve.year}
                  </span>

                  {/* Patch badge */}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: `${patchColor}15`,
                    border: `1px solid ${patchColor}44`,
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: patchColor,
                    letterSpacing: '0.04em',
                  }}>
                    {PATCH_EMOJI[cve.patchStatus]} {PATCH_LABEL[cve.patchStatus]}
                  </span>
                </div>

                {/* Title */}
                <div style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                  lineHeight: 1.4,
                }}>
                  {cve.title}
                </div>

                {/* CVSS score bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                    letterSpacing: '0.04em',
                  }}>
                    CVSS:
                  </span>
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: sevColor,
                    flexShrink: 0,
                    minWidth: 30,
                  }}>
                    {cve.cvssScore.toFixed(1)}
                  </span>
                  <div style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 3,
                      background: sevColor,
                      width: `${(cve.cvssScore / 10) * 100}%`,
                      opacity: 0.8,
                    }} />
                  </div>
                </div>

                {/* Affected products */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                  }}>
                    Affected:
                  </span>
                  {displayProducts.map((prod, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '2px 7px',
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontFamily: 'var(--mono)',
                        fontSize: 10,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {prod}
                    </span>
                  ))}
                  {hasMore && (
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      color: 'var(--text-muted)',
                    }}>
                      +{cve.affectedProducts.length - 3} more
                    </span>
                  )}
                </div>

                {/* Description */}
                <div style={{
                  fontFamily: 'inherit',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  marginBottom: 12,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {cve.description}
                </div>

                {/* Bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <button
                    onClick={() => onSelectAttack?.(cve.attackId)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 5,
                      background: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      color: '#00d4ff',
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,212,255,0.15)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.4)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,212,255,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,212,255,0.2)';
                    }}
                  >
                    → {attackDisplayName}
                  </button>

                  <a
                    href={`https://nvd.nist.gov/vuln/detail/${cve.cveId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '5px 12px',
                      borderRadius: 5,
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border2)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
                    }}
                  >
                    NVD
                    <ExternalLink size={11} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
