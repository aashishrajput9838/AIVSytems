import { Card, CardContent } from '@/components/ui/card'
import { Brain, FileText, ShieldCheck, Activity, CheckCircle } from 'lucide-react'

function StepCard({ icon: Icon, title, description, step }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Icon className="size-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center size-6 rounded-full bg-black text-white text-xs font-medium">
              {step}
            </span>
            <h3 className="text-lg font-semibold text-black">{title}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white/95 backdrop-blur-sm shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Icon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function HowItWorks() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* Dynamic Background (same as Home) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      </div>

      {/* Main White Content Area */}
      <div className="relative z-10 mx-auto mt-8 mb-8 w-[95%] max-w-6xl bg-white rounded-lg shadow-2xl">
        <main className="p-8">
          {/* Hero */}
          <section className="relative flex flex-col items-center gap-6 py-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              How It Works
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl">
              How Our System Works
            </h1>
            <p className="max-w-2xl text-balance text-base text-gray-600 sm:text-lg">
              From logging to validation to transparent decisions - see how our AI validation system ensures accuracy and trust.
            </p>
          </section>

          {/* Process Steps */}
          <section className="space-y-8 py-8">
            <h2 className="text-center text-3xl font-bold text-black mb-8">The Process</h2>
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
          <section className="space-y-8 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-4">Advanced Features</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
          <section className="space-y-8 py-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-black mb-4">Technology Behind the Magic</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
    </div>
  )
}


