import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-center" dir="rtl">
          <div className="glass-panel p-8 rounded-3xl max-w-lg w-full">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">אופס! משהו השתבש.</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">האתר נתקל בשגיאה לא צפויה. נסה לרענן את העמוד.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="glass-btn-primary px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              רענן עמוד
            </button>
            {this.state.error && (
                <details className="mt-6 text-left text-xs text-gray-400 overflow-auto max-h-32">
                    <summary>פרטים טכניים</summary>
                    <pre className="mt-2">{this.state.error.toString()}</pre>
                </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}