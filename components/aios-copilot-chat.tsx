'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Cpu,
  Database,
  ExternalLink,
  Layers,
  Loader2,
  Mail,
  Maximize2,
  MessageSquare,
  Minimize2,
  Network,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface BackgroundTaskStep {
  title: string;
  log: string;
  durationMs: number;
  status: 'pending' | 'running' | 'completed';
}

export interface BackgroundTask {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentStepIndex: number;
  totalSteps: number;
  steps: BackgroundTaskStep[];
  outputSummary?: string;
  data?: Record<string, any>;
  startTime: number;
  endTime?: number;
}

export interface EmailDraft {
  to: string;
  subject: string;
  previewText: string;
  html: string;
  status: 'draft' | 'sent';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  task?: BackgroundTask;
  emailDraft?: EmailDraft;
}

const STORAGE_KEY_MESSAGES = 'aios.copilot.messages_v2';
const STORAGE_KEY_TASKS = 'aios.copilot.tasks_v2';

const INITIAL_SUGGESTIONS = [
  '✉️ Email operations report to my email',
  '⚡ Run full system health diagnostic',
  '🔄 Reconcile unbilled calls & sweep stuck leads',
  '💬 Dispatch WhatsApp follow-up sequence',
  '📊 Analyze lead qualification & objections',
  '🧠 Re-index RAG loan policy vector context',
];

