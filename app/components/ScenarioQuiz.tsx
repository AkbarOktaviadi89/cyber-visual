'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, BookOpen, Trophy } from 'lucide-react';
import { SCENARIOS, type Scenario, type ScenarioDifficulty } from '../data/scenarios';
import { useLang } from '../lib/language';

const DIFF_META: Record<ScenarioDifficulty, { label: string; color: string }> = {
  mudah:    { label: 'Mudah',    color: '#2dff8a' },
  menengah: { label: 'Menengah', color: '#e8c840' },
  sulit:    { label: 'Sulit',    color: '#ff2d55' },
};

const DIFF_FILTERS: { key: ScenarioDifficulty | 'all'; label: string; color: string }[] = [
  { key: 'all',      label: 'Semua',    color: '#7a8299' },
  { key: 'mudah',    label: 'Mudah',    color: '#2dff8a' },
  { key: 'menengah', label: 'Menengah', color: '#e8c840' },
  { key: 'sulit',    label: 'Sulit',    color: '#ff2d55' },
];

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

interface ScenarioCardProps {
  scenario: Scenario;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onLearnAttack: (id: string) => void;
}

function ScenarioCard({ scenario, selectedIndex, onSelect, onLearnAttack }: ScenarioCardProps) {
  const { t, lang } = useLang();
  const answered    = selectedIndex !== null;
  const isCorrect   = answered && scenario.options[selectedIndex].isCorrect;
  const diff        = DIFF_META[scenario.difficulty];

  return (
    <div style={{
      background: 'var(--surface)', border: `1px solid ${answered ? (isCorrect ? 'rgba(45,255,138,0.25)' : 'rgba(255,45,85,0.25)') : 'var(--border)'}`,
      borderRadius: '12px', overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Card header */}
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
        background: answered ? (isCorrect ? 'rgba(45,255,138,0.04)' : 'rgba(255,45,85,0.04)') : 'var(--surface2)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <span style={{
          padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--mono)',
          fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
          background: `${diff.color}18`, color: diff.color, border: `1px solid ${diff.color}40`,
          flexShrink: 0,
        }}>
          {diff.label}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
          {scenario.title}
        </span>
        {answered && (
          isCorrect
            ? <CheckCircle size={16} color="#2dff8a" />
            : <XCircle    size={16} color="#ff2d55" />
        )}
      </div>

      {/* Context + symptoms */}
      <div style={{ padding: '16px 18px' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '12px' }}>
          {scenario.context}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
          {scenario.symptoms.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: '#00d4ff', flexShrink: 0, marginTop: '1px', fontFamily: 'var(--mono)', fontSize: '11px' }}>▸</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {scenario.options.map((opt, i) => {
            const isSelected = selectedIndex === i;
            const showGreen  = answered && opt.isCorrect;
            const showRed    = answered && isSelected && !opt.isCorrect;

            let borderColor = 'var(--border2)';
            let bg          = 'var(--surface2)';
            let color       = 'var(--text-secondary)';

            if (showGreen)  { borderColor = '#2dff8a'; bg = 'rgba(45,255,138,0.07)'; color = '#2dff8a'; }
            else if (showRed) { borderColor = '#ff2d55'; bg = 'rgba(255,45,85,0.07)';  color = '#ff2d55'; }
            else if (isSelected && !answered) { borderColor = '#00d4ff'; bg = 'rgba(0,212,255,0.07)'; color = '#00d4ff'; }

            return (
              <button key={i} onClick={() => !answered && onSelect(i)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '11px 14px', borderRadius: '8px',
                  border: `1px solid ${borderColor}`, background: bg, color,
                  fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 1.5,
                  textAlign: 'left', cursor: answered ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${borderColor}`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--mono)', fontSize: '10px',
                  background: showGreen ? 'rgba(45,255,138,0.18)' : showRed ? 'rgba(255,45,85,0.18)' : 'transparent',
                }}>
                  {showGreen ? <CheckCircle size={11} color="#2dff8a" />
                   : showRed  ? <XCircle    size={11} color="#ff2d55" />
                   : OPTION_LETTERS[i]}
                </div>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div style={{
            padding: '12px 14px', borderRadius: '8px', marginBottom: '12px',
            background: isCorrect ? 'rgba(45,255,138,0.05)' : 'rgba(255,123,44,0.05)',
            border: `1px solid ${isCorrect ? 'rgba(45,255,138,0.2)' : 'rgba(255,123,44,0.2)'}`,
            animation: 'view-fade-in 0.25s ease-out',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '6px', color: isCorrect ? '#2dff8a' : '#ff7b2c' }}>
              {isCorrect ? `✓ ${t('correct')}` : `✗ ${t('incorrect')}`}
            </div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {scenario.explanation}
            </p>
          </div>
        )}

        {/* Learn button */}
        <button
          disabled={!answered}
          onClick={() => onLearnAttack(scenario.attackId)}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '9px 16px', borderRadius: '7px',
            border: answered ? '1px solid rgba(0,212,255,0.35)' : '1px solid var(--border)',
            background: answered ? 'rgba(0,212,255,0.07)' : 'transparent',
            color: answered ? '#00d4ff' : 'var(--text-muted)',
            fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.06em',
            cursor: answered ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
        >
          <BookOpen size={12} />
          {lang === 'id' ? 'Pelajari Serangan Ini' : 'Learn This Attack'}
        </button>
      </div>
    </div>
  );
}

interface Props {
  onSelectAttack?: (id: string) => void;
}

export default function ScenarioQuiz({ onSelectAttack }: Props) {
  const { t, lang } = useLang();
  const [activeDiff, setActiveDiff] = useState<ScenarioDifficulty | 'all'>('all');
  const [answers,    setAnswers]    = useState<Map<string, number>>(new Map());

  const filtered = SCENARIOS.filter(s => activeDiff === 'all' || s.difficulty === activeDiff);

  const totalAnswered = answers.size;
  const totalCorrect  = Array.from(answers.entries()).filter(([id, idx]) => {
    const sc = SCENARIOS.find(s => s.id === id);
    return sc && sc.options[idx].isCorrect;
  }).length;

  const handleSelect = (id: string, index: number) => {
    setAnswers(prev => {
      if (prev.has(id)) return prev;
      const next = new Map(prev);
      next.set(id, index);
      return next;
    });
  };

  const handleLearnAttack = (attackId: string) => {
    onSelectAttack?.(attackId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg)' }}>

      {/* Header */}
      <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: '18px', fontWeight: 700, color: '#e8c840', letterSpacing: '0.12em' }}>
                SCENARIO QUIZ
              </h2>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                // {lang === 'id' ? 'Identifikasi jenis serangan dari gejala' : 'Identify attack types from symptoms'}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
              {lang === 'id' ? 'Baca skenario, analisis gejalanya, dan pilih jawaban yang benar.' : 'Read the scenario, analyze symptoms, and choose the correct answer.'}
            </p>
          </div>

          {/* Score panel */}
          <div style={{
            display: 'flex', gap: '14px', padding: '10px 16px', borderRadius: '10px',
            background: 'var(--surface2)', border: '1px solid var(--border2)', flexShrink: 0,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 800, color: '#e8c840' }}>
                {totalAnswered}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                {lang === 'id' ? 'DIJAWAB' : 'ANSWERED'}
              </div>
            </div>
            <div style={{ width: '1px', background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 800, color: '#2dff8a' }}>
                {totalCorrect}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                {t('correct').toUpperCase()}
              </div>
            </div>
            {totalAnswered > 0 && (
              <>
                <div style={{ width: '1px', background: 'var(--border)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 800, color: totalCorrect / totalAnswered >= 0.7 ? '#2dff8a' : '#ff7b2c' }}>
                    {Math.round((totalCorrect / totalAnswered) * 100)}%
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                    {t('yourScore').toUpperCase()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty filter */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '6px', flexShrink: 0 }}>
        {DIFF_FILTERS.map(f => {
          const active = activeDiff === f.key;
          return (
            <button key={f.key} onClick={() => setActiveDiff(f.key)}
              style={{
                padding: '4px 14px', borderRadius: '20px',
                border: `1px solid ${active ? f.color : 'var(--border2)'}`,
                background: active ? `${f.color}18` : 'var(--surface2)',
                color: active ? f.color : 'var(--text-muted)',
                fontFamily: 'var(--mono)', fontSize: '11px', cursor: 'pointer',
                transition: 'all 0.15s', letterSpacing: '0.05em',
              }}
            >
              {f.label}
            </button>
          );
        })}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} {lang === 'id' ? 'skenario' : 'scenarios'}
        </span>
      </div>

      {/* Scenario cards list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 16px', gap: '10px' }}>
            <Trophy size={28} color="var(--text-muted)" strokeWidth={1.5} />
            <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
              {lang === 'id' ? 'Tidak ada skenario untuk filter ini.' : 'No scenarios for this filter.'}
            </p>
          </div>
        ) : (
          filtered.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              selectedIndex={answers.get(scenario.id) ?? null}
              onSelect={(idx) => handleSelect(scenario.id, idx)}
              onLearnAttack={handleLearnAttack}
            />
          ))
        )}
      </div>
    </div>
  );
}
