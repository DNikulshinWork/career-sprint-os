import { OutreachTemplate } from '../types';

export interface JobChannel {
  name: string;
  category: 'Telegram канал' | 'Платформа' | 'Фриланс / B2B';
  url: string;
  description: string;
  badge: string;
  frequency: string;
}

export const curatedChannels: JobChannel[] = [
  {
    name: 'Habr Career (Хабр Карьера)',
    category: 'Платформа',
    url: 'https://career.habr.com/vacancies?type=suitable&remote=1',
    description: 'Лучшая платформа в РФ для поиска адекватных удаленных команд без токсичного бюрократического скрининга.',
    badge: 'Топ-1 для Fullstack',
    frequency: 'Ежедневно'
  },
  {
    name: 'HeadHunter (HH.ru)',
    category: 'Платформа',
    url: 'https://hh.ru',
    description: 'Массовый рынок. Фильтры: «Удаленная работа», «Частичная занятость» или «Проектная работа». Стек: NestJS, Next.js, Node.js.',
    badge: 'Объем и воронка',
    frequency: '2 раза в день'
  },
  {
    name: '@fordev (Работа в IT)',
    category: 'Telegram канал',
    url: 'https://t.me/fordev',
    description: 'Крупный канал с прямыми контактами фаундеров и тимлидов без рекрутерских фильтров.',
    badge: 'Telegram',
    frequency: 'Постоянно'
  },
  {
    name: '@devs_it (Вакансии для разработчиков)',
    category: 'Telegram канал',
    url: 'https://t.me/devs_it',
    description: 'Качественные удаленные вакансии Node.js, React, Fullstack, часто с вилками от 180 000 до 350 000 ₽.',
    badge: 'Telegram',
    frequency: 'Постоянно'
  },
  {
    name: '@tproger_jobs (Работа от Типичного Программиста)',
    category: 'Telegram канал',
    url: 'https://t.me/tproger_jobs',
    description: 'Проверенные вакансии от IT-компаний, стартапов и финтеха с указанием формата удаленки.',
    badge: 'Telegram',
    frequency: 'Ежедневно'
  },
  {
    name: '@remote_it_jobs (IT Удаленка)',
    category: 'Telegram канал',
    url: 'https://t.me/remote_it_jobs',
    description: 'Специализированный канал только для 100% удаленной работы.',
    badge: 'Удаленка Only',
    frequency: 'Ежедневно'
  },
  {
    name: 'Хабр Фриланс',
    category: 'Фриланс / B2B',
    url: 'https://freelance.habr.com',
    description: 'Заказы на доработку бэкенда, разработку ботов, админок, интеграцию API. Быстрый способ взять заказ на 30–80k ₽.',
    badge: 'Быстрый доход',
    frequency: 'Мониторинг через Scan-Agent'
  },
  {
    name: '@parttime_it / B2B подряды',
    category: 'Telegram канал',
    url: 'https://t.me/parttime_it',
    description: 'Канал вакансий с частичной занятостью (10-20 ч/нед), гибким графиком и контрактной оплатой.',
    badge: 'Part-time',
    frequency: 'Ежедневно'
  }
];

export const outreachTemplates: OutreachTemplate[] = [
  {
    id: 'out-1',
    title: 'Питч в Telegram для СТО / Тимлида (Part-time / Контракт)',
    targetAudience: 'Технические директора, тимлиды веб-студий и стартапов',
    platform: 'Telegram',
    tags: ['Part-time', 'Next.js 15', 'NestJS', 'Быстрый старт'],
    body: `Добрый день, [Имя]! Увидел ваш проект [Название компании / задачи].

Я Fullstack-инженер (TypeScript: Node.js/NestJS + React/Next.js 15) с 3+ годами коммерческого опыта. Могу подключиться к вашей команде на 15–25 часов в неделю под задачи, на которые сейчас не хватает свободных рук:
• Разработка и рефакторинг API (NestJS, Prisma, PostgreSQL)
• Интерактивные интерфейсы и админ-панели (Next.js 15 App Router, Server Actions, TanStack Query)
• Реалтайм-сервисы (WebSockets, Redis) и контейнеризация (Docker)

Есть живые открытые репозитории с продакшн-архитектурой:
• IoT-мониторинг транспорта (WebSockets, PWA с офлайном): github.com/DNikulshin/corporate-transport
• B2B CRM система заявок: github.com/DNikulshin/support-ticketing-system

Работаю полностью автономно, оформлен как самозанятый (договор, закрывающие акты). Если у вас есть горящие задачи в бэклоге — готов обсудить созвон на 15 минут!`
  },
  {
    id: 'out-2',
    title: 'Питч на внедрение AI & RAG по базе знаний (B2B Продажи)',
    targetAudience: 'Фаундеры B2B-сервисов, руководители клиентской поддержки',
    platform: 'Telegram',
    tags: ['AI / RAG', 'Высокий чек', 'Автоматизация'],
    body: `Здравствуйте, [Имя]! Заметил, что у вас активно развивается [Продукт/Компания].

Я помогаю компаниям автоматизировать работу со внутренними регламентами и документами с помощью современных RAG-систем (Retrieval-Augmented Generation на базе LLM).

Что я могу внедрить под ключ за 2-3 недели:
1. Корпоративный AI-помощник для сотрудников по вашей базе знаний (PDF, Notion, регламенты)
2. Точный семантический поиск с цитированием конкретных источников (исключает галлюцинации нейросети)
3. Доступ через веб-дашборд и корпоративный Telegram-бот

Мой открытый проект архитектуры RAG на FastAPI + pgvector + LangChain:
github.com/DNikulshin/docbrain

Был бы рад показать короткое демо работы и обсудить, как это может сэкономить часы работы вашей команды.`
  },
  {
    id: 'out-3',
    title: 'Сопроводительное письмо для вакансии Fullstack (HH.ru / Habr)',
    targetAudience: 'HR и нанимающие менеджеры на вакансии Middle+/Fullstack',
    platform: 'HH / Habr',
    subject: 'Отклик на позицию Fullstack-разработчик (Node.js/React)',
    tags: ['Резюме', 'HH.ru', 'Конверсия в скрининг'],
    body: `Здравствуйте!

Меня заинтересовала вакансия [Название позиции] в вашей компании. Мой опыт и стек на 100% совпадают с вашими требованиями:

• Стек: TypeScript, Node.js (NestJS, Express), React, Next.js 15, PostgreSQL, Prisma, Redis, Docker.
• 3+ года коммерческой разработки. Умею закрывать задачи полного цикла: от проектирования схемы БД до деплоя в Docker с CI/CD.
• Имею опыт реализации реалтайм-систем на WebSockets с офлайн-очередями (IndexedDB), оптимизации тяжелых запросов в PostgreSQL и построения ролевых моделей доступа (RBAC).
• Дополнительно практикую внедрение современных AI-решений (RAG, pgvector, LLM API).

Мой GitHub с чистым кодом и понятной архитектурой: https://github.com/DNikulshin
Портфолио: https://dnikulshin.github.io

Буду рад познакомиться на онлайн-интервью и подробнее обсудить ваши задачи.
С уважением, Дмитрий Никульшин
Telegram: @nikulshin_dev | Телефон: +7 (926) 718-94-08`
  }
];
