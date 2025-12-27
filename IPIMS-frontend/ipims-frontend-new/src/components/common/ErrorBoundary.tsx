import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import Button from './Button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#e53e3e' }}>
                        Oops, something went wrong.
                    </h2>
                    <p style={{ color: '#4a5568', marginBottom: '1.5rem', maxWidth: '500px' }}>
                        We're sorry, but an unexpected error occurred. Please try reloading the page.
                    </p>
                    <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'left', width: '100%', maxWidth: '600px', overflowX: 'auto' }}>
                        <code style={{ fontSize: '0.875rem', color: '#718096' }}>
                            {this.state.error?.toString()}
                        </code>
                    </div>
                    <Button onClick={this.handleReload}>Reload Page</Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
