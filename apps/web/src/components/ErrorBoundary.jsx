import React from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';
import GlassCard from './GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { withTranslation } from 'react-i18next';
import { errorService } from '../lib/errorDetectionService.js';

class ErrorBoundaryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log to our new error detection service
    if (errorService && errorService.logError) {
      errorService.logError({
        type: 'react_boundary',
        message: error.message,
        error: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
    }
    
    console.error(`[ErrorBoundary] Caught error in ${this.props.componentName || 'Component'}:`, error, errorInfo);
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6">
          <GlassCard className="max-w-2xl w-full p-8 border-red-500/30 bg-red-500/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t('common.errors.unexpected', 'System Error Detected')}</h2>
                <p className="text-sm text-gray-400">The error detection service has logged this issue.</p>
              </div>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 mb-6 overflow-x-auto border border-red-500/20">
              <div className="flex items-center gap-2 mb-2 text-red-400 font-mono text-sm">
                <Terminal className="w-4 h-4" />
                <span>{this.state.error?.toString()}</span>
              </div>
              <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>

            <div className="flex gap-4 justify-end">
              <Button 
                onClick={() => window.location.href = '/error-reporting'} 
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                View Error Logs
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-red-500 text-white hover:bg-red-600 border-0"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('common.errors.reload', 'Attempt Recovery')}
              </Button>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = withTranslation()(ErrorBoundaryComponent);
export default ErrorBoundary;