export type SprintStatus = 'not_started' | 'in_progress' | 'completed';

export interface SprintTask {
  id: string;
  title: string;
  description: string;
  deliverable: string;
  completed: boolean;
  category: 'hr' | 'github' | 'code' | 'outreach' | 'interview' | 'finance';
  priority: 'high' | 'medium' | 'low';
}

export interface Sprint {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  goal: string;
  status: SprintStatus;
  keyMetric: string;
  mentorTip: string;
  tasks: SprintTask[];
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  type: 'part-time' | 'full-time' | 'project';
  rate: string;
  source: string;
  status: 'backlog' | 'applied' | 'screening' | 'tech_interview' | 'offer' | 'rejected';
  appliedDate: string;
  notes: string;
  contact?: string;
  link?: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Node.js/NestJS' | 'React/Next.js' | 'Database/SQL' | 'AI & RAG' | 'HR & Soft Skills' | 'System Design';
  difficulty: 'Junior+' | 'Middle' | 'Middle+' | 'Senior';
  question: string;
  answer: string;
  whyAsked: string;
  mentorTip: string;
}

export interface OutreachTemplate {
  id: string;
  title: string;
  targetAudience: string;
  platform: 'Telegram' | 'HH / Habr' | 'Email' | 'Freelance';
  subject?: string;
  body: string;
  tags: string[];
}
