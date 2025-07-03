import { useNavigate } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import ErrorMessage from "./ErrorMessage";
import { useState } from "react";

function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        password: "",
        confirmPassword: "",
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

        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({
            username: "",
            password: "",
            confirmPassword: "",
            general: "",
        });

        try {
            const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    const newFieldErrors = {
                        username: "",
                        password: "",
                        confirmPassword: "",
                        general: "",
                    };

                    data.errors.forEach((error) => {
                        const fieldMap = {
                            username: "username",
                            password: "password",
                            confirmPassword: "confirmPassword",
                        };

                        const field = fieldMap[error.path] || "general";
                        newFieldErrors[field] = error.msg;
                    });

                    setFieldErrors(newFieldErrors);
                } else {
                    setFieldErrors((prev) => ({
                        ...prev,
                        general: data.message || "An unknown error occurred",
                    }));
                }
            } else {
                // Successful signup
                navigate("/login");
            }
        } catch (error) {
            setFieldErrors((prev) => ({
                ...prev,
                general: "Network error. Please try again.",
            }));
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="signup-main">
                <div className="signup-container">
                    <h2>Signup</h2>

                    {fieldErrors.general && (
                        <ErrorMessage
                            error={fieldErrors.general}
                            onClose={() =>
                                setFieldErrors((prev) => ({
                                    ...prev,
                                    general: "",
                                }))
                            }
                            autoClose={true}
                            duration={5000}
                        />
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <br></br>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                className={`form-input ${
                                    fieldErrors.username ? "error-input" : ""
                                }`}
                            />
                            <br></br>
                            <div className="error-container">
                                {fieldErrors.username && (
                                    <span className="field-error">
                                        {fieldErrors.username}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <br></br>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className={`form-input ${
                                    fieldErrors.password ? "error-input" : ""
                                }`}
                            />
                            <br></br>
                            <div className="error-container">
                                {fieldErrors.password && (
                                    <span className="field-error">
                                        {fieldErrors.password}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <br></br>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter your password again"
                                required
                                className={`form-input ${
                                    fieldErrors.confirmPassword
                                        ? "error-input"
                                        : ""
                                }`}
                            />
                            <br></br>
                            <div className="error-container">
                                {fieldErrors.confirmPassword && (
                                    <span className="field-error">
                                        {fieldErrors.confirmPassword}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="interaction-btn signup-btn"
                        >
                            {isLoading ? "Signing up..." : "Signup"}
                        </button>
                    </form>
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}

export default Signup;
