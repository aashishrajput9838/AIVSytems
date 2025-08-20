import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Activity,
  Brain,
  ShieldCheck,
} from 'lucide-react'

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

function DemoPreview() {
  return (
    <Card className="rounded-2xl border bg-gray-800/70 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-3 text-sm text-gray-300">
          Explore the full dashboard for live filters, scores, and actions.
        </div>
        <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <Link to="/dashboard" className="">Open Dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-700 to-gray-100">
      <div className="pointer-events-none absolute -left-20 -top-20 size-[36rem] rounded-full bg-gradient-to-br from-cyan-500/30 to-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[36rem] rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 blur-3xl" />

      

      <main className="mx-auto w-full max-w-6xl px-4">
        {/* Hero */}
        <section className="relative flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            Future of responsible AI
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            AI Response Validation System
          </h1>
          <p className="max-w-2xl text-balance text-base text-gray-300 sm:text-lg">
            Bringing trust, transparency, and accountability to AI decisions.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Link to="/dashboard">Try Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-8 py-6">
          <h2 className="text-center text-2xl font-semibold text-white">Capabilities</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Activity}
              title="Real-Time AI Monitoring"
              description="Track model outputs, risks, and validations as they happen across your stack."
            />
            <FeatureCard
              icon={Brain}
              title="Reasoning Transparency"
              description="Surface chain-of-thought signals and validations for explainable decisions."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Trust & Accountability"
              description="Governance-ready audit trails with approvals, thresholds, and escalations."
            />
          </div>
        </section>

        {/* Demo Preview */}
        <section className="space-y-6 py-12">
          <h2 className="text-center text-2xl font-semibold text-white">Live Demo Preview</h2>
          <DemoPreview />
        </section>

        
      </main>

      <footer id="footer" className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-600 pt-6 text-sm text-gray-400 sm:flex-row">
          <span>© {new Date().getFullYear()} AIV Systems</span>
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}


