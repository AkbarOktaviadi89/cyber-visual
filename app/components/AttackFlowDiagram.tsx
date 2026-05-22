'use client';
import React from 'react';
import { Check } from 'lucide-react';
import type { Attack } from '../data/attacks';
import { STEP_ICON_MAP } from '../lib/icons';

interface Props {
  attack: Attack;
  currentStep: number;
  onStepSelect: (i: number) => void;
}

export default function AttackFlowDiagram({ attack, currentStep, onStepSelect }: Props) {
  return (
    <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        padding: '24px 20px', gap: 0, minWidth: 'max-content',
      }}>
        {attack.steps.map((step, i) => {
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          const color = isActive ? attack.color : isDone ? '#2dff8a' : 'var(--text-muted)';
          const border = isActive ? attack.borderColor : isDone ? 'rgba(45,255,138,0.4)' : 'var(--border)';
          const bg = isActive ? attack.bgColor : isDone ? 'rgba(45,255,138,0.06)' : 'transparent';
          const Icon = STEP_ICON_MAP[step.icon];

          return (
            <React.Fragment key={i}>
              <button
                onClick={() => onStepSelect(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  width: '88px', padding: 0,
                }}
              >
                {/* Circle with icon */}
                <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: bg, border: `2px solid ${border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s',
                    boxShadow: isActive ? `0 0 22px ${attack.color}35` : 'none',
                  }}>
                    {isDone
                      ? <Check size={22} color="#2dff8a" strokeWidth={2.5} />
                      : Icon
                        ? <Icon size={22} color={color} strokeWidth={1.5} />
                        : <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color }}>{i + 1}</span>
                    }
                  </div>
                  {/* Step number badge */}
                  <div style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: isActive ? attack.color : isDone ? '#2dff8a' : 'var(--surface3)',
                    border: '1.5px solid var(--surface)',
                    fontSize: '8px', fontFamily: 'var(--mono)', fontWeight: 700,
                    color: (isActive || isDone) ? '#000' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i + 1}
                  </div>
                </div>
                {/* Label */}
                <div style={{
                  marginTop: '8px',
                  fontSize: '9px', fontFamily: 'var(--mono)', fontWeight: 600,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  textAlign: 'center', lineHeight: 1.35, maxWidth: '80px',
                }}>
                  {step.label}
                </div>
              </button>

              {/* Arrow connector */}
              {i < attack.steps.length - 1 && (
                <div style={{
                  flexShrink: 0, width: '40px', height: '56px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
                    <line
                      x1="2" y1="8" x2="28" y2="8"
                      stroke={isDone ? '#2dff8a' : 'rgba(255,255,255,0.12)'}
                      strokeWidth="1.5"
                      strokeDasharray={isDone ? undefined : '5 3'}
                    />
                    <path
                      d="M24 4 L36 8 L24 12"
                      stroke={isDone ? '#2dff8a' : 'rgba(255,255,255,0.12)'}
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
