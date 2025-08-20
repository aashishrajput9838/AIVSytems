import { Card, CardContent } from '@/components/ui/card'
import { Brain, FileText, ShieldCheck, Activity, CheckCircle } from 'lucide-react'

function StepCard({ icon: Icon, title, description, step }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-colors group-hover:bg-indigo-500/20">
            <Icon className="size-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center size-6 rounded-full bg-indigo-500 text-white text-xs font-medium">
              {step}
            </span>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-colors group-hover:bg-indigo-500/20">
            <Icon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function HowItWorks() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950">
      <div className="pointer-events-none absolute -left-20 -top-20 size-[36rem] rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[36rem] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 blur-3xl" />
      
      <main className="mx-auto w-full max-w-6xl px-4 py-16">
        {/* Hero */}
        <section className="relative flex flex-col items-center gap-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
            How It Works
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            How Our System Works
          </h1>
          <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            From logging to validation to transparent decisions - see how our AI validation system ensures accuracy and trust.
          </p>
        </section>

        {/* Process Steps */}
        <section className="space-y-8 py-12">
          <h2 className="text-center text-3xl font-bold text-white mb-8">The Process</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StepCard
              icon={FileText}
              title="Log AI Responses"
              description="Capture prompts, outputs, and context for each AI interaction with automatic logging and manual entry options."
              step="1"
            />
            <StepCard
              icon={Brain}
              title="Extract & Validate Reasoning"
              description="Evaluate reasoning steps and consistency using advanced NLP algorithms and multi-source fact checking."
              step="2"
            />
            <StepCard
              icon={ShieldCheck}
              title="Flag Risks & Ensure Transparency"
              description="Highlight risks, require verification, and build user trust with comprehensive audit trails."
              step="3"
            />
          </div>
        </section>

        {/* Advanced Features */}
        <section className="space-y-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Advanced Features</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our system goes beyond basic validation with cutting-edge technologies and comprehensive monitoring.
            </p>
          </div>
          
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Activity}
              title="Real-Time Monitoring"
              description="Track model outputs, risks, and validations as they happen across your AI stack with live updates."
            />
            <FeatureCard
              icon={Brain}
              title="Multi-Source Validation"
              description="Cross-check information using Wikipedia, Britannica, and UN data for maximum accuracy verification."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Entity Recognition"
              description="Automatically detect and validate different types of entities like people, places, and relationships."
            />
          </div>
        </section>

        {/* Technology Details */}
        <section className="space-y-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Technology Behind the Magic</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Built with state-of-the-art technologies for the most accurate and reliable AI validation possible.
            </p>
          </div>
          
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="Advanced NLP"
              description="TF-IDF, Cosine similarity, and fuzzy matching algorithms for precise text comparison and validation."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Firebase Integration"
              description="Secure authentication, real-time database, and cloud functions for scalable and reliable operation."
            />
            <FeatureCard
              icon={Activity}
              title="React & Modern UI"
              description="Beautiful, responsive interface with real-time updates and intuitive user experience."
            />
          </div>
        </section>
      </main>
    </div>
  )
}


