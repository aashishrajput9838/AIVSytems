import { Card, CardContent } from '@/shared/components/ui/card'
import { Brain, ShieldCheck, Activity } from 'lucide-react'

function FeatureCard({ icon: Icon, title, description }) {
  const IconComp = Icon
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <IconComp className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function About() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 mx-auto mt-8 mb-8 w-[95%] max-w-6xl bg-white rounded-lg shadow-2xl">
        <main className="p-8">
          <section className="relative flex flex-col items-center gap-6 py-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              About Our Mission
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl">
              AI Response Validation System
            </h1>
            <p className="max-w-2xl text-balance text-base text-gray-600 sm:text-lg">
              Bringing trust, transparency, and accountability to AI decisions through advanced validation and monitoring.
            </p>
          </section>

          <section className="space-y-8 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The AI Response Validation System helps teams monitor AI outputs, validate reasoning, and build trust with transparent audit trails.
                We believe in responsible AI that can be trusted, understood, and held accountable.
              </p>
            </div>
          </section>

          <section className="space-y-8 py-8">
            <h2 className="text-center text-3xl font-bold text-black mb-8">Key Features</h2>
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

          <section className="space-y-8 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-4">Technology Stack</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Built with modern technologies including React, Firebase, and advanced NLP algorithms for the most accurate validation possible.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
