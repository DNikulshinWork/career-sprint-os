import React, { useState } from 'react';
import { Sprint, SprintTask } from '../types';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Sparkles, 
  Award, 
  Filter, 
  Plus, 
  ChevronRight,
  Target,
  Lightbulb,
  ExternalLink,
  ArrowRight,
  Layers,
  Flame,
  FileCode,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';
import { TaskWorkbenchModal } from './TaskWorkbenchModal';
import { playTaskCompleteSound, playSprintCompleteSound, triggerConfetti } from '../utils/effects';

interface SprintRoadmapProps {
  sprints: Sprint[];
  onToggleTask: (sprintId: number, taskId: string) => void;
  onUpdateSprintStatus: (sprintId: number, status: Sprint['status']) => void;
  onAddTask: (sprintId: number, task: Omit<SprintTask, 'id' | 'completed'>) => void;
  onSaveTaskResult: (sprintId: number, taskId: string, result: { completed: boolean; artifactUrl?: string; artifactNotes?: string }) => void;
  onResetProgress?: () => void;
}

export const SprintRoadmap: React.FC<SprintRoadmapProps> = ({
  sprints,
  onToggleTask,
  onUpdateSprintStatus,
  onAddTask,
  onSaveTaskResult,
  onResetProgress
}) => {
  const [selectedSprintId, setSelectedSprintId] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [activeModalTask, setActiveModalTask] = useState<SprintTask | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDeliverable, setNewTaskDeliverable] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<SprintTask['category']>('code');
  const [newTaskPriority, setNewTaskPriority] = useState<SprintTask['priority']>('high');

  const selectedSprint = sprints.find(s => s.id === selectedSprintId) || sprints[0];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask(selectedSprint.id, {
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Пользовательская задача спринта',
      deliverable: newTaskDeliverable.trim() || 'Выполненная задача',
      category: newTaskCategory,
      priority: newTaskPriority,
      interactiveType: 'generic'
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDeliverable('');
    setIsAddingTask(false);
  };

  const getCategoryBadge = (category: SprintTask['category']) => {
    switch (category) {
      case 'hr': return { label: 'HR / Резюме', bg: 'bg-pink-500/10 text-pink-400 border-pink-500/30' };
      case 'github': return { label: 'GitHub Showcase', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      case 'code': return { label: 'Hard Skills / Код', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'outreach': return { label: 'Воронка / Питчи', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'interview': return { label: 'Собеседования', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'finance': return { label: 'Финансы / Оффер', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      default: return { label: category, bg: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const filteredTasks = selectedSprint.tasks.filter(t => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  const completedCount = selectedSprint.tasks.filter(t => t.completed).length;
  const totalTasksInSprint = selectedSprint.tasks.length;
  const sprintProgress = Math.round((completedCount / totalTasksInSprint) * 100) || 0;
  const isSprintFinished = completedCount === totalTasksInSprint && totalTasksInSprint > 0;

  // Next recommended task
  const nextTask = selectedSprint.tasks.find(t => !t.completed);

  // Quick toggle on checkbox
  const handleCheckboxClick = (e: React.MouseEvent, taskId: string, isCurrentlyDone: boolean) => {
    e.stopPropagation();
    if (!isCurrentlyDone) {
      playTaskCompleteSound();
      triggerConfetti();
    }
    onToggleTask(selectedSprint.id, taskId);
  };

  // Export progress as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sprints, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dmitry-careersprint-progress-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Интерактивный Карьерный Трекер
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Пошаговый Спринт-План: Закрываем Задачи в Реальном Времени
            </h2>
            <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
              Кликай по любой задаче, чтобы открыть ее интерактивный воркбенч, прикрепить ссылку на артефакт (коммит, резюме, питч) и продвигаться к постоянной удаленной Fullstack работе.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition-all shrink-0"
              title="Экспортировать прогресс в JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Экспорт отчета</span>
            </button>
          </div>
        </div>

        {/* Sprint horizontal cards / tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {sprints.map((sprint) => {
            const isSelected = sprint.id === selectedSprintId;
            const completed = sprint.tasks.filter(t => t.completed).length;
            const total = sprint.tasks.length;
            const percent = Math.round((completed / total) * 100) || 0;

            return (
              <button
                key={sprint.id}
                onClick={() => setSelectedSprintId(sprint.id)}
                className={`text-left p-3.5 rounded-xl border transition-all relative ${
                  isSelected 
                    ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-mono font-bold text-cyan-400">Спринт {sprint.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    sprint.status === 'completed' || percent === 100 ? 'bg-emerald-500/20 text-emerald-300' :
                    sprint.status === 'in_progress' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {percent === 100 ? 'Закрыт ✅' : sprint.status === 'in_progress' ? 'В работе' : 'Ждет'}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1">
                  {sprint.title.split(':')[1] || sprint.title}
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{completed}/{total} задач</span>
                  <span className={percent === 100 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      percent === 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Step Banner (if there is an incomplete task) */}
      {nextTask && (
        <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                Следующий рекомендуемый шаг (Спринт {selectedSprint.id}):
              </div>
              <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                {nextTask.title}
              </div>
              <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                Артефакт: {nextTask.deliverable}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveModalTask(nextTask)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/20 transition-all shrink-0"
          >
            <span>Выполнить шаг сейчас</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sprint 100% Complete Celebration Banner */}
      {isSprintFinished && (
        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                🎉 Спринт {selectedSprint.id} успешно закрыт на 100%!
              </div>
              <div className="text-xs text-emerald-300 mt-0.5">
                Все задачи и артефакты этапа зафиксированы. Отличный темп, Дмитрий!
              </div>
            </div>
          </div>

          {selectedSprint.id < 6 && (
            <button
              onClick={() => {
                const nextId = selectedSprint.id + 1;
                onUpdateSprintStatus(nextId, 'in_progress');
                setSelectedSprintId(nextId);
                playSprintCompleteSound();
                triggerConfetti();
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all shrink-0"
            >
              <span>Перейти к Спринту {selectedSprint.id + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Selected Sprint Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedSprint.duration}</span>
                  <span>•</span>
                  <span className="text-slate-400">{completedCount} из {totalTasksInSprint} выполнено</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedSprint.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {selectedSprint.subtitle}
                </p>
              </div>

              {/* Sprint Status Controller */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Статус:</span>
                <select
                  value={selectedSprint.status}
                  onChange={(e) => onUpdateSprintStatus(selectedSprint.id, e.target.value as Sprint['status'])}
                  className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="not_started">Не начат</option>
                  <option value="in_progress">В процессе</option>
                  <option value="completed">Завершен ✅</option>
                </select>
              </div>
            </div>

            {/* Goal & Key Metric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Цель спринта:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedSprint.goal}
                </p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Ключевой результат (Key Metric):</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {selectedSprint.keyMetric}
                </p>
              </div>
            </div>

            {/* Filter and Add Task Bar */}
            <div className="flex items-center justify-between gap-3 pt-2 pb-4">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                </span>
                {['all', 'hr', 'github', 'code', 'outreach', 'interview', 'finance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                      filterCategory === cat
                        ? 'bg-slate-700 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {cat === 'all' ? 'Все' : cat.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить задачу</span>
              </button>
            </div>

            {/* Add Task Form (collapsible) */}
            {isAddingTask && (
              <form onSubmit={handleCreateTask} className="bg-slate-950 border border-cyan-500/40 rounded-xl p-4 mb-4 space-y-3">
                <div className="text-xs font-semibold text-cyan-400">Новая задача для Спринта {selectedSprint.id}</div>
                <div>
                  <input
                    type="text"
                    placeholder="Название задачи..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Описание и контекст..."
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Ожидаемый артефакт (Deliverable)..."
                    value={newTaskDeliverable}
                    onChange={(e) => setNewTaskDeliverable(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as SprintTask['category'])}
                      className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2.5 py-1"
                    >
                      <option value="code">Hard Skills / Код</option>
                      <option value="github">GitHub</option>
                      <option value="hr">HR / Резюме</option>
                      <option value="outreach">Питчи / Отклики</option>
                      <option value="interview">Собеседование</option>
                      <option value="finance">Финансы / Оффер</option>
                    </select>

                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as SprintTask['priority'])}
                      className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2.5 py-1"
                    >
                      <option value="high">Высокий приоритет</option>
                      <option value="medium">Средний приоритет</option>
                      <option value="low">Низкий приоритет</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-1.5 rounded-lg transition-all"
                    >
                      Сохранить задачу
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Tasks Items */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Нет задач в этой категории
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const categoryInfo = getCategoryBadge(task.category);
                  return (
                    <div
                      key={task.id}
                      onClick={() => setActiveModalTask(task)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                        task.completed
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-80 hover:opacity-100 hover:border-slate-700'
                          : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => handleCheckboxClick(e, task.id, task.completed)}
                          className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                          title={task.completed ? 'Пометить невыполненной' : 'Пометить выполненной'}
                        >
                          {task.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${categoryInfo.bg}`}>
                              {categoryInfo.label}
                            </span>
                            {task.priority === 'high' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                                Срочно
                              </span>
                            )}
                            {task.completedAt && (
                              <span className="text-[10px] text-slate-500 font-mono">
                                Завершено {task.completedAt}
                              </span>
                            )}
                          </div>

                          <h4 className={`text-sm font-semibold text-white ${
                            task.completed ? 'line-through text-slate-400' : ''
                          }`}>
                            {task.title}
                          </h4>

                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {task.description}
                          </p>

                          {/* Deliverable & Live Link */}
                          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-start gap-1.5 text-slate-400">
                              <span className="font-semibold text-cyan-400 shrink-0">Артефакт:</span>
                              <span className="text-slate-300 font-mono text-[11px] truncate max-w-xs">{task.deliverable}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {task.artifactUrl && (
                                <a
                                  href={task.artifactUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline font-mono"
                                >
                                  <span>Ссылка</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <span className="text-[11px] text-cyan-400 font-medium group-hover:underline flex items-center gap-1">
                                <span>{task.completed ? 'Редактировать артефакт' : 'Открыть воркбенч'}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mentor Advisory & Key Strategy */}
        <div className="space-y-4">
          {/* Mentor Advice Card */}
          <div className="bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-900/40 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Наставление Ментора</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-2">
              Стратегический фокус Спринта {selectedSprint.id}
            </h4>
            <div className="bg-slate-950/70 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed italic">
              "{selectedSprint.mentorTip}"
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-900/40 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-white">Правило ментора для этого этапа:</div>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                <li>Держи темп: лучше 1 час ежедневно, чем 10 часов в аврале на выходных.</li>
                <li>Фиксируй доказательства выполнения в каждом таске.</li>
                <li>Не бойся предлагать свои решения на собеседованиях.</li>
              </ul>
            </div>
          </div>

          {/* Sprints Sequence Navigator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Траектория перехода (6 этапов)
            </h4>
            <div className="space-y-2">
              {sprints.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSprintId(s.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                    s.id === selectedSprintId
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-bold text-[11px] w-5 text-cyan-400">#{s.id}</span>
                    <span className="truncate">{s.title.split(':')[1] || s.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Workbench Modal */}
      {activeModalTask && (
        <TaskWorkbenchModal
          sprint={selectedSprint}
          task={activeModalTask}
          isOpen={!!activeModalTask}
          onClose={() => setActiveModalTask(null)}
          onSaveTaskResult={onSaveTaskResult}
        />
      )}
    </div>
  );
};
