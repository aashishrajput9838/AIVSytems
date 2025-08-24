import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { LineChart, TrendingUp, AlertTriangle } from 'lucide-react'
import { getLogs } from '@/services/api/logs'
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts'

function InsightCard({ icon: Icon, title, description }) {
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

export default function Insights() {
  const [logs, setLogs] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        setError('')
        const data = await getLogs()
        setLogs(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e?.message || 'Failed to load insights')
      }
    })()
  }, [])

  const byDayData = useMemo(() => {
    const map = new Map()
    logs.forEach(l => {
      const d = l.timestamp?.seconds ? new Date(l.timestamp.seconds * 1000) : new Date(l.timestamp || Date.now())
      const key = isNaN(d.getTime()) ? 'unknown' : d.toISOString().slice(0,10)
      const obj = map.get(key) || { date: key, count: 0, avg: 0 }
      obj.count += 1
      obj.avg += Number(l.validation_score || 0)
      map.set(key, obj)
    })
    return Array.from(map.values())
      .map(v => ({ ...v, avg: v.count ? v.avg / v.count : 0 }))
      .sort((a,b) => a.date.localeCompare(b.date))
  }, [logs])

  const scoreBuckets = useMemo(() => {
    const buckets = [
      { name: '0-0.3', from: 0, to: 0.3 },
      { name: '0.3-0.5', from: 0.3, to: 0.5 },
      { name: '0.5-0.7', from: 0.5, to: 0.7 },
      { name: '0.7-1.0', from: 0.7, to: 1.01 },
    ]
    const res = buckets.map(b => ({ range: b.name, count: 0 }))
    logs.forEach(l => {
      const s = Number(l.validation_score || 0)
      const idx = buckets.findIndex(b => s >= b.from && s < b.to)
      if (idx >= 0) res[idx].count += 1
    })
    return res
  }, [logs])

  const riskSplit = useMemo(() => {
    const counts = { required: 0, ok: 0 }
    logs.forEach(l => { if (l.external_verification_required) counts.required += 1; else counts.ok += 1 })
    return [
      { name: 'Verification Needed', value: counts.required },
      { name: 'No Verification', value: counts.ok },
    ]
  }, [logs])

  const pieColors = ['#e11d48', '#16a34a']

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
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">Insights</div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl">Trends and Observations</h1>
            <p className="max-w-2xl text-balance text-base text-gray-600 sm:text-lg">Explore validation scores, risk patterns, and model behavior to improve reliability.</p>
          </section>

          <section className="space-y-8 py-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InsightCard icon={LineChart} title="Score Distribution" description="Understand how your validations are scoring across datasets and time windows." />
              <InsightCard icon={TrendingUp} title="Improvement Signals" description="Spot areas where model responses are getting better—or worse—and act proactively." />
              <InsightCard icon={AlertTriangle} title="Risk Hotspots" description="Identify frequent sensitive topics, unverifiable claims, and entities needing manual checks." />
            </div>
          </section>

          <section className="space-y-8 py-8">
            {error && (<div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{error}</div>)}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-0 bg-white/95 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-black mb-3">Average Score by Day</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RLineChart data={byDayData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0,1]} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => Number(v).toFixed(2)} />
                        <Line type="monotone" dataKey="avg" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                      </RLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-white/95 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-black mb-3">Score Buckets</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoreBuckets}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-0 bg-white/95 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-black mb-3">Verification Requirement Split</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={riskSplit} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                        {riskSplit.map((entry, index) => (<Cell key={`c-${index}`} fill={pieColors[index % pieColors.length]} />))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
