import { InterviewQuestion } from '../types';

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'int-1',
    category: 'Node.js/NestJS',
    difficulty: 'Middle+',
    question: 'Как устроен Event Loop в Node.js? Какие фазы он проходит, и в чем разница между microtasks (process.nextTick, Promise) и macrotasks (setTimeout, setImmediate)?',
    whyAsked: 'Проверяют понимание асинхронной природы Node.js и умение избегать блокировок основного потока.',
    answer: 'Event Loop в libuv состоит из основных фаз: 1. Timers (выполняет коллбеки setTimeout/setInterval); 2. Pending callbacks (системные I/O ошибки); 3. Idle, prepare (внутренние фазы); 4. Poll (получение новых I/O событий, блокировка при ожидании); 5. Check (коллбеки setImmediate); 6. Close callbacks (закрытие соединений, e.g. socket.on("close")). Очередь микротасок (process.nextTick, Promise.then/catch/finally) выполняется СРАЗУ ПОСЛЕ завершения текущей операции, ДО перехода к следующей фазе Event Loop. При этом process.nextTick имеет наивысший приоритет над промисами.',
    mentorTip: 'Упомяни, что в реальных проектах (например, при парсинге больших файлов или расчете эмбеддингов) тяжелые синхронные вычисления выносятся в Worker Threads или Child Process, чтобы не блокировать фазу Poll для входящих HTTP/WebSocket запросов.'
  },
  {
    id: 'int-2',
    category: 'Node.js/NestJS',
    difficulty: 'Middle',
    question: 'Каков жизненный цикл запроса в NestJS (Request Lifecycle)? В каком порядке отрабатывают Middleware, Guards, Interceptors, Pipes и Exception Filters?',
    whyAsked: 'Тест на знание архитектуры NestJS и правильного размещения бизнес-логики.',
    answer: 'Порядок обработки входящего запроса в NestJS:\n1. Global / Module Middleware (e.g. CORS, логирование сырого HTTP)\n2. Guards (проверка авторизации, прав доступа, RBAC - возвращают boolean)\n3. Interceptors (Pre-controller: перехват до вызова метода контроллера, трансформация запроса)\n4. Pipes (валидация и трансформация параметров, e.g. class-validator, ParseIntPipe)\n5. Controller Method Handler & Service (бизнес-логика)\n6. Interceptors (Post-controller: трансформация ответа, логирование времени выполнения)\n7. Exception Filters (перехват не пойманных исключений и формирование унифицированного JSON ответа с HTTP-кодом).',
    mentorTip: 'Приведи пример из твоего Helpdesk проекта: Guards проверяли роль инженера через JWT, а Pipes валидировали DTO создания тикета.'
  },
  {
    id: 'int-3',
    category: 'React/Next.js',
    difficulty: 'Senior',
    question: 'В чем ключевая разница между React Server Components (RSC) и Client Components в Next.js 15 App Router? Как работают Server Actions?',
    whyAsked: 'Проверяют актуальность знаний современного стека React 19 и Next.js 15.',
    answer: 'RSC рендерятся исключительно на сервере и возвращают виртуальное дерево в бинарном RSC-формате, их JS-код НЕ попадает в клиентский бандл (0 bundle size). Они имеют прямой доступ к базам данных, секретам окружения и файловой системе, но не могут использовать хуки состояния (useState, useEffect) или браузерные API. Client Components (с директивой "use client") компилируются и гидрируются в браузере, поддерживая интерактивность.\n\nServer Actions (директива "use server") — это асинхронные серверные функции, которые можно вызывать напрямую из форм или обработчиков событий клиента. Под капотом Next.js генерирует POST-запрос с автоматическим управлением сериализацией, валидацией заголовков CSRF и поддержкой revalidatePath/revalidateTag для бесшовной инвалидации серверного кеша.',
    mentorTip: 'Расскажи, как ты использовал Server Actions в `support-ticketing-system` для мгновенного создания тикетов с оптимистичным обновлением интерфейса через `useOptimistic`.'
  },
  {
    id: 'int-4',
    category: 'Database/SQL',
    difficulty: 'Middle+',
    question: 'Какие типы индексов есть в PostgreSQL (B-Tree, GIN, GiST)? Как расследовать медленный запрос с помощью EXPLAIN ANALYZE?',
    whyAsked: 'Проверка бэкенд-зрелости: умение работать с БД при росте объемов данных.',
    answer: 'B-Tree — дефолтный и самый частый индекс для операторов сравнения (=, <, >, BETWEEN, IN), идеально подходит для ID, дат, чисел.\nGIN (Generalized Inverted Index) — инвертированный индекс для составных типов (JSONB, полнотекстовый поиск tsvector, массивы). Ищет элементы внутри коллекций.\nGiST — для пространственных (геоданные PostGIS, геометрия) и диапазонов.\n\nEXPLAIN ANALYZE реально выполняет запрос в БД и возвращает execution plan: Execution Time vs Planning Time, используемые сканирования (Seq Scan vs Index Scan / Bitmap Index Scan), затраты (Cost) и количество отфильтрованных строк. Особое внимание обращаем на Seq Scan по большим таблицам и Nested Loops без индексов.',
    mentorTip: 'Подчеркни опыт из «Связь Стандарт» или проектов: добавление составного B-Tree индекса по (status, created_at) сократило время выборки списка тикетов с 800ms до 20ms.'
  },
  {
    id: 'int-5',
    category: 'AI & RAG',
    difficulty: 'Senior',
    question: 'Как устроен современный RAG пайплайн в production? Какие бывают стратегии чанкинга и как pgvector выбирает между HNSW и IVFFlat индексами?',
    whyAsked: 'Уникальный вопрос под твой флагман DocBrain. Показывает, что ты глубоко разбираешься в AI.',
    answer: 'RAG пайплайн включает:\n1. Ингестию и адаптивный чанкинг (RecursiveCharacter, semantic chunking с перекрытием 10–20% для сохранения контекста границы).\n2. Генерацию векторных эмбеддингов (e.g., text-embedding-3-small или multilingual-e5).\n3. Сохранение в векторную БД с метаданными (pgvector / Qdrant).\n4. Поиск: Гибридный поиск (BM25 полнотекстовый + Dense Vector Similarity) + Reranking (Cross-Encoder / Cohere) для точной сортировки.\n5. Генерацию ответа LLM с системным промптом, запрещающим галлюцинации, и обязательными ссылками на chunk ID.\n\nВ pgvector:\n• IVFFlat — делит пространство на кластеры (списки). Быстрее строится, требует меньше RAM, но требует предварительного наполнения данными для качественного обучения центроидов и дает меньший recall.\n• HNSW (Hierarchical Navigable Small World) — многослойный граф. Позволяет делать запросы с высоким Recall (>98%) даже при обновлении базы "на лету", работает в разы быстрее IVFFlat на миллионах векторов, но требует больше RAM.',
    mentorTip: 'Это ответ сеньорского уровня. Ты сразу покажешь, что DocBrain — не просто учебный проект, а продуманная архитектура.'
  },
  {
    id: 'int-6',
    category: 'System Design',
    difficulty: 'Senior',
    question: 'Как спроектировать реалтайм-трекинг для 50 000 автомобилей, отправляющих GPS координаты каждую секунду по WebSocket?',
    whyAsked: 'Проверка твоего проекта `corporate-transport`.',
    answer: 'Архитектурный подход:\n1. Ingress & Load Balancing: Несколько экземпляров Node.js WebSocket-серверов за Nginx/HAProxy (SSL termination, sticky sessions или IP hash).\n2. Pub/Sub Message Broker: Redis Pub/Sub или Apache Kafka для распределения сообщений между нодами бэкенда.\n3. In-memory Cache: Redis GEO для хранения последнего известного местоположения (GEOADD, GEODIST, GEORADIUS) с мгновенным откликом для клиентов диспетчерской.\n4. Persisting Time-Series Data: Не пишем каждую секунду в реляционный Postgres! Используем батчинг (буфер в Redis/RabbitMQ) со сбросом раз в 10–30 секунд пачками в Time-Series хранилище (TimescaleDB / ClickHouse).\n5. Клиенты: React PWA с виртуализацией маркеров на карте (Leaflet / Mapbox clustering) и дебаунсингом рендера.',
    mentorTip: 'У тебя уже есть репозиторий corporate-transport! Ссылайся на него: «Я реализовал эту концепцию в монорепозитории corporate-transport...».'
  },
  {
    id: 'int-7',
    category: 'HR & Soft Skills',
    difficulty: 'Middle',
    question: 'Расскажите о ситуации, когда вы не успевали сдать задачу к дедлайну. Что вы предприняли?',
    whyAsked: 'Проверяют прозрачность коммуникации и зрелость.',
    answer: '«В таких ситуациях главное — не молчать до дня релиза. Как только я вижу, что скоуп вырос или возникли непредвиденные блокеры (например, задержка API стороннего сервиса), я заранее (за 2-3 дня) поднимаю флаг тимлиду или заказчику.\nЯ прихожу не с проблемой, а с вариантами решения: 1) Сократить скоуп до MVP (выкатить базовую функциональность без второстепенных анимаций/экспорта); 2) Приоритизировать критический путь; 3) Если сдвиг неизбежен — дать точную аргументированную оценку нового срока. Заказчики ценят предсказуемость больше, чем пустые обещания».',
    mentorTip: 'Зрелый специалист всегда управляет ожиданиями стейкхолдеров.'
  }
];
