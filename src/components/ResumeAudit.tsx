import React, { useState } from 'react';
import { 
  honestResumeDiff, 
  repoAudits, 
  honestMentorScripts, 
  honestFullResumeText 
} from '../data/auditData';
import { 
  Check, 
  Copy, 
  Sparkles, 
  Github, 
  ExternalLink, 
  Star, 
  ShieldCheck, 
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2
} from 'lucide-react';

export const ResumeAudit: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'github' | 'hr-defense'>('resume');
  const [expandedDiffIndex, setExpandedDiffIndex] = useState<number | null>(0);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">
              Честный Аудит и Позиционирование Резюме
            </h2>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Без накруток • 100% защита на интервью
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Позиционирование сильного Fullstack-инженера полного цикла. Никаких вымышленных продуктовых команд и дутых цифр — только реальный код, глубокая архитектура и честная мотивация перехода в команду.
          </p>
        </div>

        <button
          onClick={() => handleCopy(honestFullResumeText, 'full-resume')}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/20 transition-all shrink-0 cursor-pointer"
        >
          {copiedId === 'full-resume' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>Скопировать готовый текст для HH.ru</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'resume'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            📄 Резюме для HH.ru (Честное сравнение)
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'github'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            🐙 Аудит GitHub Репозиториев
          </button>
          <button
            onClick={() => setActiveTab('hr-defense')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'hr-defense'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            🛡 Защита на интервью (Команда, Опыт, Возраст)
          </button>
        </div>
      </div>

      {/* Tab 1: Resume Diff */}
      {activeTab === 'resume' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white">Принцип честного резюме:</strong> Мы не придумываем опыт работы в 20-челочной Scrum-команде или вымышленные корпорации. 
              Ваша реальная сила — это <strong>автономность, высшее образование МАМИ и умение в одиночку поднять с нуля сложную систему</strong> (NestJS API, Docker, WebSockets, RAG, React). 
              На интервью вы будете чувствовать себя абсолютно спокойно, потому что за каждое слово отвечаете своим кодом.
            </div>
          </div>

          <div className="space-y-4">
            {honestResumeDiff.map((item, index) => {
              const isExpanded = expandedDiffIndex === index;
              return (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all">
                  <button
                    onClick={() => setExpandedDiffIndex(isExpanded ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-850 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
                        0{index + 1}
                      </div>
                      <span className="font-semibold text-white text-sm">
                        {item.section}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        {isExpanded ? 'Свернуть' : 'Подробнее'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-slate-800/80">
                      {/* Why change */}
                      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200">
                        <strong className="text-amber-300">В чем была проблема:</strong> {item.problem}
                      </div>

                      {/* Side by side comparison */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Was */}
                        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                            Было в резюме:
                          </div>
                          <div className="text-xs text-slate-400 whitespace-pre-line font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                            {item.current}
                          </div>
                        </div>

                        {/* Became */}
                        <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Рекомендуемый честный вариант:</span>
                            </div>
                            <button
                              onClick={() => handleCopy(item.improved, `improved-${index}`)}
                              className="text-[11px] flex items-center gap-1 text-cyan-300 hover:text-white bg-cyan-600/30 hover:bg-cyan-600/50 px-2 py-1 rounded-md transition-colors"
                            >
                              {copiedId === `improved-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>Копировать</span>
                            </button>
                          </div>
                          <div className="text-xs text-slate-200 whitespace-pre-line font-mono bg-slate-900/90 p-3 rounded-lg border border-cyan-500/20">
                            {item.improved}
                          </div>
                        </div>
                      </div>

                      {/* Why it works */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2">
                        <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-400">Почему это выигрышно на рынке:</strong> {item.whyItWorks}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: GitHub Repos Audit */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <Github className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Твердое доказательство опыта:</span> 
              Когда у кандидата нет многолетнего опыта в брендовых корпорациях, тимлиды сразу открывают GitHub. 
              Ваши репозитории — это главный аргумент. Оформленные README, схемы архитектуры и запуск в 1 команду <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">docker compose up</code> закрывают 100% вопросов о вашей квалификации.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {repoAudits.map((repo) => (
              <div key={repo.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {repo.starsOrStatus}
                    </span>
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{repo.rating}/10</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 font-mono flex items-center gap-1.5">
                    <span>{repo.name}</span>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </h4>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {repo.currentDescription}
                  </p>

                  <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300">
                    {repo.recommendedReadmeTitle}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-300">
                      Рекомендации к оформлению:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {repo.actionItems.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
                  <strong className="text-purple-300 not-italic">Вердикт:</strong> {repo.verdict}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: HR & Tech Interview Defense Scripts */}
      {activeTab === 'hr-defense' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Железная защита на собеседованиях:</span> 
              Ниже приведены честные, уверенные и профессиональные ответы на самые острые вопросы («Работали ли в Scrum-команде?», «Пет-проекты или коммерция?», «Возраст 41 год»). 
              С ними вы никогда не окажетесь в неловком положении.
            </div>
          </div>

          <div className="space-y-4">
            {honestMentorScripts.map((item, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-mono">
                      Q{i + 1}
                    </span>
                    <span>{item.situation}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.script, `script-${i}`)}
                    className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer"
                  >
                    {copiedId === `script-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Копировать скрипт</span>
                  </button>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-sans">
                  {item.script}
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                  <span className="font-semibold text-cyan-400">Психологический ключ:</span>
                  <span>{item.keyPoint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
