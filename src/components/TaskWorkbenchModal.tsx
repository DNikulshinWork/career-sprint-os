import React, { useState, useEffect } from 'react';
import { Sprint, SprintTask } from '../types';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  FileText, 
  Send, 
  Plus, 
  Link as LinkIcon,
  ShieldCheck,
  BrainCircuit,
  Database,
  Layers,
  Flame,
  CheckSquare
} from 'lucide-react';
import { playTaskCompleteSound, triggerConfetti } from '../utils/effects';

interface TaskWorkbenchModalProps {
  sprint: Sprint;
  task: SprintTask;
  isOpen: boolean;
  onClose: () => void;
  onSaveTaskResult: (sprintId: number, taskId: string, result: { completed: boolean; artifactUrl?: string; artifactNotes?: string }) => void;
}

export const TaskWorkbenchModal: React.FC<TaskWorkbenchModalProps> = ({
  sprint,
  task,
  isOpen,
  onClose,
  onSaveTaskResult
}) => {
  const [artifactUrl, setArtifactUrl] = useState(task.artifactUrl || '');
  const [artifactNotes, setArtifactNotes] = useState(task.artifactNotes || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // In-workbench state for specific task types
  // 1. Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // 2. Counter state (for cold pitches, daily applications)
  const [counter, setCounter] = useState<number>(task.metricCurrent || 0);

  // 3. Pomodoro timer state
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // 4. Mini quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    setArtifactUrl(task.artifactUrl || '');
    setArtifactNotes(task.artifactNotes || '');
    setCounter(task.metricCurrent || 0);
  }, [task]);

  // Pomodoro effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && pomodoroSeconds > 0) {
      timer = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setCompletedSessions(prev => prev + 1);
      playTaskCompleteSound();
      triggerConfetti();
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, pomodoroSeconds]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleCheckItem = (itemKey: string) => {
    setChecklist(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const handleCompleteTask = () => {
    playTaskCompleteSound();
    triggerConfetti();
    onSaveTaskResult(sprint.id, task.id, {
      completed: true,
      artifactUrl: artifactUrl.trim() || undefined,
      artifactNotes: artifactNotes.trim() || undefined
    });
    onClose();
  };

  const handleUncompleteTask = () => {
    onSaveTaskResult(sprint.id, task.id, {
      completed: false,
      artifactUrl: artifactUrl.trim() || undefined,
      artifactNotes: artifactNotes.trim() || undefined
    });
    onClose();
  };

  // Specific renderers for interactive types
  const renderInteractiveContent = () => {
    switch (task.interactiveType) {
      case 'resume_edit': {
        const resumeChecks = [
          'Заголовок изменен на «Fullstack Engineer • AI & RAG Integrator»',
          '«Фриланс» переименован в «Контрактная B2B-разработка распределенных систем»',
          'Добавлены измеримые метрики (latency <120ms, 500+ WebSocket коннектов)',
          'Высшее образование МАМИ выделено в блоке «Обо мне» как инженерная база',
          'Резюме опубликовано на HeadHunter и Хабр Карьере'
        ];
        return (
          <div className="space-y-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" />
                <span>Чек-лист закрытия задачи:</span>
              </div>
              <div className="space-y-2">
                {resumeChecks.map((item, idx) => {
                  const key = `rc-${idx}`;
                  const isChecked = !!checklist[key] || task.completed;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleCheckItem(key)}
                      className="w-full flex items-start gap-2.5 text-left p-2 rounded-lg hover:bg-slate-900 transition-colors"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-3.5 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Готовый текст резюме сеньор-уровня в Markdown:
              </div>
              <button
                type="button"
                onClick={() => handleCopy('Fullstack Engineer (NestJS / Next.js 15 / TypeScript) • AI & RAG Integrator...', 'resume-quick')}
                className="text-xs flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg transition-all"
              >
                {copiedKey === 'resume-quick' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Скопировать готовый текст</span>
              </button>
            </div>
          </div>
        );
      }

      case 'readme_corporate': {
        const sampleReadme = `# Corporate Transport Monitoring System 🛰
Realtime Fleet Tracking with Offline-First React PWA & React Native Mobile App

## 🏗 Архитектура системы
\`\`\`mermaid
flowchart TD
    Client[React PWA Admin] <-->|WebSocket & REST| Gateway[Node.js Gateway / NestJS]
    Driver[React Native Expo Driver] -->|GPS Coordinates| Gateway
    Gateway <--> Redis[(Redis Pub/Sub & Geo Spatial)]
    Gateway --> Postgres[(PostgreSQL / Prisma TimeSeries)]
    Client -.-> IndexedDB[(Offline Queue IndexedDB)]
\`\`\`

## ⚡ Особенности
- **Оффлайн-режим:** Диспетчер может регистрировать заявки без интернета; очередь сохраняется в IndexedDB и автоматически синхронизируется при восстановлении сети.
- **Docker в 1 команду:** \`docker compose up -d\` поднимает полный стек за 20 секунд.
`;
        return (
          <div className="space-y-3">
            <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-3.5 text-xs font-mono text-purple-300 overflow-x-auto">
              <div className="text-[11px] font-bold text-slate-400 mb-2 font-sans">
                Интерактивная схема архитектуры (Mermaid):
              </div>
              <pre className="text-[11px] text-slate-300 leading-relaxed whitespace-pre">
{`React PWA Admin (IndexedDB) <---> [ WebSocket Node.js ] <---> [ Redis Geo/PubSub ]
                                              ^
                                              | GPS Telemetry
                                   [ React Native Expo Driver ]`}
              </pre>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-mono">corporate-transport/README.md</span>
              <button
                type="button"
                onClick={() => handleCopy(sampleReadme, 'corp-readme')}
                className="text-xs flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-all"
              >
                {copiedKey === 'corp-readme' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Скопировать README</span>
              </button>
            </div>
          </div>
        );
      }

      case 'readme_docbrain': {
        const docbrainReadme = `# DocBrain — Enterprise RAG Knowledge Platform 🧠
Production-ready RAG Pipeline with FastAPI, pgvector, LangChain & Hybrid Search

## 🔍 Архитектурный конвейер
\`\`\`mermaid
flowchart LR
    Docs[PDF / Markdown / Notion] --> Chunking[Adaptive Semantic Chunking 512t]
    Chunking --> Embeddings[text-embedding-3 / multilingual-e5]
    Embeddings --> PGVector[(PostgreSQL + pgvector HNSW)]
    Query[Запрос пользователя] --> Hybrid[Гибридный поиск: BM25 + Cosine]
    Hybrid --> Rerank[Reranker Cohere / Cross-Encoder]
    Rerank --> LLM[Claude 3.5 Sonnet / GPT-4o с цитированием]
\`\`\`
`;
        return (
          <div className="space-y-3">
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-3.5 text-xs text-slate-300">
              <div className="text-[11px] font-bold text-cyan-400 mb-1">
                Ключевой продающий фактор DocBrain:
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Покажи в README, что твоя система не просто делает вызовы к OpenAI, а использует <span className="text-white font-semibold">гибридный поиск (BM25 + pgvector HNSW)</span>, предотвращает галлюцинации системным промптом и выводит точные номера страниц документов.
              </p>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-mono">docbrain/README.md template</span>
              <button
                type="button"
                onClick={() => handleCopy(docbrainReadme, 'doc-readme')}
                className="text-xs flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg transition-all"
              >
                {copiedKey === 'doc-readme' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Скопировать README</span>
              </button>
            </div>
          </div>
        );
      }

      case 'cold_pitch_counter':
      case 'leads_database': {
        const target = 30;
        const progress = Math.min(100, Math.round((counter / target) * 100));
        return (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-300">Счетчик отправленных питчей:</span>
                <span className="font-mono font-bold text-cyan-400 text-base">{counter} / {target}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = counter + 1;
                    setCounter(next);
                    playTaskCompleteSound();
                    if (next >= target) triggerConfetti();
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Отправлен еще один питч (+1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCounter(Math.max(0, counter - 1))}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs py-2 px-3 rounded-lg transition-colors"
                >
                  -1
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              💡 <span className="text-slate-300">План действий:</span> отправь первые 5 сообщений фаундерам веб-студий из Telegram-каналов прямо сейчас. Шаблоны питчей доступны во вкладке «Питчи & Шаблоны».
            </div>
          </div>
        );
      }

      case 'daily_counter': {
        const target = 10;
        const progress = Math.min(100, Math.round((counter / target) * 100));
        return (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-300">Откликов отправлено сегодня:</span>
                <span className="font-mono font-bold text-emerald-400 text-base">{counter} / {target}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = counter + 1;
                  setCounter(next);
                  playTaskCompleteSound();
                  if (next >= target) triggerConfetti();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Зафиксировать отправленный отклик (+1)</span>
              </button>
            </div>
          </div>
        );
      }

      case 'pomodoro': {
        const minutes = Math.floor(pomodoroSeconds / 60);
        const seconds = pomodoroSeconds % 60;
        return (
          <div className="space-y-4 text-center">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
              <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest mb-4">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isTimerRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Пауза' : 'Старт фокус-сессии (25м)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setPomodoroSeconds(25 * 60);
                  }}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                  title="Сбросить таймер"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                Завершенных сессий сегодня: <span className="font-mono font-bold text-cyan-400">{completedSessions}</span>
              </div>
            </div>
          </div>
        );
      }

      case 'event_loop_quiz':
      case 'nextjs_quiz':
      case 'postgres_quiz': {
        const quizData = task.interactiveType === 'event_loop_quiz'
          ? [
              {
                q: 'В какой фазе Event Loop выполняются коллбеки process.nextTick и Promise?',
                options: [
                  'В фазе Timers вместе с setTimeout',
                  'Сразу после текущей операции, до перехода к любой следующей фазе Event Loop',
                  'В фазе Poll после I/O событий'
                ],
                correct: 1
              },
              {
                q: 'Где в NestJS правильнее всего валидировать входящий DTO?',
                options: [
                  'В Middleware',
                  'В ValidationPipe с помощью class-validator',
                  'В ExceptionFilter'
                ],
                correct: 1
              }
            ]
          : task.interactiveType === 'nextjs_quiz'
          ? [
              {
                q: 'Каков размер JavaScript бандла, отправляемого в браузер для React Server Components (RSC)?',
                options: [
                  'Такой же, как у обычного компонента',
                  '0 байт (код RSC не попадает в клиентский бандл)',
                  'Зависит от количества хуков'
                ],
                correct: 1
              },
              {
                q: 'Как вызывается Server Action из клиента?',
                options: [
                  'Через WebSocket соединение',
                  'Напрямую как обычная асинхронная функция через POST-запрос под капотом',
                  'Только через внешний Redux action'
                ],
                correct: 1
              }
            ]
          : [
              {
                q: 'Какой индекс в PostgreSQL оптимален для поиска элементов в JSONB или массивах?',
                options: ['B-Tree', 'GIN (Generalized Inverted Index)', 'BRIN'],
                correct: 1
              },
              {
                q: 'В чем преимущество HNSW индекса перед IVFFlat в pgvector?',
                options: [
                  'HNSW не требует RAM',
                  'HNSW обеспечивает высокий recall (>98%) и быстрый поиск даже при добавлении векторов на лету',
                  'HNSW работает только с текстом'
                ],
                correct: 1
              }
            ];

        return (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4" />
              <span>Интерактивный блиц-тест для самопроверки:</span>
            </div>

            {quizData.map((item, qIdx) => {
              const selected = selectedAnswers[qIdx];
              return (
                <div key={qIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-semibold text-white">
                    {qIdx + 1}. {item.q}
                  </div>
                  <div className="space-y-1.5">
                    {item.options.map((opt, optIdx) => {
                      const isChosen = selected === optIdx;
                      const isCorrect = optIdx === item.correct;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                            if (isCorrect) playTaskCompleteSound();
                          }}
                          className={`w-full text-left text-xs p-2 rounded-lg border transition-all ${
                            isChosen
                              ? isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-medium'
                                : 'bg-rose-500/20 border-rose-500 text-rose-300'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      default: {
        return (
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-cyan-400">Требуемый результат:</div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {task.deliverable}
            </p>
          </div>
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-8">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Спринт {sprint.id} • {sprint.duration}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              task.completed 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}>
              {task.completed ? 'Завершена ✅' : 'В работе'}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {task.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Interactive Custom Workbench Body */}
        <div className="pt-2 border-t border-slate-800/80">
          {renderInteractiveContent()}
        </div>

        {/* Artifact Evidence Section */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Фиксация доказательства выполнения (Артефакт):</span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Ссылка на артефакт (GitHub коммит / PR / резюме / чат):
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. https://github.com/DNikulshin/corporate-transport или https://hh.ru"
                  value={artifactUrl}
                  onChange={(e) => setArtifactUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Заметка ментору / итог выполнения:
              </label>
              <textarea
                rows={2}
                placeholder="Что сделано, какие метрики получены..."
                value={artifactNotes}
                onChange={(e) => setArtifactNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2"
          >
            Закрыть без изменений
          </button>

          <div className="flex items-center gap-2">
            {task.completed ? (
              <button
                type="button"
                onClick={handleUncompleteTask}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-xl transition-colors"
              >
                Вернуть в работу (Снять статус)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteTask}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Завершить шаг и зафиксировать артефакт ✅</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
