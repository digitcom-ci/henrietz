import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('HENRIETZ Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#2B1C14] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#1A1410] border border-[#C8A261]/30 p-8 rounded-3xl text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C8A261] text-[#181310] font-bold text-xl flex items-center justify-center mx-auto">
              H
            </div>
            <h2 className="text-xl font-bold text-white font-title">Maison HENRIETZ — Notice</h2>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Une erreur temporaire est survenue lors de l'affichage du site. Cliquez ci-dessous pour réinitialiser l'affichage.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-gradient-to-r from-[#C8A261] to-[#A46E43] text-[#181310] font-bold text-xs rounded-xl shadow uppercase tracking-wider hover:brightness-110 transition"
            >
              Réinitialiser & Recharger le site
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
