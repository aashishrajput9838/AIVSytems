import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { ArrowDownRight, Brain, Shield, Activity } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.6),transparent_50%)]"></div>
      </div>

      {/* Main White Content Area */}
      <div className="relative z-10 mx-auto mt-8 mb-8 w-[95%] max-w-6xl bg-white rounded-lg shadow-2xl">
        {/* Header/Navigation */}
        <header className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="text-sm font-medium text-black">aivsystems</div>
          <nav className="flex items-center gap-8 text-sm text-black">
            <Link to="/dashboard" className="hover:text-amber-600 transition-colors">DASHBOARD</Link>
            <Link to="/about" className="hover:text-amber-600 transition-colors">ABOUT</Link>
            <Link to="/capabilities" className="hover:text-amber-600 transition-colors">CAPABILITIES</Link>
            <Link to="/insights" className="hover:text-amber-600 transition-colors">INSIGHTS</Link>
            <Button asChild variant="ghost" className="flex items-center gap-1 text-black hover:text-amber-600 hover:bg-amber-50">
              <Link to="/contact">
                <ArrowDownRight className="h-3 w-3" />
                CONTACT
              </Link>
            </Button>
          </nav>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-black mb-8 tracking-tight">
              AIV SYSTEMS
            </h1>
            
            {/* Central Graphic */}
            <div className="relative mx-auto w-64 h-64 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-black rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.8),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.6),transparent_50%)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-8xl font-bold opacity-90">AI</div>
                </div>
              </div>
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-gray-100 rounded-lg"></div>
            </div>
            
            <h2 className="text-6xl font-bold text-black tracking-tight">
              VALIDATION
            </h2>
          </div>

          {/* Supporting Text */}
          <div className="flex justify-between items-end text-sm text-black">
            <div className="max-w-xs">
              <p className="font-medium">
                A <span className="font-bold">CREATIVE AI VALIDATION</span> SYSTEM
              </p>
            </div>
            <div className="max-w-xs text-right">
              <p className="font-medium">
                SETTING <span className="font-bold">AI TRUST IN MOTION</span>
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Cards */}
      <div className="relative z-20 mx-auto w-[95%] max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Brain className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-black">AI Monitoring</h3>
              </div>
              <p className="text-sm text-gray-600">
                Real-time validation and monitoring of AI responses with advanced NLP algorithms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-black">Trust & Security</h3>
              </div>
              <p className="text-sm text-gray-600">
                Multi-source fact checking and comprehensive audit trails for complete transparency.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Activity className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-black">Live Dashboard</h3>
              </div>
              <p className="text-sm text-gray-600">
                Interactive dashboard with real-time validation scores and detailed analytics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button asChild className="bg-black text-white hover:bg-amber-600 hover:text-black transition-all duration-300 px-8 py-4 text-lg font-medium">
            <Link to="/dashboard">Explore Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


