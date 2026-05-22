'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'id' | 'en';

export const TRANSLATIONS = {
  id: {
    // header
    subtitle: '// Visualisasi Serangan Siber Interaktif',
    navStats: 'Statistik',
    navCheatSheet: 'Panduan',
    navCompare: 'Bandingkan',
    navQuiz: 'Kuis',
    navLearn: 'Jalur Belajar',
    // sidebar
    searchPlaceholder: 'Cari serangan...',
    attacksCount: 'SERANGAN',
    categoriesCount: 'KATEGORI',
    // welcome
    welcomeDesc: 'Platform visualisasi serangan siber interaktif. Pilih serangan dari sidebar untuk mempelajari mekanisme, step-by-step flow, dan cara bertahan.',
    statAttackTypes: 'JENIS SERANGAN',
    statTotalSteps: 'STEP TOTAL',
    statCategories: 'KATEGORI',
    statCritical: 'CRITICAL',
    statInDatabase: 'dalam database',
    statDetailedSteps: 'langkah detail',
    statAttackTypes2: 'tipe serangan',
    statHighestThreat: 'ancaman tertinggi',
    criticalPriority: 'ANCAMAN CRITICAL — PRIORITAS TERTINGGI',
    allAttacksLabel: '// SEMUA SERANGAN — KLIK UNTUK PELAJARI',
    // attack detail
    defensesTitle: 'PERTAHANAN & MITIGASI',
    showCode: 'TAMPILKAN KODE',
    hideCode: 'SEMBUNYIKAN KODE',
    realWorldCase: '// KASUS DUNIA NYATA',
    stepLabel: 'STEP',
    ofLabel: 'DARI',
    takeQuizBtn: 'KUIS',
    simulateBtn: 'SIMULASI',
    mitreTitle: 'MITRE ATT&CK',
    difficultyLabel: 'LEVEL',
    // quiz
    quizFor: 'Kuis untuk',
    questionOf: 'dari',
    correct: 'Benar!',
    incorrect: 'Salah!',
    yourScore: 'Skor Anda',
    explanation: 'Penjelasan',
    nextQuestion: 'Pertanyaan Berikutnya',
    seeResults: 'Lihat Hasil',
    retryQuiz: 'Ulangi Kuis',
    backToAttack: 'Kembali ke Serangan',
    quizComplete: 'Kuis Selesai!',
    quizPerfect: 'Sempurna! Anda menguasai topik ini.',
    quizGood: 'Bagus! Pelajari ulang poin yang terlewat.',
    quizRetry: 'Coba lagi untuk pemahaman lebih baik.',
    // learning path
    learningPathTitle: 'JALUR BELAJAR',
    beginner: 'Pemula',
    intermediate: 'Menengah',
    advanced: 'Lanjutan',
    beginnerDesc: 'Mulai di sini jika baru mengenal keamanan siber',
    intermediateDesc: 'Sudah paham dasar, siap ke level berikutnya',
    advancedDesc: 'Teknik tingkat lanjut dan serangan kompleks',
    progressLabel: 'selesai',
    startLearning: 'Mulai Belajar',
    yourProgress: 'PROGRES BELAJAR',
    // simulation
    simulationTitle: 'SIMULASI SERANGAN',
    phaseLabel: 'FASE',
    nextPhase: 'Fase Berikutnya',
    exitSim: 'Keluar Simulasi',
    simComplete: 'Simulasi Selesai',
    simIntro: 'Ikuti simulasi serangan langkah demi langkah. Setiap fase menunjukkan teknik yang digunakan attacker.',
    startSim: 'Mulai Simulasi',
    // stats
    statsTitle: 'DATABASE ANCAMAN SIBER',
    totalAttacks: 'Total Serangan',
    totalStepsLabel: 'Total Langkah',
    categoriesCountLabel: 'Kategori',
    criticalCountLabel: 'Ancaman Kritis',
    categoryDistribution: 'DISTRIBUSI KATEGORI',
    severityBreakdown: 'SEBARAN KEPARAHAN',
    mostDangerous: 'PALING BERBAHAYA',
    // cheatsheet
    cheatSheetTitle: 'PANDUAN REFERENSI SERANGAN SIBER',
    printPDF: 'Cetak PDF',
    // compare
    compareTitle: 'BANDINGKAN SERANGAN',
    selectAttackPlaceholder: 'Pilih serangan...',
    noComparisonMsg: 'Pilih dua serangan untuk membandingkan',
    severityLabel: 'Keparahan',
    stepsLabel: 'Langkah',
    defenseCountLabel: 'Pertahanan',
    navGlossary: 'Glosarium',
    navChain: 'Rantai Serangan',
    navScenario: 'Skenario',
    relatedAttacks: 'Serangan Terkait',
    navTimeline: 'Timeline',
    navCVE: 'CVE',
    navChecklist: 'Checklist',
    navMap: 'Attack Map',
  },
  en: {
    subtitle: '// Interactive Cybersecurity Attack Visualization',
    navStats: 'Stats',
    navCheatSheet: 'Cheat Sheet',
    navCompare: 'Compare',
    navQuiz: 'Quiz',
    navLearn: 'Learning Path',
    searchPlaceholder: 'Search attacks...',
    attacksCount: 'ATTACKS',
    categoriesCount: 'CATEGORIES',
    welcomeDesc: 'Interactive cybersecurity attack visualization platform. Select an attack from the sidebar to learn about mechanisms, step-by-step flows, and defenses.',
    statAttackTypes: 'ATTACK TYPES',
    statTotalSteps: 'TOTAL STEPS',
    statCategories: 'CATEGORIES',
    statCritical: 'CRITICAL',
    statInDatabase: 'in database',
    statDetailedSteps: 'detailed steps',
    statAttackTypes2: 'attack types',
    statHighestThreat: 'highest threats',
    criticalPriority: 'CRITICAL THREATS — HIGHEST PRIORITY',
    allAttacksLabel: '// ALL ATTACKS — CLICK TO LEARN',
    defensesTitle: 'DEFENSES & MITIGATIONS',
    showCode: 'SHOW CODE',
    hideCode: 'HIDE CODE',
    realWorldCase: '// REAL WORLD CASE',
    stepLabel: 'STEP',
    ofLabel: 'OF',
    takeQuizBtn: 'QUIZ',
    simulateBtn: 'SIMULATE',
    mitreTitle: 'MITRE ATT&CK',
    difficultyLabel: 'LEVEL',
    quizFor: 'Quiz for',
    questionOf: 'of',
    correct: 'Correct!',
    incorrect: 'Incorrect!',
    yourScore: 'Your Score',
    explanation: 'Explanation',
    nextQuestion: 'Next Question',
    seeResults: 'See Results',
    retryQuiz: 'Retry Quiz',
    backToAttack: 'Back to Attack',
    quizComplete: 'Quiz Complete!',
    quizPerfect: 'Perfect! You mastered this topic.',
    quizGood: 'Good job! Review the missed points.',
    quizRetry: 'Try again for better understanding.',
    learningPathTitle: 'LEARNING PATH',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    beginnerDesc: 'Start here if you\'re new to cybersecurity',
    intermediateDesc: 'Ready for the next level',
    advancedDesc: 'Advanced techniques and complex attacks',
    progressLabel: 'completed',
    startLearning: 'Start Learning',
    yourProgress: 'YOUR PROGRESS',
    simulationTitle: 'ATTACK SIMULATION',
    phaseLabel: 'PHASE',
    nextPhase: 'Next Phase',
    exitSim: 'Exit Simulation',
    simComplete: 'Simulation Complete',
    simIntro: 'Follow the attack simulation step by step. Each phase shows techniques used by attackers.',
    startSim: 'Start Simulation',
    statsTitle: 'CYBER THREAT DATABASE',
    totalAttacks: 'Total Attacks',
    totalStepsLabel: 'Total Steps',
    categoriesCountLabel: 'Categories',
    criticalCountLabel: 'Critical Threats',
    categoryDistribution: 'CATEGORY DISTRIBUTION',
    severityBreakdown: 'SEVERITY BREAKDOWN',
    mostDangerous: 'MOST DANGEROUS',
    cheatSheetTitle: 'CYBERSECURITY ATTACK REFERENCE GUIDE',
    printPDF: 'Print PDF',
    compareTitle: 'COMPARE ATTACKS',
    selectAttackPlaceholder: 'Select attack...',
    noComparisonMsg: 'Select two attacks to compare',
    severityLabel: 'Severity',
    stepsLabel: 'Steps',
    defenseCountLabel: 'Defenses',
    navGlossary: 'Glossary',
    navChain: 'Attack Chain',
    navScenario: 'Scenarios',
    relatedAttacks: 'Related Attacks',
    navTimeline: 'Timeline',
    navCVE: 'CVE',
    navChecklist: 'Checklist',
    navMap: 'Attack Map',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangCtx>({
  lang: 'id',
  toggle: () => {},
  t: k => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('id');
  const toggle = () => setLang(l => (l === 'id' ? 'en' : 'id'));
  const t = (key: TranslationKey): string =>
    (TRANSLATIONS[lang] as Record<string, string>)[key] ??
    (TRANSLATIONS.en as Record<string, string>)[key] ??
    key;
  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
