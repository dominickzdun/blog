import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
function Dashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUserPosts = async () => {
        try {
            const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/articles/user`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const userPosts = await response.json();
            setUserPosts(userPosts);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    // make sure user is logged in to access dashboard
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setIsLoggedIn(true);
            fetchUserPosts();
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div>
                <h1>Please login first before accessing dashboard</h1>
                <a href="/login">Login</a>
                <a href="/">Back to Home</a>
            </div>
        );
    }

    const handlePostVisibilityChange = async (post) => {
        try {
            const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/articles/${post.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        title: post.title,
                        content: post.content,
                        published: !post.published,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setUserPosts((prevPosts) =>
                prevPosts.map((prevPost) =>
                    prevPost.id === post.id
                        ? { ...prevPost, published: !prevPost.published }
                        : prevPost
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const handlePostDeletion = async (id) => {
        try {
            const response = await fetch(
                `http://${import.meta.env.VITE_API_URL}/articles/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setUserPosts((prevUserPosts) =>
                prevUserPosts.filter((post) => post.id !== id)
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditRedirect = (id) => {
        navigate(`/edit/${id}`);
    };

    return (
        <>
            <header>
                <Header></Header>
            </header>
            <main className="center-main">
                <div className="dashboard-wrapper">
                    <div className="dashboard-top">
                        <h1>Dashboard</h1>
                        <Link
                            className="interaction-btn create-new-post"
                            to="/create"
                        >
                            Create a new post
                        </Link>
                    </div>
                    <div className="dashboard-article-link-wrapper">
                        {userPosts.map((post) => (
                            <div
                                className="dashboard-article-link"
                                key={post.id}
                            >
                                <Link
                                    draggable={false}
                                    to={`/articles/${post.id}`}
                                >
                                    {post.title}
                                </Link>
                                <div className="dashboard-article-options-wrapper">
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={post.published}
                                            onChange={(e) =>
                                                handlePostVisibilityChange(post)
                                            }
                                        />
                                        Published
                                    </label>
                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEditRedirect(post.id)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handlePostDeletion(post.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </>
    );
}

export default Dashboard;
