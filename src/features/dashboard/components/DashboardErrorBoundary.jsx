import { Component } from 'react'
import { Button } from '@/shared/components/ui/button'
import { AlertTriangle, RefreshCw, Database, Activity } from 'lucide-react'

class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error,
      errorId: `dashboard_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    })
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative min-h-dvh w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-amber-900 to-amber-100" />
          <div className="relative z-10 mx-auto mt-8 mb-8 w-[95%] max-w-6xl bg-white rounded-lg shadow-2xl">
            <div className="p-8">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Database className="h-10 w-10 text-red-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Dashboard Error
                </h1>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We encountered an error while loading the dashboard. This might be due to a network issue or temporary service disruption.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mb-6 text-left max-w-2xl mx-auto">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                      Error Details (Development)
                    </summary>
                    <div className="bg-gray-100 p-4 rounded text-xs font-mono text-gray-800 overflow-auto max-h-48">
                      <div className="mb-2">
                        <strong>Error ID:</strong> {this.state.errorId}
                      </div>
                      <div className="mb-2">
                        <strong>Message:</strong> {this.state.error.message}
                      </div>
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    </div>
                  </details>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={this.handleRetry}
                    className="bg-black hover:bg-amber-600 hover:text-black text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Dashboard
                  </Button>
                  
                  <Button 
                    onClick={this.handleRefresh}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-amber-50"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Refresh Page
                  </Button>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  Error ID: {this.state.errorId}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default DashboardErrorBoundary
