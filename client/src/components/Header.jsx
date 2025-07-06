import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const storeUserTokenInfo = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Decode JWT token to get user info
                const payload = JSON.parse(atob(token.split(".")[1]));
                setCurrentUser({
                    id: payload.id,
                    username: payload.username,
                });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    };

    useEffect(() => {
        storeUserTokenInfo();
    }, []);

    useEffect(() => {
        if (currentUser) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [currentUser]); 

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <header className="main-header">
            <nav className="nav-links">
                <div className="header-left">
                    <a className="header-main-name" href="/">
                        chitai
                    </a>
                </div>

                {isLoggedIn ? (
                    <div className="header-right">
                        <a href="/dashboard">Dashboard</a>
                        <span className="display-user">
                            {currentUser.username}
                        </span>
                        <button onClick={handleLogout} className="logout-btn">
                            <img
                                src="../../export-arrow-right.svg"
                                alt="Logout"
                                className="header-logout-image"
                            />
                        </button>
                    </div>
                ) : (
                    <div className="header-right">
                        <a href="/login">Login</a>
                        <a href="/signup">Signup</a>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;
