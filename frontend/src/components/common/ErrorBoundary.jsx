/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 */
import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  /**
   * Catch errors in child components
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // In production, you would send this to an error reporting service
    // logErrorToService(error, errorInfo)
  }

  /**
   * Reset error state and retry
   */
  handleRetry = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  /**
   * Reload the entire application
   */
  handleReload = () => {
    window.location.reload()
  }

  /**
   * Go back to home page
   */
  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center px-4">
          <div className="glass-morphism rounded-2xl p-8 max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Don't worry, your pets are safe!
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-white/5 rounded-lg p-4 mb-6 overflow-auto max-h-40">
                <summary className="cursor-pointer text-sm text-gray-400 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-red-400 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {'\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>

              <button
                onClick={this.handleReload}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Reload Application
              </button>
            </div>

            {/* Support Information */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">
                If the problem persists, please contact support with the error details.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary