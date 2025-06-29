import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Header from "./Header";
function ArticleDetail() {
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState(null);
    const [userCreatedComment, setUserCreatedComment] = useState(""); // Stores comment created by user
    const [isArticleLoading, setIsArticleLoading] = useState(true);
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [activeManageMenu, setActiveManageMenu] = useState(null); // Track which menu is open
    const [currentUser, setCurrentUser] = useState(null); // Track current user

    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        // Get current user from token
        const storeUserTokenInfo = () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    // Decode JWT token to get user info (simple base64 decode of payload)
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

        const fetchArticleDetails = async () => {
            try {
                const response = await fetch(
                    `http://${import.meta.env.VITE_API_URL}/articles/${id}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error("Error fetching article:", error);
                setError(error.message);
            } finally {
                setIsArticleLoading(false);
            }
        };
        const fetchArticleComments = async () => {
            try {
                const response = await fetch(
                    `http://${
                        import.meta.env.VITE_API_URL
                    }/articles/${id}/comments`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error("Error fetching article:", error);
                setError(error.message);
            } finally {
                setIsCommentsLoading(false);
            }
        };
        storeUserTokenInfo();
        fetchArticleDetails();
        fetchArticleComments();
    }, [id]);

    const handleCommentCreationChange = (e) => {
        setUserCreatedComment(e.target.value);
    };

    // Instead of fetching comment data again, just add new comment to front of the array, and format the date

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://${
                    import.meta.env.VITE_API_URL
                }/articles/${id}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ content: userCreatedComment }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newComment = await response.json();
            console.log(newComment);

            // Data comes in string, convert to date, then format it

            const formattedComment = {
                ...newComment,
                datePosted: new Date(newComment.datePosted).toLocaleDateString(
                    "en-US"
                ),
            };

            setComments((prevComments) => [formattedComment, ...prevComments]);
            setUserCreatedComment("");
        } catch (error) {
            console.error("Error submitting comment:", error);
            setError(error.message);
        }
    };
    const handleManageCommentDisplay = (commentId) => {
        setActiveManageMenu(activeManageMenu === commentId ? null : commentId);
    };

    const handleCommentEdit = (commentId) => {
        // TODO: Implement comment editing functionality
        console.log("Edit comment:", commentId);
    };

    const handleCommentDelete = async (commentId) => {
        try {
            const response = await fetch(
                `http://${
                    import.meta.env.VITE_API_URL
                }/articles/${id}/comments/${commentId}`,
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

            // Remove the deleted comment from the state
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );

            // Close the manage menu
            setActiveManageMenu(null);
        } catch (error) {
            console.error("Error deleting comment:", error);
            setError(error.message);
        }
    };

    if (error) return <p>Error loading article: {error}</p>;
    if (!article) return <p>Article not found</p>;

    return (
        <>
            <Header></Header>
            <main className="article-detail">
                <Link to="/" className="back-link">
                    Back to Articles
                </Link>
                {isArticleLoading ? (
                    <p>Loading article details...</p>
                ) : (
                    <>
                        <h1>{article.title}</h1>
                        <p>{article.content}</p>
                    </>
                )}
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        placeholder="Add a comment"
                        name="content"
                        value={userCreatedComment}
                        onChange={handleCommentCreationChange}
                    ></textarea>
                    <button type="submit">Post Comment</button>
                </form>
                <div className="comments">
                    {isCommentsLoading ? (
                        <p>Loading comments...</p>
                    ) : comments && comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <p>{comment.content}</p>
                                <p>
                                    By {comment.author.name} <br></br>
                                    {comment.datePosted}
                                </p>
                                {/* Only show manage button if current user owns the comment */}
                                {currentUser &&
                                    currentUser.id === comment.authorId && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleManageCommentDisplay(
                                                        comment.id
                                                    )
                                                }
                                                className="manage-comment-button"
                                            >
                                                Manage
                                            </button>
                                            <div
                                                className="manage-comment-menu"
                                                style={{
                                                    display:
                                                        activeManageMenu ===
                                                        comment.id
                                                            ? "block"
                                                            : "none",
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleCommentEdit(
                                                            comment.id
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleCommentDelete(
                                                            comment.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
            </main>
        </>
    );
}

export default ArticleDetail;