export function AiosCopilotChat({
  vertical = 'solar',
  externalOpen,
  onExternalClose,
}: {
  vertical?: string;
  externalOpen?: boolean;
  onExternalClose?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [tasksFilter, setTasksFilter] = useState<'all' | 'running' | 'completed'>('all');

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved chat messages', e);
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Hello! I am your **AIOS Autonomous Operations Copilot**.\n\nYou can prompt me to perform background tasks (call sweeps, system audits, lead scoring) or **dispatch executive email reports**.\n\n*Note: I will only send emails when you explicitly ask me to and confirm!*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [tasks, setTasks] = useState<BackgroundTask[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_TASKS);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved tasks', e);
      }
    }
    return [];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Synchronize external open triggers
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [externalOpen]);

  // Persist messages & tasks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized && activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, activeTab]);

  // Autonomous background task executor
  useEffect(() => {
    const runningTasks = tasks.filter((t) => t.status === 'running');
    if (runningTasks.length === 0) return;

    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status !== 'running') return task;

          const currentStep = task.steps[task.currentStepIndex];
          if (!currentStep) {
            toast.success(`Background Task "${task.name}" completed successfully!`, {
              description: task.outputSummary || 'Execution finished with 0 errors.',
              action: {
                label: 'View in Copilot',
                onClick: () => {
                  setIsOpen(true);
                  setIsMinimized(false);
                  setActiveTab('tasks');
                },
              },
            });
            return {
              ...task,
              status: 'completed',
              progress: 100,
              endTime: Date.now(),
            };
          }

          const updatedSteps = [...task.steps];
          updatedSteps[task.currentStepIndex] = {
            ...currentStep,
            status: 'completed',
          };

          const nextIndex = task.currentStepIndex + 1;
          const isDone = nextIndex >= task.steps.length;

          if (isDone) {
            toast.success(`Background Task "${task.name}" completed successfully!`, {
              description: task.outputSummary || 'All operations synced.',
              action: {
                label: 'View Output',
                onClick: () => {
                  setIsOpen(true);
                  setIsMinimized(false);
                  setActiveTab('tasks');
                },
              },
            });
            return {
              ...task,
              steps: updatedSteps,
              currentStepIndex: nextIndex,
              status: 'completed',
              progress: 100,
              endTime: Date.now(),
            };
          }

          updatedSteps[nextIndex] = {
            ...updatedSteps[nextIndex],
            status: 'running',
          };

          const nextProgress = Math.round((nextIndex / task.steps.length) * 100);

          return {
            ...task,
            steps: updatedSteps,
            currentStepIndex: nextIndex,
            progress: nextProgress,
          };
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [tasks]);

  // Keep task references in chat messages in sync with global tasks
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (!msg.task) return msg;
        const liveTask = tasks.find((t) => t.id === msg.task?.id);
        return liveTask ? { ...msg, task: liveTask } : msg;
      })
    );
  }, [tasks]);

  const activeRunningCount = tasks.filter((t) => t.status === 'running').length;
  const currentRunningTask = tasks.find((t) => t.status === 'running');

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          vertical,
        }),
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();

      let assignedTask: BackgroundTask | undefined = undefined;

      if (data.task) {
        assignedTask = {
          id: data.task.id,
          name: data.task.name,
          type: data.task.type,
          description: data.task.description,
          status: 'running',
          progress: 15,
          currentStepIndex: 0,
          totalSteps: data.task.totalSteps,
          steps: data.task.steps.map((s: any, idx: number) => ({
            ...s,
            status: idx === 0 ? 'running' : 'pending',
          })),
          outputSummary: data.task.outputSummary,
          data: data.task.data,
          startTime: Date.now(),
        };

        setTasks((prev) => [assignedTask!, ...prev]);

        toast.info(`Task [${assignedTask.name}] running in background...`, {
          description: 'You can minimize this chat; the task will continue running.',
        });
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        task: assignedTask,
        emailDraft: data.emailDraft,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ I encountered a temporary connection issue reaching the AI backend. Please try again or run a system diagnostic.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async (draft: EmailDraft) => {
    setIsSendingEmail(true);
    toast.info(`Transmitting email to ${draft.to}...`);

    try {
      const res = await fetch('/api/ai/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: draft.to,
          subject: draft.subject,
          html: draft.html,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || `Email sent successfully to ${draft.to}!`);
        // Update draft status to sent in chat
        setMessages((prev) =>
          prev.map((m) =>
            m.emailDraft?.to === draft.to
              ? { ...m, emailDraft: { ...m.emailDraft, status: 'sent' } }
              : m
          )
        );

        // Add email dispatch task
        const emailTask: BackgroundTask = {
          id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
          name: `Email Dispatch to ${draft.to}`,
          type: 'email_dispatch',
          description: `Dispatched operational email report to ${draft.to}`,
          status: 'completed',
          progress: 100,
          currentStepIndex: 2,
          totalSteps: 2,
          steps: [
            { title: 'Rendered responsive email template', log: 'Built HTML report', durationMs: 400, status: 'completed' },
            { title: `Delivered via ${data.provider || 'gateway'}`, log: data.message || 'Transmitted', durationMs: 600, status: 'completed' },
          ],
          outputSummary: `Delivered to ${draft.to}`,
          startTime: Date.now() - 1000,
          endTime: Date.now(),
        };
        setTasks((prev) => [emailTask, ...prev]);
      } else {
        toast.error(data.error || 'Failed to dispatch email.');
      }
    } catch (err: any) {
      toast.error('Network error dispatching email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Chat history cleared. I am ready for your next background task or query.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    toast.success('Chat history cleared');
  };

  const handleCancelTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'cancelled', endTime: Date.now() } : t))
    );
    toast.info('Task cancelled');
  };

  const handleRerunTask = (task: BackgroundTask) => {
    const newTask: BackgroundTask = {
      ...task,
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'running',
      progress: 15,
      currentStepIndex: 0,
      steps: task.steps.map((s, idx) => ({ ...s, status: idx === 0 ? 'running' : 'pending' })),
      startTime: Date.now(),
      endTime: undefined,
    };
    setTasks((prev) => [newTask, ...prev]);
    toast.info(`Re-launched task [${newTask.name}] in background`);
  };

  const filteredTasks = tasks.filter((t) => {
    if (tasksFilter === 'running') return t.status === 'running';
    if (tasksFilter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <>
      {/* ─── 1. FLOATING LAUNCHER PILL / BUTTON ───────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {currentRunningTask && (
            <div
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
                setActiveTab('tasks');
              }}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-primary/40 bg-card/95 px-3.5 py-1.5 text-xs shadow-float backdrop-blur-md transition-all hover:scale-105 hover:border-primary"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <span className="font-medium text-foreground truncate max-w-[190px]">
                {currentRunningTask.name}
              </span>
              <span className="font-mono text-[11px] font-semibold text-primary">
                {currentRunningTask.progress}%
              </span>
            </div>
          )}

          <Button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex h-14 items-center gap-2.5 rounded-full bg-primary px-5 text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:bg-primary/95"
            aria-label="Open AIOS Autonomous Copilot"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="size-6 transition-transform group-hover:rotate-6" />
              <Sparkles className="absolute -right-1 -top-1 size-3 text-amber-300 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold uppercase tracking-wider">AIOS Copilot</span>
              <span className="text-[10px] opacity-85">
                {activeRunningCount > 0 ? `${activeRunningCount} Task Running` : 'Background Assistant'}
              </span>
            </div>

            {activeRunningCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-sm">
                {activeRunningCount}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* ─── 2. FLOATING CHAT WINDOW ─────────────────────────────────── */}
      {isOpen && (
        <div
          className={cn(
            'fixed z-50 flex flex-col overflow-hidden border border-border/80 bg-card shadow-2xl transition-all duration-300',
            isMinimized
              ? 'bottom-6 right-6 h-14 w-80 rounded-2xl'
              : isExpanded
              ? 'inset-4 md:inset-8 rounded-2xl'
              : 'bottom-6 right-6 h-[640px] w-full max-w-[480px] rounded-2xl'
          )}
        >
          {/* Header Bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-3 select-none">
            <div
              className="flex cursor-pointer items-center gap-2.5"
              onClick={() => isMinimized && setIsMinimized(false)}
            >
              <div className="relative flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Bot className="size-4" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-card bg-emerald-500" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-sm font-bold tracking-tight">AIOS Copilot</span>
                  <Badge variant="outline" className="h-4 border-primary/30 px-1 text-[9px] text-primary">
                    Autonomous
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  {activeRunningCount > 0 ? (
                    <span className="text-primary font-medium flex items-center gap-1">
                      <Loader2 className="size-2.5 animate-spin" /> {activeRunningCount} background task active
                    </span>
                  ) : (
                    'Background worker ready'
                  )}
                </span>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <div className="mr-2 flex rounded-lg bg-muted p-0.5 text-xs">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={cn(
                      'rounded-md px-2.5 py-1 font-medium transition-colors text-xs',
                      activeTab === 'chat'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors text-xs',
                      activeTab === 'tasks'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Tasks
                    {activeRunningCount > 0 && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                        {activeRunningCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <ChevronUp className="size-4" /> : <Minimize2 className="size-3.5" />}
              </Button>

              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex size-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Restore' : 'Maximize'}
                >
                  <Maximize2 className="size-3.5" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsOpen(false);
                  if (onExternalClose) onExternalClose();
                }}
                title="Close"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Body Content */}
          {!isMinimized && (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* ─── TAB 1: CHAT ────────────────────────────────────── */}
              {activeTab === 'chat' && (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex flex-col',
                          msg.sender === 'user' ? 'items-end' : 'items-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm',
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-xs'
                              : 'bg-muted/70 text-foreground border border-border/70 rounded-bl-xs'
                          )}
                        >
                          <div className="whitespace-pre-wrap font-sans space-y-1.5">
                            {msg.text.split('\n\n').map((paragraph, pIdx) => (
                              <p key={pIdx}>
                                {paragraph.split('**').map((part, bIdx) =>
                                  bIdx % 2 === 1 ? (
                                    <strong key={bIdx} className="font-semibold">
                                      {part}
                                    </strong>
                                  ) : (
                                    part
                                  )
                                )}
                              </p>
                            ))}
                          </div>

                          {/* Email Preview & Confirmation Card */}
                          {msg.emailDraft && (
                            <div className="mt-3 overflow-hidden rounded-xl border border-primary/40 bg-card p-3.5 text-foreground shadow-sm">
                              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                                <div className="flex items-center gap-1.5 font-semibold text-xs text-primary">
                                  <Mail className="size-3.5" />
                                  <span>Operational Email Dispatch</span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-[10px]',
                                    msg.emailDraft.status === 'sent'
                                      ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                      : 'border-primary/40 text-primary'
                                  )}
                                >
                                  {msg.emailDraft.status === 'sent' ? 'Sent' : 'Approval Required'}
                                </Badge>
                              </div>

                              <div className="mt-2.5 space-y-1.5 text-[11px]">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <span className="font-medium text-foreground">To:</span>
                                  <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-foreground font-semibold">
                                    {msg.emailDraft.to}
                                  </span>
                                </div>
                                <div className="text-muted-foreground">
                                  <span className="font-medium text-foreground">Subject:</span> {msg.emailDraft.subject}
                                </div>
                              </div>

                              <div className="mt-2.5 rounded-lg bg-muted/50 p-2.5 text-[10.5px] border border-border/50 text-muted-foreground leading-relaxed">
                                {msg.emailDraft.previewText}
                              </div>

                              {msg.emailDraft.status === 'draft' && (
                                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <AlertCircle className="size-3 text-amber-500" /> Only sends upon your click
                                  </span>
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                                    onClick={() => handleSendEmail(msg.emailDraft!)}
                                    disabled={isSendingEmail}
                                  >
                                    {isSendingEmail ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
                                    Send Email Now
                                  </Button>
                                </div>
                              )}

                              {msg.emailDraft.status === 'sent' && (
                                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="size-3.5" /> Dispatched successfully to {msg.emailDraft.to}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Live Background Task Card */}
                          {msg.task && (
                            <div className="mt-3 overflow-hidden rounded-xl border border-primary/30 bg-card p-3 text-foreground shadow-sm">
                              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                                <div className="flex items-center gap-1.5">
                                  <Workflow className="size-3.5 text-primary" />
                                  <span className="font-semibold text-xs">{msg.task.name}</span>
                                </div>
                                <Badge
                                  className={cn(
                                    'text-[10px]',
                                    msg.task.status === 'completed'
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                      : msg.task.status === 'running'
                                      ? 'bg-primary/10 text-primary animate-pulse'
                                      : 'bg-muted text-muted-foreground'
                                  )}
                                >
                                  {msg.task.status === 'running' ? (
                                    <span className="flex items-center gap-1">
                                      <Loader2 className="size-2.5 animate-spin" /> In Background
                                    </span>
                                  ) : msg.task.status === 'completed' ? (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle2 className="size-2.5" /> Completed
                                    </span>
                                  ) : (
                                    msg.task.status
                                  )}
                                </Badge>
                              </div>

                              <p className="mt-2 text-[11px] text-muted-foreground">
                                {msg.task.description}
                              </p>

                              <div className="mt-2.5 space-y-1">
                                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                                  <span>Step {Math.min(msg.task.currentStepIndex + 1, msg.task.totalSteps)} of {msg.task.totalSteps}</span>
                                  <span className="font-bold text-primary">{msg.task.progress}%</span>
                                </div>
                                <Progress value={msg.task.progress} className="h-1.5" />
                              </div>

                              <div className="mt-3 rounded-lg bg-muted/60 p-2 font-mono text-[10px] space-y-1.5 max-h-32 overflow-y-auto border border-border/50">
                                {msg.task.steps.map((step, sIdx) => (
                                  <div key={sIdx} className="flex items-start gap-1.5">
                                    {step.status === 'completed' ? (
                                      <CheckCircle2 className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                                    ) : step.status === 'running' ? (
                                      <Loader2 className="size-3 text-primary animate-spin shrink-0 mt-0.5" />
                                    ) : (
                                      <Clock className="size-3 text-muted-foreground shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                      <span className={cn('font-medium', step.status === 'running' ? 'text-primary' : 'text-foreground')}>
                                        {step.title}
                                      </span>
                                      {step.status !== 'pending' && (
                                        <p className="text-muted-foreground text-[9.5px] mt-0.5">
                                          &gt; {step.log}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {msg.task.status === 'completed' && msg.task.outputSummary && (
                                <div className="mt-2 rounded-lg bg-emerald-500/5 p-2 text-[10.5px] border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                  <strong>Result:</strong> {msg.task.outputSummary}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="mt-1 px-1 text-[9px] text-muted-foreground">
                          {msg.timestamp}
                        </span>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-center gap-2 rounded-2xl bg-muted/70 p-3 text-xs text-muted-foreground w-fit border border-border/60">
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                        <span>AIOS Copilot is formulating task...</span>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div className="border-t border-border/60 bg-muted/20 px-3 py-2">
                    <div className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="size-3 text-primary" /> Recommended Operations
                      </span>
                      <button
                        onClick={handleClearChat}
                        className="text-[10px] hover:text-destructive transition-colors"
                      >
                        Clear chat
                      </button>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {INITIAL_SUGGESTIONS.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(item.replace(/^[^\w\s]+\s*/, ''))}
                          disabled={isLoading}
                          className="shrink-0 rounded-full border border-border/80 bg-card px-2.5 py-1 text-[11px] text-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Form */}
                  <div className="border-t border-border/80 p-3 bg-card">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="relative flex items-end gap-2"
                    >
                      <textarea
                        ref={inputRef}
                        rows={2}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a task or ask to send an email... (e.g. 'Email report to me@gmail.com')"
                        className="w-full resize-none rounded-xl border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="h-9 w-9 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={!inputValue.trim() || isLoading}
                      >
                        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                      </Button>
                    </form>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground px-1">
                      <span>Press <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for newline</span>
                      <span className="flex items-center gap-1 text-primary">
                        <Mail className="size-2.5" /> Email on Explicit Demand Only
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TAB 2: BACKGROUND TASKS REGISTRY ────────────────── */}
              {activeTab === 'tasks' && (
                <div className="flex flex-1 flex-col overflow-hidden p-4 space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h3 className="font-semibold text-sm flex items-center gap-1.5">
                        <Cpu className="size-4 text-primary" />
                        Background Tasks Worker
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Autonomous tasks running asynchronously across AIOS services.
                      </p>
                    </div>

                    <div className="flex rounded-lg bg-muted p-0.5 text-xs">
                      <button
                        onClick={() => setTasksFilter('all')}
                        className={cn(
                          'rounded-md px-2 py-0.5 text-[11px]',
                          tasksFilter === 'all' ? 'bg-card font-medium text-foreground shadow-sm' : 'text-muted-foreground'
                        )}
                      >
                        All ({tasks.length})
                      </button>
                      <button
                        onClick={() => setTasksFilter('running')}
                        className={cn(
                          'rounded-md px-2 py-0.5 text-[11px]',
                          tasksFilter === 'running' ? 'bg-card font-medium text-foreground shadow-sm' : 'text-muted-foreground'
                        )}
                      >
                        Running ({activeRunningCount})
                      </button>
                      <button
                        onClick={() => setTasksFilter('completed')}
                        className={cn(
                          'rounded-md px-2 py-0.5 text-[11px]',
                          tasksFilter === 'completed' ? 'bg-card font-medium text-foreground shadow-sm' : 'text-muted-foreground'
                        )}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {filteredTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-center text-xs text-muted-foreground">
                        <Workflow className="size-8 text-muted-foreground/40 mb-2" />
                        <p className="font-medium text-foreground">No tasks in this view</p>
                        <p className="text-[11px] mt-1">Prompt the Copilot to trigger a background operation.</p>
                      </div>
                    ) : (
                      filteredTasks.map((t) => (
                        <div
                          key={t.id}
                          className="rounded-xl border border-border/80 bg-card p-3 shadow-sm space-y-2.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">{t.name}</span>
                                <span className="font-mono text-[10px] text-muted-foreground">#{t.id}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{t.description}</p>
                            </div>
                            <Badge
                              className={cn(
                                'text-[10px] shrink-0',
                                t.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : t.status === 'running'
                                  ? 'bg-primary/10 text-primary animate-pulse'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {t.status === 'running' ? 'Running' : t.status === 'completed' ? 'Done' : t.status}
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                              <span>Progress</span>
                              <span>{t.progress}%</span>
                            </div>
                            <Progress value={t.progress} className="h-1.5" />
                          </div>

                          <div className="rounded-lg bg-muted/60 p-2 font-mono text-[10px] space-y-1 border border-border/40">
                            {t.steps.map((step, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                {step.status === 'completed' ? (
                                  <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                                ) : step.status === 'running' ? (
                                  <Loader2 className="size-3 text-primary animate-spin shrink-0" />
                                ) : (
                                  <Clock className="size-3 text-muted-foreground shrink-0" />
                                )}
                                <span className={step.status === 'running' ? 'text-primary font-medium' : 'text-foreground'}>
                                  {step.title}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                            <span>Started: {new Date(t.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>

                            <div className="flex items-center gap-2">
                              {t.status === 'running' && (
                                <button
                                  onClick={() => handleCancelTask(t.id)}
                                  className="text-destructive hover:underline font-medium"
                                >
                                  Cancel
                                </button>
                              )}
                              {t.status !== 'running' && (
                                <button
                                  onClick={() => handleRerunTask(t)}
                                  className="text-primary hover:underline font-medium flex items-center gap-1"
                                >
                                  <RefreshCw className="size-2.5" /> Re-run
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
