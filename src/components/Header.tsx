import React from 'react';
import { 
  Rocket, 
  FileText, 
  Send, 
  Briefcase, 
  BrainCircuit, 
  Calculator, 
  MessageSquareCode,
  Github,
  Globe,
  Send as TelegramIcon,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  progressPercent: number;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progressPercent,
  completedTasksCount,
  totalTasksCount
}) => {
  const tabs = [
    { id: 'roadmap', label: 'Спринт-План', icon: Rocket },
    { id: 'audit', label: 'Аудит Резюме & GitHub', icon: FileText },
    { id: 'outreach', label: 'Питчи & Шаблоны', icon: Send },
    { id: 'pipeline', label: 'Воронка Вакансий', icon: Briefcase },
    { id: 'interview', label: 'Техинтервью & Хард-скиллы', icon: BrainCircuit },
    { id: 'finance', label: 'Калькулятор Дохода', icon: Calculator },
    { id: 'mentor', label: 'Советы Ментора', icon: MessageSquareCode },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with candidate profile info */}
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-bold text-xl tracking-tight">
                  ДН
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" title="Готов к удаленной работе" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Дмитрий Никульшин
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Fullstack (Node.js/React/NestJS) & AI Integrator
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Удаленно / Home Office Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>📍 Москва</span>
                <span>• 41 год (Зрелый Fullstack)</span>
                <span>• Опыт 3+ года</span>
                <span>• МАМИ (Прикладная информатика)</span>
                <a 
                  href="https://github.com/DNikulshin" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-mono hover:underline"
                >
                  <Github className="w-3.5 h-3.5" /> github.com/DNikulshin
                </a>
                <a 
                  href="https://dnikulshin.github.io" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-300 hover:text-white inline-flex items-center gap-1 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" /> dnikulshin.github.io
                </a>
                <a 
                  href="https://t.me/nikulshin_dev" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 hover:underline"
                >
                  <TelegramIcon className="w-3.5 h-3.5" /> @nikulshin_dev
                </a>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-6 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5">
            <div>
              <div className="text-xs text-slate-400 font-medium">Прогресс по спринтам</div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">{progressPercent}%</span>
              </div>
            </div>

            <div className="border-l border-slate-800 pl-4">
              <div className="text-xs text-slate-400">Закрыто задач</div>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{completedTasksCount} / {totalTasksCount}</span>
              </div>
            </div>

            <div className="border-l border-slate-800 pl-4 hidden sm:block">
              <div className="text-xs text-slate-400">Фокус стратегии</div>
              <div className="text-xs font-semibold text-amber-400 mt-0.5">
                Part-time → Full-time Remote
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
