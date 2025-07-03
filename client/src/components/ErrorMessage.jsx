import { useEffect, useState } from "react";

function ErrorMessage({
    error,
    onClose = null,
    autoClose = true,
    duration = 5000,
}) {
    const [isClosing, setIsClosing] = useState(false);

    // Close the error message after a duration
    useEffect(() => {
        if (autoClose && error && onClose) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [error, onClose, autoClose, duration]);

    const handleClose = () => {
        setIsClosing(true);
        // Wait for animation to complete before actually closing
        setTimeout(() => {
            onClose();
            setIsClosing(false); // Reset for next time
        }, 300); // Has to be the same as CSS duration
    };

    if (!error) return null;

    return (
        <div className={`error-message ${isClosing ? "closing" : ""}`}>
            <span>{error}</span>
            {onClose && (
                <button className="error-message-btn" onClick={handleClose}>
                    ×
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
