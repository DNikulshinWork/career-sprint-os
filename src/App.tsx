import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SprintRoadmap } from './components/SprintRoadmap';
import { ResumeAudit } from './components/ResumeAudit';
import { ColdOutreach } from './components/ColdOutreach';
import { JobPipeline } from './components/JobPipeline';
import { InterviewPrep } from './components/InterviewPrep';
import { FinanceCalculator } from './components/FinanceCalculator';
import { MentorConsultation } from './components/MentorConsultation';
import { initialSprints } from './data/sprintsData';
import { Sprint, SprintTask, JobApplication } from './types';
import { 
  CheckCircle2, 
  Github, 
  Globe, 
  Send as TelegramIcon,
  ShieldCheck,
  Compass
} from 'lucide-react';

const STORAGE_KEY_SPRINTS = 'careersprint_dmitry_sprints_v2';
const STORAGE_KEY_APPS = 'careersprint_dmitry_apps_v2';

const initialApplications: JobApplication[] = [
  {
    id: 'app-1',
    company: 'SkyFleet Logistics',
    role: 'Fullstack разработчик (Next.js / Node.js)',
    type: 'part-time',
    rate: '2,200 ₽ / час (88,000 ₽/мес)',
    source: 'Telegram (@devs_it)',
    status: 'screening',
    appliedDate: '24.09.2026',
    notes: 'Интересует опыт с WebSocket и IoT трекингом. Показал проект corporate-transport. Скрининг назначен на вторник.',
    contact: '@cto_alex_fleet',
    link: 'https://t.me/devs_it/8492'
  },
  {
    id: 'app-2',
    company: 'B2B DocuAI',
    role: 'AI / RAG Engineer (FastAPI, pgvector)',
    type: 'project',
    rate: '150,000 ₽ под ключ',
    source: 'Хабр Фриланс',
    status: 'tech_interview',
    appliedDate: '22.09.2026',
    notes: 'Разработка RAG по регламентам компании. Показал репозиторий DocBrain. На техинтервью обсуждаем гибридный поиск и чанкинг.',
    contact: 'support@docuai.ru'
  },
  {
    id: 'app-3',
    company: 'Digital Core Agency',
    role: 'Fullstack (NestJS / Next.js 15)',
    type: 'part-time',
    rate: '2,000 ₽ / час (80,000 ₽/мес)',
    source: 'Хабр Карьера',
    status: 'applied',
    appliedDate: '25.09.2026',
    notes: 'Отклик отправлен с персонализированным сопроводительным письмом и ссылкой на support-ticketing-system.'
  },
  {
    id: 'app-4',
    company: 'Fintech Solutions (Target Full-time)',
    role: 'Senior / Middle+ Fullstack Developer',
    type: 'full-time',
    rate: '260,000 ₽ / мес net',
    source: 'HeadHunter (HH.ru)',
    status: 'backlog',
    appliedDate: 'План на Спринт 4',
    notes: 'Целевая продуктовая компания для основного перехода.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('roadmap');

  // Load sprints from localStorage or fallback
  const [sprints, setSprints] = useState<Sprint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPRINTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialSprints;
  });

  // Load applications from localStorage or fallback
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialApplications;
  });

  // Persist sprints
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPRINTS, JSON.stringify(sprints));
    } catch (e) {
      console.error(e);
    }
  }, [sprints]);

  // Persist applications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  // Task toggler
  const handleToggleTask = (sprintId: number, taskId: string) => {
    setSprints(prev => prev.map(s => {
      if (s.id !== sprintId) return s;
      const updatedTasks = s.tasks.map(t => {
        if (t.id !== taskId) return t;
        const nextCompleted = !t.completed;
        return { 
          ...t, 
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toLocaleDateString('ru-RU') : undefined
        };
      });
      // Check if all completed
      const allDone = updatedTasks.every(t => t.completed);
      return {
        ...s,
        tasks: updatedTasks,
        status: allDone ? 'completed' : s.status === 'not_started' ? 'in_progress' : s.status
      };
    }));
  };

  // Save detailed task result with artifact
  const handleSaveTaskResult = (
    sprintId: number, 
    taskId: string, 
    result: { completed: boolean; artifactUrl?: string; artifactNotes?: string }
  ) => {
    setSprints(prev => prev.map(s => {
      if (s.id !== sprintId) return s;
      const updatedTasks = s.tasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          completed: result.completed,
          completedAt: result.completed ? (t.completedAt || new Date().toLocaleDateString('ru-RU')) : undefined,
          artifactUrl: result.artifactUrl !== undefined ? result.artifactUrl : t.artifactUrl,
          artifactNotes: result.artifactNotes !== undefined ? result.artifactNotes : t.artifactNotes
        };
      });
      const allDone = updatedTasks.every(t => t.completed);
      return {
        ...s,
        tasks: updatedTasks,
        status: allDone ? 'completed' : s.status === 'not_started' ? 'in_progress' : s.status
      };
    }));
  };

  // Sprint status updater
  const handleUpdateSprintStatus = (sprintId: number, status: Sprint['status']) => {
    setSprints(prev => prev.map(s => s.id === sprintId ? { ...s, status } : s));
  };

  // Add task to sprint
  const handleAddTask = (sprintId: number, taskData: Omit<SprintTask, 'id' | 'completed'>) => {
    const newTask: SprintTask = {
      ...taskData,
      id: `custom-${Date.now()}`,
      completed: false
    };
    setSprints(prev => prev.map(s => {
      if (s.id !== sprintId) return s;
      return {
        ...s,
        tasks: [...s.tasks, newTask]
      };
    }));
  };

  // Job Application handlers
  const handleAddApplication = (appData: Omit<JobApplication, 'id' | 'appliedDate'>) => {
    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toLocaleDateString('ru-RU')
    };
    setApplications(prev => [newApp, ...prev]);
  };

  const handleUpdateAppStatus = (id: string, newStatus: JobApplication['status']) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  // Overall metrics
  const totalTasks = sprints.reduce((acc, s) => acc + s.tasks.length, 0);
  const completedTasks = sprints.reduce((acc, s) => acc + s.tasks.filter(t => t.completed).length, 0);
  const overallProgress = Math.round((completedTasks / totalTasks) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Persistent Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progressPercent={overallProgress}
        completedTasksCount={completedTasks}
        totalTasksCount={totalTasks}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'roadmap' && (
          <SprintRoadmap
            sprints={sprints}
            onToggleTask={handleToggleTask}
            onUpdateSprintStatus={handleUpdateSprintStatus}
            onAddTask={handleAddTask}
            onSaveTaskResult={handleSaveTaskResult}
          />
        )}

        {activeTab === 'audit' && <ResumeAudit />}

        {activeTab === 'outreach' && <ColdOutreach />}

        {activeTab === 'pipeline' && (
          <JobPipeline
            applications={applications}
            onAddApplication={handleAddApplication}
            onUpdateStatus={handleUpdateAppStatus}
            onDeleteApplication={handleDeleteApplication}
          />
        )}

        {activeTab === 'interview' && <InterviewPrep />}

        {activeTab === 'finance' && <FinanceCalculator />}

        {activeTab === 'mentor' && <MentorConsultation />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>CareerSprint OS • Персональный менторский кокпит Дмитрия Никульшина</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a 
              href="https://github.com/DNikulshin" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono"
            >
              <Github className="w-3.5 h-3.5" /> DNikulshin
            </a>
            <a 
              href="https://dnikulshin.github.io" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" /> Портфолио
            </a>
            <a 
              href="https://t.me/nikulshin_dev" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <TelegramIcon className="w-3.5 h-3.5" /> @nikulshin_dev
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
