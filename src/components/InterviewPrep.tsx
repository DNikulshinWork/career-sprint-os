import React, { useState } from 'react';
import { interviewQuestions } from '../data/interviewData';
import { InterviewQuestion } from '../types';
import { 
  BrainCircuit, 
  Check, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  Filter,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export const InterviewPrep: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [knownIds, setKnownIds] = useState<Record<string, boolean>>({});

  const categories = [
    'all',
    'Node.js/NestJS',
    'React/Next.js',
    'Database/SQL',
    'AI & RAG',
    'System Design',
    'HR & Soft Skills'
  ];

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleKnown = (id: string) => {
    setKnownIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = interviewQuestions.filter(q => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  const knownCount = Object.values(knownIds).filter(Boolean).length;
  const knownPercent = Math.round((knownCount / interviewQuestions.length) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Header and Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Тренажер Технических Собеседований (Fullstack & AI)
            </h3>
            <p className="text-xs text-slate-400">
              Вопросы и архитектурные кейсы, составленные под твой стек: NestJS, Next.js 15, PostgreSQL, pgvector и RAG.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2">
          <div>
            <div className="text-[11px] text-slate-400">Готовность к интервью:</div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-300" 
                  style={{ width: `${knownPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-purple-400">{knownPercent}%</span>
            </div>
          </div>
          <div className="text-xs text-slate-300 font-mono border-l border-slate-850 pl-3">
            {knownCount} из {interviewQuestions.length} вопросов
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {cat === 'all' ? 'Все категории' : cat}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isRevealed = !!revealedIds[q.id];
          const isKnown = !!knownIds[q.id];

          return (
            <div
              key={q.id}
              className={`bg-slate-900 border rounded-2xl p-5 transition-all space-y-3 ${
                isKnown 
                  ? 'border-emerald-500/40 bg-slate-900/90' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-medium">
                      {q.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      Уровень: {q.difficulty}
                    </span>
                    {isKnown && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Знаю уверенно
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {q.question}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleKnown(q.id)}
                    className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
                      isKnown
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-750'
                    }`}
                    title={isKnown ? 'Снять отметку' : 'Отметить как освоенный'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl transition-all"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Скрыть ответ' : 'Показать ответ'}</span>
                  </button>
                </div>
              </div>

              {/* Context: why it is asked */}
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Зачем спрашивают: <span className="text-slate-300">{q.whyAsked}</span></span>
              </div>

              {/* Answer block (when revealed) */}
              {isRevealed && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-line">
                    {q.answer}
                  </div>

                  {/* Mentor tip */}
                  <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Совет ментора на интервью:</span> {q.mentorTip}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
