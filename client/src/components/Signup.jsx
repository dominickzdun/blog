import { useNavigate } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";

function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
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
        setErrors([]);

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
                    setErrors(data.errors);
                } else {
                    setErrors([
                        { msg: data.message || "An unknown error occurred" },
                    ]);
                }
            } else {
                // Successful signup
                navigate("/login");
            }
        } catch (error) {
            setErrors([{ msg: "Network error. Please try again." }]);
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="signup-container">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Enter your password again"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="signup-button"
                    >
                        {isLoading ? "Signing up..." : "Signup"}
                    </button>
                    {errors.length > 0 && (
                        <div className="error-messages">
                            <ul>
                                {errors.map((error, index) => (
                                    <li key={index} className="error-message">
                                        {error.msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
            </div>
            <footer><Footer></Footer></footer>
        </>
    );
}

export default Signup;
