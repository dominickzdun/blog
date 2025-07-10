import { useEffect } from "react";

function ErrorMessage({
    error,
    onClose = null,
    autoClose = true,
    duration = 5000,
}) {
    useEffect(() => {
        if (error && autoClose && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [error, autoClose, duration, onClose]);

    if (!error) return null;

    return (
        <div className="error-message">
            <span>{error}</span>
            {onClose && (
                <button className="error-message-btn" onClick={onClose}>
                    ×
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
