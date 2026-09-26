import React, { useState } from 'react';
import { resumeAuditDiff, repoAudits, mentorScripts } from '../data/auditData';
import { 
  Check, 
  Copy, 
  AlertTriangle, 
  Sparkles, 
  Github, 
  ExternalLink, 
  Star, 
  ShieldCheck, 
  FileCheck,
  ChevronDown,
  ChevronUp
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

  const fullOptimizedResumeText = `# Никульшин Дмитрий Юрьевич
Fullstack Engineer (NestJS / Next.js 15 / TypeScript) • AI & RAG Integrator
Телефон: +7 (926) 718-94-08 | Email: d.nikulshin.work@gmail.com
Telegram: @nikulshin_dev | GitHub: https://github.com/DNikulshin | Портфолио: https://dnikulshin.github.io
Локация: Москва (Готов к 100% удаленной работе, домашний офис оборудован)

## КЛЮЧЕВОЙ ПРОФИЛЬ
Fullstack-инженер с высшим техническим образованием (МАМИ, Прикладная информатика) и 3+ годами коммерческой разработки веб-систем полного цикла. 
Специализируюсь на связке современного TypeScript стека (Node.js/NestJS + React/Next.js 15) с практическими AI-интеграциями (RAG-системы, pgvector, LLM API).
Закрываю полный цикл разработки под ключ: от схемы БД и системного дизайна до микросервисов, оффлайн PWA, Docker-контейнеризации и CI/CD деплоя на VPS.

## СТЕК ТЕХНОЛОГИЙ
• Backend: Node.js, NestJS, Express, Fastify, Python (FastAPI), REST API, WebSockets, Swagger/OpenAPI.
• Frontend: React 19, Next.js 15 (App Router, Server Actions), TypeScript, Redux Toolkit, TanStack Query, Tailwind CSS, PWA, React Native (Expo).
• Базы данных & Инфраструктура: PostgreSQL, Prisma ORM, Redis, pgvector, Docker, Docker Compose, GitHub Actions (CI/CD), Linux/VPS, Caddy/Nginx, Cloudflare.
• AI & Автоматизация: OpenAI API, Claude API, LangChain (JS/TS, Python), RAG pipelines, pgvector, Telegram Bot API, Playwright, n8n.

## ОПЫТ РАБОТЫ

### Декабрь 2024 — настоящее время (1 год 10 мес)
Контрактная B2B-разработка / Продуктовый Fullstack инженер
Проектирование архитектуры и разработка распределенных коммерческих систем под ключ:
• IoT-система мониторинга автопарка (Corporate Transport):
  - Монорепозиторий real-time трекинга с одновременной обработкой WebSocket-соединений.
  - Диспетчерская панель: React PWA с поддержкой оффлайн-режима (очередь синхронизации в IndexedDB).
  - Мобильное приложение водителей на React Native (Expo).
  - CI/CD пайплайн в GitHub Actions: сборка Docker-образов, деплой на VPS.
• Enterprise Helpdesk & CRM (Support Ticketing System):
  - Бэкенд на NestJS + Prisma + PostgreSQL с ролевой моделью доступа (RBAC), swagger-документацией и вложениями.
  - Фронтенд на Next.js 15 App Router с Server Actions и оптимистичными обновлениями UI.
• DocBrain — Корпоративная RAG-система:
  - Пайплайн ингестии и гибридного поиска: FastAPI + LangChain + pgvector + MinIO + LLM (Claude/OpenAI).
  - Сокращение времени поиска по внутренним регламентам на 70%, поддержка цитирования источников.
• ScanAgent — AI-агент для автоматизации:
  - Парсинг заказов (Playwright), оценка релевантности через LLM, Telegram-уведомления, PWA-дашборд.

### Июль 2023 — Декабрь 2024 (1 год 6 мес)
ООО "Связь Стандарт" — Fullstack-разработчик (React / Node.js / Express / PostgreSQL)
• Разработал PWA Helpdesk-систему с нуля для диспетчеризации инцидентов компании.
• Интегрировал Яндекс.Карты для интерактивного отображения заявок на карте Москвы и области.
• Реализовал систему мгновенных уведомлений (WebSocket) и гранулярный RBAC (администратор, менеджер, исполнитель).
• Добился сокращения времени обработки заявок на 30% за счет оптимизации маршрутизации и запросов к PostgreSQL.
• Обеспечивал непрерывный саппорт и релизный цикл продукта без простоев.

## ОБРАЗОВАНИЕ
2014 — Московский государственный технический университет "МАМИ", Москва. Информатика, Прикладная информатика (Высшее).
2021 — Повышение квалификации: Frontend-разработчик, Result School.
`;

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'resume'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            📄 Резюме 2.0 (До и После)
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
            🛡 Защита от HR-возражений (41 год / Переход)
          </button>
        </div>

        {activeTab === 'resume' && (
          <button
            onClick={() => handleCopy(fullOptimizedResumeText, 'full-resume')}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            {copiedId === 'full-resume' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>Скопировать Резюме целиком (Markdown)</span>
          </button>
        )}
      </div>

      {/* Tab 1: Resume Diff */}
      {activeTab === 'resume' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">HR-экспертиза ментора:</span> Резюме переработано по стандарту продуктового сеньора. 
              Мы убрали любые ассоциации с «пет-проектами» и «учебными заданиями», упаковали блок независимой работы как контрактную B2B-разработку, добавили твердые метрики и вывели вперед твое главное УТП (Fullstack + AI/RAG).
            </div>
          </div>

          <div className="space-y-4">
            {resumeAuditDiff.map((item, index) => {
              const isExpanded = expandedDiffIndex === index;
              return (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all">
                  <button
                    onClick={() => setExpandedDiffIndex(isExpanded ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">
                        0{index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {item.section}
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          Проблема: {item.problem}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-slate-800 space-y-4">
                      {/* Problem highlight */}
                      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 text-xs text-rose-300 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                        <div>
                          <span className="font-bold">В чем слабость текущего варианта:</span> {item.problem}
                        </div>
                      </div>

                      {/* Before and After Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Current */}
                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Как в резюме сейчас:</span>
                            <span className="text-[10px] text-slate-500">До</span>
                          </div>
                          <div className="text-xs text-slate-400 whitespace-pre-line font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                            {item.current}
                          </div>
                        </div>

                        {/* Improved */}
                        <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 relative">
                          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Рекомендуемая формулировка (HR-Ready):</span>
                            <button
                              onClick={() => handleCopy(item.improved, `diff-${index}`)}
                              className="text-xs flex items-center gap-1 text-cyan-300 hover:text-white bg-cyan-500/20 hover:bg-cyan-500/30 px-2 py-0.5 rounded transition-all"
                            >
                              {copiedId === `diff-${index}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>Копировать</span>
                            </button>
                          </div>
                          <div className="text-xs text-slate-200 whitespace-pre-line font-mono bg-slate-950/80 p-3 rounded-lg border border-cyan-500/20 leading-relaxed">
                            {item.improved}
                          </div>
                        </div>
                      </div>

                      {/* Why it works */}
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300 flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-emerald-200">Почему это работает нанимающему менеджеру: </span>
                          {item.whyItWorks}
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

      {/* Tab 2: GitHub Audit */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <Github className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Аудит профиля GitHub (github.com/DNikulshin):</span> 
              У тебя отличная база! Большинство соискателей выкладывают незаконченные todo-листы, а у тебя — реальные архитектурные решения (Docker, WebSocket, PWA оффлайн, RAG, pgvector). Чтобы конвертировать просмотр репозитория в оффер, нужно оформить README так, чтобы тимлид за 30 секунд понял масштаб работы без необходимости скачивать код.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {repoAudits.map((repo, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        {repo.starsOrStatus}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
                        <span>{repo.name}</span>
                        <a 
                          href={repo.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white font-mono">{repo.rating}/10</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    {repo.currentDescription}
                  </p>

                  <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                    <div className="text-[11px] font-semibold text-cyan-400 mb-1">
                      Рекомендуемый заголовок README:
                    </div>
                    <div className="text-xs font-mono text-slate-300 select-all">
                      {repo.recommendedReadmeTitle}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-300">
                      Что сделать в репозитории для максимального эффекта:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {repo.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 italic">
                  <span className="text-purple-300 font-semibold">Вердикт ментора:</span> {repo.verdict}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: HR Defense Scripts */}
      {activeTab === 'hr-defense' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Психология и скрипты общения с HR:</span> 
              На созвонах с рекрутерами 90% успеха — это уверенность, доброжелательность и отсутствие оправданий. 
              Ниже готовые фразы, которые снимают любые сомнения работодателя насчет возраста, частичной занятости и опыта.
            </div>
          </div>

          <div className="space-y-4">
            {mentorScripts.map((item, i) => (
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
                    className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all shrink-0"
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
