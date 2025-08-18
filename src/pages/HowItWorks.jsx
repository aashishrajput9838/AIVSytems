import { Card, CardContent } from '@/components/ui/card'
import { Brain, FileText, ShieldCheck } from 'lucide-react'

export default function HowItWorks() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">How It Works</h1>
        <p className="mt-2 text-muted-foreground">From logging to validation to transparent decisions.</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="rounded-2xl border bg-background/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <FileText className="size-5" />
              </div>
              <h3 className="font-semibold">Log AI Responses</h3>
            </div>
            <p className="text-sm text-muted-foreground">Capture prompts, outputs, and context for each interaction.</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border bg-background/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <Brain className="size-5" />
              </div>
              <h3 className="font-semibold">Extract & Validate Reasoning</h3>
            </div>
            <p className="text-sm text-muted-foreground">Evaluate reasoning steps and consistency using policy checks.</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border bg-background/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-semibold">Flag Risks & Ensure Transparency</h3>
            </div>
            <p className="text-sm text-muted-foreground">Highlight risks, require verification, and build user trust.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


