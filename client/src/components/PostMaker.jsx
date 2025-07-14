import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams, useNavigate } from "react-router";
import ErrorMessage from "./ErrorMessage";

function PostMaker() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let isEditing = false;
    const [post, setPost] = useState({
        title: "",
        content: "",
        published: false,
    });

    if (id) {
        isEditing = true;
    }

    // Fetch post data if editing
    useEffect(() => {
        if (isEditing == false) return;

        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://${import.meta.env.VITE_API_URL}/articles/${id}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const postData = await response.json();
                setPost(postData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPost((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError(
                `You must be logged in to ${
                    isEditing ? "edit" : "create"
                } a post. Please log in first`
            );
            return;
        }

        try {
            const url = isEditing
                ? `http://${import.meta.env.VITE_API_URL}/articles/${id}`
                : `http://${import.meta.env.VITE_API_URL}/articles/create`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(post),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                if (response.status === 401) {
                    setError("Authentication failed. Please log in again");
                } else if (response.status === 400) {
                    setError(
                        `Validation failed: ${
                            errorData?.errors
                                ? errorData.errors.map((e) => e.msg).join(", ")
                                : "Please check your input"
                        }`
                    );
                } else {
                    setError(`HTTP error! Status: ${response.status}`);
                }
                return;
            }

            const data = await response.json();

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setError(
                `An error occurred while ${
                    isEditing ? "updating" : "creating"
                } the post. Please try again`
            );
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <header>
                <Header />
            </header>
            <main className="center-main">
                <form className="post-maker" onSubmit={handleSubmit}>
                    <ErrorMessage
                        error={error}
                        onClose={() => setError(null)}
                        autoClose={true}
                        duration={5000}
                    />

                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={post.title}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="content">Content</label>
                    <textarea
                        name="content"
                        className="post-maker-textbox"
                        id="content"
                        value={post.content}
                        onChange={handleChange}
                        required
                    />
                    <div className="bottom-post-maker">
                        <label htmlFor="published">
                            Publish
                            <input
                                type="checkbox"
                                className="checkbox"
                                name="published"
                                id="published"
                                checked={post.published}
                                onChange={handleChange}
                            />
                        </label>

                        <button
                            className="interaction-btn post-maker-btn"
                            type="submit"
                        >
                            {isEditing ? "Update Post" : "Create Post"}
                        </button>
                    </div>
                </form>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}

export default PostMaker;
