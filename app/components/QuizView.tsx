'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, Trophy } from 'lucide-react';
import type { Attack } from '../data/attacks';
import { QUIZ } from '../data/quiz';
import { useLang } from '../lib/language';

interface Props {
  attack: Attack;
  onClose: () => void;
}

export default function QuizView({ attack, onClose }: Props) {
  const { t } = useLang();
  const questions = QUIZ[attack.id] ?? [];
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers,   setAnswers]   = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (questions.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
          // Belum ada kuis untuk serangan ini.
        </div>
        <button onClick={onClose} style={{
          padding: '8px 20px', borderRadius: '8px', border: `1px solid ${attack.borderColor}`,
          background: attack.bgColor, color: attack.color, fontFamily: 'var(--mono)',
          fontSize: '12px', cursor: 'pointer',
        }}>{t('backToAttack')}</button>
      </div>
    );
  }

  const q = questions[current];
  const score = answers.filter(Boolean).length;
  const pct   = Math.round((score / questions.length) * 100);

  const handleSelect = (idx: number) => {
    if (!confirmed) setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    setAnswers(prev => [...prev, selected === q.correct]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setShowResults(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setAnswers([]);
    setShowResults(false);
  };

  const resultMsg =
    pct === 100 ? t('quizPerfect')
    : pct >= 60  ? t('quizGood')
    : t('quizRetry');

  const resultColor = pct === 100 ? '#2dff8a' : pct >= 60 ? attack.color : '#ff7b2c';

  /* ── Results Screen ──────────────────────────────────────────────────────── */
  if (showResults) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '24px', animation: 'view-fade-in 0.3s ease-out' }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          border: `3px solid ${resultColor}`,
          background: `${resultColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Trophy size={44} color={resultColor} strokeWidth={1.5} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 900, color: resultColor, marginBottom: '6px' }}>
            {pct}%
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>
            {t('yourScore')}: {score}/{questions.length}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.7 }}>
            {resultMsg}
          </div>
        </div>

        {/* Per-question summary */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {answers.map((correct, i) => (
            <div key={i} style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: correct ? 'rgba(45,255,138,0.12)' : 'rgba(255,0,85,0.12)',
              border: `1px solid ${correct ? '#2dff8a' : '#ff0055'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--mono)', fontSize: '11px',
              color: correct ? '#2dff8a' : '#ff0055',
            }}>{i + 1}</div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleRetry} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '8px',
            border: '1px solid var(--border2)', background: 'var(--surface2)',
            color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '12px',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <RotateCcw size={13} />
            {t('retryQuiz')}
          </button>
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '8px',
            border: `1px solid ${attack.borderColor}`, background: attack.bgColor,
            color: attack.color, fontFamily: 'var(--mono)', fontSize: '12px',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            <ArrowLeft size={13} />
            {t('backToAttack')}
          </button>
        </div>
      </div>
    );
  }

  /* ── Question Screen ─────────────────────────────────────────────────────── */
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'view-fade-in 0.22s ease-out' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid var(--border)',
        background: 'rgba(6,8,16,0.7)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onClose} style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <ArrowLeft size={13} color="var(--text-muted)" />
          </button>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: attack.color, fontWeight: 700, letterSpacing: '0.1em' }}>
            {t('quizFor').toUpperCase()}: {attack.name.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Progress dots */}
          {questions.map((_, i) => (
            <div key={i} style={{
              width: i === current ? '20px' : '8px', height: '8px',
              borderRadius: '4px',
              background: i < current
                ? (answers[i] ? '#2dff8a' : '#ff0055')
                : i === current ? attack.color : 'var(--border2)',
              transition: 'all 0.2s',
            }} />
          ))}
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>
            {current + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '2px', background: 'var(--border)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: attack.color, width: `${((current) / questions.length) * 100}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* Question content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>

        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px', color: attack.color,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          {t('questionOf') === 'of'
            ? `Question ${current + 1} of ${questions.length}`
            : `Pertanyaan ${current + 1} dari ${questions.length}`}
        </div>

        <div style={{
          fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 700,
          color: 'var(--text-primary)', lineHeight: 1.6,
        }}>
          {q.q}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.options.map((opt, i) => {
            const isSelected  = selected === i;
            const isCorrect   = i === q.correct;
            const showCorrect = confirmed && isCorrect;
            const showWrong   = confirmed && isSelected && !isCorrect;

            let borderColor = 'var(--border2)';
            let bg = 'var(--surface2)';
            let color = 'var(--text-secondary)';

            if (showCorrect) { borderColor = '#2dff8a'; bg = 'rgba(45,255,138,0.08)'; color = '#2dff8a'; }
            else if (showWrong) { borderColor = '#ff0055'; bg = 'rgba(255,0,85,0.08)'; color = '#ff0055'; }
            else if (isSelected && !confirmed) { borderColor = attack.borderColor; bg = attack.bgColor; color = attack.color; }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  width: '100%', textAlign: 'left', padding: '14px 18px',
                  borderRadius: '10px', border: `1px solid ${borderColor}`,
                  background: bg, color, fontFamily: 'var(--mono)', fontSize: '14px',
                  lineHeight: 1.5, cursor: confirmed ? 'default' : 'pointer',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '12px',
                }}
              >
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '11px',
                  background: showCorrect ? '#2dff8a22' : showWrong ? '#ff005522' : 'transparent',
                }}>
                  {showCorrect ? <CheckCircle size={14} color="#2dff8a" />
                   : showWrong ? <XCircle size={14} color="#ff0055" />
                   : String.fromCharCode(65 + i)}
                </div>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation (after confirm) */}
        {confirmed && (
          <div style={{
            padding: '16px 18px', borderRadius: '10px',
            background: selected === q.correct ? 'rgba(45,255,138,0.06)' : 'rgba(255,123,44,0.06)',
            border: `1px solid ${selected === q.correct ? 'rgba(45,255,138,0.2)' : 'rgba(255,123,44,0.2)'}`,
            animation: 'view-fade-in 0.3s ease-out',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.1em',
              color: selected === q.correct ? '#2dff8a' : '#ff7b2c', marginBottom: '8px' }}>
              {selected === q.correct ? `✓ ${t('correct')}` : `✗ ${t('incorrect')}`}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {q.explain}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingBottom: '32px' }}>
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              style={{
                padding: '12px 28px', borderRadius: '8px',
                border: `1px solid ${selected !== null ? attack.borderColor : 'var(--border)'}`,
                background: selected !== null ? attack.bgColor : 'var(--surface2)',
                color: selected !== null ? attack.color : 'var(--text-muted)',
                fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.1em', cursor: selected !== null ? 'pointer' : 'default',
                transition: 'all 0.15s',
              }}
            >
              KONFIRMASI
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                padding: '12px 28px', borderRadius: '8px',
                border: `1px solid ${attack.borderColor}`, background: attack.bgColor,
                color: attack.color, fontFamily: 'var(--mono)', fontSize: '12px',
                fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {current + 1 >= questions.length ? t('seeResults').toUpperCase() : t('nextQuestion').toUpperCase()} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
