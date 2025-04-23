'use client';
import React, { Component } from 'react';

/**
 * Componente de captura de errores para React
 * Atrapa errores en componentes hijos y muestra una UI de fallback
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Actualizar estado para mostrar UI de fallback
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Puedes registrar el error en un servicio de reporte de errores
        console.error('Error capturado en ErrorBoundary:', error, errorInfo);
        this.setState({ errorInfo });

        // Aquí podrías llamar a un servicio para reportar errores
        // reportError(error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    }

    render() {
        const { hasError, error, errorInfo } = this.state;
        const { fallback, children } = this.props;

        if (hasError) {
            // Puedes renderizar cualquier UI personalizada
            if (fallback) {
                return typeof fallback === 'function'
                    ? fallback({ error, errorInfo, reset: this.resetError })
                    : fallback;
            }

            return (
                <div className="p-6 bg-red-50 border border-red-100 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-red-700 mb-3">Algo salió mal</h2>
                    <p className="text-red-600 mb-4">Ha ocurrido un error inesperado en la aplicación.</p>

                    <div className="mb-4">
                        <p className="font-medium text-gray-700">Error:</p>
                        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-32">
                            {error?.toString() || 'Error desconocido'}
                        </pre>
                    </div>

                    {process.env.NODE_ENV !== 'production' && errorInfo && (
                        <div className="mb-4">
                            <p className="font-medium text-gray-700">Stack:</p>
                            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-64">
                                {errorInfo.componentStack}
                            </pre>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={this.resetError}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Intentar de nuevo
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Recargar página
                        </button>
                    </div>
                </div>
            );
        }

        // Si no hay error, renderizar los hijos normalmente
        return children;
    }
}

/**
 * Higher-Order Component para envolver componentes con ErrorBoundary
 * @param {React.Component} Component - Componente a envolver
 * @param {React.Component|Function} fallback - Componente o función de fallback
 */
export function withErrorBoundary(Component, fallback) {
    const displayName = Component.displayName || Component.name || 'Component';

    const WrappedComponent = (props) => (
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
    return WrappedComponent;
}