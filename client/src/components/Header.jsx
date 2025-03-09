import { useState, useEffect } from "react";
function Header() {
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    window.location.href = "/";
  }

  return (
    <header className="main-header">

      <nav className="nav-links">
        <a href="/">Home</a>

        {isLoggedIn ? (
          <>
            <span className="welcome-message">Welcome, {username}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
