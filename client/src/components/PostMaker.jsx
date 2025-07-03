import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams, useNavigate } from "react-router";
function PostMaker() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [post, setPost] = useState({
        title: "",
        content: "",
        published: false,
    });

    //if id, user wants to edit, so fetch post details
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(
                    `http://${import.meta.env.VITE_API_URL}/articles/${id}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const postData = await response.json();
                setPost(postData);
                setIsChecked(postData.published);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            setLoading(true);
            fetchPost();
        }
    }, [id]);

    const handleChange = (e) => {
        setPost({
            ...post,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheck = () => {
        setIsChecked(!isChecked);
        setPost({
            ...post,
            published: !isChecked,
        });
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError(
                "You must be logged in to create a post. Please log in first"
            );
            return;
        }

        try {
            const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/articles/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(post),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                if (response.status === 401) {
                    setError("Authentication failed. Please log in again");
                } else if (response.status === 400) {
                    setError(
                        `Validation failed: ${
                            errorData?.errors
                                ? errorData.errors.map((e) => e.msg).join(" ")
                                : "Please check your input"
                        }`
                    );
                } else {
                    setError(`HTTP error! Status: ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            console.log("Post created successfully:", data);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error creating post:", error);
            setError(
                "An error occurred while creating the post. Please try again"
            );
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            setError(
                "You must be logged in to edit a post. Please log in first"
            );
            return;
        }

        try {
            const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/articles/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(post),
                }
            );

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
            console.log("Post updated successfully:", data);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating post:", error);
            setError(
                "An error occurred while updating the post. Please try again"
            );
        }
    };

    if (loading) return <p>Loading...</p>;

    if (!id) {
        // If there isnt an id,  user wants to create post
        return (
            <>
                <header>
                    <Header></Header>
                </header>
                <main>
                    <form className="post-maker" onSubmit={handleSubmitCreate}>
                        {error && (
                            <div
                                className="error-message"
                                style={{ color: "red", marginBottom: "10px" }}
                            >
                                {error}
                            </div>
                        )}
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                        />
                        <label htmlFor="content">Content</label>
                        <textarea
                            name="content"
                            value={post.content}
                            onChange={handleChange}
                        ></textarea>
                        <label htmlFor="published">Publish</label>
                        <input
                            type="checkbox"
                            name="published"
                            checked={isChecked}
                            onChange={handleCheck}
                        />

                        <button type="submit">Create Post</button>
                    </form>
                </main>

                <footer>
                    <Footer></Footer>
                </footer>
            </>
        );
    } else {
        // Else user wants to edit post

        return (
            <>
                <header>
                    <Header></Header>
                </header>
                <main>
                    {" "}
                    <form className="post-maker" onSubmit={handleSubmitEdit}>
                        {error && (
                            <div
                                className="error-message"
                                style={{ color: "red", marginBottom: "10px" }}
                            >
                                {error}
                            </div>
                        )}
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={post.title}
                            onChange={handleChange}
                        />
                        <label htmlFor="content">Content</label>
                        <textarea
                            name="content"
                            value={post.content}
                            onChange={handleChange}
                        ></textarea>
                        <label htmlFor="published">Publish</label>
                        <input
                            type="checkbox"
                            name="published"
                            checked={isChecked}
                            onChange={handleCheck}
                        />

                        <button type="submit">Finalize Edit</button>
                    </form>
                </main>
                <footer>
                    <Footer></Footer>
                </footer>
            </>
        );
    }
}

export default PostMaker;
