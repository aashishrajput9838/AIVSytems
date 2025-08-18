import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Activity,
  Brain,
  ShieldCheck,
} from 'lucide-react'

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-colors group-hover:bg-indigo-500/20">
            <Icon className="size-5" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function DemoPreview() {
  return (
    <Card className="rounded-2xl border bg-background/70 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-3 text-sm text-muted-foreground">
          Explore the full dashboard for live filters, scores, and actions.
        </div>
        <Button asChild>
          <Link to="/dashboard" className="">Open Dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950">
      <div className="pointer-events-none absolute -left-20 -top-20 size-[36rem] rounded-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[36rem] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 blur-3xl" />

      

      <main className="mx-auto w-full max-w-6xl px-4">
        {/* Hero */}
        <section className="relative flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
            Future of responsible AI
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            AI Response Validation System
          </h1>
          <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            Bringing trust, transparency, and accountability to AI decisions.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/dashboard">Try Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-8 py-6">
          <h2 className="text-center text-2xl font-semibold">Capabilities</h2>
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
          <h2 className="text-center text-2xl font-semibold">Live Demo Preview</h2>
          <DemoPreview />
        </section>

        
      </main>

      <footer id="footer" className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} AIV Systems</span>
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">About</a>
            <a href="#" className="hover:text-foreground">Contact</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}


