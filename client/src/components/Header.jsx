import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
function Header() {
    const [username, setUsername] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");

        if (token && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUsername(null);
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
                        <span className="display-user">{username}</span>
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
