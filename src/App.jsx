import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import ThankYou from './components/ThankYou';

// R1 — Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Error caught by boundary
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    direction: 'rtl',
                    padding: '2rem',
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        maxWidth: '420px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h1 style={{ marginBottom: '0.5rem', color: '#333' }}>אופס! משהו השתבש</h1>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                            אירעה שגיאה בלתי צפויה. נסו לרענן את הדף.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => window.location.reload()}
                            style={{ maxWidth: '200px' }}
                        >
                            רענן את הדף
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// R2 — 404 Not Found
function NotFound() {
    return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div className="card">
                <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>הדף לא נמצא</p>
                <Link to="/">
                    <button className="btn-primary" style={{ maxWidth: '200px' }}>
                        חזרה לדף הבית
                    </button>
                </Link>
            </div>
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<RegistrationForm />} />
                        <Route path="/thank-you" element={<ThankYou />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
