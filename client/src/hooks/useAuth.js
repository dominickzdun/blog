import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setCurrentUser({
                    id: payload.id,
                    username: payload.username,
                });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    return currentUser;
};