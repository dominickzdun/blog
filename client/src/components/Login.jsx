import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router";

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [fieldErrors, setFieldErrors] = useState({
        login: "",
        general: "",
    });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({
            login: "",
            general: "",
        });

        try {
            const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                setFieldErrors((prev) => ({
                    ...prev,
                    login: errorData.message || "Login failed",
                }));
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", formData.username);

            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setFieldErrors((prev) => ({
                ...prev,
                login: "Network error. Please try again.",
            }));
        } finally {
            setIsLoading(false);
        }
    };
    console.log(fieldErrors);
    return (
        <>
            <Header />
            <main className="login-main">
                <div className="login-container">
                    <h2>Login</h2>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-input"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="error-container">
                            {fieldErrors.login && (
                                <span className="field-error">{}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="error-container">
                            {fieldErrors.login && (
                                <span className="field-error">
                                    {fieldErrors.login}
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="login-btn interaction-btn"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </>
    );
}

export default Login;
