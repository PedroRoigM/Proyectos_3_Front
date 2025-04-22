'use client';
import React from 'react';

const ErrorTypes = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

/**
 * ErrorHandler component for displaying consistent error messages across the application
 * @param {Object} props Component props
 * @param {string} props.message The message to display
 * @param {string} props.type The type of message: 'success', 'error', 'warning', 'info'
 * @param {boolean} props.dismissible Whether the error can be dismissed
 * @param {function} props.onDismiss Function to call when the error is dismissed
 */
const ErrorHandler = ({
    message,
    type = ErrorTypes.ERROR,
    dismissible = true,
    onDismiss
}) => {
    if (!message) return null;

    const getClassName = () => {
        switch (type) {
            case ErrorTypes.SUCCESS:
                return "bg-green-100 text-green-700 border-green-300";
            case ErrorTypes.WARNING:
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case ErrorTypes.INFO:
                return "bg-blue-100 text-blue-700 border-blue-300";
            case ErrorTypes.ERROR:
            default:
                return "bg-red-100 text-red-700 border-red-300";
        }
    };

    const getIcon = () => {
        switch (type) {
            case ErrorTypes.SUCCESS:
                return "✅";
            case ErrorTypes.WARNING:
                return "⚠️";
            case ErrorTypes.INFO:
                return "ℹ️";
            case ErrorTypes.ERROR:
            default:
                return "❌";
        }
    };

    return (
        <div className={`p-3 mb-4 rounded-md border ${getClassName()} flex justify-between items-center`}>
            <div className="flex items-center">
                <span className="mr-2">{getIcon()}</span>
                <p>{message}</p>
            </div>
            {dismissible && (
                <button
                    onClick={onDismiss}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                    aria-label="Dismiss"
                >
                    ×
                </button>
            )}
        </div>
    );
};

// Export the component and the error types
export { ErrorHandler, ErrorTypes };