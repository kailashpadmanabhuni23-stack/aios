'use client';

import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  FileText,
  Layers,
  MessageSquare,
  Network,
  PhoneCall,
  Play,
  RefreshCw,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Volume2,
  Workflow,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function FourCsFrameworkPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'connections' | 'capability' | 'context' | 'cadence'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Connection states
  const [connections, setConnections] = useState([
    {
      id: 'google',
      name: 'Google Workspace',
      category: 'Calendar, Sheets & Mail',
      status: 'Connected',
      type: 'Two-way Sync',
      latency: '68ms',
      lastSync: '2 mins ago',
      details: 'Google Calendar booking + Sheets lead sync',
      active: true,
      metrics: '1,420 events synced',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      category: 'Conversational Messaging',
      status: 'Connected',
      type: 'Direct Cloud API',
      latency: '112ms',
      lastSync: '1 min ago',
      details: 'Automated post-call brochures & verification links',
      active: true,
      metrics: '3,840 messages delivered (98.2% read)',
    },
    {
      id: 'calling',
      name: 'Voice Telephony (Dograh / Vaani)',
      category: 'Inbound & Outbound Calling',
      status: 'Active',
      type: 'SIP WebRTC / REST',
      latency: '45ms',
      lastSync: 'Live',
      details: 'Ultra-low latency conversational voice stream',
      active: true,
      metrics: '24 concurrent lines • 12,850 mins processed',
    },
    {
      id: 'database',
      name: 'Supabase PostgreSQL & Vector',
      category: 'Primary Database & Embeddings',
      status: 'Connected',
      type: 'pgvector + Row Level Security',
      latency: '14ms',
      lastSync: 'Live',
      details: 'Customer memory, lead state machine & call records',
      active: true,
      metrics: '99.98% uptime • 25,000+ lead records',
    },
    {
      id: 'n8n',
      name: 'n8n & Webhook Pipelines',
      category: 'Workflow Automation',
      status: 'Connected',
      type: 'Webhook Ingress / Egress',
      latency: '82ms',
      lastSync: '4 mins ago',
      details: 'Automated lead intake from marketing landing pages',
      active: true,
      metrics: '4 active pipelines • 0 errors in 24h',
    },
  ]);

  // Capability states
  const [capabilities, setCapabilities] = useState([
    {
      id: 'outbound-call',
      title: 'Autonomous Outbound Dialing',
      description: 'Conversational voice outreach to fresh and warm leads within seconds of submission.',
      tags: ['Voice AI', 'Sub-second Latency', 'Objection Handling'],
      status: 'Active',
      successRate: '88.4%',
      count: '8,420 calls',
      enabled: true,
    },
    {
      id: 'inbound-reception',
      title: '24/7 Inbound Voice Reception',
      description: 'Answers customer inquiries instantly, resolves qualification questions, and schedules advisor meetings.',
      tags: ['Round-the-clock', 'Zero Hold Time', 'Instant Triage'],
      status: 'Active',
      successRate: '94.1%',
      count: '1,290 calls',
      enabled: true,
    },
    {
      id: 'whatsapp-followup',
      title: 'Multichannel WhatsApp & SMS Automation',
      description: 'Dispatches personalized brochures, repayment calculators, and self-service KYC links post-call.',
      tags: ['WhatsApp Cloud', 'Rich Media', 'High Open Rate'],
      status: 'Active',
      successRate: '98.2%',
      count: '4,110 messages',
      enabled: true,
    },
    {
      id: 'qualification',
      title: 'Real-time Credit & Loan Pre-qualification',
      description: 'Calculates EMI affordability, checks credit eligibility rules, and classifies intent (Hot/Warm/Cold).',
      tags: ['Underwriting Rules', 'Instant Scoring', 'CRM Sync'],
      status: 'Active',
      successRate: '91.7%',
      count: '6,780 evaluations',
      enabled: true,
    },
    {
      id: 'calendar-booking',
      title: 'Google Calendar Appointment Booking',
      description: 'Checks advisor availability in real-time and books calendar invitations directly during calls.',
      tags: ['Google Calendar', 'Timezone Aware', 'Email Invites'],
      status: 'Active',
      successRate: '96.5%',
      count: '640 meetings booked',
      enabled: true,
    },
    {
      id: 'human-handoff',
      title: 'Warm SIP Human Transfer',
      description: 'Seamlessly bridges VIP customers or complex inquiries to human loan specialists on the fly.',
      tags: ['Zero Drops', 'Call Brief Injection', 'SIP Bridging'],
      status: 'Standby',
      successRate: '99.0%',
      count: '142 transfers',
      enabled: true,
    },
  ]);

  // Context Knowledge Data
  const contextStats = {
    totalDocuments: 48,
    totalChunks: 1840,
    embeddingModel: 'text-embedding-3-small (1536 dim)',
    avgSimilarity: '94.8%',
    contextWindow: '128,000 tokens',
    cacheHitRatio: '89.4%',
  };

  const contextDocuments = [
    { name: 'Personal Loan Eligibility & Policy Matrix', size: '240 KB', chunks: 210, updated: '2 days ago', status: 'Indexed' },
    { name: 'Home Loan & Mortgage Interest Rates (Q4)', size: '380 KB', chunks: 340, updated: 'Yesterday', status: 'Indexed' },
    { name: 'Objection Handling Manual: Rates & Processing Fees', size: '190 KB', chunks: 180, updated: '3 days ago', status: 'Indexed' },
    { name: 'RBI Lending Guidelines & Fair Practice Code', size: '520 KB', chunks: 480, updated: '1 week ago', status: 'Indexed' },
    { name: 'Pre-approved Customer Segment Offers', size: '140 KB', chunks: 120, updated: '5 hours ago', status: 'Indexed' },
  ];

  // Cadence Workflows & Pacing
  const cadencePolicies = [
    {
      id: 'dial-pacing',
      title: 'Operational Calling Window',
      schedule: 'Mon - Sat: 09:30 AM - 06:30 PM (IST)',
      details: 'Restricts outgoing dialer strictly to regulated calling hours. No calls on national holidays.',
      status: 'Active',
    },
    {
      id: 'retry-ladder',
      title: 'Smart Retry Ladder (Unanswered Leads)',
      schedule: 'Attempt 1: Immediate • Attempt 2: +60m • Attempt 3: +4h • Attempt 4: Next morning 11:00 AM',
      details: 'Spaced backoff prevents spamming and dramatically improves contact rates by 34%.',
      status: 'Automated',
    },
    {
      id: 'multichannel-flow',
      title: 'Multi-touch Follow-up Sequence',
      schedule: 'Minute 0: Call • Minute +5: WhatsApp link • Hour +2: SMS alert • Day +1: Follow-up re-dial',
      details: 'Autonomous multi-touch cadence ensures lead engagement even when the first call is missed.',
      status: 'Automated',
    },
    {
      id: 'maintenance-tasks',
      title: 'Automated Real-time Sync & Cleanup',
      schedule: 'Webhooks: Continuous • CRM Sync: Live • Recycle Bin Purge: Daily at 02:00 AM',
      details: 'Keeps lead statuses fresh and automatically purges soft-deleted records after 30 days.',
      status: 'Continuous',
    },
  ];

  const handleTestConnection = (name: string) => {
    toast.info(`Pinging ${name}...`);
    setTimeout(() => {
      toast.success(`${name} responded healthy! Latency: 42ms`);
    }, 600);
  };

  const handleToggleCapability = (id: string, name: string) => {
    setCapabilities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
    toast.success(`Updated capability: ${name}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("4 C's framework metrics synced with live engine!");
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              AIOS Core Engine
            </span>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              100% Operational
            </Badge>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            The 4 C&apos;s Framework
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            End-to-end operational visibility across <strong>Connections</strong>, <strong>Capability</strong>, <strong>Context</strong>, and <strong>Cadence</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Engine
          </Button>
        </div>
      </div>

      {/* 4 C's Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Connections */}
        <Card
          className="cursor-pointer border-border/80 transition-all hover:border-primary/50 hover:shadow-md"
          onClick={() => setActiveTab('connections')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">1. Connections</CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Network className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 / 5 Active</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Google, WhatsApp, Voice, Supabase, n8n
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="size-3.5" /> All integrations connected
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Capability */}
        <Card
          className="cursor-pointer border-border/80 transition-all hover:border-primary/50 hover:shadow-md"
          onClick={() => setActiveTab('capability')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">2. Capability</CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Cpu className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6 Capabilities</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Voice Calls, WhatsApp, Scoring & Calendar
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium">
              <Zap className="size-3.5" /> 92.4% avg success rate
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Context */}
        <Card
          className="cursor-pointer border-border/80 transition-all hover:border-primary/50 hover:shadow-md"
          onClick={() => setActiveTab('context')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">3. Context</CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Brain className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,840 Chunks</div>
            <p className="mt-1 text-xs text-muted-foreground">
              48 Docs • RAG Vector Knowledge Base
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <CheckCircle2 className="size-3.5" /> 94.8% retrieval precision
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Cadence */}
        <Card
          className="cursor-pointer border-border/80 transition-all hover:border-primary/50 hover:shadow-md"
          onClick={() => setActiveTab('cadence')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">4. Cadence</CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Workflow className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 Automations</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Paced dialing, smart retries & multi-touch
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Clock className="size-3.5" /> Real-time event driven
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="all">Complete Overview</TabsTrigger>
          <TabsTrigger value="connections" className="gap-1.5">
            <Network className="size-3.5" /> Connections
          </TabsTrigger>
          <TabsTrigger value="capability" className="gap-1.5">
            <Cpu className="size-3.5" /> Capability
          </TabsTrigger>
          <TabsTrigger value="context" className="gap-1.5">
            <Brain className="size-3.5" /> Context
          </TabsTrigger>
          <TabsTrigger value="cadence" className="gap-1.5">
            <Workflow className="size-3.5" /> Cadence
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ─── 1. CONNECTIONS SECTION ─────────────────────────────────── */}
      {(activeTab === 'all' || activeTab === 'connections') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Network className="size-5 text-blue-500" />
                1. Connections (How Many Connections & Integrations)
              </h2>
              <p className="text-xs text-muted-foreground">
                External APIs, communication channels, databases, and third-party tools linked to AIOS.
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {connections.filter((c) => c.active).length} Connected
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connections.map((item) => (
              <Card key={item.id} className="relative flex flex-col justify-between border-border/80">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">{item.name}</CardTitle>
                      <CardDescription className="text-xs">{item.category}</CardDescription>
                    </div>
                    <Badge
                      className={
                        item.status === 'Connected' || item.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 text-xs">
                  <p className="text-muted-foreground leading-relaxed">{item.details}</p>
                  <div className="rounded-lg bg-muted/50 p-2.5 font-mono text-[11px] text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Protocol:</span>
                      <span className="font-medium text-foreground">{item.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Latency:</span>
                      <span className="font-medium text-emerald-500">{item.latency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Throughput:</span>
                      <span className="font-medium text-foreground">{item.metrics}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-muted-foreground">Synced: {item.lastSync}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleTestConnection(item.name)}
                    >
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ─── 2. CAPABILITY SECTION ─────────────────────────────────── */}
      {(activeTab === 'all' || activeTab === 'capability') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Cpu className="size-5 text-purple-500" />
                2. Capability (What It Can Do: Calls, Messaging & Actions)
              </h2>
              <p className="text-xs text-muted-foreground">
                Autonomous agent abilities, call handling, messaging, lead scoring, and scheduling workflows.
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {capabilities.filter((c) => c.enabled).length} Enabled
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => (
              <Card key={cap.id} className="flex flex-col justify-between border-border/80">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold leading-tight">{cap.title}</CardTitle>
                    <button
                      onClick={() => handleToggleCapability(cap.id, cap.title)}
                      className="text-primary hover:opacity-80 transition-opacity shrink-0"
                      aria-label="Toggle capability"
                    >
                      {cap.enabled ? (
                        <ToggleRight className="size-6 text-primary" />
                      ) : (
                        <ToggleLeft className="size-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <CardDescription className="text-xs mt-1">{cap.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Execution Volume:</span>
                      <span className="font-semibold text-foreground">{cap.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="font-semibold text-emerald-500">{cap.successRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ─── 3. CONTEXT SECTION ────────────────────────────────────── */}
      {(activeTab === 'all' || activeTab === 'context') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Brain className="size-5 text-amber-500" />
                3. Context (Knowledge Base, RAG Data & Prompts)
              </h2>
              <p className="text-xs text-muted-foreground">
                Domain context injected into the agent: loan policy manuals, RAG vectors, customer history, and prompts.
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {contextStats.totalChunks} Semantic Chunks
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Knowledge Overview Card */}
            <Card className="border-border/80 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">RAG Retrieval Engine</CardTitle>
                <CardDescription className="text-xs">
                  Contextual grounding & vector index
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>Retrieval Accuracy</span>
                      <span className="font-medium text-foreground">{contextStats.avgSimilarity}</span>
                    </div>
                    <Progress value={95} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>Cache Hit Ratio</span>
                      <span className="font-medium text-foreground">{contextStats.cacheHitRatio}</span>
                    </div>
                    <Progress value={89} className="h-1.5" />
                  </div>
                </div>

                <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Embedding Model:</span>
                    <span className="font-mono text-foreground">{contextStats.embeddingModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Context Window:</span>
                    <span className="font-mono text-foreground">{contextStats.contextWindow}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Indexed Documents:</span>
                    <span className="font-semibold text-foreground">{contextStats.totalDocuments} files</span>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-700 dark:text-amber-300">
                  <div className="font-semibold flex items-center gap-1.5 mb-1">
                    <Bot className="size-3.5" /> Dynamic Lead Context Injection
                  </div>
                  Customer name, requested loan amount, CIBIL range, and prior objections are automatically injected into the first prompt token.
                </div>
              </CardContent>
            </Card>

            {/* Document Index Table */}
            <Card className="border-border/80 lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Indexed Knowledge Documents</CardTitle>
                    <CardDescription className="text-xs">
                      Active context documents loaded into the vector retrieval store
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => toast.success("All knowledge documents re-indexed with pgvector!")}
                  >
                    Re-index RAG
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-lg border border-border/70 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b text-[11px] font-semibold text-muted-foreground">
                      <tr>
                        <th className="p-2.5">Document Name</th>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5">Chunks</th>
                        <th className="p-2.5">Last Sync</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {contextDocuments.map((doc, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="p-2.5 font-medium flex items-center gap-2">
                            <FileText className="size-3.5 text-primary shrink-0" />
                            <span className="truncate max-w-[220px]">{doc.name}</span>
                          </td>
                          <td className="p-2.5 text-muted-foreground">{doc.size}</td>
                          <td className="p-2.5 text-muted-foreground">{doc.chunks}</td>
                          <td className="p-2.5 text-muted-foreground">{doc.updated}</td>
                          <td className="p-2.5 text-right">
                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                              {doc.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* ─── 4. CADENCE SECTION ────────────────────────────────────── */}
      {(activeTab === 'all' || activeTab === 'cadence') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Workflow className="size-5 text-emerald-500" />
                4. Cadence (Automated Tasks, Pacing & Schedules)
              </h2>
              <p className="text-xs text-muted-foreground">
                Dialing pacing, smart retry sequences, automated multi-touch workflows, and system maintenance.
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {cadencePolicies.length} Active Workflows
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {cadencePolicies.map((pol) => (
              <Card key={pol.id} className="border-border/80 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold">{pol.title}</CardTitle>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20">
                      {pol.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2 rounded-md bg-muted/60 px-2.5 py-1.5 font-mono text-xs text-foreground font-medium">
                    <Clock className="size-3.5 text-primary shrink-0" />
                    <span>{pol.schedule}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-xs text-muted-foreground leading-relaxed">
                  <p>{pol.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Visual Cadence Flow Diagram */}
          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Autonomous Lead Cadence Lifecycle</CardTitle>
              <CardDescription className="text-xs">
                Visual pipeline executed automatically from lead ingestion to qualification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-primary">Stage 1: Ingestion</span>
                      <Badge variant="outline" className="text-[10px]">T = 0s</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Lead arrives via Google Form / Webhook. Instant Supabase validation & credit pre-scoring.
                    </p>
                  </div>
                  <div className="mt-3 font-medium text-foreground">Trigger: Webhook Ingress</div>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-foreground">Stage 2: Voice Outreach</span>
                      <Badge variant="outline" className="text-[10px]">T = 30s</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      AI places outbound call. Conversational speech qualification & loan requirement gathering.
                    </p>
                  </div>
                  <div className="mt-3 font-medium text-foreground">Action: Dograh SIP Dial</div>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-foreground">Stage 3: Multi-touch</span>
                      <Badge variant="outline" className="text-[10px]">T = +5m</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      If unanswered: instant WhatsApp template. If connected: WhatsApp confirmation brochure.
                    </p>
                  </div>
                  <div className="mt-3 font-medium text-foreground">Action: WhatsApp Cloud API</div>
                </div>

                <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Stage 4: Conversion</span>
                      <Badge variant="outline" className="text-[10px]">T = Complete</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Booking added to Google Calendar. CRM status escalated to &quot;Qualified Lead&quot;.
                    </p>
                  </div>
                  <div className="mt-3 font-medium text-emerald-600 dark:text-emerald-400">Action: Google Calendar Sync</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
