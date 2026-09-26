import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle, 
  Flame,
  Award,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface AdviceCard {
  title: string;
  category: string;
  question: string;
  advice: string;
  actionableSteps: string[];
}

export const MentorConsultation: React.FC = () => {
  const [userQuery, setUserQuery] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'mentor'; text: string; time: string }[]>([
    {
      role: 'mentor',
      text: 'Привет, Дмитрий! Я твой персональный ментор по переходу в удаленную разработку. У тебя отличная база: NestJS, Next.js 15, PostgreSQL, Docker, и уникальное преимущество — реальные AI/RAG системы (DocBrain, Scan-Agent). Чем я могу помочь сегодня? Выбери один из частых сценариев ниже или напиши свой вопрос.',
      time: '09:00'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedAdvices: AdviceCard[] = [
    {
      title: 'Как совмещать подработку и текущие дела без выгорания?',
      category: 'Тайм-менеджмент',
      question: 'У меня есть домашние и текущие обязанности. Как выделить 15–20 часов в неделю на код?',
      advice: 'Главный закон удаленного совмещения — жесткая кластеризация времени. Мозг тратит до 25 минут на переключение контекста, поэтому работать «набегами по 20 минут между делом» нельзя. Разбей неделю на понятные блоки.',
      actionableSteps: [
        'Утренний золотой блок: 07:00 – 09:30 (2.5 часа с чистой головой на архитектуру и сложный код).',
        'Вечерний блок: 19:30 – 21:00 (1.5 часа на PR, ревью, документацию и отклики).',
        'Субботний спринт: 4 часа с 10:00 до 14:00 для сдачи недельного майлстоуна.',
        'Правило одного экрана: закрывать все вкладки личных дел во время кодинг-сессий.'
      ]
    },
    {
      title: 'Что делать, если присылают огромное неоплачиваемое тестовое?',
      category: 'Отношения с работодателем',
      question: 'Компания прислала ТЗ: «Сделайте сервис с авторизацией, микросервисами и PWA, срок 3 дня». Делать?',
      advice: 'Категорически НЕТ в полном объеме. Это типичная ловушка или признак неуважения к времени кандидата. Зрелый разработчик ценит свое время и предлагает альтернативу.',
      actionableSteps: [
        'Напиши вежливый ответ: «У меня уже есть открытые продакшн-репозитории с аналогичной архитектурой: PWA с оффлайном и WebSocket (github.com/DNikulshin/corporate-transport) и CRM на NestJS/Next.js 15 (github.com/DNikulshin/support-ticketing-system).»',
        'Предложи альтернативу: «Готов созвониться на 30-40 минут с тимлидом, разобрать мой код, защитить архитектуру или решить алгоритмическую задачу в live-coding».',
        'Если тестовое адекватное (<3-4 часов) и компания топовая — сделай только ключевое ядро и покажи архитектуру в README.'
      ]
    },
    {
      title: 'Как обосновать ставку 2 000 – 2 500 ₽/час на Part-time?',
      category: 'Переговоры и Финансы',
      question: 'Заказчик говорит: «У нас бюджет только 1 000 ₽/час». Как аргументировать свою ценность?',
      advice: 'Ты продаешь не «часы стучания по клавиатуре», а решение бизнес-проблемы автономным инженером. Джуниор за 1 000 ₽ потребует 20 часов ревью тимлида и наделает багов. Ты закрываешь задачу под ключ от БД до деплоя.',
      actionableSteps: [
        'Показывай экономию на менеджменте: «Вам не нужно нанимать DevOps, верстальщика и бэкендера по отдельности. Я один закрываю связку NestJS + Next.js + Docker».',
        'Фокусируйся на предсказуемости: «Моя ставка 2 000 ₽/час, потому что я сдаю задачу в срок, пишу типизированный код и документирую API в Swagger».',
        'Если бюджет жестко ограничен — фиксируй скоуп: «За эту сумму мы сделаем только MVP с 2 ключевыми экранами, а интеграцию AI вынесем во 2-й этап».'
      ]
    },
    {
      title: 'Как презентовать возраст 41 год с максимальной выгодой?',
      category: 'HR-стратегия',
      question: 'Не отсеют ли меня рекрутеры из-за возраста?',
      advice: 'В B2B, стартапах с серьезными инвесторами и зрелых продуктах возраст 40+ воспринимается как огромный плюс, если ты демонстрируешь высокий темп и современный стек.',
      actionableSteps: [
        'Подчеркивай стабильность: у тебя нет метаний, ты не сорвешься через месяц, потому что «выгорел от поиска себя».',
        'Фокус на системности: образование МАМИ дает инженерную дисциплину в структуре данных и алгоритмах.',
        'Держи стек свежим: в твоем резюме Next.js 15, React 19, RAG, pgvector — это новее, чем у большинства 25-летних программистов!'
      ]
    }
  ];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuery.trim()) return;

    const userText = userQuery.trim();
    setUserQuery('');

    const newLog = [
      ...chatLog,
      {
        role: 'user' as const,
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setChatLog(newLog);
    setIsLoading(true);

    // Mentor reasoning generator
    setTimeout(() => {
      let mentorResponse = '';
      const queryLower = userText.toLowerCase();

      if (queryLower.includes('тестов') || queryLower.includes('задани')) {
        mentorResponse = `По поводу тестовых заданий: твое главное правило — «Правило 4-х часов». Если задание требует больше 4 часов работы, а с нанимающим менеджером или тимлидом ты еще не общался — не делай его вслепую. Предложи разобрать твой репозиторий corporate-transport или docbrain на 30-минутном созвоне. Твой код открыт, документирован и запущен в Docker — этого более чем достаточно для оценки хард-скиллов.`;
      } else if (queryLower.includes('возраст') || queryLower.includes('41') || queryLower.includes('лет')) {
        mentorResponse = `Дмитрий, помни: на удаленной работе никто не заглядывает в паспорт. Работодателя волнует только 2 вещи: 1) Умеешь ли ты писать надежный код на Next.js/NestJS, 2) Не пропадешь ли ты посреди спринта. Твои 41 год — это знак эмоциональной зрелости, умения доводить дела до конца и отсутствия токсичности. В резюме и на созвонах делай упор на инженерную базу МАМИ и 3+ года непрерывного продакшна.`;
      } else if (queryLower.includes('зарплат') || queryLower.includes('ставк') || queryLower.includes('денег') || queryLower.includes('руб')) {
        mentorResponse = `Твоя финансовая планка: для part-time (15-20 ч/нед) держи ставку 1,800 – 2,500 ₽/час. Это даст стабильные 80,000 – 140,000 ₽/мес дополнительного дохода. Для постоянной Full-time удаленки цель — 220,000 – 280,000 ₽ на руки. Никогда не соглашайся на ставку ниже 1,500 ₽/час — демпинг привлекает токсичных заказчиков с завышенными требованиями.`;
      } else if (queryLower.includes('rag') || queryLower.includes('ai') || queryLower.includes('нейро')) {
        mentorResponse = `Твой проект DocBrain (FastAPI, pgvector, LangChain, Claude) — это мощнейший рычаг! Сейчас большинство компаний хотят внедрить корпоративный поиск по документам или AI-агентов, но не знают, как это сделать без галлюцинаций. На собеседованиях рассказывай о гибридном поиске, эмбеддингах и связке с Telegram/веб. Это выделит тебя среди 95% стандартных фуллстеков.`;
      } else {
        mentorResponse = `Отличный вопрос! Чтобы двигаться максимально эффективно:
1. Зафиксируй этот шаг в Спринт-плане во вкладке «Спринт-План».
2. Держи фокус на практическом результате: каждый день отправляй минимум 5 целевых откликов или сообщений в Telegram фаундерам.
3. Проверяй свои репозитории: README с гифкой и схемой архитектуры продает тебя лучше любых слов.
Двигайся по спринтам шаг за шагом — мы доведем тебя до первого надежного контракта!`;
      }

      setChatLog(prev => [
        ...prev,
        {
          role: 'mentor',
          text: mentorResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsLoading(false);
    }, 700);
  };

  const handleAskPreset = (question: string) => {
    setUserQuery(question);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Менторская Консультация & Стратегический Разбор
            </h3>
            <p className="text-xs text-slate-400">
              Ответы на сложные вопросы карьеры, разбор тестовых заданий, психология переговоров и защита от ошибок.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Senior Mentor Online</span>
        </div>
      </div>

      {/* Main Grid: Interactive Chat + Predefined Playbooks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Chat (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[560px] overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Диалог с ментором
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Фокус: Fullstack + Part-Time Transition
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1">
                  <span>{msg.role === 'user' ? 'Дмитрий' : 'Ментор-эксперт'}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-md shadow-cyan-600/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Ментор формулирует рекомендацию...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Спроси ментора о собеседовании, резюме, ставке или оффере..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!userQuery.trim() || isLoading}
              className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Playbooks & Frequently Asked Guides (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Готовые менторские плейбуки</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {predefinedAdvices.map((card, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-medium">
                    {card.category}
                  </span>
                  <button
                    onClick={() => handleAskPreset(card.question)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
                  >
                    Задать в чат →
                  </button>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {card.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {card.advice}
                </p>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400">Шаги к действию:</div>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {card.actionableSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
