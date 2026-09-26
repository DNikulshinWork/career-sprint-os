import React, { useState } from 'react';
import { outreachTemplates, curatedChannels } from '../data/outreachData';
import { 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Radio, 
  MessageSquare,
  Building,
  User,
  Sliders
} from 'lucide-react';

export const ColdOutreach: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(outreachTemplates[0].id);
  const [targetName, setTargetName] = useState<string>('Алексей');
  const [targetCompany, setTargetCompany] = useState<string>('TechSolutions');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'channels'>('templates');

  const selectedTemplate = outreachTemplates.find(t => t.id === selectedTemplateId) || outreachTemplates[0];

  // Replace placeholders dynamically
  const personalizedText = selectedTemplate.body
    .replace(/\[Имя\]/g, targetName || 'Коллега')
    .replace(/\[Название компании \/ задачи\]/g, targetCompany || 'вашу команду')
    .replace(/\[Продукт\/Компания\]/g, targetCompany || 'ваш продукт')
    .replace(/\[Название позиции\]/g, 'Fullstack-разработчик (Node.js/React)');

  const handleCopy = () => {
    navigator.clipboard.writeText(personalizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'templates'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            ✉️ Генератор Питчей и Писем
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'channels'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            📡 База Каналов и Источников Удаленки
          </button>
        </div>

        {activeTab === 'templates' && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>Скопировать готовый текст</span>
          </button>
        )}
      </div>

      {activeTab === 'templates' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Template selector & Customizer (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>1. Выбери цель и шаблон</span>
              </div>

              {outreachTemplates.map((template) => {
                const isSelected = template.id === selectedTemplateId;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white">{template.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {template.platform}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Кому: {template.targetAudience}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Customizer variables */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>2. Персонализация под адресата</span>
              </div>

              <div>
                <label className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Имя контакта (СТО / Фаундер / HR):</span>
                </label>
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="e.g. Артем, Михаил, Екатерина"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Название компании или проекта:</span>
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. FinTech Bot, SkyDigital, LeadCRM"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed pt-2">
                💡 Менторский лайфхак: Персонализация имени и проекта повышает конверсию ответа в Telegram с 4% до 28%. Никогда не отправляй шаблон без подстановки реального контекста компании!
              </div>
            </div>
          </div>

          {/* Right: Live Preview & Copy (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Готовый персонализированный текст
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {personalizedText.length} символов
                  </span>
                </div>

                {selectedTemplate.subject && (
                  <div className="mt-3 bg-slate-950/70 border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs flex items-center gap-2">
                    <span className="font-semibold text-slate-400">Тема письма:</span>
                    <span className="font-mono text-cyan-300">{selectedTemplate.subject}</span>
                  </div>
                )}

                <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-sans text-slate-200 leading-relaxed whitespace-pre-line select-all">
                  {personalizedText}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Отправлять в Telegram личным сообщением или в сопроводительное на HH/Хабре.</span>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Скопировано в буфер!' : 'Скопировать'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Channels directory */
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
            <Radio className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Стратегия поиска каналов ментора:</span> 
              Не ограничивайся одним HeadHunter. Самые вкусные part-time предложения, гибкие контракты и удаленка с высокой оплатой появляются в Telegram-каналах с прямым контактом СТО/Тимлида. Подпишись на эти 8 каналов и проверяй их ежедневно по 15 минут.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {curatedChannels.map((channel, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                      {channel.category}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                      {channel.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2">
                    {channel.name}
                  </h4>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Ритм: {channel.frequency}
                  </span>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
                  >
                    <span>Открыть</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
