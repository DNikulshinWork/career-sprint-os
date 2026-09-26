import React, { useState } from 'react';
import { JobApplication } from '../types';
import { 
  Plus, 
  Briefcase, 
  ExternalLink, 
  Clock, 
  ChevronRight, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  XCircle,
  PhoneCall,
  Calendar,
  Filter
} from 'lucide-react';

interface JobPipelineProps {
  applications: JobApplication[];
  onAddApplication: (app: Omit<JobApplication, 'id' | 'appliedDate'>) => void;
  onUpdateStatus: (id: string, newStatus: JobApplication['status']) => void;
  onDeleteApplication: (id: string) => void;
}

export const JobPipeline: React.FC<JobPipelineProps> = ({
  applications,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Fullstack Developer (Node.js/Next.js)');
  const [type, setType] = useState<JobApplication['type']>('part-time');
  const [rate, setRate] = useState('2,000 ₽ / час (80,000 ₽/мес)');
  const [source, setSource] = useState('Telegram (@devs_it)');
  const [notes, setNotes] = useState('');
  const [contact, setContact] = useState('');
  const [link, setLink] = useState('');

  const columns: { status: JobApplication['status']; label: string; color: string; bg: string }[] = [
    { status: 'backlog', label: 'В бэклоге (План)', color: 'text-slate-400', bg: 'border-slate-800' },
    { status: 'applied', label: 'Отклик отправлен', color: 'text-cyan-400', bg: 'border-cyan-500/30' },
    { status: 'screening', label: 'Скрининг с HR', color: 'text-amber-400', bg: 'border-amber-500/30' },
    { status: 'tech_interview', label: 'Техническое интервью', color: 'text-purple-400', bg: 'border-purple-500/30' },
    { status: 'offer', label: 'Оффер 🎉', color: 'text-emerald-400', bg: 'border-emerald-500/30' },
    { status: 'rejected', label: 'Отказ / Архив', color: 'text-rose-400', bg: 'border-rose-500/30' }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    onAddApplication({
      company: company.trim(),
      role: role.trim(),
      type,
      rate: rate.trim(),
      source: source.trim(),
      status: 'applied',
      notes: notes.trim(),
      contact: contact.trim(),
      link: link.trim()
    });

    setCompany('');
    setNotes('');
    setContact('');
    setLink('');
    setIsModalOpen(false);
  };

  const filteredApps = applications.filter(a => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              CRM Воронка Вакансий & Откликов
            </h3>
            <p className="text-xs text-slate-400">
              Всего в пайплайне: <span className="font-mono text-cyan-400 font-semibold">{applications.length}</span> позиций
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter by job type */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <span className="text-xs text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" />
            </span>
            {['all', 'part-time', 'full-time', 'project'].map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  filterType === ft
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ft === 'all' ? 'Все типы' : ft === 'part-time' ? 'Part-time' : ft === 'full-time' ? 'Full-time' : 'Проект'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить отклик</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colApps = filteredApps.filter(a => a.status === col.status);
          return (
            <div
              key={col.status}
              className={`bg-slate-900/70 border ${col.bg} rounded-2xl p-3.5 flex flex-col min-w-[240px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <span className={`text-xs font-bold ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                  {colApps.length}
                </span>
              </div>

              {/* Cards in this column */}
              <div className="space-y-3 flex-1">
                {colApps.length === 0 ? (
                  <div className="text-center py-6 text-slate-600 text-xs border border-dashed border-slate-800/60 rounded-xl">
                    Пусто
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-2 shadow-sm relative group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-xs text-white truncate">
                          {app.company}
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          app.type === 'part-time' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          app.type === 'full-time' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {app.type}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 font-medium line-clamp-1">
                        {app.role}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                        <DollarSign className="w-3 h-3 shrink-0" />
                        <span>{app.rate}</span>
                      </div>

                      {app.contact && (
                        <div className="text-[10px] text-slate-400 truncate">
                          Контакт: <span className="text-slate-300 font-mono">{app.contact}</span>
                        </div>
                      )}

                      {app.notes && (
                        <div className="text-[10px] text-slate-400 line-clamp-2 bg-slate-900/50 p-1.5 rounded">
                          {app.notes}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-mono">{app.appliedDate}</span>

                        {/* Status Mover Quick Select */}
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value as JobApplication['status'])}
                          className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-cyan-500"
                        >
                          <option value="backlog">План</option>
                          <option value="applied">Отклик</option>
                          <option value="screening">Скрининг</option>
                          <option value="tech_interview">Интервью</option>
                          <option value="offer">Оффер</option>
                          <option value="rejected">Архив</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-base font-bold text-white">Добавить вакансию или лид в воронку</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Компания / Заказчик:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Яндекс, Avito, B2B Startup, Agency"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Позиция / Роль:</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Формат:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as JobApplication['type'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="part-time">Part-time (Частичная занятость)</option>
                    <option value="full-time">Full-time Remote</option>
                    <option value="project">Проектный контракт</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Ставка / Зарплата:</label>
                  <input
                    type="text"
                    placeholder="e.g. 2,000 ₽/час или 250,000 ₽"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Источник:</label>
                  <input
                    type="text"
                    placeholder="e.g. HH, Habr, @devs_it"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Контактное лицо (TG/Email/Телефон):</label>
                <input
                  type="text"
                  placeholder="e.g. @cto_alexey или hr@startup.io"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Заметки и договоренности:</label>
                <textarea
                  rows={2}
                  placeholder="О чем договорились, стек, дата созвона..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-5 py-2 rounded-xl transition-all"
                >
                  Сохранить в воронку
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
