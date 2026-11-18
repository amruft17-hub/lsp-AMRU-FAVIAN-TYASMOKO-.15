
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';

class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Dashboard gagal ditampilkan:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error-state" role="alert">
          <h1>Dashboard tidak dapat ditampilkan</h1>
          <p>Terjadi kesalahan saat memuat halaman. Silakan coba muat ulang.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Muat Ulang
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemen root aplikasi tidak ditemukan');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
