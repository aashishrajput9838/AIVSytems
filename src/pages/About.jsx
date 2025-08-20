import { Card, CardContent } from '@/components/ui/card'
import { Brain, ShieldCheck, Activity } from 'lucide-react'

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border bg-gray-800/60 backdrop-blur shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 blur-2xl" />
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 transition-colors group-hover:bg-cyan-500/20">
            <Icon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function About() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-700 to-gray-100">
      <div className="pointer-events-none absolute -left-20 -top-20 size-[36rem] rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[36rem] rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 blur-3xl" />
      
      <main className="mx-auto w-full max-w-6xl px-4 py-16">
        {/* Hero */}
        <section className="relative flex flex-col items-center gap-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            About Our Mission
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            AI Response Validation System
          </h1>
          <p className="max-w-2xl text-balance text-base text-gray-300 sm:text-lg">
            Bringing trust, transparency, and accountability to AI decisions through advanced validation and monitoring.
          </p>
        </section>

        {/* Mission */}
        <section className="space-y-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              The AI Response Validation System helps teams monitor AI outputs, validate reasoning, and build trust with transparent audit trails. 
              We believe in responsible AI that can be trusted, understood, and held accountable.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-8 py-12">
          <h2 className="text-center text-3xl font-bold text-white mb-8">Key Features</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Activity}
              title="Real-Time Monitoring"
              description="Track model outputs, risks, and validations as they happen across your AI stack with live updates."
            />
            <FeatureCard
              icon={Brain}
              title="Advanced Validation"
              description="Multi-source fact checking with Wikipedia, Britannica, and UN data for comprehensive accuracy verification."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Trust & Accountability"
              description="Governance-ready audit trails with approvals, thresholds, and escalations for complete transparency."
            />
          </div>
        </section>

        {/* Technology */}
        <section className="space-y-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Technology Stack</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Built with modern technologies including React, Firebase, and advanced NLP algorithms for the most accurate validation possible.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}


