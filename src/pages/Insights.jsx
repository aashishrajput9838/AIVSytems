import { Card, CardContent } from '@/components/ui/card'
import { LineChart, TrendingUp, AlertTriangle } from 'lucide-react'

function InsightCard({ icon: Icon, title, description }) {
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

export default function Insights() {
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
              Insights
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl">
              Trends and Observations
            </h1>
            <p className="max-w-2xl text-balance text-base text-gray-600 sm:text-lg">
              Explore validation scores, risk patterns, and model behavior to improve reliability.
            </p>
          </section>

          {/* Insight Cards */}
          <section className="space-y-8 py-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InsightCard
                icon={LineChart}
                title="Score Distribution"
                description="Understand how your validations are scoring across datasets and time windows."
              />
              <InsightCard
                icon={TrendingUp}
                title="Improvement Signals"
                description="Spot areas where model responses are getting better—or worse—and act proactively."
              />
              <InsightCard
                icon={AlertTriangle}
                title="Risk Hotspots"
                description="Identify frequent sensitive topics, unverifiable claims, and entities needing manual checks."
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}


